# 📋 Serah Terima Isra → Riyadh
## StudyTrack — Laporan Tahap Pomodoro + Grafik Progres

---

## ✅ File yang Dibuat / Diubah

### Tahap 1 — Branch: `feat_pomodoro/13-10-2026` (merged → develop)

| File | Pattern | Keterangan |
|------|---------|------------|
| `src/services/PomodoroTimer.ts` | **State Pattern** | Context PomodoroTimer + 4 concrete state: IdleState, FocusState, BreakState, PausedState |
| `src/services/NotificationUtils.ts` | — | Notifikasi suara via Web Audio API (tanpa aset eksternal) |
| `src/services/PomodoroService.ts` | — | Tambah `now?` param untuk SSR safety di `getTodayTotalMinutes` dan `getWeeklyMinutes` |
| `src/hooks/usePomodoro.ts` | **State + Observer** | Implementasi penuh countdown (`useRef` + `setInterval`), subscribe ke timer dan storage |
| `src/components/pomodoro/TimerDisplay.tsx` | — | SVG circular countdown dengan glow sesuai state |
| `src/components/pomodoro/TimerControls.tsx` | — | Tombol Mulai/Jeda/Lanjutkan/Reset |
| `src/components/pomodoro/TaskCourseSelector.tsx` | — | Dropdown pilih mata kuliah & tugas aktif |
| `src/components/pomodoro/PomodoroSettingsModal.tsx` | — | Modal atur durasi + preset cepat (25/5, 50/10, 15/3) |
| `src/components/pomodoro/SessionHistory.tsx` | — | Tabel riwayat sesi fokus (10 sesi terbaru) |
| `src/components/pomodoro/index.ts` | — | Barrel export semua komponen |
| `app/pomodoro/page.tsx` | — | Halaman Pomodoro lengkap |
| `src/hooks/useSchedule.ts` | — | Fix SSR: `new Date()` dipindahkan ke `useEffect` |
| `app/schedule/page.tsx` | — | Fix: hapus `export const metadata` yang tidak valid |
| `app/page.tsx` | — | Fix SSR: nama hari diinisialisasi dalam `useEffect` |

### Tahap 2 — Branch: `feat_progress_charts/13-10-2026` (merged → develop)

| File | Pattern | Keterangan |
|------|---------|------------|
| `src/types/index.ts` | — | Perbarui `DashboardSummary` dengan alias `nearestTasks`, `todayMinutes`, `weeklyMinutes`, `taskCompletion` |
| `src/services/StatsService.ts` | **Facade** | Perbarui `getDashboardSummary()` — mengembalikan semua field kontrak + SSR safe |
| `src/hooks/useStats.ts` | **Observer** | Implementasi penuh: subscribe ke 4 kunci storage, interval refresh tiap menit |
| `src/components/charts/StudyHoursBarChart.tsx` | — | Bar Chart Recharts jam belajar harian 7 hari + custom tooltip |
| `src/components/charts/TaskCompletionPieChart.tsx` | — | Donut Chart Recharts rasio tugas selesai vs belum, persentase di tengah |
| `src/components/charts/MiniChart.tsx` | — | **Komponen reusable** — 2 mode: `"study"` (sparkline bar) & `"tasks"` (mini donut) |
| `src/components/charts/index.ts` | — | Barrel export semua komponen grafik |
| `app/progress/page.tsx` | — | Halaman Progres lengkap: 2 grafik besar + MiniChart showcase + tabel |

---

## 🎯 Cara Pakai untuk Riyadh

### useStats — Data Dashboard Lengkap

```typescript
import { useStats } from "@/hooks/useStats";

const {
  summary,          // DashboardSummary — lihat shape di bawah
  weeklyData,       // WeeklyStudyData[] — 7 hari terakhir (menit per hari)
  taskCompletion,   // { done: number; total: number }
  refresh,          // () => void — refresh manual
} = useStats();
```

### Shape getDashboardSummary()

```typescript
// Semua field tersedia di summary:
{
  todaySchedule: Course[];            // Jadwal hari ini
  currentCourse: Course | null;       // Mata kuliah sedang berlangsung
  nextCourse: Course | null;          // Mata kuliah berikutnya hari ini
  taskStats: { done, total };         // Alias lama (kompatibel Ariq)
  taskCompletion: { done, total };    // Alias baru (lebih eksplisit)
  todayStudyMinutes: number;          // Alias lama
  todayMinutes: number;               // Alias baru
  weeklyMinutes: WeeklyStudyData[];   // 7 hari data menit
  nearestDeadlineTasks: Task[];       // 5 tugas deadline terdekat
  nearestTasks: Task[];               // Alias nearestDeadlineTasks
}
```

