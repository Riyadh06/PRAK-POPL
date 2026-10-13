/**
 * src/services/TaskService.ts
 *
 * Service untuk mengelola daftar tugas.
 * Extends BaseService<Task>.
 * Menerapkan Strategy Pattern untuk filter dan sort.
 */

import { Task, STORAGE_KEYS } from "@/types";
import { BaseService } from "./BaseService";
import { TaskFilterStrategy, AllTasksFilter } from "./strategies/TaskFilterStrategy";
import { TaskSortStrategy, ByDeadlineAsc } from "./strategies/TaskSortStrategy";

export class TaskService extends BaseService<Task> {
  private static instance: TaskService;

  private constructor() {
    super(STORAGE_KEYS.TASKS);
  }

  /** Singleton */
  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  // ── Strategy Pattern ──────────────────────────────────────────────────────

  /**
   * Filter tugas menggunakan strategy yang diberikan.
   * Default: AllTasksFilter (tidak ada filter).
   */
  public filter(strategy: TaskFilterStrategy = new AllTasksFilter()): Task[] {
    return strategy.filter(this.getAll());
  }

  /**
   * Sort tugas menggunakan strategy yang diberikan.
   * Default: ByDeadlineAsc (deadline terdekat dulu).
   */
  public sort(strategy: TaskSortStrategy = new ByDeadlineAsc()): Task[] {
    return strategy.sort(this.getAll());
  }

  // ── Logika Spesifik Tugas ─────────────────────────────────────────────────

  /**
   * Mendapatkan N tugas dengan deadline terdekat yang belum selesai.
   * Dipakai oleh StatsService dan Dashboard (Isra/Riyadh).
   */
  public getNearestDeadline(limit: number = 5): Task[] {
    return this.getAll()
      .filter((t) => t.status !== "done")
      .sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
      .slice(0, limit);
  }

  /**
   * Mengecek apakah tugas sudah melewati deadline.
   */
  public isOverdue(task: Task): boolean {
    if (task.status === "done") return false;
    return new Date(task.deadline) < new Date();
  }

  /**
   * Mengecek apakah tugas hampir jatuh tempo (default <= 48 jam).
   */
  public isDueSoon(task: Task, hours: number = 48): boolean {
    if (task.status === "done") return false;
    if (this.isOverdue(task)) return false;
    const diff = new Date(task.deadline).getTime() - new Date().getTime();
    return diff <= hours * 60 * 60 * 1000;
  }

  /**
   * Menghitung statistik penyelesaian tugas.
   * Dipakai oleh StatsService (Isra/Riyadh).
   */
  public getCompletionStats(): { done: number; total: number } {
    const all = this.getAll();
    const done = all.filter((t) => t.status === "done").length;
    return { done, total: all.length };
  }
}
