"use client";
/**
 * src/components/pomodoro/TaskCourseSelector.tsx
 *
 * Komponen dropdown untuk memilih mata kuliah atau tugas yang sedang dikerjakan.
 * Mengambil data dari hook useSchedule dan useTasks (integrasi lintas modul).
 */

import React from "react";
import { Course, Task } from "@/types";

interface TaskCourseSelectorProps {
  courses: Course[];
  tasks: Task[];
  selectedCourseId: string;
  selectedTaskId: string;
  onSelectCourse: (courseId: string) => void;
  onSelectTask: (taskId: string) => void;
  disabled?: boolean;
}

export function TaskCourseSelector({
  courses,
  tasks,
  selectedCourseId,
  selectedTaskId,
  onSelectCourse,
  onSelectTask,
  disabled = false,
}: TaskCourseSelectorProps) {
  // Hanya tampilkan tugas yang belum selesai (todo / doing)
  const activeTasks = tasks.filter((t) => t.status !== "done");

  return (
    <div
      className="card"
      style={{
        width: "100%",
        maxWidth: 580,
        background: "rgba(255, 255, 255, 0.04)",
        padding: "20px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          🎯 Target Belajar (Opsional)
        </span>
        {disabled && (
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Terkunci selama sesi berjalan
          </span>
        )}
      </div>

      <div className="grid-2" style={{ gap: 14 }}>
        {/* Dropdown Mata Kuliah */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label
            htmlFor="pomodoro-course-select"
            className="form-label"
            style={{ fontSize: 12 }}
          >
            Mata Kuliah
          </label>
          <select
            id="pomodoro-course-select"
            className="form-select"
            value={selectedCourseId}
            onChange={(e) => {
              const val = e.target.value;
              onSelectCourse(val);
              // Jika tugas yang terpilih sebelumnya bukan milik kuliah ini, reset tugas
              if (selectedTaskId) {
                const curTask = tasks.find((t) => t.id === selectedTaskId);
                if (curTask && curTask.courseId !== val) {
                  onSelectTask("");
                }
              }
            }}
            disabled={disabled}
            style={{ fontSize: 13, padding: "8px 12px" }}
          >
            <option value="">-- Tanpa Mata Kuliah --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.room})
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Tugas */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label
            htmlFor="pomodoro-task-select"
            className="form-label"
            style={{ fontSize: 12 }}
          >
            Tugas Terkait
          </label>
          <select
            id="pomodoro-task-select"
            className="form-select"
            value={selectedTaskId}
            onChange={(e) => {
              const val = e.target.value;
              onSelectTask(val);
              // Otomatis sinkronkan mata kuliah bila tugas memiliki courseId
              if (val) {
                const task = tasks.find((t) => t.id === val);
                if (task && task.courseId && task.courseId !== selectedCourseId) {
                  onSelectCourse(task.courseId);
                }
              }
            }}
            disabled={disabled}
            style={{ fontSize: 13, padding: "8px 12px" }}
          >
            <option value="">-- Tanpa Tugas --</option>
            {activeTasks
              .filter((task) =>
                selectedCourseId ? task.courseId === selectedCourseId : true
              )
              .map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.priority === "high" ? "Prioritas Tinggi" : task.priority === "medium" ? "Sedang" : "Rendah"})
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}
