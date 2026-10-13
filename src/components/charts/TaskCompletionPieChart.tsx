"use client";
/**
 * src/components/charts/TaskCompletionPieChart.tsx
 *
 * Grafik donat (Pie/Donut Chart) Recharts untuk rasio penyelesaian tugas (selesai vs belum selesai).
 * Menampilkan persentase pencapaian di tengah donat dan rincian legenda tugas.
 */

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TaskCompletionPieChartProps {
  taskCompletion: { done: number; total: number };
  height?: number;
}

const COLORS = {
  done: "#10b981", // Emerald
  pending: "#6366f1", // Indigo
  empty: "rgba(255, 255, 255, 0.08)",
};

export function TaskCompletionPieChart({
  taskCompletion,
  height = 300,
}: TaskCompletionPieChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        Memuat grafik...
      </div>
    );
  }

  const { done, total } = taskCompletion;
  const pending = Math.max(total - done, 0);
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  const data =
    total === 0
      ? [{ name: "Belum Ada Tugas", value: 1, color: COLORS.empty }]
      : [
          { name: "Selesai", value: done, color: COLORS.done },
          { name: "Belum Selesai", value: pending, color: COLORS.pending },
        ];

  return (
    <div className="card" style={{ width: "100%" }}>
      <div style={{ marginBottom: 16 }}>
        <div className="card-title" style={{ marginBottom: 2 }}>
          🎯 Rasio Penyelesaian Tugas
        </div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {done} dari {total} tugas telah diselesaikan
        </p>
      </div>

      <div
        style={{
          width: "100%",
          height,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length && total > 0) {
                  const item = payload[0];
                  return (
                    <div
                      style={{
                        background: "#181829",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: 10,
                        padding: "8px 12px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                      }}
                    >
                      <p style={{ fontSize: 13, fontWeight: 600, color: item.payload.color }}>
                        {item.name}: {item.value} tugas
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={95}
              paddingAngle={total > 0 ? 4 : 0}
              dataKey="value"
              stroke="transparent"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Teks Persentase di Tengah Donat */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1,
            }}
          >
            {percentage}%
          </span>
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginTop: 4,
            }}
          >
            Tuntas
          </span>
        </div>
      </div>

      {/* Rincian Legenda */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          marginTop: 12,
          paddingTop: 16,
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: COLORS.done,
            }}
          />
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Selesai: <strong style={{ color: "var(--text-primary)" }}>{done}</strong>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: COLORS.pending,
            }}
          />
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Belum: <strong style={{ color: "var(--text-primary)" }}>{pending}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
