/**
 * src/services/PomodoroTimer.ts
 *
 * PATTERN: State Pattern
 * - TimerState: interface untuk representasi keadaan timer.
 * - IdleState, FocusState, BreakState, PausedState: implementasi keadaan konkret.
 * - PomodoroTimer: Context yang menyimpan state saat ini dan mendelegasikan aksi.
 *
 * Alur Transisi:
 * Idle -> Focus -> Break -> Idle
 * Paused dapat dimasuki dari Focus atau Break, dan melanjutkan kembali ke state sebelumnya.
 */

import { PomodoroSession, PomodoroSettings, PomodoroTimerState } from "@/types";
import { PomodoroService } from "./PomodoroService";

/**
 * Interface State Pattern untuk keadaan timer.
 */
export interface TimerState {
  readonly stateName: PomodoroTimerState;
  start(timer: PomodoroTimer, courseId?: string, taskId?: string): void;
  pause(timer: PomodoroTimer): void;
  resume(timer: PomodoroTimer): void;
  reset(timer: PomodoroTimer): void;
  tick(timer: PomodoroTimer): void;
}

/**
 * State: IDLE
 * Timer dalam posisi standby, siap untuk memulai sesi fokus baru.
 */
export class IdleState implements TimerState {
  readonly stateName: PomodoroTimerState = "idle";

  start(timer: PomodoroTimer, courseId?: string, taskId?: string): void {
    timer.setCourseId(courseId);
    timer.setTaskId(taskId);
    const focusSeconds = timer.getSettings().focusMinutes * 60;
    timer.setSecondsLeft(focusSeconds);
    timer.changeState(new FocusState());
  }

  pause(_timer: PomodoroTimer): void {
    // Tidak ada aksi jeda saat idle
  }

  resume(_timer: PomodoroTimer): void {
    // Tidak ada aksi resume saat idle
  }

  reset(timer: PomodoroTimer): void {
    timer.setSecondsLeft(timer.getSettings().focusMinutes * 60);
  }

  tick(_timer: PomodoroTimer): void {
    // Tidak berjalan saat idle
  }
}

/**
 * State: FOCUS
 * Timer sedang berjalan menghitung mundur durasi fokus.
 */
export class FocusState implements TimerState {
  readonly stateName: PomodoroTimerState = "focus";

  start(_timer: PomodoroTimer): void {
    // Sudah dalam keadaan fokus
  }

  pause(timer: PomodoroTimer): void {
    timer.changeState(new PausedState("focus"));
  }

  resume(_timer: PomodoroTimer): void {
    // Sudah berjalan
  }

  reset(timer: PomodoroTimer): void {
    timer.setCourseId(undefined);
    timer.setTaskId(undefined);
    timer.setSecondsLeft(timer.getSettings().focusMinutes * 60);
    timer.changeState(new IdleState());
  }

  tick(timer: PomodoroTimer): void {
    const current = timer.getSecondsLeft();
    if (current > 1) {
      timer.setSecondsLeft(current - 1);
    } else {
      // Sesi fokus selesai (mencapai 0)
      timer.setSecondsLeft(0);

      // Rekam sesi fokus ke PomodoroService secara otomatis
      const durationMinutes = timer.getSettings().focusMinutes;
      const courseId = timer.getCourseId();
      const taskId = timer.getTaskId();
      const session = PomodoroService.getInstance().recordFocusSession(
        durationMinutes,
        courseId,
        taskId
      );

      timer.notifySessionCompleted(session);

      // Transisi otomatis ke waktu istirahat (BreakState)
      const breakSeconds = timer.getSettings().breakMinutes * 60;
      timer.setSecondsLeft(breakSeconds);
      timer.changeState(new BreakState());
    }
  }
}

/**
 * State: BREAK
 * Timer sedang berjalan menghitung mundur durasi istirahat.
 */
export class BreakState implements TimerState {
  readonly stateName: PomodoroTimerState = "break";

  start(_timer: PomodoroTimer): void {
    // Sedang dalam sesi istirahat
  }

  pause(timer: PomodoroTimer): void {
    timer.changeState(new PausedState("break"));
  }

  resume(_timer: PomodoroTimer): void {
    // Sudah berjalan
  }

  reset(timer: PomodoroTimer): void {
    timer.setCourseId(undefined);
    timer.setTaskId(undefined);
    timer.setSecondsLeft(timer.getSettings().focusMinutes * 60);
    timer.changeState(new IdleState());
  }

  tick(timer: PomodoroTimer): void {
    const current = timer.getSecondsLeft();
    if (current > 1) {
      timer.setSecondsLeft(current - 1);
    } else {
      // Sesi istirahat selesai
      timer.setSecondsLeft(0);
      timer.notifyBreakCompleted();

      // Transisi otomatis kembali ke IdleState
      timer.setCourseId(undefined);
      timer.setTaskId(undefined);
      timer.setSecondsLeft(timer.getSettings().focusMinutes * 60);
      timer.changeState(new IdleState());
    }
  }
}

