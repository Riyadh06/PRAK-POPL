"use client";
/**
 * src/components/pomodoro/SessionHistory.tsx
 *
 * Komponen riwayat sesi fokus Pomodoro.
 * Menampilkan rincian sesi belajar yang telah selesai beserta mata kuliah,
 * tugas yang dikerjakan, dan waktu pencatatan.
 */

import React from "react";
import { Course, PomodoroSession, Task } from "@/types";

interface SessionHistoryProps {
  sessions: PomodoroSession[];
  courses: Course[];
  tasks: Task[];
}

export function SessionHistory({
  sessions,
  courses,
  tasks,
}: SessionHistoryProps) {
  // Urutkan sesi dari yang paling baru ke paling lama
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const getCourse = (id?: string) => courses.find((c) => c.id === id);
  const getTask = (id?: string) => tasks.find((t) => t.id === id);

  return (
    <div className="card" style={{ width: "100%", maxWidth: 860 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div className="card-title" style={{ marginBottom: 0 }}>
          📋 Riwayat Sesi Fokus ({sessions.length})
        </div>
        {sessions.length > 0 && (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Total {sessions.reduce((acc, s) => acc + s.durationMinutes, 0)} menit
          </span>
        )}
      </div>

      {sortedSessions.length === 0 ? (
        <div className="empty-state" style={{ padding: "36px 0" }}>
          <span className="empty-icon" style={{ fontSize: 36 }}>
            🍅
          </span>
          <p className="empty-title">Belum Ada Sesi Fokus</p>
          <p className="empty-desc">
            Selesaikan sesi fokus pertamamu untuk melihat riwayat belajar di sini.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Waktu Selesai</th>
                <th>Durasi</th>
                <th>Mata Kuliah</th>
                <th>Tugas</th>
              </tr>
            </thead>
            <tbody>
              {sortedSessions.slice(0, 10).map((session) => {
                const course = getCourse(session.courseId);
                const task = getTask(session.taskId);

                const dateObj = new Date(session.completedAt);
                const timeStr = dateObj.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const dateStr = dateObj.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                });

                return (
                  <tr key={session.id}>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600 }}>{timeStr}</span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginLeft: 6,
                          }}
                        >
                          {dateStr}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "rgba(99, 102, 241, 0.15)",
                          color: "var(--color-primary-light)",
                        }}
                      >
                        +{session.durationMinutes} menit
                      </span>
                    </td>
                    <td>
                      {course ? (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span
                            className="color-dot"
                            style={{ backgroundColor: course.color }}
                          />
                          <span style={{ fontWeight: 500, fontSize: 13 }}>
                            {course.name}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      {task ? (
                        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                          {task.title}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
