"use client";
/**
 * src/hooks/useStats.ts
 *
 * Hook statistik dashboard dan analitik belajar.
 * Menerapkan Facade Pattern via StatsService dan Observer Pattern via StorageService.
 *
 * Grafik dan ringkasan diperbarui otomatis (reaktif) setiap kali data
 * jadwal, tugas, atau sesi Pomodoro berubah di localStorage.
 */

import { useState, useEffect, useCallback } from "react";
import { DashboardSummary, STORAGE_KEYS, WeeklyStudyData } from "@/types";
import { StatsService } from "@/services/StatsService";
import { StorageService } from "@/services/StorageService";

const statsService = StatsService.getInstance();
const storageService = StorageService.getInstance();

export interface UseStatsReturn {
  /** Ringkasan dashboard (Facade) */
  summary: DashboardSummary;
  /** Data studi mingguan untuk grafik */
  weeklyData: WeeklyStudyData[];
  /** Statistik penyelesaian tugas */
  taskCompletion: { done: number; total: number };
  /** Refresh data secara manual */
  refresh: () => void;
}

const defaultSummary: DashboardSummary = {
  todaySchedule: [],
  currentCourse: null,
  nextCourse: null,
  taskStats: { done: 0, total: 0 },
  taskCompletion: { done: 0, total: 0 },
  todayStudyMinutes: 0,
  todayMinutes: 0,
  weeklyMinutes: [],
  nearestDeadlineTasks: [],
  nearestTasks: [],
};

export function useStats(): UseStatsReturn {
  const [summary, setSummary] = useState<DashboardSummary>(defaultSummary);
  const [weeklyData, setWeeklyData] = useState<WeeklyStudyData[]>([]);
  const [taskCompletion, setTaskCompletion] = useState<{ done: number; total: number }>({
    done: 0,
    total: 0,
  });

  const refresh = useCallback(() => {
    setSummary(statsService.getDashboardSummary());
    setWeeklyData(statsService.getWeeklyStudyHours());
    setTaskCompletion(statsService.getTaskCompletion());
  }, []);

  useEffect(() => {
    refresh();

    // Interval pembaharuan tiap menit untuk jadwal aktif
    const interval = setInterval(refresh, 60_000);

    // Observer Pattern: Langganan perubahan data di seluruh modul
    const unsubSchedule = storageService.subscribe(STORAGE_KEYS.SCHEDULE, refresh);
    const unsubTasks = storageService.subscribe(STORAGE_KEYS.TASKS, refresh);
    const unsubPomodoro = storageService.subscribe(STORAGE_KEYS.POMODORO, refresh);
    const unsubSettings = storageService.subscribe(
      STORAGE_KEYS.POMODORO_SETTINGS,
      refresh
    );

    return () => {
      clearInterval(interval);
      unsubSchedule();
      unsubTasks();
      unsubPomodoro();
      unsubSettings();
    };
  }, [refresh]);

  return { summary, weeklyData, taskCompletion, refresh };
}
