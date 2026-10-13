"use client";
/**
 * src/components/dashboard/StudyStatsCard.tsx
 *
 * Kartu statistik belajar: total menit hari ini + sparkline bar chart
 * menit belajar 7 hari. Menggunakan MiniChart dari Isra.
 */

import { WeeklyStudyData } from "@/types";
import { MiniChart } from "@/components/charts";

interface StudyStatsCardProps {
  todayMinutes: number;
  weeklyData: WeeklyStudyData[];
}

export function StudyStatsCard({ todayMinutes, weeklyData }: StudyStatsCardProps) {
  const todayHours = Math.floor(todayMinutes / 60);
  const todayMins = todayMinutes % 60;

  const weeklyTotal = weeklyData.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <div className="card">
      <div className="card-title">⏱️ Belajar Hari Ini</div>

      {/* Angka total hari ini */}
      <div style={{ marginBottom: 16 }}>
        {todayMinutes === 0 ? (
          <div className="empty-state" style={{ padding: "16px 0" }}>
            <span style={{ fontSize: 32 }}>📚</span>
            <p className="empty-title">Belum ada sesi belajar</p>
            <p className="empty-desc">
              Mulai sesi Pomodoro untuk mencatat waktu belajar!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            {todayHours > 0 && (
              <>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {todayHours}
                </span>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>jam</span>
              </>
            )}
            <span
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "var(--color-primary-light)",
                lineHeight: 1,
              }}
            >
              {todayMins}
            </span>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>menit fokus</span>
          </div>
        )}
      </div>

      {/* Sparkline 7 hari */}
      <div>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          7 Hari Terakhir · Total {weeklyTotal} menit
        </p>
        <MiniChart type="study" data={weeklyData} height={80} showTooltip />
      </div>
    </div>
  );
}
