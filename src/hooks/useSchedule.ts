"use client";
/**
 * src/hooks/useSchedule.ts
 *
 * Hook reaktif untuk jadwal kuliah.
 * Subscribe ke ScheduleService dan menyediakan aksi CRUD.
 */

import { useState, useEffect, useCallback } from "react";
import { Course } from "@/types";
import { ScheduleService } from "@/services/ScheduleService";
import { EntityFactory } from "@/factories/EntityFactory";

const scheduleService = ScheduleService.getInstance();

export interface UseScheduleReturn {
  /** Semua mata kuliah */
  courses: Course[];
  /** Jadwal hari ini */
  todayCourses: Course[];
  /** Mata kuliah yang sedang berlangsung */
  currentCourse: Course | null;
  /** Mata kuliah berikutnya */
  nextCourse: Course | null;
  /** Mendapatkan jadwal hari tertentu */
  getCoursesByDay: (day: Course["day"]) => Course[];
  /** Tambah mata kuliah baru */
  addCourse: (data: Omit<Course, "id">) => Course;
  /** Update mata kuliah */
  updateCourse: (id: string, partial: Partial<Omit<Course, "id">>) => void;
  /** Hapus mata kuliah */
  deleteCourse: (id: string) => void;
}

export function useSchedule(): UseScheduleReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [now, setNow] = useState<Date | null>(null);

  // Subscribe ke perubahan data (Observer)
  useEffect(() => {
    setCourses(scheduleService.getAll());
    const unsubscribe = scheduleService.subscribe((updated) => {
      setCourses(updated);
    });
    return unsubscribe;
  }, []);

  // Update waktu setiap menit untuk highlight mata kuliah aktif
  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const todayCourses = now ? scheduleService.getToday(now) : [];
  const currentCourse = now ? scheduleService.getCurrentCourse(now) : null;
  const nextCourse = now ? scheduleService.getNextCourse(now) : null;

  const getCoursesByDay = useCallback((day: Course["day"]) => {
    return scheduleService.getByDay(day);
  }, []);

  const addCourse = useCallback((data: Omit<Course, "id">): Course => {
    const newCourse = EntityFactory.createCourse(data);
    return scheduleService.create(newCourse);
  }, []);

  const updateCourse = useCallback(
    (id: string, partial: Partial<Omit<Course, "id">>) => {
      scheduleService.update(id, partial);
    },
    []
  );

  const deleteCourse = useCallback((id: string) => {
    scheduleService.delete(id);
  }, []);

  return {
    courses,
    todayCourses,
    currentCourse,
    nextCourse,
    getCoursesByDay,
    addCourse,
    updateCourse,
    deleteCourse,
  };
}
