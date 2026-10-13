# 📚 StudyTrack — Dashboard Produktivitas Belajar Mahasiswa

StudyTrack adalah aplikasi web dashboard produktivitas belajar untuk mahasiswa yang dibangun menggunakan Next.js (App Router), TypeScript, dan Tailwind CSS. Aplikasi ini dirancang dengan prinsip Object-Oriented Programming (OOP) dan Design Patterns yang kuat, serta berjalan sepenuhnya di sisi client (localStorage) tanpa backend eksternal.

---

## 👥 Pembagian Tugas Tim (Estafet)

Proyek ini dikembangkan secara bergantian sesuai urutan: **Ariq → Isra → Riyadh**.

| Anggota | Peran & Tanggung Jawab | Status |
|---|---|---|
| **Ariq** | Inisialisasi Proyek, Arsitektur Core (Singleton, Repository, Factory, Strategy, Facade), Modul Jadwal Kuliah (Tahap 2), Modul Manajemen Tugas (Tahap 3), Base Hook & Layout |  **Selesai** |
| **Isra** | Modul Pomodoro Timer (State Pattern), Integrasi Countdown & Settings, Halaman Pomodoro |  *Next* |
| **Riyadh** | Modul Grafik & Visualisasi Progres Belajar (Recharts), Halaman Progres, Ringkasan Statistik | ⏳ *Pending* |

Dokumentasi serah terima dari Ariq ke Isra dapat dibaca di [`HANDOVER_ARIQ_TO_ISRA.md`](./HANDOVER_ARIQ_TO_ISRA.md).

---

## 🏗️ Pola Desain (Design Patterns) & OOP

Aplikasi ini mengimplementasikan beberapa Design Pattern standar industri:

1. **Singleton Pattern** — [`StorageService.ts`](./src/services/StorageService.ts):
   Memastikan hanya ada satu instance pengelola `localStorage` di seluruh aplikasi, lengkap dengan mekanisme SSR check (`typeof window !== "undefined"`).
2. **Observer Pattern** — [`StorageService.ts`](./src/services/StorageService.ts):
   Hook dan komponen mendaftar (subscribe) ke event perubahan data localStorage untuk pembaruan UI secara otomatis dan reaktif.
3. **Repository Pattern & Template Method** — [`BaseService.ts`](./src/services/BaseService.ts):
   Kelas generik dasar `BaseService<T>` menyediakan operasi CRUD seragam yang diwarisi oleh `ScheduleService`, `TaskService`, dan `PomodoroService`.
4. **Factory Pattern** — [`EntityFactory.ts`](./src/factories/EntityFactory.ts):
   Membuat objek entitas (`Course`, `Task`, `PomodoroSession`) dengan UUID dan nilai default yang valid dan konsisten.
5. **Strategy Pattern** — [`TaskFilterStrategy.ts`](./src/services/strategies/TaskFilterStrategy.ts) & [`TaskSortStrategy.ts`](./src/services/strategies/TaskSortStrategy.ts):
   Memisahkan logika filter dan sorting daftar tugas secara fleksibel dan modular.
6. **Facade Pattern** — [`StatsService.ts`](./src/services/StatsService.ts):
   Menyediakan antarmuka sederhana satu pintu untuk mengakses agregasi statistik dari berbagai service.

---

## 📐 Arsitektur Alur Data (Strict Data Flow)

Komponen UI **dilarang keras** mengakses `localStorage` secara langsung:

```
Komponen React UI
      ↓
Custom Hook (useSchedule, useTasks, usePomodoro, useStats)
      ↓
Service Class (ScheduleService, TaskService, PomodoroService, StatsService)
      ↓
BaseService<T> (Repository)
      ↓
StorageService (Singleton) ← localStorage
      ↑
Observer: notifyListeners() → hook state update → UI re-render
```

---

## 🚀 Fitur yang Sudah Selesai (Tugas Ariq)

- [x] **Setup & Architecture**: Next.js 16 + React 19 + TypeScript strict + Tailwind CSS + Recharts
- [x] **Core Layer**: Interface lengkap, StorageService, BaseService, EntityFactory, Strategy classes, Facade
- [x] **Jadwal Kuliah (Schedule)**:
  - Form tambah/edit jadwal kuliah dengan validasi rentang waktu dan pilihan warna
  - Tampilan tabel jadwal mingguan (Senin - Minggu)
  - Tampilan daftar per hari dengan highlight kuliah yang sedang berlangsung atau berikutnya
- [x] **Manajemen Tugas (Tasks)**:
  - Form tambah/edit tugas terhubung dengan mata kuliah
  - Filter tugas (Semua, Belum Selesai, Sedang Dikerjakan, Selesai, per Mata Kuliah)
  - Sorting tugas (Deadline terdekat/terjauh, Prioritas)
  - Indikator status deadline: Merah (Terlewat), Oranye (Segera < 24 jam), Hijau (Aman)
- [x] **Dashboard Utama**:
  - Kartu statistik cepat (Tugas selesai, Jadwal hari ini, Total waktu belajar)
  - Banner status jadwal hari ini (kuliah berlangsung / berikutnya)
  - Daftar tugas dengan deadline paling mendesak
- [x] **Placeholder Halaman Pomodoro & Progres**: Sudah disiapkan untuk mempermudah pengerjaan Isra dan Riyadh.

---

## 🛠️ Panduan Menjalankan Proyek

### 1. Clone & Masuk ke Direktori
```bash
git clone <URL_REPOSITORY>
cd studytrack
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 4. Pengecekan Type Checking (TypeScript)
```bash
npx tsc --noEmit
```

---

## 🌿 Aturan Git, Branch, & Commit

### 1. Format Penamaan Branch
- **Fitur baru**: `feat_{nama_fitur}/{tanggal}` (contoh: `feat_authentikasi/19-03-2025` atau `feat_jadwal_kuliah/13-10-2026`)
- **Perbaikan bug**: `fix_{nama_fitur}/{tanggal}`

### 2. Format Commit Message
- `feat: pesan deskripsi` → untuk penambahan/peningkatan fitur.
- `fix: pesan deskripsi` → untuk perbaikan bug.
- `style: pesan deskripsi` → untuk styling UI.
- `chore: pesan deskripsi` → perubahan non-fungsional (config, dokumentasi, dll).

### 3. Struktur Branch Utama
- `main`: Branch rilis final
- `develop`: Branch integrasi utama (semua feature di-merge ke sini)
- `feat_arsitektur_core/13-10-2026`: Setup arsitektur core OOP & layout (Ariq)
- `feat_jadwal_kuliah/13-10-2026`: Modul jadwal kuliah & tabel mingguan (Ariq)
- `feat_manajemen_tugas/13-10-2026`: Modul manajemen tugas & filter/sorting (Ariq)
- `feat_dashboard_ui/13-10-2026`: Styling dashboard utama & placeholder modul (Ariq)
- `feat_pomodoro/{tanggal}`: Pengerjaan modul Pomodoro timer (Isra)
- `feat_progress/{tanggal}`: Pengerjaan grafik Recharts & statistik (Riyadh)
