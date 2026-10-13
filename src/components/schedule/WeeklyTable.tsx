"use client";
/**
 * src/components/schedule/WeeklyTable.tsx
 * Tampilan tabel mingguan jadwal kuliah (7 kolom per hari).
 * Highlight mata kuliah yang sedang berlangsung.
 */

import { Course } from "@/types";

interface WeeklyTableProps {
  courses: Course[];
  currentCourse: Course | null;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

const DAYS: { label: string; short: string; value: Course["day"] }[] = [
  { label: "Minggu", short: "Min", value: 0 },
  { label: "Senin", short: "Sen", value: 1 },
  { label: "Selasa", short: "Sel", value: 2 },
  { label: "Rabu", short: "Rab", value: 3 },
  { label: "Kamis", short: "Kam", value: 4 },
  { label: "Jumat", short: "Jum", value: 5 },
  { label: "Sabtu", short: "Sab", value: 6 },
];

export function WeeklyTable({
  courses,
  currentCourse,
  onEdit,
  onDelete,
}: WeeklyTableProps) {
  const today = new Date().getDay() as Course["day"];

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {DAYS.map((d) => (
              <th
                key={d.value}
                style={{
                  minWidth: 130,
                  color: d.value === today ? "var(--color-primary-light)" : undefined,
                  background:
                    d.value === today ? "rgba(99,102,241,0.08)" : undefined,
                }}
              >
                {d.label}
                {d.value === today && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 9,
                      background: "var(--color-primary)",
                      padding: "1px 5px",
                      borderRadius: 999,
                      color: "white",
                    }}
                  >
                    HARI INI
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {DAYS.map((d) => {
              const dayCourses = courses
                .filter((c) => c.day === d.value)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));
              return (
                <td
                  key={d.value}
                  style={{
                    verticalAlign: "top",
                    padding: "12px 10px",
                    background:
                      d.value === today ? "rgba(99,102,241,0.04)" : undefined,
                  }}
                >
                  {dayCourses.length === 0 ? (
                    <span style={{ color: "var(--text-muted)", fontSize: 12 }}>–</span>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {dayCourses.map((c) => {
                        const isActive = currentCourse?.id === c.id;
                        return (
                          <div
                            key={c.id}
                            style={{
                              padding: "8px 10px",
                              borderRadius: 8,
                              background: isActive
                                ? `${c.color}22`
                                : "var(--bg-input)",
                              borderLeft: `3px solid ${c.color}`,
                              outline: isActive
                                ? `1px solid ${c.color}55`
                                : "none",
                              position: "relative",
                            }}
                          >
                            {isActive && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 5,
                                  right: 5,
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: "#10b981",
                                  animation: "pulse 2s infinite",
                                }}
                              />
                            )}
                            <p
                              style={{
                                fontWeight: 600,
                                fontSize: 12,
                                color: "var(--text-primary)",
                                marginBottom: 2,
                              }}
                            >
                              {c.name}
                            </p>
                            <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                              {c.startTime}–{c.endTime}
                            </p>
                            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                              {c.room}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                gap: 4,
                                marginTop: 4,
                              }}
                            >
                              <button
                                className="btn btn-ghost btn-sm"
                                style={{ padding: "2px 6px", fontSize: 11 }}
                                onClick={() => onEdit(c)}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                style={{ padding: "2px 6px", fontSize: 11 }}
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
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
