/**
 * src/services/StatsService.ts
 *
 * PATTERN: Facade
 * Menyederhanakan akses statistik lintas service untuk Dashboard.
 * Isra dan Riyadh cukup memanggil StatsService tanpa menyentuh service lain.
 */

import { DashboardSummary, WeeklyStudyData } from "@/types";
import { ScheduleService } from "./ScheduleService";
import { TaskService } from "./TaskService";
import { PomodoroService } from "./PomodoroService";

export class StatsService {
  private static instance: StatsService;

  private readonly scheduleService: ScheduleService;
  private readonly taskService: TaskService;
  private readonly pomodoroService: PomodoroService;

  private constructor() {
    // Facade: agregasi beberapa service
    this.scheduleService = ScheduleService.getInstance();
    this.taskService = TaskService.getInstance();
    this.pomodoroService = PomodoroService.getInstance();
  }

  /** Singleton */
  public static getInstance(): StatsService {
    if (!StatsService.instance) {
      StatsService.instance = new StatsService();
    }
    return StatsService.instance;
  }

  // ── Facade Methods ────────────────────────────────────────────────────────

  /**
   * Mengumpulkan semua data yang dibutuhkan Dashboard dalam satu panggilan.
   * Dipakai oleh useStats hook dan halaman dashboard.
   */
  public getDashboardSummary(): DashboardSummary {
    const now = new Date();
    return {
      todaySchedule: this.scheduleService.getToday(now),
      currentCourse: this.scheduleService.getCurrentCourse(now),
      nextCourse: this.scheduleService.getNextCourse(now),
      taskStats: this.taskService.getCompletionStats(),
      todayStudyMinutes: this.pomodoroService.getTodayTotalMinutes(),
      nearestDeadlineTasks: this.taskService.getNearestDeadline(3),
    };
  }

  /**
   * Data jam belajar mingguan untuk grafik Recharts.
   */
  public getWeeklyStudyHours(): WeeklyStudyData[] {
    return this.pomodoroService.getWeeklyMinutes();
  }

  /**
   * Statistik penyelesaian tugas (done / total).
   */
  public getTaskCompletion(): { done: number; total: number } {
    return this.taskService.getCompletionStats();
  }
}
