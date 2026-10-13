"use client";
/**
 * app/progress/page.tsx — Halaman Progres Belajar (Recharts)
 *
 * Mengimplementasikan grafik analitik produktivitas belajar:
 * 1. StudyHoursBarChart: Menit/jam belajar harian selama 7 hari terakhir
 * 2. TaskCompletionPieChart: Rasio tugas selesai vs belum selesai (Donut chart)
 * 3. MiniChart showcase: Demonstrasi komponen grafik ringkas yang siap dipakai ulang oleh Riyadh
 *
 * Seluruh grafik diperbarui otomatis (Observer Pattern) saat terjadi perubahan data
 * pada jadwal, tugas, atau sesi Pomodoro.
 */

import { TopBar } from "@/components/layout/TopBar";
import { useStats } from "@/hooks/useStats";
import {
  StudyHoursBarChart,
  TaskCompletionPieChart,
  MiniChart,
} from "@/components/charts";

export default function ProgressPage() {
  const { weeklyData, taskCompletion, summary } = useStats();

  const totalWeeklyMinutes = weeklyData.reduce((acc, d) => acc + d.minutes, 0);
  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1);
  const completionPct =
    taskCompletion.total > 0
      ? Math.round((taskCompletion.done / taskCompletion.total) * 100)
      : 0;

  return (
    <div>
      <TopBar
        title="Progres Belajar"
        subtitle="Analitik waktu belajar dan statistik pencapaian tugas 📈"
      />

      <div className="page-container">
        {/* ── Stat Cards ── */}
        <div className="grid-3" style={{ marginBottom: 28 }}>
          <div className="stat-card stat-card--primary">
            <span className="stat-label">Total Belajar Minggu Ini</span>
            <span className="stat-value">{totalWeeklyMinutes}</span>
            <span className="stat-sub">menit (~{totalWeeklyHours} jam dalam 7 hari)</span>
          </div>

          <div className="stat-card stat-card--success">
            <span className="stat-label">Tugas Terselesaikan</span>
            <span className="stat-value">{taskCompletion.done}</span>
            <span className="stat-sub">dari {taskCompletion.total} total tugas</span>
          </div>

          <div className="stat-card stat-card--warning">
            <span className="stat-label">Persentase Capaian</span>
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

        {/* ── Dua Grafik Utama (Recharts) ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 24,
            marginBottom: 28,
          }}
        >
          {/* Grafik Batang Waktu Belajar */}
          <StudyHoursBarChart data={weeklyData} height={320} />

          {/* Grafik Donut Rasio Tugas */}
          <TaskCompletionPieChart taskCompletion={taskCompletion} height={320} />
        </div>

        {/* ── MiniChart Showcase (Dapat Dipakai Ulang oleh Riyadh) ── */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div>
              <div className="card-title" style={{ marginBottom: 2 }}>
                🧩 Komponen MiniChart (Siap Pakai untuk Dashboard Riyadh)
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Komponen <code>&lt;MiniChart /&gt;</code> dirancang agar ringan dan dapat disematkan langsung ke kartu dashboard.
              </p>
            </div>
            <span className="badge badge-doing">Reusable Component</span>
          </div>

          <div className="grid-2" style={{ gap: 16 }}>
            {/* Preview MiniChart Study */}
            <div
              style={{
                padding: "16px 20px",
                background: "var(--bg-input)",
                borderRadius: 12,
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  MiniChart (type=&quot;study&quot;)
                </span>
                <span style={{ fontSize: 12, color: "var(--color-primary-light)" }}>
                  {totalWeeklyMinutes}m
                </span>
              </div>
              <MiniChart type="study" data={weeklyData} height={100} />
            </div>

            {/* Preview MiniChart Tasks */}
            <div
              style={{
                padding: "16px 20px",
                background: "var(--bg-input)",
                borderRadius: 12,
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  MiniChart (type=&quot;tasks&quot;)
                </span>
                <span style={{ fontSize: 12, color: "#34d399" }}>
                  {completionPct}% Tuntas
                </span>
              </div>
              <MiniChart
                type="tasks"
                taskCompletion={taskCompletion}
                height={100}
              />
            </div>
          </div>
        </div>

        {/* ── Tabel Rincian Data Harian ── */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="card-title">📅 Tabel Aktivitas Belajar 7 Hari Terakhir</div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Hari &amp; Tanggal</th>
                  <th>Menit Belajar</th>
                  <th>Jam</th>
                  <th>Distribusi Visual</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.map((d) => {
                  const dateObj = new Date(d.date);
                  const formattedDate = dateObj.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  });
                  const barWidth = Math.min((d.minutes / 180) * 100, 100);

                  return (
                    <tr key={d.date}>
                      <td style={{ fontWeight: 500 }}>{formattedDate}</td>
                      <td>
                        <strong style={{ color: "var(--color-primary-light)" }}>
                          {d.minutes}
                        </strong>{" "}
                        menit
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>
                        {(d.minutes / 60).toFixed(1)} jam
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            maxWidth: 240,
                          }}
                        >
                          <div className="progress-bar" style={{ height: 6 }}>
                            <div
                              className="progress-fill"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            {Math.round(barWidth)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Jadwal Hari Ini ── */}
        <div className="card">
          <div className="card-title">📖 Jadwal Kuliah Hari Ini</div>
          {summary.todaySchedule.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Tidak ada jadwal kuliah hari ini. Waktu yang tepat untuk fokus mengerjakan tugas!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {summary.todaySchedule.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "var(--bg-input)",
                    borderRadius: 10,
                    borderLeft: `4px solid ${c.color}`,
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      Ruang {c.room}
                    </p>
                  </div>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      color: "var(--text-primary)",
                    }}
                  >
                    🕐 {c.startTime} – {c.endTime}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
