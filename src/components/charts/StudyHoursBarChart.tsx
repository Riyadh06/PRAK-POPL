"use client";
/**
 * src/components/charts/StudyHoursBarChart.tsx
 *
 * Grafik batang (Bar Chart) Recharts untuk menampilkan jam belajar per hari selama 7 hari terakhir.
 * Desain modern dengan gradient warna, custom tooltip bergaya glassmorphism, dan format bahasa Indonesia.
 */

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { WeeklyStudyData } from "@/types";

interface StudyHoursBarChartProps {
  data: WeeklyStudyData[];
  height?: number;
}

interface ChartItem {
  date: string;
  dayLabel: string;
  fullDateLabel: string;
  minutes: number;
  hours: number;
}

const DAY_ABBR = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function StudyHoursBarChart({
  data,
  height = 300,
}: StudyHoursBarChartProps) {
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

  // Format data untuk sumbu dan tooltip
  const chartData: ChartItem[] = data.map((item) => {
    const d = new Date(item.date);
    const dayName = DAY_ABBR[d.getDay()] || "";
    const dateFormatted = d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });

    return {
      date: item.date,
      dayLabel: `${dayName} ${d.getDate()}`,
      fullDateLabel: dateFormatted,
      minutes: item.minutes,
      hours: Number((item.minutes / 60).toFixed(1)),
    };
  });

  const totalWeeklyMinutes = data.reduce((acc, d) => acc + d.minutes, 0);

  return (
    <div className="card" style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div className="card-title" style={{ marginBottom: 2 }}>
            📊 Jam Belajar 7 Hari Terakhir
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Total{" "}
            <strong style={{ color: "var(--color-primary-light)" }}>
              {Math.floor(totalWeeklyMinutes / 60)} jam {totalWeeklyMinutes % 60} menit
            </strong>{" "}
            fokus minggu ini
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: "linear-gradient(180deg, #818cf8, #6366f1)",
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Durasi (Menit)
          </span>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="studyBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />

            <XAxis
              dataKey="dayLabel"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />

            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              unit="m"
            />

            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ChartItem;
                  return (
                    <div
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "10px 14px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginBottom: 4,
                        }}
                      >
                        {item.fullDateLabel}
                      </p>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "var(--color-primary-light)",
                        }}
                      >
                        {item.minutes} Menit
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 400,
                            color: "var(--text-secondary)",
                            marginLeft: 6,
                          }}
                        >
                          ({item.hours} jam)
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar
              dataKey="minutes"
              fill="url(#studyBarGrad)"
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
