"use client";
/**
 * app/pomodoro/page.tsx — Halaman Pomodoro Timer
 *
 * Menggabungkan TimerDisplay (SVG circular countdown), TimerControls,
 * TaskCourseSelector, SessionHistory, dan PomodoroSettingsModal.
 * Terhubung secara reaktif lewat hook usePomodoro, useSchedule, dan useTasks.
 */

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useSchedule } from "@/hooks/useSchedule";
import { useTasks } from "@/hooks/useTasks";
import {
  TimerDisplay,
  TimerControls,
  TaskCourseSelector,
  PomodoroSettingsModal,
  SessionHistory,
} from "@/components/pomodoro";

export default function PomodoroPage() {
  const {
    timerState,
    secondsLeft,
    settings,
    todayMinutes,
    sessions,
    startFocus,
    pauseTimer,
    resumeTimer,
    resetTimer,
    saveSettings,
    selectedCourseId,
    setSelectedCourseId,
    selectedTaskId,
    setSelectedTaskId,
    notificationMessage,
    dismissNotification,
  } = usePomodoro();

  const { courses } = useSchedule();
  const { tasks } = useTasks();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Cari mata kuliah dan tugas yang sedang dipilih
  const currentCourse = courses.find((c) => c.id === selectedCourseId);
  const currentTask = tasks.find((t) => t.id === selectedTaskId);

  // Total durasi sesi aktif dalam detik untuk kalkulasi progress melingkar
  const totalDurationSeconds =
    timerState === "break"
      ? settings.breakMinutes * 60
      : settings.focusMinutes * 60;

  const isTimerRunning =
    timerState === "focus" || timerState === "break" || timerState === "paused";

  return (
    <div>
      <TopBar
        title="Pomodoro Timer"
        subtitle="Kelola waktu belajar dengan teknik Pomodoro 🍅"
      />

      <div className="page-container">
        {/* Banner Notifikasi Selesai */}
        {notificationMessage && (
          <div
            style={{
              padding: "16px 20px",
              background: "linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.2))",
              border: "1px solid rgba(99, 102, 241, 0.4)",
              borderRadius: 14,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.15)",
              animation: "slideUp 250ms ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>🔔</span>
              <div>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>
                  {notificationMessage}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Tetap jaga ritme belajarmu agar tidak kelelahan.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={dismissNotification}
              style={{ color: "var(--text-primary)" }}
            >
              Tutup ✕
            </button>
          </div>
        )}

        {/* Ringkasan Statistik Cepat */}
        <div className="grid-3" style={{ marginBottom: 32 }}>
          <div className="stat-card stat-card--primary">
            <span className="stat-label">Belajar Hari Ini</span>
            <span className="stat-value">{todayMinutes}</span>
            <span className="stat-sub">menit sesi fokus</span>
          </div>
          <div className="stat-card stat-card--success">
            <span className="stat-label">Total Sesi Selesai</span>
            <span className="stat-value">{sessions.length}</span>
            <span className="stat-sub">sesi tercatat</span>
          </div>
          <div className="stat-card stat-card--warning">
            <span className="stat-label">Durasi Terpasang</span>
            <span className="stat-value">
              {settings.focusMinutes}
              <span style={{ fontSize: 16, fontWeight: 500 }}> / {settings.breakMinutes}m</span>
            </span>
            <span className="stat-sub">fokus / istirahat</span>
          </div>
        </div>

        {/* Area Utama Timer */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            marginBottom: 40,
          }}
        >
          {/* Circular Countdown Progress */}
          <TimerDisplay
            secondsLeft={secondsLeft}
            totalDurationSeconds={totalDurationSeconds}
            timerState={timerState}
            courseName={currentCourse?.name}
            courseColor={currentCourse?.color}
            taskTitle={currentTask?.title}
          />

          {/* Tombol Kontrol */}
          <TimerControls
            timerState={timerState}
            onStart={() => startFocus()}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onReset={resetTimer}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Selector Mata Kuliah & Tugas */}
          <TaskCourseSelector
            courses={courses}
            tasks={tasks}
            selectedCourseId={selectedCourseId}
            selectedTaskId={selectedTaskId}
            onSelectCourse={setSelectedCourseId}
            onSelectTask={setSelectedTaskId}
            disabled={isTimerRunning}
          />
        </div>

        {/* Riwayat Sesi Belajar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <SessionHistory
            sessions={sessions}
            courses={courses}
            tasks={tasks}
          />
        </div>

        {/* Modal Pengaturan */}
        <PomodoroSettingsModal
          isOpen={isSettingsOpen}
          initialSettings={settings}
          onSave={saveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  );
}
