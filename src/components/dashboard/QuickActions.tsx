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
    desc: "Mulai sesi fokus belajar",
    colorClass: "btn-primary",
    accent: "rgba(99,102,241,0.15)",
    border: "rgba(99,102,241,0.3)",
  },
  {
    href: "/tasks",
    label: "Tambah Tugas",
    icon: "✅",
    desc: "Catat tugas baru",
    colorClass: "btn-secondary",
    accent: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
  },
  {
    href: "/schedule",
    label: "Lihat Jadwal",
    icon: "📅",
    desc: "Cek jadwal mingguan",
    colorClass: "btn-secondary",
    accent: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.25)",
  },
  {
    href: "/progress",
    label: "Lihat Progres",
    icon: "📈",
    desc: "Grafik belajar & tugas",
    colorClass: "btn-secondary",
    accent: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
];

export function QuickActions() {
  return (
    <div className="card" style={{ marginBottom: 28 }}>
      <div className="card-title">⚡ Pintasan Cepat</div>
      <div className="grid-4" style={{ gap: 14 }}>
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "18px 12px",
              background: action.accent,
              border: `1px solid ${action.border}`,
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              color: "var(--text-primary)",
              transition: "all var(--transition-fast)",
              cursor: "pointer",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "var(--shadow-card)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
            }}
          >
            <span style={{ fontSize: 28 }}>{action.icon}</span>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{action.label}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {action.desc}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