/**
 * State: PAUSED
 * Timer dijeda sementara dan mencatat state sebelumnya (focus atau break).
 */
export class PausedState implements TimerState {
  readonly stateName: PomodoroTimerState = "paused";
  private previousState: "focus" | "break";

  constructor(previousState: "focus" | "break") {
    this.previousState = previousState;
  }

  getPreviousState(): "focus" | "break" {
    return this.previousState;
  }

  start(_timer: PomodoroTimer): void {
    // Saat dijeda, gunakan resume
  }

  pause(_timer: PomodoroTimer): void {
    // Sudah dijeda
  }

  resume(timer: PomodoroTimer): void {
    if (this.previousState === "focus") {
      timer.changeState(new FocusState());
    } else {
      timer.changeState(new BreakState());
    }
  }

  reset(timer: PomodoroTimer): void {
    timer.setCourseId(undefined);
    timer.setTaskId(undefined);
    timer.setSecondsLeft(timer.getSettings().focusMinutes * 60);
    timer.changeState(new IdleState());
  }

  tick(_timer: PomodoroTimer): void {
    // Tidak berkurang saat dijeda
  }
}

export type TimerChangeListener = (secondsLeft: number, state: PomodoroTimerState) => void;
export type SessionCompletedListener = (session: PomodoroSession) => void;
export type BreakCompletedListener = () => void;

/**
 * Context: PomodoroTimer
 * Mengelola konteks timer, mendelegasikan perintah ke state aktif,
 * dan memberitahu pendengar (listener) ketika ada pembaruan.
 */
export class PomodoroTimer {
  private state: TimerState;
  private secondsLeft: number;
  private settings: PomodoroSettings;
  private courseId?: string;
  private taskId?: string;

  private listeners: Set<TimerChangeListener> = new Set();
  private sessionCompletedListeners: Set<SessionCompletedListener> = new Set();
  private breakCompletedListeners: Set<BreakCompletedListener> = new Set();

  constructor(initialSettings?: PomodoroSettings) {
    this.settings =
      initialSettings ?? PomodoroService.getInstance().getSettings();
    this.secondsLeft = this.settings.focusMinutes * 60;
    this.state = new IdleState();
  }

  // ── Getter & Setter State ─────────────────────────────────────────────────

  public getState(): TimerState {
    return this.state;
  }

  public getStateName(): PomodoroTimerState {
    return this.state.stateName;
  }

  public getSecondsLeft(): number {
    return this.secondsLeft;
  }

  public setSecondsLeft(seconds: number): void {
    this.secondsLeft = seconds;
    this.notify();
  }

  public getSettings(): PomodoroSettings {
    return this.settings;
  }

  public setSettings(newSettings: PomodoroSettings): void {
    this.settings = newSettings;
    if (this.state.stateName === "idle") {
      this.secondsLeft = newSettings.focusMinutes * 60;
      this.notify();
    }
  }

  public getCourseId(): string | undefined {
    return this.courseId;
  }

  public setCourseId(courseId?: string): void {
    this.courseId = courseId;
  }

  public getTaskId(): string | undefined {
    return this.taskId;
  }

  public setTaskId(taskId?: string): void {
    this.taskId = taskId;
  }

  /**
   * Mengubah state timer saat ini (State Pattern Context transition).
   */
  public changeState(nextState: TimerState): void {
    this.state = nextState;
    this.notify();
  }

  // ── Aksi Delegasi ke State ────────────────────────────────────────────────

  public start(courseId?: string, taskId?: string): void {
    this.state.start(this, courseId, taskId);
  }

  public pause(): void {
    this.state.pause(this);
  }

  public resume(): void {
    this.state.resume(this);
  }

  public reset(): void {
    this.state.reset(this);
  }

  public tick(): void {
    this.state.tick(this);
  }

  // ── Listener & Event Notifikasi ───────────────────────────────────────────

  public subscribe(listener: TimerChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public onSessionCompleted(listener: SessionCompletedListener): () => void {
    this.sessionCompletedListeners.add(listener);
    return () => this.sessionCompletedListeners.delete(listener);
  }

  public onBreakCompleted(listener: BreakCompletedListener): () => void {
    this.breakCompletedListeners.add(listener);
    return () => this.breakCompletedListeners.delete(listener);
  }

  public notifySessionCompleted(session: PomodoroSession): void {
    this.sessionCompletedListeners.forEach((fn) => fn(session));
  }

  public notifyBreakCompleted(): void {
    this.breakCompletedListeners.forEach((fn) => fn());
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.secondsLeft, this.state.stateName));
  }
}
