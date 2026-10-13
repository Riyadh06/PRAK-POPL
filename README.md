# 📚 StudyTrack — Dashboard Produktivitas Belajar Mahasiswa

StudyTrack adalah aplikasi web dashboard produktivitas belajar untuk mahasiswa yang dibangun menggunakan Next.js (App Router), TypeScript, dan Tailwind CSS. Aplikasi ini dirancang dengan prinsip Object-Oriented Programming (OOP) dan Design Patterns yang kuat, serta berjalan sepenuhnya di sisi client (localStorage) tanpa backend eksternal.

---

## 🐳 Docker Hub Repository
- **Docker Hub Public Repo**: [https://hub.docker.com/r/israaulia/studytrack](https://hub.docker.com/r/israaulia/studytrack)
- **Docker Image Tag**: `israaulia/studytrack:v1-UTS`
- **Cara Menjalankan Container**:
  ```bash
  docker pull israaulia/studytrack:v1-UTS
  docker run -p 3000:3000 israaulia/studytrack:v1-UTS
  ```

---

## 👥 Pembagian Tugas Tim (Estafet)

Proyek ini dikembangkan secara bergantian sesuai urutan: **Ariq → Isra → Riyadh**.

| Anggota | Peran & Tanggung Jawab | Status |
|---|---|---|
| **Ariq** | Inisialisasi Proyek, Arsitektur Core (Singleton, Repository, Factory, Strategy, Facade), Modul Jadwal Kuliah, Modul Manajemen Tugas, Base Hook & Layout | ✅ **Selesai** |
| **Isra** | Modul Pomodoro Timer (State Pattern), Integrasi Countdown & Settings, Halaman Pomodoro, Halaman Progres & Grafik Recharts (MiniChart, BarChart, PieChart) | ✅ **Selesai** |
| **Riyadh** | Dashboard Page (4 hook + komponen modular + MiniChart), Dokumentasi Arsitektur (UML, diagram alur), Final Integration & QA | ✅ **Selesai** |

Dokumentasi serah terima:
- Ariq → Isra: [`HANDOVER_ARIQ_TO_ISRA.md`](./HANDOVER_ARIQ_TO_ISRA.md)
- Isra → Riyadh: [`HANDOVER_ISRA_TO_RIYADH.md`](./HANDOVER_ISRA_TO_RIYADH.md)

---

## 🏗️ Pola Desain (Design Patterns) & OOP

Aplikasi ini mengimplementasikan **7 Design Pattern** standar industri:

| # | Pattern | File | Tujuan |
|---|---------|------|--------|
| 1 | **Singleton** | [`StorageService.ts`](./src/services/StorageService.ts) | Satu instance pengelola localStorage di seluruh aplikasi |
| 2 | **Observer** | [`StorageService.ts`](./src/services/StorageService.ts) | UI re-render otomatis saat data berubah (reaktif) |
| 3 | **Repository + Template Method** | [`BaseService.ts`](./src/services/BaseService.ts) | CRUD generik yang diwarisi semua service |
| 4 | **Factory** | [`EntityFactory.ts`](./src/factories/EntityFactory.ts) | Pembuatan entitas dengan UUID dan default yang konsisten |
| 5 | **Strategy** | [`strategies/`](./src/services/strategies/) | Algoritma filter & sort tugas yang dapat diganti runtime |
| 6 | **State** | [`PomodoroTimer.ts`](./src/services/PomodoroTimer.ts) | Mesin state timer Idle→Focus→Break→Idle |
| 7 | **Facade** | [`StatsService.ts`](./src/services/StatsService.ts) | Satu pintu untuk semua data dashboard |

📖 Lihat [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) untuk penjelasan lengkap dengan diagram Mermaid.

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

## ✨ Fitur Aplikasi

### Dashboard
- Kartu statistik ringkas: jadwal hari ini, tugas selesai, menit belajar, progres %
- Status kuliah aktif & berikutnya hari ini
- Daftar tugas deadline terdekat dengan penanda warna (merah/kuning/hijau)
- MiniChart sparkline belajar 7 hari + mini donut chart progres tugas
- Tombol pintasan: Mulai Pomodoro, Tambah Tugas, Lihat Jadwal, Lihat Progres

### Jadwal Kuliah
- Tambah / edit / hapus mata kuliah
- Tampilan tabel jadwal mingguan (Senin–Minggu)
- Highlight kuliah yang sedang berlangsung atau berikutnya

### Manajemen Tugas
- Tambah / edit / hapus tugas dengan deadline dan prioritas
- Filter (Semua, Belum, Dikerjakan, Selesai, per Mata Kuliah)
- Sorting (Deadline terdekat / terjauh)
- Indikator deadline: Merah (terlambat), Kuning (hampir), Hijau (aman)

### Pomodoro Timer
- Countdown presisi 25 menit fokus + 5 menit istirahat
- Transisi otomatis Focus → Break → Idle (State Pattern)
- Jeda / lanjutkan / reset timer
- Pencatatan sesi ke localStorage setelah selesai
- Notifikasi suara via Web Audio API
- Riwayat 10 sesi terakhir

### Progres & Grafik
- Bar chart jam belajar harian 7 hari (Recharts)
- Donut chart rasio tugas selesai vs belum (Recharts)
- Tabel statistik lengkap

---

## 🛠️ Panduan Menjalankan Proyek

### 1. Clone & Masuk ke Direktori
```bash
git clone <URL_REPOSITORY>
cd PRAK-POPL
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

### 4. Pemeriksaan Type (TypeScript)
```bash
npx tsc --noEmit
```

### 5. Lint
```bash
npm run lint
```

### 6. Build Produksi
```bash
npm run build
```

---

## 🌿 Aturan Git, Branch, & Commit

### 1. Format Penamaan Branch
- **Fitur baru**: `feat_{nama_fitur}/{tanggal}` (contoh: `feat_jadwal_kuliah/13-10-2026`)
- **Perbaikan bug**: `fix_{nama_fitur}/{tanggal}`
- **Dokumentasi**: `docs/{nama}`
- **Pemeliharaan**: `chore/{nama}`

### 2. Format Commit Message
- `feat: pesan deskripsi` → untuk penambahan/peningkatan fitur
- `fix: pesan deskripsi` → untuk perbaikan bug
- `style: pesan deskripsi` → untuk styling UI
- `chore: pesan deskripsi` → perubahan non-fungsional (config, dokumentasi, dll)
- `docs: pesan deskripsi` → dokumentasi

### 3. Struktur Branch
- `main`: Branch rilis final (tag `v1.0.0`)
- `develop`: Branch integrasi utama
- `feat_arsitektur_core/13-10-2026` — Ariq: setup core
- `feat_jadwal_kuliah/13-10-2026` — Ariq: modul jadwal
- `feat_manajemen_tugas/13-10-2026` — Ariq: modul tugas
- `feat_dashboard_ui/13-10-2026` — Ariq: layout & styling
- `feature/pomodoro` — Isra: modul Pomodoro
- `feat_progress_charts/13-10-2026` — Isra: grafik progres
- `feature/dashboard` — Riyadh: dashboard page
- `docs/architecture` — Riyadh: dokumentasi arsitektur
- `chore/final-integration` — Riyadh: integrasi & QA akhir
