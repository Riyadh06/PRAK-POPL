"use client";
/**
 * src/components/schedule/CourseForm.tsx
 * Form tambah/ubah mata kuliah dengan validasi waktu.
 */

import { useState } from "react";
import { Course } from "@/types";

interface CourseFormProps {
  initial?: Partial<Course>;
  onSubmit: (data: Omit<Course, "id">) => void;
  onCancel: () => void;
}

const DAYS = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
] as const;

const PRESET_COLORS = [
  "#6366f1", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
];

export function CourseForm({ initial, onSubmit, onCancel }: CourseFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [day, setDay] = useState<Course["day"]>(initial?.day ?? 1);
  const [startTime, setStartTime] = useState(initial?.startTime ?? "08:00");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "09:40");
  const [room, setRoom] = useState(initial?.room ?? "");
  const [color, setColor] = useState(initial?.color ?? "#6366f1");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Nama mata kuliah wajib diisi";
    if (!room.trim()) errs.room = "Ruangan wajib diisi";

    // Validasi: jam selesai harus setelah jam mulai
    const toMin = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    if (toMin(endTime) <= toMin(startTime)) {
      errs.endTime = "Jam selesai harus setelah jam mulai";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: name.trim(), day, startTime, endTime, room: room.trim(), color });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Nama */}
      <div className="form-group">
        <label className="form-label">Nama Mata Kuliah *</label>
        <input
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Pemrograman Web"
          id="course-name"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      {/* Hari */}
      <div className="form-group">
        <label className="form-label">Hari *</label>
        <select
          id="course-day"
          className="form-select"
          value={day}
          onChange={(e) => setDay(Number(e.target.value) as Course["day"])}
        >
          {DAYS.map((d, i) => (
            <option key={i} value={i}>{d}</option>
          ))}
        </select>
      </div>

      {/* Jam Mulai & Selesai */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="form-group">
          <label className="form-label">Jam Mulai *</label>
          <input
            id="course-start"
            type="time"
            className="form-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Jam Selesai *</label>
          <input
            id="course-end"
            type="time"
            className="form-input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          {errors.endTime && <span className="form-error">{errors.endTime}</span>}
        </div>
      </div>

      {/* Ruangan */}
      <div className="form-group">
        <label className="form-label">Ruangan *</label>
        <input
          id="course-room"
          className="form-input"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Contoh: Gedung A Lt.3"
        />
        {errors.room && <span className="form-error">{errors.room}</span>}
      </div>

      {/* Warna */}
      <div className="form-group">
        <label className="form-label">Warna Penanda</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: c,
                border: color === c ? "3px solid white" : "3px solid transparent",
                cursor: "pointer",
                outline: color === c ? "2px solid var(--color-primary)" : "none",
                outlineOffset: 2,
                transition: "transform 0.15s",
              }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "2px solid var(--border-subtle)",
              cursor: "pointer",
              padding: 1,
              background: "transparent",
            }}
            title="Pilih warna kustom"
          />
        </div>
      </div>

      {/* Aksi */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary" id="course-submit">
          {initial?.name ? "Simpan Perubahan" : "Tambah Mata Kuliah"}
        </button>
      </div>
    </form>
  );
}