### MiniChart — Grafik Ringkas untuk Dashboard

```tsx
import { MiniChart } from "@/components/charts";

// Sparkline bar chart menit belajar mingguan
<MiniChart type="study" data={weeklyData} height={100} />

// Mini donut chart rasio tugas
<MiniChart type="tasks" taskCompletion={taskCompletion} height={100} />

// Props lengkap:
// type: "study" | "tasks"
// data?: WeeklyStudyData[]          (untuk type="study")
// taskCompletion?: { done, total }   (untuk type="tasks")
// height?: number                    (default 110px)
// showTooltip?: boolean              (default true)
```

### Grafik Lengkap untuk Halaman Progress

```tsx
import { StudyHoursBarChart, TaskCompletionPieChart } from "@/components/charts";

<StudyHoursBarChart data={weeklyData} height={300} />
<TaskCompletionPieChart taskCompletion={taskCompletion} height={300} />
```

---

## 🏗️ Arsitektur yang Dikerjakan

```
Komponen React
    ↓
usePomodoro / useStats (Custom Hook — Observer subscribe ke timer & storage)
    ↓
PomodoroTimer (State Pattern Context)
    ↓
PomodoroService / StatsService (Facade) / ScheduleService / TaskService
    ↓
BaseService<T> (Repository + Template Method)
    ↓
StorageService (Singleton) ← localStorage
    ↑
Observer: notifyListeners() → hook state update → re-render otomatis
```

---

## 📦 Perintah Git yang Dipakai

```bash
# Tahap 1 — Pomodoro
git checkout -b feature/pomodoro             # (dibuat dari develop)
# ... coding ...
git add .
git commit -m "feat: implementasi pomodoro timer dengan state pattern dan pencatatan sesi fokus"
git push origin feature/pomodoro
git checkout develop
git merge feature/pomodoro
git push origin develop

# Tahap 2 — Grafik Progres
git checkout -b feat_progress_charts/13-10-2026
# ... coding ...
git add .
git commit -m "feat: implementasi halaman progres dengan grafik recharts (bar chart, donut chart, minichart)"
git push origin feat_progress_charts/13-10-2026
git checkout develop
git merge feat_progress_charts/13-10-2026
git push origin develop
```

---

## ⚠️ Bug / Keterbatasan yang Diketahui

1. **Branch Tahap 1 dinamai `feature/pomodoro`** (bukan `feat_pomodoro/13-10-2026`) karena dibuat sebelum aturan branch dikonfirmasi. Branch Tahap 2 sudah mengikuti konvensi yang benar.

2. **Notifikasi suara** menggunakan Web Audio API sintetis (tanpa file `.mp3`/`.wav`). Pada beberapa browser versi lama atau konteks yang dibatasi, suara mungkin tidak terputar — tidak ada crash, hanya warning di console.

3. **Timer tidak persist** jika tab browser ditutup/di-refresh saat sesi berjalan. Ini by design (state timer hanya di memori React), karena localStorage hanya menyimpan sesi yang telah **selesai**.

4. **PomodoroService.getTodayTotalMinutes()** dan **getWeeklyMinutes()** sekarang menerima parameter `now?: Date` opsional untuk kemudahan testing — tetap backward compatible.

5. **Grafik Recharts** menggunakan `useState(false)` + `useEffect` (mounted pattern) untuk mencegah error SSR/Turbopack. Artinya ada satu frame kosong saat pertama render — sudah ditangani dengan loading state.

---

## 📌 Catatan untuk Riyadh (Tahap Dashboard)

1. **Gunakan `useStats()`** — bukan akses `StatsService` langsung dari komponen.
2. **Gunakan `MiniChart`** untuk kartu ringkasan di dashboard — sudah siap pakai.
3. `summary.weeklyMinutes` sudah berupa array `WeeklyStudyData[]` — langsung pakai untuk `StudyHoursBarChart`.
4. Data grafik **update otomatis** (reaktif) lewat Observer — tidak perlu polling manual.
5. Semua komponen sudah menggunakan kelas CSS dari `globals.css` Ariq.

---

*Ditulis oleh: Isra*
*Untuk: Riyadh (Tahap Dashboard)*
