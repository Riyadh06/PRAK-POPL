"use client";
/**
 * app/tasks/page.tsx — Halaman Daftar Tugas
 *
 * Fitur:
 * - Filter status dan mata kuliah
 * - Sorting deadline (ascending/descending)
 * - CRUD tugas via modal
 * - Indikator warna deadline (merah/oranye/hijau/abu)
 */

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useTasks } from "@/hooks/useTasks";
import { useSchedule } from "@/hooks/useSchedule";
import { Task } from "@/types";
import type { FilterType, SortType } from "@/hooks/useTasks";

export default function TasksPage() {
  const {
    tasks,
    activeFilter,
    activeSort,
    activeCourseId,
    setFilter,
    setCourseFilter,
    setSort,
    addTask,
    updateTask,
    deleteTask,
    updateStatus,
    isOverdue,
    isDueSoon,
    completionStats,
  } = useTasks();

  const { courses } = useSchedule();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = (data: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const completionPct =
    completionStats.total > 0
      ? Math.round((completionStats.done / completionStats.total) * 100)
      : 0;

  const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "todo", label: "Belum" },
    { value: "doing", label: "Proses" },
    { value: "done", label: "Selesai" },
  ];

  return (
    <div>
      <TopBar title="Daftar Tugas" subtitle="Kelola dan pantau semua tugas kuliah" />
      <div className="page-container">
        {/* ── Stat Bar ── */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
            padding: "16px 20px",
            background: "var(--bg-card)",
            borderRadius: 14,
            border: "1px solid var(--border-subtle)",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Progres Tugas
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary-light)" }}>
                {completionStats.done}/{completionStats.total} ({completionPct}%)
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: "var(--color-danger)" }}>
                {tasks.filter((t) => isOverdue(t)).length}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Terlambat</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: "var(--color-warning)" }}>
                {tasks.filter((t) => isDueSoon(t)).length}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Hampir DL</p>
            </div>
          </div>
        </div>

        {/* ── Filter & Sort ── */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Filter Status */}
          <div className="toggle-group">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f.value}
                id={`filter-${f.value}`}
                className={`toggle-btn ${activeFilter === f.value ? "toggle-btn--active" : ""}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Filter Mata Kuliah */}
          <select
            id="filter-course"
            className="form-select"
            style={{ width: "auto", padding: "7px 14px" }}
            value={activeCourseId ?? ""}
            onChange={(e) => setCourseFilter(e.target.value || null)}
          >
            <option value="">Semua Mata Kuliah</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Sort Deadline */}
          <select
            id="sort-deadline"
            className="form-select"
            style={{ width: "auto", padding: "7px 14px" }}
            value={activeSort}
            onChange={(e) => setSort(e.target.value as SortType)}
          >
            <option value="deadline-asc">Deadline Terdekat</option>
            <option value="deadline-desc">Deadline Terjauh</option>
          </select>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          <button className="btn btn-primary" onClick={handleAdd} id="add-task-btn">
            + Tambah Tugas
          </button>
        </div>

        {/* ── Daftar Tugas ── */}
        {tasks.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <span className="empty-icon">✅</span>
              <p className="empty-title">Tidak ada tugas</p>
              <p className="empty-desc">
                {activeFilter !== "all" || activeCourseId
                  ? "Tidak ada tugas yang sesuai filter."
                  : "Tambahkan tugas pertama Anda!"}
              </p>
              {activeFilter === "all" && !activeCourseId && (
                <button
                  className="btn btn-primary"
                  onClick={handleAdd}
                  style={{ marginTop: 12 }}
                >
                  + Tambah Tugas
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isOverdue={isOverdue(task)}
                isDueSoon={isDueSoon(task)}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteConfirm(id)}
                onStatusChange={updateStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Form ── */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingTask ? "✏️ Edit Tugas" : "➕ Tambah Tugas"}
              </h2>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setShowForm(false)}
                id="close-task-form"
              >
                ✕
              </button>
            </div>
            <TaskForm
              initial={editingTask ?? undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* ── Konfirmasi Hapus ── */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 380 }}>
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <span style={{ fontSize: 40 }}>⚠️</span>
              <h3 style={{ marginTop: 12, marginBottom: 8, fontSize: 18, fontWeight: 700 }}>
                Hapus Tugas?
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                  Batal
                </button>
                <button
                  className="btn btn-danger"
                  id="confirm-delete-task"
                  onClick={() => {
                    deleteTask(deleteConfirm);
                    setDeleteConfirm(null);
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
