"use client";
/**
 * src/components/pomodoro/TimerDisplay.tsx
 *
 * Komponen tampilan lingkaran countdown timer Pomodoro dengan SVG Circular Progress,
 * aksen visual menyala (glow) sesuai status timer, serta penanda mata kuliah/tugas.
 */

import React from "react";
import { PomodoroTimerState } from "@/types";

interface TimerDisplayProps {
  secondsLeft: number;
  totalDurationSeconds: number;
  timerState: PomodoroTimerState;
  courseName?: string;
  courseColor?: string;
  taskTitle?: string;
}

export function TimerDisplay({
  secondsLeft,
  totalDurationSeconds,
  timerState,
  courseName,
  courseColor,
  taskTitle,
}: TimerDisplayProps) {
  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  // Perhitungan SVG circle progress
  const size = 300;
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const validTotal = totalDurationSeconds > 0 ? totalDurationSeconds : 1;
  const progress = Math.min(Math.max(secondsLeft / validTotal, 0), 1);
  const strokeDashoffset = circumference * (1 - progress);

  // Penentuan skema warna sesuai state
  const isFocus = timerState === "focus";
  const isBreak = timerState === "break";
  const isPaused = timerState === "paused";

  const strokeColor = isFocus
    ? "var(--color-primary)"
    : isBreak
    ? "var(--color-success)"
    : isPaused
    ? "var(--color-warning)"
    : "var(--border-subtle)";

  const glowShadow = isFocus
    ? "0 0 48px rgba(99, 102, 241, 0.35)"
    : isBreak
    ? "0 0 48px rgba(16, 185, 129, 0.35)"
    : isPaused
    ? "0 0 36px rgba(245, 158, 11, 0.25)"
    : "none";

  const stateBadge = {
    idle: { label: "Siap Mulai", icon: "⏱️", color: "var(--text-secondary)", bg: "rgba(255, 255, 255, 0.06)" },
    focus: { label: "Sesi Fokus", icon: "🍅", color: "var(--color-primary-light)", bg: "rgba(99, 102, 241, 0.16)" },
    break: { label: "Waktu Istirahat", icon: "☕", color: "#34d399", bg: "rgba(16, 185, 129, 0.16)" },
    paused: { label: "Timer Dijeda", icon: "⏸️", color: "#fbbf24", bg: "rgba(245, 158, 11, 0.16)" },
  }[timerState];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: size,
        height: size,
      }}
    >
      {/* SVG Circular Progress Background & Track */}
      <svg
        width={size}
        height={size}
        style={{
          transform: "rotate(-90deg)",
          filter: glowShadow !== "none" ? `drop-shadow(${glowShadow})` : "none",
          transition: "filter 0.5s ease",
        }}
      >
        {/* Lingkaran Jalur Dasar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Lingkaran Progress Berjalan */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease",
          }}
        />
      </svg>

      {/* Konten Tengah Lingkaran */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        {/* Badge Status */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 999,
            backgroundColor: stateBadge.bg,
            color: stateBadge.color,
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 8,
          }}
        >
          <span>{stateBadge.icon}</span>
          <span>{stateBadge.label}</span>
        </div>

        {/* Angka Digital Countdown */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-2px",
            lineHeight: 1,
            color: "var(--text-primary)",
            textShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
          }}
        >
          {minutes}:{seconds}
        </div>

        {/* Informasi Konteks Sesi Aktif */}
        {(courseName || taskTitle) && (
          <div
            style={{
              marginTop: 10,
              maxWidth: 200,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
            }}
          >
            {courseName && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: courseColor || "var(--color-primary-light)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: courseColor || "var(--color-primary)",
                  }}
                />
                {courseName}
              </span>
            )}
            {taskTitle && (
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                📝 {taskTitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
