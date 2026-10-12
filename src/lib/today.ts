/* Petites règles de la page Aujourd'hui. */

/** Mode nuit entre 21 h et 6 h, heure locale. */
export function isNightHour(d = new Date()): boolean {
  const h = d.getHours();
  return h >= 21 || h < 6;
}

/** « trois semaines », « cinq jours »… depuis une date ISO. */
const WORDS = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze"];
export function sinceWords(iso: string | null | undefined, now = new Date()): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const days = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (days < 1) return null;
  const n = (k: number) => WORDS[k] ?? String(k);
  if (days < 14) return days === 1 ? "un jour" : `${n(days)} jours`;
  if (days < 60) { const w = Math.round(days / 7); return `${n(w)} semaines`; }
  const m = Math.round(days / 30);
  if (m < 24) return m === 1 ? "un mois" : `${n(m)} mois`;
  return `${n(Math.round(m / 12))} ans`;
}

const REM_KEY = "lg.dateReminders.v1";
export type Reminder = "non" | "semaine" | "veille";
export function setDateReminder(key: string, r: Reminder) {
  if (typeof window === "undefined") return;
  try {
    const m = JSON.parse(window.localStorage.getItem(REM_KEY) ?? "{}");
    m[key] = r;
    window.localStorage.setItem(REM_KEY, JSON.stringify(m));
  } catch { /* indisponible */ }
}
export function getDateReminder(key: string): Reminder | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(window.localStorage.getItem(REM_KEY) ?? "{}")[key] ?? null; } catch { return null; }
}
