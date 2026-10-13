/**
 * src/services/ScheduleService.ts
 *
 * Service untuk mengelola jadwal kuliah.
 * Extends BaseService<Course>.
 */

import { Course, STORAGE_KEYS } from "@/types";
import { BaseService } from "./BaseService";

export class ScheduleService extends BaseService<Course> {
  private static instance: ScheduleService;

  private constructor() {
    super(STORAGE_KEYS.SCHEDULE);
  }

  /** Singleton — satu instance untuk seluruh aplikasi */
  public static getInstance(): ScheduleService {
    if (!ScheduleService.instance) {
      ScheduleService.instance = new ScheduleService();
    }
    return ScheduleService.instance;
  }

  // ── Logika Spesifik Jadwal ────────────────────────────────────────────────

  /** Mendapatkan semua mata kuliah pada hari tertentu (0=Minggu…6=Sabtu) */
  public getByDay(day: Course["day"]): Course[] {
    return this.getAll()
      .filter((c) => c.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  /** Mendapatkan jadwal hari ini berurutan */
  public getToday(now: Date): Course[] {
    const day = now.getDay() as Course["day"];
    return this.getByDay(day);
  }

  /**
   * Mengecek apakah waktu `now` berada dalam rentang startTime–endTime sebuah Course.
   * Waktu dibandingkan dalam format "HH:mm".
   */
  private isWithinTime(course: Course, now: Date): boolean {
    const current = this.toMinutes(
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    );
    const start = this.toMinutes(course.startTime);
    const end = this.toMinutes(course.endTime);
    return current >= start && current < end;
  }

  /** Konversi string "HH:mm" ke total menit */
  private toMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  /** Mendapatkan mata kuliah yang sedang berlangsung pada waktu `now` */
  public getCurrentCourse(now: Date): Course | null {
    const todayCourses = this.getToday(now);
    return todayCourses.find((c) => this.isWithinTime(c, now)) ?? null;
  }

  /** Mendapatkan mata kuliah berikutnya setelah waktu `now` */
  public getNextCourse(now: Date): Course | null {
    const currentMinutes = this.toMinutes(
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    );
    const todayCourses = this.getToday(now);
    const upcoming = todayCourses.filter(
      (c) => this.toMinutes(c.startTime) > currentMinutes
    );
    return upcoming.length > 0 ? upcoming[0] : null;
  }
}
