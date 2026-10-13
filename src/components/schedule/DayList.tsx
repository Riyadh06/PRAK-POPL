"use client";
/**
 * src/components/schedule/DayList.tsx
 * Tampilan daftar per hari (alternatif dari WeeklyTable).
 * Highlight mata kuliah yang sedang berlangsung.
 */

import { Course } from "@/types";

interface DayListProps {
  courses: Course[];
  currentCourse: Course | null;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

const DAYS = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
];

export function DayList({ courses, currentCourse, onEdit, onDelete }: DayListProps) {
  // Kelompokkan per hari
  const grouped: Record<number, Course[]> = {};
  for (let i = 0; i < 7; i++) {
    grouped[i] = courses
      .filter((c) => c.day === i)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  const today = new Date().getDay();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {[1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
        const dayCourses = grouped[dayNum];
        const isToday = dayNum === today;

        return (
          <div key={dayNum}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: isToday ? "var(--color-primary-light)" : "var(--text-secondary)",
                }}
              >
                {DAYS[dayNum]}
              </h3>
              {isToday && (
                <span
                  style={{
                    fontSize: 10,
                    background: "var(--color-primary)",
                    padding: "2px 8px",
                    borderRadius: 999,
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  HARI INI
                </span>
              )}
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  background: "var(--bg-input)",
                  padding: "1px 8px",
                  borderRadius: 999,
                }}
              >
                {dayCourses.length} matkul
              </span>
            </div>

            {dayCourses.length === 0 ? (
              <div
                style={{
                  padding: "16px",
                  background: "var(--bg-input)",
                  borderRadius: 10,
                  color: "var(--text-muted)",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                Tidak ada kuliah
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {dayCourses.map((c) => {
                  const isActive = currentCourse?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 16px",
                        background: isActive ? `${c.color}18` : "var(--bg-card)",
                        borderRadius: 12,
                        borderLeft: `4px solid ${c.color}`,
                        border: isActive
                          ? `1px solid ${c.color}44`
                          : "1px solid var(--border-subtle)",
                        borderLeftWidth: 4,
                        transition: "all 0.2s",
                      }}
                    >
                      {/* Indikator aktif */}
                      {isActive && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#10b981",
                            animation: "pulse 2s infinite",
                            flexShrink: 0,
                          }}
                        />
                      )}

                      {/* Info Kuliah */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <p style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</p>
                          {isActive && (
                            <span
                              style={{
                                fontSize: 10,
                                background: "rgba(16,185,129,0.2)",
                                color: "#34d399",
                                padding: "2px 7px",
                                borderRadius: 999,
                                fontWeight: 600,
                              }}
                            >
                              Aktif
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                          🕐 {c.startTime} – {c.endTime} &nbsp;·&nbsp; 📍 {c.room}
                        </p>
                      </div>

                      {/* Aksi */}
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onEdit(c)}
                          title="Edit"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onDelete(c.id)}
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
