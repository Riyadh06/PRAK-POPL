/**
 * src/services/PomodoroService.ts
 *
 * Service untuk mengelola sesi Pomodoro dan pengaturannya.
 * Extends BaseService<PomodoroSession>.
 */

import {
  PomodoroSession,
  PomodoroSettings,
  STORAGE_KEYS,
  WeeklyStudyData,
} from "@/types";
import { BaseService } from "./BaseService";
import { EntityFactory } from "@/factories/EntityFactory";

export class PomodoroService extends BaseService<PomodoroSession> {
  private static instance: PomodoroService;

  private constructor() {
    super(STORAGE_KEYS.POMODORO);
  }

  /** Singleton */
  public static getInstance(): PomodoroService {
    if (!PomodoroService.instance) {
      PomodoroService.instance = new PomodoroService();
    }
    return PomodoroService.instance;
  }

  // ── Sesi Fokus ────────────────────────────────────────────────────────────

  /**
   * Merekam satu sesi fokus yang telah selesai.
   * Dipakai oleh hook usePomodoro setelah timer selesai.
   */
  public recordFocusSession(
    durationMinutes: number,
    courseId?: string,
    taskId?: string
  ): PomodoroSession {
    const session = EntityFactory.createSession({
      type: "focus",
      durationMinutes,
      courseId,
      taskId,
    });
    return this.create(session);
  }

  // ── Statistik ─────────────────────────────────────────────────────────────

  /** Total menit belajar hari ini */
  public getTodayTotalMinutes(): number {
    const today = new Date().toISOString().split("T")[0];
    return this.getAll()
      .filter((s) => s.completedAt.startsWith(today))
      .reduce((acc, s) => acc + s.durationMinutes, 0);
  }

  /**
   * Menit belajar per hari selama 7 hari terakhir.
   * Dipakai oleh grafik Recharts (Isra/Riyadh).
   * Selalu mengembalikan array 7 elemen (urutan hari semakin baru ke kanan).
   */
  public getWeeklyMinutes(): WeeklyStudyData[] {
    const result: WeeklyStudyData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const minutes = this.getAll()
        .filter((s) => s.completedAt.startsWith(dateStr))
        .reduce((acc, s) => acc + s.durationMinutes, 0);

      result.push({ date: dateStr, minutes });
    }

    return result;
  }

  // ── Pengaturan ────────────────────────────────────────────────────────────

  /** Membaca pengaturan Pomodoro (focus & break duration) */
  public getSettings(): PomodoroSettings {
    return this.storage.get<PomodoroSettings>(
      STORAGE_KEYS.POMODORO_SETTINGS,
      EntityFactory.defaultPomodoroSettings()
    );
  }

  /** Menyimpan pengaturan Pomodoro */
  public saveSettings(settings: PomodoroSettings): void {
    this.storage.set<PomodoroSettings>(STORAGE_KEYS.POMODORO_SETTINGS, settings);
  }
}
