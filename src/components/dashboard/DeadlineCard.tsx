"use client";
/**
 * src/components/dashboard/DeadlineCard.tsx
 *
 * Kartu daftar tugas dengan deadline terdekat.
 * Menampilkan penanda warna: merah (terlambat), kuning (hampir), hijau (aman).
 * Data diperoleh dari useStats melalui props.
 */

import Link from "next/link";
import { Task } from "@/types";

interface DeadlineCardProps {
  tasks: Task[];
  isOverdue: (task: Task) => boolean;
  isDueSoon: (task: Task) => boolean;
}

function priorityLabel(p: Task["priority"]): string {
  return p === "high" ? "Tinggi" : p === "medium" ? "Sedang" : "Rendah";
}

export function DeadlineCard({ tasks, isOverdue, isDueSoon }: DeadlineCardProps) {
  return (
    <div className="card">
      <div
        className="card-title"
        style={{ justifyContent: "space-between" }}
      >
        <span>⏰ Deadline Terdekat</span>
        <Link
          href="/tasks"
          style={{
            fontSize: 12,
            color: "var(--color-primary-light)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Lihat semua →
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state" style={{ padding: "30px 0" }}>
          <span style={{ fontSize: 32 }}>🎉</span>
          <p className="empty-title">Tidak ada tugas mendesak!</p>
          <p className="empty-desc">Semua tugas sudah tertangani.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tasks.map((task) => {
            const overdue = isOverdue(task);
            const dueSoon = isDueSoon(task);
            const borderColor = overdue
              ? "var(--color-danger)"
              : dueSoon
              ? "var(--color-warning)"
              : "var(--color-success)";
            const labelColor = overdue
              ? "var(--color-danger)"
              : dueSoon
              ? "var(--color-warning)"
              : "var(--text-muted)";
            const statusText = overdue
              ? "⚠️ Terlambat"
              : dueSoon
              ? "🔔 Hampir jatuh tempo"
              : "📅";

            return (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: "var(--bg-input)",
                  borderRadius: 10,
                  borderLeft: `4px solid ${borderColor}`,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.background = "var(--bg-input)";
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {task.title}
                  </p>
                  <p style={{ fontSize: 11, color: labelColor, marginTop: 2 }}>
                    {statusText}{" "}
                    {new Date(task.deadline).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span className={`badge badge-${task.priority}`}>
                    {priorityLabel(task.priority)}
                  </span>
                  <span className={`badge badge-${task.status}`}>
                    {task.status === "todo"
                      ? "Belum"
                      : task.status === "doing"
                      ? "Dikerjakan"
                      : "Selesai"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
