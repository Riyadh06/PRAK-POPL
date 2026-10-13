"use client";
/**
 * src/hooks/usePomodoro.ts
 *
 * PLACEHOLDER untuk Isra — Hook Pomodoro dengan State Pattern.
 * State: Idle → Focus → Break → Paused → Idle
 *
 * Isra perlu mengisi logika timer dan memanggil pomodoroService.recordFocusSession()
 * saat sesi selesai.
 */

import { useState } from "react";
import { PomodoroSettings, PomodoroSession, PomodoroTimerState } from "@/types";
import { PomodoroService } from "@/services/PomodoroService";

const pomodoroService = PomodoroService.getInstance();

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
}

/**
 * TODO (Isra): Implementasi lengkap timer menggunakan useRef + setInterval.
 * Gunakan State Pattern untuk transisi: Idle→Focus→Break→Paused→...
 * Panggil pomodoroService.recordFocusSession() ketika sesi fokus selesai.
 */
export function usePomodoro(): UsePomodoroReturn {
  const [timerState, setTimerState] = useState<PomodoroTimerState>("idle");
  const [secondsLeft, setSecondsLeft] = useState<number>(
    pomodoroService.getSettings().focusMinutes * 60
  );
  const [sessions] = useState<PomodoroSession[]>(pomodoroService.getAll());
  const settings = pomodoroService.getSettings();
  const todayMinutes = pomodoroService.getTodayTotalMinutes();

  // ── Placeholder actions — Isra lengkapi ──────────────────────────────────
  const startFocus = (_courseId?: string, _taskId?: string) => {
    setTimerState("focus");
  };
  const pauseTimer = () => setTimerState("paused");
  const resumeTimer = () => setTimerState("focus");
  const resetTimer = () => {
    setTimerState("idle");
    setSecondsLeft(settings.focusMinutes * 60);
  };
  const saveSettings = (s: PomodoroSettings) => {
    pomodoroService.saveSettings(s);
  };

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
  };
}
