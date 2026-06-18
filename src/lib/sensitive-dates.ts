import type { Relation } from "./legato-state";

export type SensitiveDate = {
  id: string;
  label: string;
  date: Date;      // prochaine occurrence
  daysAway: number;
  kind: "anniversary" | "death" | "holiday" | "personal";
};

function nextOccurrence(month: number, day: number, from = new Date()): Date {
  const y = from.getFullYear();
  const candidate = new Date(y, month, day, 12, 0, 0);
  if (candidate.getTime() < from.setHours(0, 0, 0, 0)) {
    return new Date(y + 1, month, day, 12, 0, 0);
  }
  return candidate;
}

function daysUntil(d: Date, from = new Date()): number {
  const a = new Date(d).setHours(0, 0, 0, 0);
  const b = new Date(from).setHours(0, 0, 0, 0);
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
}

/** Renvoie les dates dans la fenêtre [now, +N jours]. */
export function upcomingSensitiveDates(opts: {
  birthday?: string | null;     // ISO YYYY-MM-DD
  deathDate?: string | null;
  custom?: { label: string; date: string }[];
  windowDays?: number;
  relation?: Relation | null;
} = {}): SensitiveDate[] {
  const window = opts.windowDays ?? 3;
  const now = new Date();
  const out: SensitiveDate[] = [];

  const add = (id: string, label: string, d: Date, kind: SensitiveDate["kind"]) => {
    const days = daysUntil(d, now);
    if (days >= 0 && days <= window) out.push({ id, label, date: d, daysAway: days, kind });
  };

  if (opts.birthday) {
    const [, m, d] = opts.birthday.split("-").map(Number);
    add("birthday", "Son anniversaire", nextOccurrence(m - 1, d, now), "anniversary");
  }
  if (opts.deathDate) {
    const [, m, d] = opts.deathDate.split("-").map(Number);
    add("death", "Date du départ", nextOccurrence(m - 1, d, now), "death");
  }

  // Fêtes sensibles — uniquement celles qui ont un sens pour ce lien.
  const r = opts.relation ?? null;
  if (r === "mere") add("mothers", "Fête des mères", nextOccurrence(4, 31, now), "holiday");
  if (r === "pere") add("fathers", "Fête des pères", nextOccurrence(5, 21, now), "holiday");
  // Noël et nouvelle année sont sensibles pour toute famille proche, et neutres sinon.
  if (r === "mere" || r === "pere" || r === "conjoint" || r === "enfant" || r === "frere_soeur" || r === "grand_parent") {
    add("christmas", "Noël", nextOccurrence(11, 25, now), "holiday");
    add("newyear", "Nouvelle année", nextOccurrence(0, 1, now), "holiday");
  }

  for (const c of opts.custom ?? []) {
    const [, m, d] = c.date.split("-").map(Number);
    add(`c-${c.label}`, c.label, nextOccurrence(m - 1, d, now), "personal");
  }

  return out.sort((a, b) => a.daysAway - b.daysAway);
}