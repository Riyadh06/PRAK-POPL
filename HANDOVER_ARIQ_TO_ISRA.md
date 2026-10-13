# 📋 Serah Terima Ariq → Isra
## StudyTrack — Laporan Tahap 1, 2, 3

---

## ✅ File yang Dibuat / Diubah

### Konfigurasi
| File | Keterangan |
|------|------------|
| `tsconfig.json` | Path alias `@/*` → `./src/*` |
| `app/globals.css` | Design system lengkap (dark mode, glassmorphism, CSS variables) |
| `app/layout.tsx` | Root layout + Sidebar navigasi |

### Core Architecture
| File | Pattern | Keterangan |
|------|---------|------------|
| `src/types/index.ts` | — | Semua interface: Course, Task, PomodoroSession, PomodoroSettings |
| `src/services/StorageService.ts` | **Singleton + Observer** | Semua akses localStorage, subscribe/notify |
| `src/services/BaseService.ts` | **Repository + Template Method** | CRUD generik, semua service extend ini |
| `src/factories/EntityFactory.ts` | **Factory** | createCourse, createTask, createSession |

### Services
| File | Keterangan |
|------|------------|
| `src/services/ScheduleService.ts` | CRUD jadwal + getByDay, getCurrentCourse, getNextCourse |
| `src/services/TaskService.ts` | CRUD tugas + filter/sort Strategy, getNearestDeadline, isOverdue, isDueSoon |
| `src/services/PomodoroService.ts` | CRUD sesi + recordFocusSession, getTodayTotalMinutes, getWeeklyMinutes, settings |
| `src/services/StatsService.ts` | **Facade**: getDashboardSummary, getWeeklyStudyHours, getTaskCompletion |
| `src/services/strategies/TaskFilterStrategy.ts` | AllTasksFilter, ByStatusFilter, ByCourseFilter, CombinedFilter |
| `src/services/strategies/TaskSortStrategy.ts` | ByDeadlineAsc, ByDeadlineDesc, ByPriority |

### Hooks
| File | Keterangan |
|------|------------|
| `src/hooks/useSchedule.ts` | ✅ **Lengkap** — reaktif, CRUD, update tiap menit |
| `src/hooks/useTasks.ts` | ✅ **Lengkap** — filter/sort Strategy, CRUD, isOverdue/isDueSoon |
| `src/hooks/usePomodoro.ts` | 🔲 **Placeholder untuk Isra** — struktur return type sesuai kontrak |
| `src/hooks/useStats.ts` | 🔲 **Placeholder untuk Isra/Riyadh** — refresh setiap menit |

### Komponen & Halaman
| File | Status |
|------|--------|
| `src/components/layout/Sidebar.tsx` | ✅ Navigasi dengan highlight aktif |
| `src/components/layout/TopBar.tsx` | ✅ Jam real-time + tanggal Indonesia |
| `src/components/schedule/CourseForm.tsx` | ✅ Form CRUD jadwal + validasi jam |
| `src/components/schedule/WeeklyTable.tsx` | ✅ Tabel mingguan + highlight aktif |
| `src/components/schedule/DayList.tsx` | ✅ Tampilan daftar per hari |
| `src/components/tasks/TaskCard.tsx` | ✅ Card dengan indikator warna merah/oranye/hijau |
| `src/components/tasks/TaskForm.tsx` | ✅ Form CRUD tugas |
| `app/page.tsx` | ✅ Dashboard lengkap |
| `app/schedule/page.tsx` | ✅ Halaman jadwal lengkap |
| `app/tasks/page.tsx` | ✅ Halaman tugas lengkap |
| `app/pomodoro/page.tsx` | 🔲 Placeholder — **TODO Isra** |
| `app/progress/page.tsx` | 🔲 Placeholder — **TODO Riyadh** |

---

## 🎯 Cara Pakai Hook untuk Isra

### useSchedule
```typescript
import { useSchedule } from "@/hooks/useSchedule";

const {
  courses,          // Course[] — semua mata kuliah
  todayCourses,     // Course[] — jadwal hari ini
  currentCourse,    // Course | null — sedang berlangsung
  nextCourse,       // Course | null — berikutnya
  getCoursesByDay,  // (day: 0-6) => Course[]
  addCourse,        // (data: Omit<Course, "id">) => Course
  updateCourse,     // (id, partial) => void
  deleteCourse,     // (id) => void
} = useSchedule();
```

