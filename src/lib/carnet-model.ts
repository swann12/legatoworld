/* Règles pures du carnet et de « Qui fait quoi » (testées). */

export type Rdv = { id: string; date: string; time?: string; who: string; place?: string; with?: string; questions: string[]; detail?: string };
export type CarnetNote = { id: string; text: string; date: string; label?: string };
export type Task = { id: string; what: string; when: string; askedTo: string[]; assignee?: string | null; accepted: boolean; mine?: boolean };

export const todayIso = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function upcoming(rdvs: Rdv[], today = todayIso()) {
  return rdvs.filter((r) => r.date >= today).sort((a, b) => (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")));
}

export function taskState(t: Task): "accepte" | "attente" | "personne" {
  if (t.accepted) return "accepte";
  return t.askedTo.length ? "attente" : "personne";
}

const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const at = (iso: string) => new Date(`${iso}T12:00:00`);
export const dayName = (iso: string) => DAYS[at(iso).getDay()];
export const dayNum = (iso: string) => String(at(iso).getDate());
export const monthShort = (iso: string) => at(iso).toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();
export const longDate = (iso: string) => at(iso).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
export const hour = (t?: string) => (t ? `${Number(t.slice(0, 2))} h${t.slice(3, 5) !== "00" ? t.slice(3, 5) : ""}` : "");
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
