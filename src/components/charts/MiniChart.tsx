"use client";
/**
 * src/components/charts/MiniChart.tsx
 *
 * Komponen grafik ringkas (MiniChart) yang fleksibel dan siap dipakai ulang
 * oleh Riyadh di Dashboard atau kartu ringkasan mana pun.
 *
 * Mode yang didukung:
 * - "study" : Sparkline bar chart mingguan (7 hari) menit belajar
 * - "tasks" : Mini donut chart rasio penyelesaian tugas
 *
 * Contoh penggunaan oleh Riyadh:
 * ```tsx
 * import { MiniChart } from "@/components/charts";
 *
 * // Di Dashboard Riyadh:
 * <MiniChart type="study" data={weeklyData} height={110} />
 * <MiniChart type="tasks" taskCompletion={taskStats} height={110} />
 * ```
 */

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { WeeklyStudyData } from "@/types";

export interface MiniChartProps {
  type: "study" | "tasks";
  data?: WeeklyStudyData[];
  taskCompletion?: { done: number; total: number };
  height?: number;
  showTooltip?: boolean;
}

export function MiniChart({
  type,
  data = [],
  taskCompletion = { done: 0, total: 0 },
  height = 110,
  showTooltip = true,
}: MiniChartProps) {
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
          fontSize: 11,
        }}
      >
        Memuat...
      </div>
    );
  }

  // ── Mode 1: Mini Sparkline Bar Chart Jam Belajar ───────────────────────────
  if (type === "study") {
    const formattedData = data.map((d) => {
      const dt = new Date(d.date);
      const day = dt.toLocaleDateString("id-ID", { weekday: "short" });
      return {
        day,
        minutes: d.minutes,
        date: d.date,
      };
    });

    return (
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
            <defs>
              <linearGradient id="miniStudyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            {showTooltip && (
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as { day: string; minutes: number };
                    return (
                      <div
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: 6,
                          padding: "4px 8px",
                          fontSize: 11,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                        }}
                      >
                        <span style={{ color: "var(--text-muted)" }}>{item.day}: </span>
                        <strong style={{ color: "var(--color-primary)" }}>
                          {item.minutes}m
                        </strong>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            )}
            <Bar
              dataKey="minutes"
              fill="url(#miniStudyGrad)"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── Mode 2: Mini Donut Chart Progres Tugas ─────────────────────────────────
  const { done, total } = taskCompletion;
  const pending = Math.max(total - done, 0);
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  const pieData =
    total === 0
      ? [{ name: "Kosong", value: 1, color: "#e2e8f0" }]
      : [
          { name: "Selesai", value: done, color: "#10b981" },
          { name: "Belum", value: pending, color: "#6366f1" },
        ];

  return (
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
          {showTooltip && total > 0 && (
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  return (
                    <div
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 6,
                        padding: "4px 8px",
                        fontSize: 11,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      <strong style={{ color: item.payload.color }}>
                        {item.name}: {item.value}
                      </strong>
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={height * 0.28}
            outerRadius={height * 0.42}
            paddingAngle={total > 0 ? 3 : 0}
            dataKey="value"
            stroke="transparent"
          >
            {pieData.map((entry, index) => (
              <Cell key={`mini-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

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
            fontSize: Math.max(height * 0.2, 14),
            fontWeight: 800,
            color: "var(--text-primary)",
            lineHeight: 1,
          }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}
