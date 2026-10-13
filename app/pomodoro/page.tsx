"use client";
/**
 * app/pomodoro/page.tsx — Halaman Pomodoro (Placeholder untuk Isra)
 *
 * Isra perlu mengimplementasikan:
 * - Timer dengan State Pattern (Idle → Focus → Break → Paused)
 * - usePomodoro hook sudah tersedia di src/hooks/usePomodoro.ts
 * - PomodoroService.recordFocusSession() untuk merekam sesi
 */

import { TopBar } from "@/components/layout/TopBar";
import { usePomodoro } from "@/hooks/usePomodoro";

export default function PomodoroPage() {
  const { timerState, secondsLeft, settings, todayMinutes, startFocus, pauseTimer, resumeTimer, resetTimer } =
    usePomodoro();

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div>
      <TopBar title="Pomodoro Timer" subtitle="Sesi belajar fokus — Segera hadir!" />
      <div className="page-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 32,
          }}
        >
          {/* Timer Display */}
          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: "50%",
              border: "4px solid",
              borderColor:
                timerState === "focus"
                  ? "var(--color-primary)"
                  : timerState === "break"
                  ? "var(--color-success)"
                  : "var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg-card)",
              boxShadow:
                timerState === "focus"
                  ? "0 0 40px rgba(99,102,241,0.3)"
                  : timerState === "break"
                  ? "0 0 40px rgba(16,185,129,0.3)"
                  : "none",
              transition: "all 0.5s",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              {timerState === "idle" && "Siap Mulai"}
              {timerState === "focus" && "🍅 Fokus"}
              {timerState === "break" && "☕ Istirahat"}
              {timerState === "paused" && "⏸ Dijeda"}
            </span>
            <span
              style={{
                fontSize: 64,
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-2px",
                color: "var(--text-primary)",
              }}
            >
              {mins}:{secs}
            </span>
            <span style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
              Fokus: {settings.focusMinutes}m · Istirahat: {settings.breakMinutes}m
            </span>
          </div>

          {/* Kontrol */}
          <div style={{ display: "flex", gap: 12 }}>
            {timerState === "idle" && (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => startFocus()}
                id="pomodoro-start"
              >
                ▶ Mulai Fokus
              </button>
            )}
            {timerState === "focus" && (
              <>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={pauseTimer}
                  id="pomodoro-pause"
                >
                  ⏸ Jeda
                </button>
                <button
                  className="btn btn-danger"
                  onClick={resetTimer}
                  id="pomodoro-reset"
                >
                  ↺ Reset
                </button>
              </>
            )}
            {timerState === "paused" && (
              <>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={resumeTimer}
                  id="pomodoro-resume"
                >
                  ▶ Lanjutkan
                </button>
                <button
                  className="btn btn-danger"
                  onClick={resetTimer}
                >
                  ↺ Reset
                </button>
              </>
            )}
          </div>

          {/* Statistik Hari Ini */}
          <div
            style={{
              padding: "20px 32px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
              Belajar Hari Ini
            </p>
            <p
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "var(--color-primary-light)",
              }}
            >
              {todayMinutes}
              <span style={{ fontSize: 16, fontWeight: 500, color: "var(--text-secondary)" }}>
                {" "}menit
              </span>
            </p>
          </div>

          {/* Pesan untuk Isra */}
          <div
            style={{
              padding: "16px 24px",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 12,
              maxWidth: 460,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 13, color: "var(--color-warning)", fontWeight: 600 }}>
              🚧 Untuk Isra
            </p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
              Implementasikan logika timer menggunakan <code>useRef + setInterval</code>.
              Gunakan State Pattern (Idle→Focus→Break→Paused).
              Hook <code>usePomodoro</code> sudah ada di <code>src/hooks/usePomodoro.ts</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
