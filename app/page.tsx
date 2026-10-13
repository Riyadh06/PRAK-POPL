"use client";
/**
 * app/page.tsx — Halaman Dashboard
 *
 * Menampilkan ringkasan: jadwal hari ini, mata kuliah aktif,
 * statistik tugas, total belajar, dan tugas deadline terdekat.
 */

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { useStats } from "@/hooks/useStats";
import { useSchedule } from "@/hooks/useSchedule";
import { useTasks } from "@/hooks/useTasks";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function DashboardPage() {
  const { summary } = useStats();
  const { currentCourse, nextCourse } = useSchedule();
  const { isOverdue, isDueSoon } = useTasks();
  const [dayName, setDayName] = useState<string>("");

  useEffect(() => {
    setDayName(DAY_NAMES[new Date().getDay()]);
  }, []);

  const completionPct =
    summary.taskStats.total > 0
      ? Math.round((summary.taskStats.done / summary.taskStats.total) * 100)
      : 0;

  return (
    <div>
      <TopBar
        title="Dashboard"
        subtitle="Selamat datang di StudyTrack 🎓"
      />
      <div className="page-container">
        {/* ── Stat Cards ── */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          <div className="stat-card stat-card--primary">
            <span className="stat-label">Jadwal Hari Ini</span>
            <span className="stat-value">{summary.todaySchedule.length}</span>
            <span className="stat-sub">mata kuliah</span>
          </div>
          <div className="stat-card stat-card--success">
            <span className="stat-label">Tugas Selesai</span>
            <span className="stat-value">{summary.taskStats.done}</span>
            <span className="stat-sub">dari {summary.taskStats.total} tugas</span>
          </div>
          <div className="stat-card stat-card--warning">
            <span className="stat-label">Belajar Hari Ini</span>
            <span className="stat-value">{summary.todayStudyMinutes}</span>
            <span className="stat-sub">menit fokus</span>
          </div>
          <div className="stat-card stat-card--danger">
            <span className="stat-label">Progres Tugas</span>
            <span className="stat-value">{completionPct}%</span>
            <span className="stat-sub">
              <div className="progress-bar" style={{ marginTop: 6 }}>
                <div
                  className="progress-fill"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </span>
          </div>
        </div>

        {/* ── Dua Kolom: Jadwal & Tugas Deadline ── */}
        <div className="grid-2" style={{ marginBottom: 28 }}>
          {/* Mata Kuliah Aktif */}
          <div className="card">
            <div className="card-title">🏫 Status Kelas</div>
            {currentCourse ? (
              <div style={{ padding: "16px", background: "rgba(99,102,241,0.1)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.2)", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    className="color-dot"
                    style={{ backgroundColor: currentCourse.color, width: 14, height: 14 }}
                  />
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--color-primary-light)", fontSize: 15 }}>
                      {currentCourse.name}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      🕐 {currentCourse.startTime} – {currentCourse.endTime} · 📍 {currentCourse.room}
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.15)", padding: "3px 10px", borderRadius: 999 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite" }} />
                  <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>Sedang Berlangsung</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: "12px 0", color: "var(--text-muted)", fontSize: 14 }}>
                Tidak ada kelas yang sedang berlangsung.
              </div>
            )}
            {nextCourse && (
              <div style={{ padding: "12px", background: "var(--bg-input)", borderRadius: 10 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Berikutnya:</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="color-dot" style={{ backgroundColor: nextCourse.color }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{nextCourse.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {nextCourse.startTime} · {nextCourse.room}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tugas Deadline Terdekat */}
          <div className="card">
            <div className="card-title">⏰ Deadline Terdekat</div>
            {summary.nearestDeadlineTasks.length === 0 ? (
              <div className="empty-state" style={{ padding: "30px 0" }}>
                <span style={{ fontSize: 32 }}>🎉</span>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                  Tidak ada tugas mendesak!
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {summary.nearestDeadlineTasks.map((task) => {
                  const overdue = isOverdue(task);
                  const dueSoon = isDueSoon(task);
                  const color = overdue ? "var(--color-danger)" : dueSoon ? "var(--color-warning)" : "var(--text-secondary)";
                  return (
                    <div
                      key={task.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        background: "var(--bg-input)",
                        borderRadius: 10,
                        borderLeft: `3px solid ${color}`,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 13 }}>{task.title}</p>
                        <p style={{ fontSize: 11, color }}>
                          {overdue ? "⚠️ Terlambat" : dueSoon ? "🔔 Hampir jatuh tempo" : "📅"}{" "}
                          {new Date(task.deadline).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span className={`badge badge-${task.priority}`}>
                        {task.priority === "high" ? "Tinggi" : task.priority === "medium" ? "Sedang" : "Rendah"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Jadwal Hari Ini ── */}
        <div className="card">
          <div className="card-title">
            📅 Jadwal Hari Ini{dayName ? ` — ${dayName}` : ""}
          </div>
          {summary.todaySchedule.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px 0" }}>
              <span className="empty-icon">😴</span>
              <p className="empty-title">Tidak ada kuliah hari ini</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {summary.todaySchedule.map((course) => (
                <div
                  key={course.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 16px",
                    background: "var(--bg-input)",
                    borderRadius: 10,
                    borderLeft: `4px solid ${course.color}`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600 }}>{course.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {course.startTime} – {course.endTime} · {course.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