### useTasks
```typescript
import { useTasks } from "@/hooks/useTasks";

const {
  tasks,           // Task[] setelah filter + sort
  addTask,         // (data) => Task
  updateTask,      // (id, partial) => void
  deleteTask,      // (id) => void
  updateStatus,    // (id, "todo"|"doing"|"done") => void
  isOverdue,       // (task) => boolean
  isDueSoon,       // (task) => boolean
  completionStats, // { done: number, total: number }
  nearestDeadline, // (limit?) => Task[]
  setFilter,       // ("all"|"todo"|"doing"|"done") => void
  setSort,         // ("deadline-asc"|"deadline-desc") => void
  setCourseFilter, // (courseId | null) => void
} = useTasks();
```

### usePomodoro (TODO Isra!)
```typescript
import { usePomodoro } from "@/hooks/usePomodoro";
// Hook ada di src/hooks/usePomodoro.ts
// Return type UsePomodoroReturn sudah didefinisikan
// Isra perlu implementasi:
// 1. useRef + setInterval untuk countdown
// 2. Transisi State: idle → focus → break → paused
// 3. Panggil pomodoroService.recordFocusSession() saat sesi selesai
// 4. Auto-transisi: focus selesai → break, break selesai → idle
```

---

## 🔧 Kunci localStorage (JANGAN diubah)
```
studytrack:schedule          → Course[]
studytrack:tasks             → Task[]
studytrack:pomodoro          → PomodoroSession[]
studytrack:pomodoro-settings → PomodoroSettings
```

---

## 🚧 Yang Belum Selesai (Tugas Isra)

### Priority 1 — usePomodoro
- [ ] Implementasi timer countdown dengan `useRef + setInterval`
- [ ] State machine: `idle → focus → break → paused`
- [ ] Panggil `pomodoroService.recordFocusSession()` saat fokus selesai
- [ ] Auto-switch: setelah focus selesai → otomatis mulai break timer
- [ ] Settings form: ubah focusMinutes/breakMinutes

### Priority 2 — Halaman Pomodoro
- [ ] Circular progress bar (SVG) untuk timer visual
- [ ] Tombol pilih mata kuliah/tugas saat mulai sesi
- [ ] Riwayat sesi hari ini

### Priority 3 — useStats Reaktivitas
- [ ] Tambahkan subscribe ke StorageService untuk update otomatis

---

## 📦 Aturan Git & Instruksi untuk Isra

### Format Penamaan Branch & Commit
- **Fitur Baru**: `feat_{nama_fitur}/{tanggal}` (contoh: `feat_pomodoro/14-10-2026`)
- **Perbaikan Bug**: `fix_{nama_fitur}/{tanggal}`
- **Format Commit**:
  - `feat: pesan deskripsi` → penambahan fitur
  - `fix: pesan deskripsi` → perbaikan bug
  - `style: pesan deskripsi` → styling UI
  - `chore: pesan deskripsi` → perubahan non-fungsional / config / dokumentasi

```bash
# Pastikan di folder studytrack
cd "c:\MATERI KULIAH\SEMESTER 5\POPL\PRAK POPL\PROJECT\studytrack"

# Isra: mulai dari develop dan buat branch fitur sesuai aturan
git checkout develop
git pull origin develop
git checkout -b feat_pomodoro/14-10-2026
```

---

## 🏗️ Arsitektur Alur Data

```
Komponen React
    ↓
Custom Hook (useSchedule / useTasks / usePomodoro / useStats)
    ↓
Service Class (ScheduleService / TaskService / PomodoroService / StatsService)
    ↓
BaseService<T> (getAll / create / update / delete / subscribe)
    ↓
StorageService (Singleton) ← localStorage
    ↑
Observer: notifyListeners() → hook state update → re-render
```

---

## ⚠️ Aturan Wajib untuk Isra

1. **JANGAN** akses `localStorage` langsung dari komponen/hook
2. **WAJIB** lewat alur: Komponen → Hook → Service → StorageService
3. Tambahkan `"use client"` di semua komponen dan hook
4. Semua nama kunci localStorage sudah di `STORAGE_KEYS` di `src/types/index.ts`
5. Semua entitas baru harus dibuat lewat `EntityFactory`
6. TypeScript strict — jangan gunakan `any`

---

*Ditulis oleh: Ariq*  
*Untuk: Isra (Tahap Pomodoro), Riyadh (Tahap Progress/Grafik)*
