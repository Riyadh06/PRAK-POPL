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
              padding: "20px 14px",
              background: action.accent,
              border: `1px solid ${action.border}`,
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              color: "var(--text-primary)",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(-4px)";
              el.style.boxShadow = `0 12px 24px -6px ${action.border}`;
              el.style.borderColor = "rgba(255, 255, 255, 0.3)";
              const iconEl = el.querySelector(".action-icon") as HTMLElement;
              if (iconEl) iconEl.style.transform = "scale(1.2) rotate(6deg)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "";
              el.style.boxShadow = "";
              el.style.borderColor = action.border;
              const iconEl = el.querySelector(".action-icon") as HTMLElement;
              if (iconEl) iconEl.style.transform = "";
            }}
          >
            <span
              className="action-icon"
              style={{
                fontSize: 32,
                transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "inline-block",
              }}
            >
              {action.icon}
            </span>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.2px" }}>
              {action.label}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.3 }}>
              {action.desc}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
