/**
 * src/services/strategies/TaskFilterStrategy.ts
 *
 * PATTERN: Strategy
 * Interface dan implementasi strategi filter tugas.
 */

import { Task, TaskStatus } from "@/types";

/** Interface Strategy untuk filter tugas */
export interface TaskFilterStrategy {
  filter(tasks: Task[]): Task[];
}

/** Filter: tampilkan semua tugas */
export class AllTasksFilter implements TaskFilterStrategy {
  filter(tasks: Task[]): Task[] {
    return tasks;
  }
}

/** Filter: berdasarkan status */
export class ByStatusFilter implements TaskFilterStrategy {
  constructor(private readonly status: TaskStatus) {}

  filter(tasks: Task[]): Task[] {
    return tasks.filter((t) => t.status === this.status);
  }
}

/** Filter: berdasarkan mata kuliah */
export class ByCourseFilter implements TaskFilterStrategy {
  constructor(private readonly courseId: string) {}

  filter(tasks: Task[]): Task[] {
    return tasks.filter((t) => t.courseId === this.courseId);
  }
}

/** Filter gabungan: status + mata kuliah */
export class CombinedFilter implements TaskFilterStrategy {
  constructor(
    private readonly statusFilter: TaskFilterStrategy,
    private readonly courseFilter: TaskFilterStrategy
  ) {}

  filter(tasks: Task[]): Task[] {
    return this.courseFilter.filter(this.statusFilter.filter(tasks));
  }
}
