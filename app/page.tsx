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

  // Nama hari & greeting diinisialisasi di useEffect untuk SSR safety
  const [dayName, setDayName] = useState<string>("");
  const [greeting, setGreeting] = useState<{ title: string; subtitle: string }>({
    title: "Selamat Datang di StudyTrack 🎓",
    subtitle: "Pantau jadwal, selesaikan tugas, dan bangun sesi fokus produktif.",
  });

  useEffect(() => {
    const hour = new Date().getHours();
    let title = "Halo, Mahasiswa! 👋";
    if (hour >= 4 && hour < 11) {
      title = "Selamat pagi! ☀️";
    } else if (hour >= 11 && hour < 15) {
      title = "Selamat siang! 🌤️";
    } else if (hour >= 15 && hour < 18) {
      title = "Selamat sore! 🌇";
    } else {
      title = "Selamat malam! 🌙";
    }
    setGreeting({
      title,
      subtitle: "Berikut ringkasan jadwal kuliah, progres tugas, dan sesi belajarmu hari ini.",
    });
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
        subtitle={`Ringkasan aktivitas belajar — ${dayName || "Hari Ini"}`}
      />

      <div className="page-container">
        {/* ── Greeting Ringkas & Natural ──────────────────────────────────── */}
        <div
          className="card"
          style={{
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
              {greeting.title}
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
              {greeting.subtitle}
            </p>
          </div>
          <div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
                background: "#f1f5f9",
                padding: "6px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              📅 {dayName || "Hari Ini"}
            </span>
          </div>
        </div>

        {/* ── Kartu Statistik Ringkas ─────────────────────────────────────── */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          <div className="stat-card stat-card--primary">
            <span className="stat-label">Jadwal Hari Ini</span>
            <span className="stat-value">{summary.todaySchedule.length}</span>
            <span className="stat-sub">mata kuliah terdaftar</span>
          </div>

          <div className="stat-card stat-card--success">
            <span className="stat-label">Tugas Selesai</span>
            <span className="stat-value">{summary.taskStats.done}</span>
            <span className="stat-sub">dari {summary.taskStats.total} total tugas</span>
          </div>

          <div className="stat-card stat-card--warning">
            <span className="stat-label">Belajar Hari Ini</span>
            {/* todayMinutes: data real-time dari usePomodoro (State Pattern) */}
            <span className="stat-value">{todayMinutes}</span>
            <span className="stat-sub">menit sesi Pomodoro</span>
          </div>

          <div className="stat-card stat-card--danger">
            <span className="stat-label">Progres Tugas</span>
            <span className="stat-value">{completionPct}%</span>
            <span className="stat-sub">
              <div className="progress-bar" style={{ marginTop: 8 }}>
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
              <p className="empty-desc">Nikmati hari bebas atau gunakan untuk fokus belajar mandiri!</p>
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
                    background: "#f8fafc",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    borderLeft: `4px solid ${course.color}`,
                    transition: "all 0.15s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <span
                    className="color-dot"
                    style={{ backgroundColor: course.color, width: 12, height: 12 }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{course.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                      🕐 {course.startTime} – {course.endTime} · 📍 {course.room}
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
