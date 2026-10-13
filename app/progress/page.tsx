"use client";
/**
 * app/progress/page.tsx — Halaman Progres (Placeholder untuk Riyadh)
 *
 * Riyadh perlu mengimplementasikan grafik Recharts menggunakan:
 * - useStats().weeklyData → data menit belajar per hari
 * - useStats().taskCompletion → pie chart progres tugas
 * - StatsService.getWeeklyStudyHours() sudah tersedia
 */

import { TopBar } from "@/components/layout/TopBar";
import { useStats } from "@/hooks/useStats";

export default function ProgressPage() {
  const { weeklyData, taskCompletion, summary } = useStats();

  const totalWeeklyMinutes = weeklyData.reduce((acc, d) => acc + d.minutes, 0);
  const completionPct =
    taskCompletion.total > 0
      ? Math.round((taskCompletion.done / taskCompletion.total) * 100)
      : 0;

  return (
    <div>
      <TopBar title="Progres Belajar" subtitle="Statistik dan grafik kemajuan studi" />
      <div className="page-container">
        {/* Stat Summary */}
        <div className="grid-3" style={{ marginBottom: 28 }}>
          <div className="stat-card stat-card--primary">
            <span className="stat-label">Total Minggu Ini</span>
            <span className="stat-value">{totalWeeklyMinutes}</span>
            <span className="stat-sub">menit belajar (7 hari)</span>
          </div>
          <div className="stat-card stat-card--success">
            <span className="stat-label">Tugas Selesai</span>
            <span className="stat-value">{taskCompletion.done}</span>
            <span className="stat-sub">dari {taskCompletion.total} total</span>
          </div>
          <div className="stat-card stat-card--warning">
            <span className="stat-label">Persentase Selesai</span>
            <span className="stat-value">{completionPct}%</span>
            <span className="stat-sub">
              <div className="progress-bar" style={{ marginTop: 6 }}>
                <div className="progress-fill" style={{ width: `${completionPct}%` }} />
              </div>
            </span>
          </div>
        </div>

        {/* Data mentah untuk Riyadh */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title">📊 Data Belajar Mingguan (untuk Recharts)</div>
          <div
            style={{
              padding: "16px 20px",
              background: "rgba(245,158,11,0.08)",
              borderRadius: 10,
              border: "1px solid rgba(245,158,11,0.2)",
              marginBottom: 16,
            }}
          >
            <p style={{ fontSize: 13, color: "var(--color-warning)", fontWeight: 600, marginBottom: 6 }}>
              🚧 Untuk Riyadh
            </p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Gunakan <code>useStats().weeklyData</code> untuk data grafik batang menit belajar per hari,
              dan <code>useStats().taskCompletion</code> untuk pie chart progres tugas.
              Import Recharts dari &apos;recharts&apos; yang sudah terinstall.
            </p>
          </div>

          {/* Preview data mentah */}
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Menit Belajar</th>
                  <th>Jam</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.map((d) => (
                  <tr key={d.date}>
                    <td>
                      {new Date(d.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            height: 8,
                            width: d.minutes > 0 ? Math.min((d.minutes / 120) * 100, 100) + "px" : 4,
                            background: "var(--color-primary)",
                            borderRadius: 4,
                            minWidth: 4,
                          }}
                        />
                        {d.minutes} menit
                      </div>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>
                      {(d.minutes / 60).toFixed(1)} jam
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jadwal Hari Ini */}
        <div className="card">
          <div className="card-title">📅 Jadwal Hari Ini</div>
          {summary.todaySchedule.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Tidak ada kuliah hari ini.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {summary.todaySchedule.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    background: "var(--bg-input)",
                    borderRadius: 10,
                    borderLeft: `3px solid ${c.color}`,
                  }}
                >
                  <span style={{ fontWeight: 600, flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {c.startTime} – {c.endTime} · {c.room}
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
