"use client";
/**
 * src/components/pomodoro/PomodoroSettingsModal.tsx
 *
 * Modal pengaturan durasi fokus dan durasi istirahat Pomodoro.
 * Dilengkapi preset cepat (25/5, 50/10, 15/3) dan validasi nilai.
 */

import React, { useState } from "react";
import { PomodoroSettings } from "@/types";

interface PomodoroSettingsModalProps {
  isOpen: boolean;
  initialSettings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
  onClose: () => void;
}

export function PomodoroSettingsModal({
  isOpen,
  initialSettings,
  onSave,
  onClose,
}: PomodoroSettingsModalProps) {
  const [focusMinutes, setFocusMinutes] = useState<number>(
    initialSettings.focusMinutes
  );
  const [breakMinutes, setBreakMinutes] = useState<number>(
    initialSettings.breakMinutes
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (focusMinutes < 1 || focusMinutes > 180) {
      setError("Durasi fokus harus antara 1 sampai 180 menit.");
      return;
    }
    if (breakMinutes < 1 || breakMinutes > 60) {
      setError("Durasi istirahat harus antara 1 sampai 60 menit.");
      return;
    }
    setError(null);
    onSave({ focusMinutes, breakMinutes });
    onClose();
  };

  const applyPreset = (focus: number, breakM: number) => {
    setFocusMinutes(focus);
    setBreakMinutes(breakM);
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 460 }}
      >
        <div className="modal-header">
          <h2 className="modal-title">⚙️ Pengaturan Pomodoro</h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Pilihan Preset Cepat */}
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block",
              marginBottom: 8,
            }}
          >
            Pilihan Cepat (Preset)
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => applyPreset(25, 5)}
              style={{
                borderColor:
                  focusMinutes === 25 && breakMinutes === 5
                    ? "var(--color-primary)"
                    : undefined,
              }}
            >
              🍅 Klasik (25 / 5 m)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => applyPreset(50, 10)}
              style={{
                borderColor:
                  focusMinutes === 50 && breakMinutes === 10
                    ? "var(--color-primary)"
                    : undefined,
              }}
            >
              🧠 Deep Work (50 / 10 m)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => applyPreset(15, 3)}
              style={{
                borderColor:
                  focusMinutes === 15 && breakMinutes === 3
                    ? "var(--color-primary)"
                    : undefined,
              }}
            >
              ⚡ Sprint (15 / 3 m)
            </button>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="input-focus-duration" className="form-label">
              Durasi Fokus (Menit)
            </label>
            <input
              id="input-focus-duration"
              type="number"
              min={1}
              max={180}
              className="form-input"
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(Number(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="input-break-duration" className="form-label">
              Durasi Istirahat (Menit)
            </label>
            <input
              id="input-break-duration"
              type="number"
              min={1}
              max={60}
              className="form-input"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
              required
            />
          </div>

          {error && (
            <p
              style={{
                color: "var(--color-danger)",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              ⚠️ {error}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 24,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
