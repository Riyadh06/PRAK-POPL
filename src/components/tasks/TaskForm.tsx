"use client";
/**
 * src/components/tasks/TaskForm.tsx
 * Form tambah/edit tugas dengan dropdown mata kuliah dari ScheduleService.
 */

import { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { useSchedule } from "@/hooks/useSchedule";

interface TaskFormProps {
  initial?: Partial<Task>;
  onSubmit: (data: Omit<Task, "id" | "createdAt">) => void;
  onCancel: () => void;
}

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Rendah" },
  { value: "medium", label: "Sedang" },
  { value: "high", label: "Tinggi" },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "Belum Dikerjakan" },
  { value: "doing", label: "Sedang Dikerjakan" },
  { value: "done", label: "Selesai" },
];

export function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const { courses } = useSchedule();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [courseId, setCourseId] = useState(initial?.courseId ?? "");
  const [deadline, setDeadline] = useState(
    initial?.deadline
      ? new Date(initial.deadline).toISOString().slice(0, 16)
      : ""
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initial?.priority ?? "medium"
  );
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? "todo");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Judul tugas wajib diisi";
    if (!deadline) errs.deadline = "Deadline wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      courseId,
      deadline: new Date(deadline).toISOString(),
      priority,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Judul */}
      <div className="form-group">
        <label className="form-label">Judul Tugas *</label>
        <input
          id="task-title"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Tugas 2 Pemrograman Web"
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      {/* Mata Kuliah */}
      <div className="form-group">
        <label className="form-label">Mata Kuliah</label>
        <select
          id="task-course"
          className="form-select"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">— Tidak terkait mata kuliah —</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Deadline */}
      <div className="form-group">
        <label className="form-label">Deadline *</label>
        <input
          id="task-deadline"
          type="datetime-local"
          className="form-input"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        {errors.deadline && <span className="form-error">{errors.deadline}</span>}
      </div>

      {/* Prioritas & Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="form-group">
          <label className="form-label">Prioritas</label>
          <select
            id="task-priority"
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            id="task-status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Aksi */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary" id="task-submit">
          {initial?.title ? "Simpan Perubahan" : "Tambah Tugas"}
        </button>
      </div>
    </form>
  );
}
