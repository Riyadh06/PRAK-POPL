"use client";
/**
 * app/page.tsx — Halaman Dashboard StudyTrack
 *
 * Halaman utama yang merangkum produktivitas belajar:
 *   1. Status kuliah aktif / berikutnya hari ini (ScheduleCard)
 *   2. Tugas deadline terdekat dengan penanda warna (DeadlineCard)
 *   3. Total waktu belajar hari ini + sparkline 7 hari (StudyStatsCard)
 *   4. Mini donut chart progres tugas (TaskProgressCard)
 *   5. Tombol pintasan Pomodoro / Tambah Tugas / Lihat Jadwal (QuickActions)
 *
 * Alur Data (sesuai kontrak arsitektur):
 *   Komponen → useStats / useSchedule / useTasks / usePomodoro
 *           → Service → StorageService → localStorage
 *
 * TIDAK ada akses localStorage langsung di file ini.
 */

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { useStats } from "@/hooks/useStats";
import { useSchedule } from "@/hooks/useSchedule";
import { useTasks } from "@/hooks/useTasks";
import { usePomodoro } from "@/hooks/usePomodoro";
import {
  ScheduleCard,
  DeadlineCard,
  StudyStatsCard,
  TaskProgressCard,
  QuickActions,
} from "@/components/dashboard";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function DashboardPage() {
  // ── Hook (sesuai kontrak: hanya 4 hook ini, tanpa localStorage langsung) ──
  const { summary, weeklyData, taskCompletion } = useStats();
  const { currentCourse, nextCourse, todayCourses } = useSchedule();
  const { isOverdue, isDueSoon } = useTasks();
  const { todayMinutes } = usePomodoro();

  // Nama hari diinisialisasi di useEffect untuk SSR safety
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
        subtitle={`Selamat datang di StudyTrack 🎓 — ${dayName}`}
      />

      <div className="page-container">
        {/* ── Kartu Statistik Ringkas ─────────────────────────────────────── */}
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
            {/* todayMinutes: data real-time dari usePomodoro (State Pattern) */}
            <span className="stat-value">{todayMinutes}</span>
            <span className="stat-sub">menit fokus</span>
          </div>

          <div className="stat-card stat-card--danger">
            <span className="stat-label">Progres Tugas</span>
            <span className="stat-value">{completionPct}%</span>
            <span className="stat-sub">
              <div className="progress-bar" style={{ marginTop: 6 }}>
                <div
                  className="progress-fill"
                  style={{ width: `${completionPct}%`, transition: "width 0.6s ease" }}
                />
              </div>
            </span>
          </div>
        </div>

        {/* ── Pintasan Cepat ──────────────────────────────────────────────── */}
        {/* QuickActions: Mulai Pomodoro, Tambah Tugas, Lihat Jadwal, Lihat Progres */}
        <QuickActions />

        {/* ── Dua Kolom: Status Kelas + Deadline ─────────────────────────── */}
        <div className="grid-2" style={{ marginBottom: 28 }}>
          {/* ScheduleCard: kuliah aktif & berikutnya hari ini */}
          <ScheduleCard
            currentCourse={currentCourse}
            nextCourse={nextCourse}
            todaySchedule={todayCourses}
            dayName={dayName}
          />

          {/* DeadlineCard: tugas deadline terdekat dengan penanda warna */}
          <DeadlineCard
            tasks={summary.nearestDeadlineTasks}
            isOverdue={isOverdue}
            isDueSoon={isDueSoon}
          />
        </div>

        {/* ── Dua Kolom: Grafik Belajar + Progres Tugas ──────────────────── */}
        <div className="grid-2" style={{ marginBottom: 28 }}>
          {/* StudyStatsCard: menit belajar hari ini + MiniChart sparkline 7 hari */}
          <StudyStatsCard
            todayMinutes={summary.todayStudyMinutes}
            weeklyData={weeklyData}
          />

          {/* TaskProgressCard: MiniChart donut rasio tugas selesai */}
          <TaskProgressCard taskCompletion={taskCompletion} />
        </div>

        {/* ── Jadwal Lengkap Hari Ini ─────────────────────────────────────── */}
        <div className="card">
          <div className="card-title">
            📅 Jadwal Hari Ini{dayName ? ` — ${dayName}` : ""}
          </div>

          {summary.todaySchedule.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px 0" }}>
              <span className="empty-icon">😴</span>
              <p className="empty-title">Tidak ada kuliah hari ini</p>
              <p className="empty-desc">Nikmati hari bebas atau belajar mandiri!</p>
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
                  <span
                    className="color-dot"
                    style={{ backgroundColor: course.color, width: 10, height: 10 }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{course.name}</p>
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
