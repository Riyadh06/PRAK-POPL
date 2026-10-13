"use client";
/**
 * src/components/dashboard/TaskProgressCard.tsx
 *
 * Kartu progres penyelesaian tugas dengan mini donut chart.
 * Menggunakan MiniChart dari Isra.
 */

import { MiniChart } from "@/components/charts";

interface TaskProgressCardProps {
  taskCompletion: { done: number; total: number };
}

export function TaskProgressCard({ taskCompletion }: TaskProgressCardProps) {
  const { done, total } = taskCompletion;
  const pending = Math.max(total - done, 0);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="card">
      <div className="card-title">📊 Progres Tugas</div>

      {total === 0 ? (
        <div className="empty-state" style={{ padding: "16px 0" }}>
          <span style={{ fontSize: 32 }}>✨</span>
          <p className="empty-title">Belum ada tugas</p>
          <p className="empty-desc">Tambah tugas pertamamu!</p>
        </div>
      ) : (
        <>
          {/* Mini Donut */}
          <MiniChart
            type="tasks"
            taskCompletion={taskCompletion}
            height={110}
            showTooltip
          />

          {/* Legend */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 10,
              fontSize: 12,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, color: "#10b981", fontSize: 18 }}>
                {done}
              </p>
              <p style={{ color: "var(--text-muted)" }}>Selesai</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, color: "#6366f1", fontSize: 18 }}>
                {pending}
              </p>
              <p style={{ color: "var(--text-muted)" }}>Belum</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontSize: 18,
                }}
              >
                {pct}%
              </p>
              <p style={{ color: "var(--text-muted)" }}>Progres</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar" style={{ marginTop: 14 }}>
            <div
              className="progress-fill"
              style={{ width: `${pct}%`, transition: "width 0.6s ease" }}
            />
          </div>
        </>
      )}
    </div>
  );
}
