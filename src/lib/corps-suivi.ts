/* B021 · Votre petit suivi : quatre gestes par jour, gardés sur le téléphone. Sans note ni objectif. */
export type Geste = "dormi" | "mange" | "lave" | "sorti";
export const GESTES: { id: Geste; label: string }[] = [
  { id: "dormi", label: "Dormi" }, { id: "mange", label: "Mangé" }, { id: "lave", label: "Lavé" }, { id: "sorti", label: "Sorti" },
];
export type Suivi = Record<string, Partial<Record<Geste, boolean>>>;
const KEY = "lg.corps.suivi.v1";

export const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Les sept jours de la semaine (lundi → dimanche) contenant `ref`, décalés de `weeksBack`. */
export function weekDays(ref: Date, weeksBack = 0): Date[] {
  const start = new Date(ref); start.setHours(12, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - 7 * weeksBack);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
}

export const countWeek = (s: Suivi, g: Geste, days: Date[]) => days.filter((d) => s[dayKey(d)]?.[g]).length;

const WORDS = ["", "une fois", "deux fois", "trois fois", "quatre fois", "cinq fois", "six fois", "sept fois"];

/** Phrase douce : seulement un mieux, jamais un reproche. */
export function gentleNote(s: Suivi, ref: Date): string | null {
  const now = weekDays(ref), before = weekDays(ref, 1);
  const verbs: Record<Geste, string> = { sorti: "êtes sorti", dormi: "avez dormi", mange: "avez mangé", lave: "vous êtes lavé" };
  for (const g of ["sorti", "dormi", "mange", "lave"] as Geste[]) {
    const diff = countWeek(s, g, now) - countWeek(s, g, before);
    if (diff > 0) return `Vous ${verbs[g]} ${WORDS[diff]} de plus que la semaine dernière.`;
  }
  return null;
}

export function loadSuivi(): Suivi {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch { return {}; }
}
export function saveSuivi(s: Suivi) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* stockage indisponible */ }
}
