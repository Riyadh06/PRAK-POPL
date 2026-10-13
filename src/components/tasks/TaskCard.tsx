"use client";
/**
 * src/components/tasks/TaskCard.tsx
 * Kartu tugas dengan indikator warna status:
 * - Merah = terlambat (overdue)
 * - Oranye = hampir jatuh tempo (<= 48 jam)
 * - Hijau = selesai
 * - Abu = normal
 */

import { Task, TaskStatus } from "@/types";
import { useSchedule } from "@/hooks/useSchedule";

interface TaskCardProps {
  task: Task;
  isOverdue: boolean;
  isDueSoon: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Belum Dikerjakan",
  doing: "Sedang Dikerjakan",
  done: "Selesai",
};

const PRIORITY_LABELS: Record<string, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

export function TaskCard({
  task,
  isOverdue,
  isDueSoon,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const { courses } = useSchedule();
  const course = courses.find((c) => c.id === task.courseId);

  // ── Tentukan warna indikator deadline ──
  let borderColor = "var(--border-subtle)";
  let deadlineColor = "var(--text-muted)";
  let deadlineIcon = "📅";

  if (task.status === "done") {
    borderColor = "rgba(16,185,129,0.5)";
    deadlineColor = "#34d399";
    deadlineIcon = "✅";
  } else if (isOverdue) {
    borderColor = "rgba(239,68,68,0.6)";
    deadlineColor = "var(--color-danger)";
    deadlineIcon = "⚠️";
  } else if (isDueSoon) {
    borderColor = "rgba(245,158,11,0.5)";
    deadlineColor = "var(--color-warning)";
    deadlineIcon = "🔔";
  }

  const formattedDeadline = new Date(task.deadline).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        background: task.status === "done" ? "rgba(16,185,129,0.05)" : "var(--bg-card)",
        border: `1px solid ${borderColor}`,
        borderRadius: 14,
        padding: "16px 18px",
        transition: "all 0.2s",
        opacity: task.status === "done" ? 0.75 : 1,
      }}
    >
      {/* ── Baris Atas: Judul + Badge Status ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        {/* Checkbox status cepat */}
        <button
          onClick={() =>
            onStatusChange(
              task.id,
              task.status === "done" ? "todo" : "done"
            )
          }
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            border: `2px solid ${task.status === "done" ? "#10b981" : "var(--border-subtle)"}`,
            background: task.status === "done" ? "#10b981" : "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
            transition: "all 0.15s",
          }}
          title="Toggle selesai"
        >
          {task.status === "done" && (
            <span style={{ fontSize: 11, color: "white" }}>✓</span>
          )}
        </button>

        <div style={{ flex: 1 }}>
          <p
            style={{
              fontWeight: 600,
              fontSize: 15,
              color: task.status === "done" ? "var(--text-secondary)" : "var(--text-primary)",
              textDecoration: task.status === "done" ? "line-through" : "none",
            }}
          >
            {task.title}
          </p>
          {course && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span
                className="color-dot"
                style={{ backgroundColor: course.color }}
              />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {course.name}
              </span>
            </div>
          )}
        </div>

        <span className={`badge badge-${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {/* ── Baris Bawah: Info + Aksi ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {/* Deadline */}
          <span style={{ fontSize: 12, color: deadlineColor }}>
            {deadlineIcon} {formattedDeadline}
          </span>

          {/* Prioritas */}
          <span className={`badge badge-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>

        {/* Aksi Edit/Hapus */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(task)}
            title="Edit tugas"
          >
            ✏️
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(task.id)}
            title="Hapus tugas"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
