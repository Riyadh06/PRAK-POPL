"use client";
/**
 * src/components/dashboard/QuickActions.tsx
 *
 * Tombol pintasan navigasi cepat di Dashboard.
 * Navigasi ke halaman Pomodoro, Tambah Tugas, dan Jadwal.
 */

import Link from "next/link";

const actions = [
  {
    href: "/pomodoro",
    label: "Mulai Pomodoro",
    icon: "🍅",
    desc: "Mulai sesi fokus 25 menit",
    iconBg: "#fee2e2",
  },
  {
    href: "/tasks",
    label: "Tambah Tugas",
    icon: "✅",
    desc: "Catat tugas & deadline",
    iconBg: "#dcfce7",
  },
  {
    href: "/schedule",
    label: "Lihat Jadwal",
    icon: "📅",
    desc: "Cek jadwal mingguan",
    iconBg: "#e0e7ff",
  },
  {
    href: "/progress",
    label: "Lihat Progres",
    icon: "📈",
    desc: "Grafik belajar & tugas",
    iconBg: "#fef3c7",
  },
];

export function QuickActions() {
  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-title">⚡ Pintasan Cepat</div>
      <div className="grid-4" style={{ gap: 14 }}>
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              background: "#f8fafc",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              color: "var(--text-primary)",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(-2px)";
              el.style.background = "#ffffff";
              el.style.borderColor = "#cbd5e1";
              el.style.boxShadow = "var(--shadow-hover)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "";
              el.style.background = "#f8fafc";
              el.style.borderColor = "var(--border-subtle)";
              el.style.boxShadow = "";
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: action.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {action.icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>
                {action.label}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {action.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
