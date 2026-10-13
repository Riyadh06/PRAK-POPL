"use client";
/**
 * src/components/dashboard/ScheduleCard.tsx
 *
 * Kartu jadwal hari ini: menampilkan mata kuliah yang sedang berlangsung
 * dan mata kuliah berikutnya. Data dari useStats (Facade).
 */

import { Course } from "@/types";

interface ScheduleCardProps {
  currentCourse: Course | null;
  nextCourse: Course | null;
  todaySchedule: Course[];
  dayName: string;
}

export function ScheduleCard({
  currentCourse,
  nextCourse,
  todaySchedule,
  dayName,
}: ScheduleCardProps) {
  return (
    <div className="card">
      <div className="card-title">🏫 Status Kelas — {dayName || "…"}</div>

      {/* Mata Kuliah Sedang Berlangsung */}
      {currentCourse ? (
        <div
          style={{
            padding: 16,
            background: "rgba(99,102,241,0.1)",
            borderRadius: 12,
            border: "1px solid rgba(99,102,241,0.2)",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              className="color-dot"
              style={{
                backgroundColor: currentCourse.color,
                width: 14,
                height: 14,
              }}
            />
            <div>
              <p
                style={{
                  fontWeight: 700,
                  color: "var(--color-primary-light)",
                  fontSize: 15,
                }}
              >
                {currentCourse.name}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                🕐 {currentCourse.startTime} – {currentCourse.endTime} · 📍{" "}
                {currentCourse.room}
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(16,185,129,0.15)",
              padding: "3px 10px",
              borderRadius: 999,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10b981",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>
              Sedang Berlangsung
            </span>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "12px 0",
            color: "var(--text-muted)",
            fontSize: 14,
            marginBottom: 8,
          }}
        >
          Tidak ada kelas yang sedang berlangsung.
        </div>
      )}

      {/* Kelas Berikutnya */}
      {nextCourse && (
        <div
          style={{
            padding: 12,
            background: "var(--bg-input)",
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
            Berikutnya:
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              className="color-dot"
              style={{ backgroundColor: nextCourse.color }}
            />
            <div>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{nextCourse.name}</p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {nextCourse.startTime} · {nextCourse.room}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Jadwal Hari Ini seluruhnya (jika tidak ada aktif/berikutnya) */}
      {!currentCourse && !nextCourse && todaySchedule.length === 0 && (
        <div className="empty-state" style={{ padding: "24px 0" }}>
          <span className="empty-icon">😴</span>
          <p className="empty-title">Tidak ada kuliah hari ini</p>
          <p className="empty-desc">Nikmati hari bebas atau belajar mandiri!</p>
        </div>
      )}

      {/* Ringkasan jumlah jadwal hari ini */}
      {todaySchedule.length > 0 && (
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
          📚 {todaySchedule.length} mata kuliah hari ini
        </p>
      )}
    </div>
  );
}
