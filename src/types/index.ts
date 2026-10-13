/**
 * src/types/index.ts
 * Semua interface/tipe data terpusat untuk StudyTrack.
 * Digunakan oleh semua service, hook, dan komponen.
 */

// ─── Entitas Jadwal ─────────────────────────────────────────────────────────

/** Representasi satu mata kuliah dalam jadwal mingguan */
export interface Course {
  id: string;
  name: string;
  /** 0 = Minggu, 1 = Senin, …, 6 = Sabtu */
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Format "HH:mm" */
  startTime: string;
  /** Format "HH:mm" */
  endTime: string;
  room: string;
  /** Warna penanda dalam format hex, misal "#3b82f6" */
  color: string;
}

// ─── Entitas Tugas ───────────────────────────────────────────────────────────

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "doing" | "done";

/** Representasi satu tugas/assignment */
export interface Task {
  id: string;
  title: string;
  /** Referensi ke Course.id */
  courseId: string;
  /** Tanggal deadline dalam format ISO 8601 */
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  /** Waktu pembuatan dalam format ISO 8601 */
  createdAt: string;
}

// ─── Entitas Pomodoro ────────────────────────────────────────────────────────

export type PomodoroType = "focus";

/** Satu sesi fokus Pomodoro yang telah selesai */
export interface PomodoroSession {
  id: string;
  type: PomodoroType;
  durationMinutes: number;
  /** Waktu selesai dalam format ISO 8601 */
  completedAt: string;
  /** Opsional: dikaitkan ke mata kuliah */
  courseId?: string;
  /** Opsional: dikaitkan ke tugas */
  taskId?: string;
}

/** Pengaturan durasi Pomodoro */
export interface PomodoroSettings {
  /** Default 25 menit */
  focusMinutes: number;
  /** Default 5 menit */
  breakMinutes: number;
}

// ─── Tipe Utilitas ───────────────────────────────────────────────────────────

/** Ringkasan statistik untuk dashboard (StatsService Facade) */
export interface DashboardSummary {
  todaySchedule: Course[];
  currentCourse: Course | null;
  nextCourse: Course | null;
  taskStats: { done: number; total: number };
  taskCompletion: { done: number; total: number };
  todayStudyMinutes: number;
  todayMinutes: number;
  weeklyMinutes: WeeklyStudyData[];
  nearestDeadlineTasks: Task[];
  nearestTasks: Task[];
}

/** Data studi mingguan untuk grafik */
export interface WeeklyStudyData {
  date: string;
  minutes: number;
}

/** State mesin Pomodoro (State Pattern) */
export type PomodoroTimerState = "idle" | "focus" | "break" | "paused";

/** Kunci localStorage yang digunakan aplikasi */
export const STORAGE_KEYS = {
  SCHEDULE: "studytrack:schedule",
  TASKS: "studytrack:tasks",
  POMODORO: "studytrack:pomodoro",
  POMODORO_SETTINGS: "studytrack:pomodoro-settings",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
