/**
 * src/factories/EntityFactory.ts
 *
 * PATTERN: Factory
 * - Membuat entitas baru dengan id unik (menggunakan crypto.randomUUID
 *   atau fallback manual agar aman di semua lingkungan).
 */

import { Course, Task, PomodoroSession, PomodoroSettings } from "@/types";

/** Menghasilkan UUID unik yang aman lintas browser */
function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // Fallback manual bila crypto.randomUUID tidak tersedia
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class EntityFactory {
  /**
   * Membuat Course baru.
   * Caller menyediakan semua field kecuali id.
   */
  public static createCourse(
    data: Omit<Course, "id">
  ): Course {
    return {
      id: generateId(),
      ...data,
    };
  }

  /**
   * Membuat Task baru.
   * createdAt di-set otomatis ke waktu sekarang.
   */
  public static createTask(
    data: Omit<Task, "id" | "createdAt">
  ): Task {
    return {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...data,
    };
  }

  /**
   * Membuat PomodoroSession baru.
   * completedAt di-set otomatis ke waktu sekarang.
   */
  public static createSession(
    data: Omit<PomodoroSession, "id" | "completedAt">
  ): PomodoroSession {
    return {
      id: generateId(),
      completedAt: new Date().toISOString(),
      ...data,
    };
  }

  /** Mengembalikan PomodoroSettings dengan nilai default */
  public static defaultPomodoroSettings(): PomodoroSettings {
    return {
      focusMinutes: 25,
      breakMinutes: 5,
    };
  }
}
