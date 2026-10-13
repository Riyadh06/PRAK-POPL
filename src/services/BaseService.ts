/**
 * src/services/BaseService.ts
 *
 * PATTERN: Repository + Template Method
 * - Menyediakan operasi CRUD generik untuk semua entitas.
 * - Subclass hanya perlu menambah logika spesifik (Template Method).
 * - ID dibuat lewat EntityFactory (kontrak).
 * - Semua akses data hanya lewat StorageService (kontrak).
 */

import { StorageKey } from "@/types";
import { StorageService } from "./StorageService";

type Listener<T> = (items: T[]) => void;

export abstract class BaseService<T extends { id: string }> {
  protected readonly storage: StorageService;
  protected readonly storageKey: StorageKey;

  constructor(storageKey: StorageKey) {
    this.storageKey = storageKey;
    // Singleton — tidak new StorageService()
    this.storage = StorageService.getInstance();
  }

  // ── Template Method ──────────────────────────────────────────────────────

  /** Hook opsional: dipanggil setelah data berhasil disimpan */
  protected onAfterWrite?(): void;

  // ── Repository Methods ───────────────────────────────────────────────────

  /** Mengambil semua entitas dari localStorage */
  public getAll(): T[] {
    return this.storage.get<T[]>(this.storageKey, []);
  }

  /** Mengambil satu entitas berdasarkan id */
  public getById(id: string): T | undefined {
    return this.getAll().find((item) => item.id === id);
  }

  /**
   * Menyimpan entitas baru.
   * Pemanggil bertanggung jawab membuat id via EntityFactory.
   */
  public create(data: T): T {
    const all = this.getAll();
    all.push(data);
    this.storage.set<T[]>(this.storageKey, all);
    this.onAfterWrite?.();
    return data;
  }

  /** Memperbarui entitas secara parsial berdasarkan id */
  public update(id: string, partial: Partial<T>): T | null {
    const all = this.getAll();
    const index = all.findIndex((item) => item.id === id);
    if (index === -1) return null;
    all[index] = { ...all[index], ...partial };
    this.storage.set<T[]>(this.storageKey, all);
    this.onAfterWrite?.();
    return all[index];
  }

  /** Menghapus entitas berdasarkan id */
  public delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter((item) => item.id !== id);
    if (filtered.length === all.length) return false;
    this.storage.set<T[]>(this.storageKey, filtered);
    this.onAfterWrite?.();
    return true;
  }

  /**
   * Subscribe ke perubahan data.
   * Observer Pattern — listener dipanggil setiap data berubah.
   * @returns Fungsi unsubscribe.
   */
  public subscribe(listener: Listener<T>): () => void {
    return this.storage.subscribe<T[]>(this.storageKey, (value) => {
      listener(value ?? []);
    });
  }
}
