"use client";
/**
 * src/components/layout/Sidebar.tsx
 * Navigasi sidebar utama StudyTrack
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/schedule", label: "Jadwal", icon: "📅" },
  { href: "/tasks", label: "Tugas", icon: "✅" },
  { href: "/pomodoro", label: "Pomodoro", icon: "🍅" },
  { href: "/progress", label: "Progres", icon: "📈" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">StudyTrack</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "nav-item--active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {isActive && <span className="nav-indicator" />}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            background: "#f8fafc",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#e0e7ff",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            🎓
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Mahasiswa
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Semester Aktif
            </p>
          </div>
        </div>
        <p className="sidebar-footer-text" style={{ textAlign: "center" }}>
          StudyTrack v1.0.0
        </p>
      </div>
    </aside>
  );
}
