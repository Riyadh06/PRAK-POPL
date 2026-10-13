/**
 * src/services/strategies/TaskSortStrategy.ts
 *
 * PATTERN: Strategy
 * Interface dan implementasi strategi sort tugas.
 */

import { Task } from "@/types";

/** Interface Strategy untuk sort tugas */
export interface TaskSortStrategy {
  sort(tasks: Task[]): Task[];
}

/** Sort: berdasarkan deadline terdekat (ascending) */
export class ByDeadlineAsc implements TaskSortStrategy {
  sort(tasks: Task[]): Task[] {
    return [...tasks].sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
  }
}

/** Sort: berdasarkan deadline terjauh (descending) */
export class ByDeadlineDesc implements TaskSortStrategy {
  sort(tasks: Task[]): Task[] {
    return [...tasks].sort(
      (a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
    );
  }
}

/** Sort: berdasarkan prioritas (high > medium > low) */
export class ByPriority implements TaskSortStrategy {
  private readonly priorityOrder = { high: 0, medium: 1, low: 2 };

  sort(tasks: Task[]): Task[] {
    return [...tasks].sort(
      (a, b) => this.priorityOrder[a.priority] - this.priorityOrder[b.priority]
    );
  }
}

/** Sort: berdasarkan waktu dibuat (terbaru dulu) */
export class ByCreatedAtDesc implements TaskSortStrategy {
  sort(tasks: Task[]): Task[] {
    return [...tasks].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
