/**
 * src/services/StorageService.ts
 *
 * PATTERN: Singleton + Observer
 * - Hanya ada satu instance (Singleton).
 * - Komponen/service dapat subscribe untuk menerima notifikasi perubahan data.
 * - Aman dari SSR (cek typeof window !== "undefined").
 */

import { StorageKey } from "@/types";

type Listener<T> = (value: T) => void;

export class StorageService {
  // ── Singleton ────────────────────────────────────────────────────────────
  private static instance: StorageService;

  private constructor() {
    // Mendengarkan event storage dari tab lain (Observer cross-tab)
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (event) => {
        if (event.key && event.newValue !== null) {
          this.notifyListeners(event.key as StorageKey);
        }
      });
    }
  }

  /** Mengembalikan instance tunggal StorageService */
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // ── Observer ─────────────────────────────────────────────────────────────
  /** Map: key → Set of listeners */
  private listeners: Map<string, Set<Listener<unknown>>> = new Map();

  /**
   * Subscribe ke perubahan data pada key tertentu.
   * @returns Fungsi unsubscribe — panggil saat komponen unmount.
   */
  public subscribe<T>(key: StorageKey, listener: Listener<T>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    const set = this.listeners.get(key)!;
    set.add(listener as Listener<unknown>);

    // Kembalikan fungsi unsubscribe
    return () => {
      set.delete(listener as Listener<unknown>);
    };
  }

  /** Memberitahu semua listener untuk key tertentu */
  private notifyListeners(key: StorageKey): void {
    const set = this.listeners.get(key);
    if (!set) return;
    const value = this.get(key, null);
    set.forEach((listener) => listener(value));
  }

  // ── CRUD localStorage ─────────────────────────────────────────────────────

  /**
   * Membaca dan memparsing data dari localStorage.
   * Aman SSR: mengembalikan fallback bila di server atau data tidak valid.
   */
  public get<T>(key: StorageKey, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      // JSON.parse gagal → kembalikan fallback
      console.warn(`[StorageService] Gagal membaca key "${key}"`);
      return fallback;
    }
  }

  /**
   * Menyimpan data ke localStorage dan memberitahu semua listener.
   */
  public set<T>(key: StorageKey, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      this.notifyListeners(key);
    } catch {
      console.error(`[StorageService] Gagal menyimpan key "${key}"`);
    }
  }

  /**
   * Menghapus data dari localStorage dan memberitahu semua listener.
   */
  public remove(key: StorageKey): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
    this.notifyListeners(key);
  }
}
