/**
 * src/services/NotificationUtils.ts
 *
 * Utilitas notifikasi suara dan alert untuk Pomodoro Timer.
 * Menggunakan Web Audio API sintetis (tanpa file audio eksternal)
 * sehingga berfungsi konsisten dan aman dari dependensi aset.
 */

export function playTimerNotificationSound(type: "focus-complete" | "break-complete"): void {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === "focus-complete") {
      // 3 nada harmonis ceria: C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.15 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.35);
      });
    } else {
      // 2 nada lembut penanda istirahat selesai: A4 (440Hz) -> D5 (587.33Hz)
      const notes = [440, 587.33];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.2);

        gain.gain.setValueAtTime(0, now + idx * 0.2);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.2 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.2);
        osc.stop(now + idx * 0.2 + 0.4);
      });
    }
  } catch (error) {
    console.warn("[NotificationUtils] Gagal memutar suara:", error);
  }
}
