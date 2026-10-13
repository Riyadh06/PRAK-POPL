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
      <div className="sidebar-footer">
        <p className="sidebar-footer-text">© 2025 StudyTrack</p>
      </div>
    </aside>
  );
}
