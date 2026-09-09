/* Intensité du dernier check-in (1 → 10), gardée en local. */

const KEY = "lg.emotionIntensity";

export function loadIntensity(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const n = Number(JSON.parse(raw));
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function saveIntensity(v: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* stockage indisponible */
  }
}
