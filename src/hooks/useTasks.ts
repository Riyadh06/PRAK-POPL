"use client";
/**
 * src/hooks/useTasks.ts
 *
 * Hook reaktif untuk daftar tugas.
 * Mendukung filter dan sort via Strategy Pattern.
 */

import { useState, useEffect, useCallback } from "react";
import { Task, TaskStatus } from "@/types";
import { TaskService } from "@/services/TaskService";
import { EntityFactory } from "@/factories/EntityFactory";
import {
  TaskFilterStrategy,
  AllTasksFilter,
  ByStatusFilter,
  ByCourseFilter,
  CombinedFilter,
} from "@/services/strategies/TaskFilterStrategy";
import {
  TaskSortStrategy,
  ByDeadlineAsc,
  ByDeadlineDesc,
} from "@/services/strategies/TaskSortStrategy";

const taskService = TaskService.getInstance();

export type FilterType = "all" | TaskStatus;
export type SortType = "deadline-asc" | "deadline-desc";

export interface UseTasksReturn {
  /** Tugas setelah filter + sort diterapkan */
  tasks: Task[];
  /** Filter aktif saat ini */
  activeFilter: FilterType;
  /** Sort aktif saat ini */
  activeSort: SortType;
  /** Mata kuliah filter (opsional) */
  activeCourseId: string | null;
  /** Ubah filter status */
  setFilter: (filter: FilterType) => void;
  /** Ubah filter mata kuliah */
  setCourseFilter: (courseId: string | null) => void;
  /** Ubah sort */
  setSort: (sort: SortType) => void;
  /** Tambah tugas */
  addTask: (data: Omit<Task, "id" | "createdAt">) => Task;
  /** Update tugas */
  updateTask: (id: string, partial: Partial<Omit<Task, "id" | "createdAt">>) => void;
  /** Hapus tugas */
  deleteTask: (id: string) => void;
  /** Update status tugas */
  updateStatus: (id: string, status: TaskStatus) => void;
  /** Cek apakah tugas overdue */
  isOverdue: (task: Task) => boolean;
  /** Cek apakah tugas hampir jatuh tempo */
  isDueSoon: (task: Task) => boolean;
  /** Statistik penyelesaian */
  completionStats: { done: number; total: number };
  /** N tugas deadline terdekat */
  nearestDeadline: (limit?: number) => Task[];
}

export function useTasks(): UseTasksReturn {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<SortType>("deadline-asc");

  // Subscribe ke perubahan data (Observer)
  useEffect(() => {
    setAllTasks(taskService.getAll());
    const unsubscribe = taskService.subscribe((updated) => {
      setAllTasks(updated);
    });
    return unsubscribe;
  }, []);

  // Terapkan filter + sort setiap ada perubahan state
  const tasks = (() => {
    // Bangun strategy filter
    let filterStrategy: TaskFilterStrategy = new AllTasksFilter();
    const statusFilter =
      activeFilter !== "all" ? new ByStatusFilter(activeFilter as TaskStatus) : null;
    const courseFilter = activeCourseId ? new ByCourseFilter(activeCourseId) : null;

    if (statusFilter && courseFilter) {
      filterStrategy = new CombinedFilter(statusFilter, courseFilter);
    } else if (statusFilter) {
      filterStrategy = statusFilter;
    } else if (courseFilter) {
      filterStrategy = courseFilter;
    }

    // Bangun strategy sort
    const sortStrategy: TaskSortStrategy =
      activeSort === "deadline-desc" ? new ByDeadlineDesc() : new ByDeadlineAsc();

    const filtered = filterStrategy.filter(allTasks);
    return sortStrategy.sort(filtered);
  })();

  const addTask = useCallback(
    (data: Omit<Task, "id" | "createdAt">): Task => {
      const newTask = EntityFactory.createTask(data);
      return taskService.create(newTask);
    },
    []
  );

  const updateTask = useCallback(
    (id: string, partial: Partial<Omit<Task, "id" | "createdAt">>) => {
      taskService.update(id, partial);
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    taskService.delete(id);
  }, []);

  const updateStatus = useCallback((id: string, status: TaskStatus) => {
    taskService.update(id, { status });
  }, []);

  const isOverdue = useCallback((task: Task) => taskService.isOverdue(task), []);
  const isDueSoon = useCallback((task: Task) => taskService.isDueSoon(task), []);

  const nearestDeadline = useCallback(
    (limit: number = 5) => taskService.getNearestDeadline(limit),
    []
  );

  const completionStats = taskService.getCompletionStats();

  return {
    tasks,
    activeFilter,
    activeSort,
    activeCourseId,
    setFilter: setActiveFilter,
    setCourseFilter: setActiveCourseId,
    setSort: setActiveSort,
    addTask,
    updateTask,
    deleteTask,
    updateStatus,
    isOverdue,
    isDueSoon,
    completionStats,
    nearestDeadline,
  };
}
