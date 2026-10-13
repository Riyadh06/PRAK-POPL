"use client";
/**
 * src/hooks/useStats.ts
 *
 * PLACEHOLDER untuk Isra/Riyadh — Hook statistik dashboard.
 * Menggunakan StatsService (Facade) untuk mengambil semua data dashboard.
 */

import { useState, useEffect } from "react";
import { DashboardSummary, WeeklyStudyData } from "@/types";
import { StatsService } from "@/services/StatsService";

const statsService = StatsService.getInstance();

export interface UseStatsReturn {
  /** Ringkasan dashboard */
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
  todayStudyMinutes: 0,
  nearestDeadlineTasks: [],
};

/**
 * TODO (Isra/Riyadh): Tambah subscribe ke StorageService untuk reaktivitas.
 * Saat ini data hanya di-load sekali + manual refresh.
 */
export function useStats(): UseStatsReturn {
  const [summary, setSummary] = useState<DashboardSummary>(defaultSummary);
  const [weeklyData, setWeeklyData] = useState<WeeklyStudyData[]>([]);
  const [taskCompletion, setTaskCompletion] = useState({ done: 0, total: 0 });

  const refresh = () => {
    setSummary(statsService.getDashboardSummary());
    setWeeklyData(statsService.getWeeklyStudyHours());
    setTaskCompletion(statsService.getTaskCompletion());
  };

  useEffect(() => {
    refresh();
    // Update setiap menit untuk jadwal aktif
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, []);

  return { summary, weeklyData, taskCompletion, refresh };
}
