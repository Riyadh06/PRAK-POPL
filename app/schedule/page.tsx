"use client";
/**
 * app/schedule/page.tsx — Halaman Jadwal Kuliah
 *
 * Fitur:
 * - Toggle tampilan: Tabel Mingguan / Daftar Per Hari
 * - CRUD mata kuliah (form modal)
 * - Highlight kuliah yang sedang berlangsung (update tiap menit)
 */

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { WeeklyTable } from "@/components/schedule/WeeklyTable";
import { DayList } from "@/components/schedule/DayList";
import { CourseForm } from "@/components/schedule/CourseForm";
import { useSchedule } from "@/hooks/useSchedule";
import { Course } from "@/types";

export const metadata = undefined; // Metadata dari layout

export default function SchedulePage() {
  const { courses, currentCourse, addCourse, updateCourse, deleteCourse } =
    useSchedule();

  const [viewMode, setViewMode] = useState<"weekly" | "daily">("weekly");
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleFormSubmit = (data: Omit<Course, "id">) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, data);
    } else {
      addCourse(data);
    }
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteCourse(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <div>
      <TopBar title="Jadwal Kuliah" subtitle="Kelola jadwal perkuliahan mingguan" />
      <div className="page-container">
        {/* ── Header Aksi ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {courses.length} mata kuliah terdaftar
            </span>
            {currentCourse && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  padding: "4px 12px",
                  borderRadius: 999,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#10b981",
                    animation: "pulse 2s infinite",
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>
                  Aktif: {currentCourse.name}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {/* Toggle tampilan */}
            <div className="toggle-group">
              <button
                className={`toggle-btn ${viewMode === "weekly" ? "toggle-btn--active" : ""}`}
                onClick={() => setViewMode("weekly")}
                id="view-weekly"
              >
                📊 Tabel
              </button>
              <button
                className={`toggle-btn ${viewMode === "daily" ? "toggle-btn--active" : ""}`}
                onClick={() => setViewMode("daily")}
                id="view-daily"
              >
                📋 Daftar
              </button>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleAdd}
              id="add-course-btn"
            >
              + Tambah Mata Kuliah
            </button>
          </div>
        </div>

        {/* ── Tampilan Jadwal ── */}
        {courses.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <p className="empty-title">Belum ada jadwal kuliah</p>
              <p className="empty-desc">Tambahkan mata kuliah pertama Anda!</p>
              <button
                className="btn btn-primary"
                onClick={handleAdd}
                style={{ marginTop: 12 }}
              >
                + Tambah Mata Kuliah
              </button>
            </div>
          </div>
        ) : viewMode === "weekly" ? (
          <WeeklyTable
            courses={courses}
            currentCourse={currentCourse}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <DayList
            courses={courses}
            currentCourse={currentCourse}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
                {editingCourse ? "✏️ Edit Mata Kuliah" : "➕ Tambah Mata Kuliah"}
              </h2>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setShowForm(false)}
                id="close-form-btn"
              >
                ✕
              </button>
            </div>
            <CourseForm
              initial={editingCourse ?? undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* ── Dialog Konfirmasi Hapus ── */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 380 }}>
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <span style={{ fontSize: 40 }}>⚠️</span>
              <h3 style={{ marginTop: 12, marginBottom: 8, fontSize: 18, fontWeight: 700 }}>
                Hapus Mata Kuliah?
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Batal
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  id="confirm-delete-btn"
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
