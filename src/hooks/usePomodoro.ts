"use client";
/**
 * src/hooks/usePomodoro.ts
 *
 * Hook Pomodoro Timer menerapkan State Pattern via PomodoroTimer.
 * State: Idle -> Focus -> Break -> Idle (Paused dapat dipicu dari Focus / Break).
 *
 * Alur Data:
 * Komponen -> usePomodoro -> PomodoroTimer (State Pattern) & PomodoroService -> StorageService -> localStorage
 *
 * Fitur:
 * - Countdown presisi dengan useRef + setInterval
 * - Pencatatan otomatis ke PomodoroService saat sesi fokus selesai
 * - Transisi otomatis ke istirahat (BreakState) lalu kembali ke IdleState
 * - Pemutaran notifikasi suara via Web Audio API saat sesi fokus/istirahat selesai
 * - Reaktif terhadap perubahan localStorage (Observer Pattern)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  PomodoroSettings,
  PomodoroSession,
  PomodoroTimerState,
  STORAGE_KEYS,
} from "@/types";
import { PomodoroService } from "@/services/PomodoroService";
import { PomodoroTimer } from "@/services/PomodoroTimer";
import { StorageService } from "@/services/StorageService";
import { playTimerNotificationSound } from "@/services/NotificationUtils";

const pomodoroService = PomodoroService.getInstance();
const storageService = StorageService.getInstance();

export interface UsePomodoroReturn {
  /** State timer saat ini (State Pattern) */
  timerState: PomodoroTimerState;
  /** Sisa waktu dalam detik */
  secondsLeft: number;
  /** Pengaturan durasi */
  settings: PomodoroSettings;
  /** Total menit belajar hari ini */
  todayMinutes: number;
  /** Riwayat sesi */
  sessions: PomodoroSession[];
  /** Mulai sesi fokus */
  startFocus: (courseId?: string, taskId?: string) => void;
  /** Jeda timer */
  pauseTimer: () => void;
  /** Lanjutkan timer */
  resumeTimer: () => void;
  /** Reset timer ke idle */
  resetTimer: () => void;
  /** Simpan pengaturan baru */
  saveSettings: (settings: PomodoroSettings) => void;

  // Properti pendukung untuk integrasi UI
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  selectedTaskId: string;
  setSelectedTaskId: (id: string) => void;
  notificationMessage: string | null;
  dismissNotification: () => void;
}

const defaultSettings: PomodoroSettings = {
  focusMinutes: 25,
  breakMinutes: 5,
};

export function usePomodoro(): UsePomodoroReturn {
  const [timerState, setTimerState] = useState<PomodoroTimerState>("idle");
  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings);
  const [secondsLeft, setSecondsLeft] = useState<number>(defaultSettings.focusMinutes * 60);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [todayMinutes, setTodayMinutes] = useState<number>(0);

  // Pilihan mata kuliah & tugas aktif
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Instance Context State Pattern disimpan dalam ref
  const timerRef = useRef<PomodoroTimer | null>(null);

  // Inisialisasi awal aman SSR di client
  useEffect(() => {
    const loadedSettings = pomodoroService.getSettings();
    setSettings(loadedSettings);
    setSessions(pomodoroService.getAll());
    setTodayMinutes(pomodoroService.getTodayTotalMinutes());

    if (!timerRef.current) {
      timerRef.current = new PomodoroTimer(loadedSettings);
      setSecondsLeft(timerRef.current.getSecondsLeft());
      setTimerState(timerRef.current.getStateName());
    }

    const timer = timerRef.current;

    // Observer: Langganan perubahan state dan detik dari timer
    const unsubTimer = timer.subscribe((sec, state) => {
      setSecondsLeft(sec);
      setTimerState(state);
    });

    // Observer: Notifikasi ketika sesi fokus selesai
    const unsubSessionCompleted = timer.onSessionCompleted((session) => {
      playTimerNotificationSound("focus-complete");
      setNotificationMessage(
        `🎉 Hebat! Sesi fokus ${session.durationMinutes} menit selesai. Waktunya istirahat!`
      );
      setSessions(pomodoroService.getAll());
      setTodayMinutes(pomodoroService.getTodayTotalMinutes());
    });

    // Observer: Notifikasi ketika istirahat selesai
    const unsubBreakCompleted = timer.onBreakCompleted(() => {
      playTimerNotificationSound("break-complete");
      setNotificationMessage("☕ Waktu istirahat selesai. Siap untuk fokus lagi?");
    });

    // Observer: Langganan perubahan data sesi dari localStorage
    const unsubSessionsStorage = pomodoroService.subscribe((updatedSessions) => {
      setSessions(updatedSessions);
      setTodayMinutes(pomodoroService.getTodayTotalMinutes());
    });

    // Observer: Langganan perubahan pengaturan dari localStorage
    const unsubSettingsStorage = storageService.subscribe<PomodoroSettings>(
      STORAGE_KEYS.POMODORO_SETTINGS,
      (newSettings) => {
        if (newSettings) {
          setSettings(newSettings);
          timer.setSettings(newSettings);
        }
      }
    );

    return () => {
      unsubTimer();
      unsubSessionCompleted();
      unsubBreakCompleted();
      unsubSessionsStorage();
      unsubSettingsStorage();
    };
  }, []);

  // Interval detak timer (1 detik) saat status aktif (focus atau break)
  useEffect(() => {
    if (timerState !== "focus" && timerState !== "break") {
      return;
    }

    const intervalId = setInterval(() => {
      if (timerRef.current) {
        timerRef.current.tick();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerState]);

  // ── Aksi Kontrol Timer ────────────────────────────────────────────────────

  const startFocus = useCallback(
    (courseId?: string, taskId?: string) => {
      const targetCourseId = courseId ?? (selectedCourseId || undefined);
      const targetTaskId = taskId ?? (selectedTaskId || undefined);

      if (timerRef.current) {
        timerRef.current.start(targetCourseId, targetTaskId);
      }
    },
    [selectedCourseId, selectedTaskId]
  );

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      timerRef.current.pause();
    }
  }, []);

  const resumeTimer = useCallback(() => {
    if (timerRef.current) {
      timerRef.current.resume();
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      timerRef.current.reset();
    }
  }, []);

  const saveSettings = useCallback((newSettings: PomodoroSettings) => {
    pomodoroService.saveSettings(newSettings);
    setSettings(newSettings);
    if (timerRef.current) {
      timerRef.current.setSettings(newSettings);
    }
  }, []);

  const dismissNotification = useCallback(() => {
    setNotificationMessage(null);
  }, []);

  return {
    timerState,
    secondsLeft,
    settings,
    todayMinutes,
    sessions,
    startFocus,
    pauseTimer,
    resumeTimer,
    resetTimer,
    saveSettings,
    selectedCourseId,
    setSelectedCourseId,
    selectedTaskId,
    setSelectedTaskId,
    notificationMessage,
    dismissNotification,
  };
}
