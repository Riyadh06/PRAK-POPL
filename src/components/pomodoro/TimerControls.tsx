"use client";
/**
 * src/components/pomodoro/TimerControls.tsx
 *
 * Komponen tombol kendali Pomodoro (Mulai / Jeda / Lanjutkan / Reset)
 * serta tombol pembuka pengaturan durasi.
 */

import React from "react";
import { PomodoroTimerState } from "@/types";

interface TimerControlsProps {
  timerState: PomodoroTimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
}

export function TimerControls({
  timerState,
  onStart,
  onPause,
  onResume,
  onReset,
  onOpenSettings,
}: TimerControlsProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      {/* State: IDLE */}
      {timerState === "idle" && (
        <>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onStart}
            id="pomodoro-start"
            style={{
              padding: "14px 36px",
              fontSize: 16,
              fontWeight: 700,
              gap: 10,
            }}
          >
            <span style={{ fontSize: 18 }}>▶</span>
            <span>Mulai Fokus</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenSettings}
            title="Ubah Durasi Pomodoro"
            style={{ padding: "14px 18px" }}
          >
            ⚙️ Atur Waktu
          </button>
        </>
      )}

      {/* State: FOCUS */}
      {timerState === "focus" && (
        <>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={onPause}
            id="pomodoro-pause"
            style={{ padding: "14px 28px", fontWeight: 600 }}
          >
            ⏸ Jeda
          </button>
          <button
            type="button"
            className="btn btn-danger btn-lg"
            onClick={onReset}
            id="pomodoro-reset"
            style={{ padding: "14px 24px" }}
          >
            ↺ Batalkan Sesi
          </button>
        </>
      )}

      {/* State: PAUSED */}
      {timerState === "paused" && (
        <>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onResume}
            id="pomodoro-resume"
            style={{ padding: "14px 32px", fontWeight: 700 }}
          >
            ▶ Lanjutkan
          </button>
          <button
            type="button"
            className="btn btn-danger btn-lg"
            onClick={onReset}
            id="pomodoro-reset-paused"
            style={{ padding: "14px 24px" }}
          >
            ↺ Reset
          </button>
        </>
      )}

      {/* State: BREAK */}
      {timerState === "break" && (
        <>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={onPause}
            id="pomodoro-pause-break"
            style={{ padding: "14px 28px" }}
          >
            ⏸ Jeda Istirahat
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={onReset}
            id="pomodoro-skip-break"
            style={{ padding: "14px 24px" }}
          >
            ⏭ Lewati Istirahat
          </button>
        </>
      )}
    </div>
  );
}
