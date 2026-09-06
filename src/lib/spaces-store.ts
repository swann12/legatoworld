import { useCallback, useEffect, useState } from "react";
import type { Relation } from "./legato-state";

/* ───────── Mes espaces — un espace par être aimé ─────────
   Stocké en localStorage, comme les souvenirs. Chaque espace porte
   son nom, le lien, ses dates repères et ses dates personnelles. */

export type SpaceDate = {
  id: string;
  label: string;
  date: string; // ISO YYYY-MM-DD
};

export type Space = {
  id: string;
  name: string;
  relation: Relation | null;
  birthday?: string | null;  // ISO YYYY-MM-DD
  deathDate?: string | null; // ISO YYYY-MM-DD
  note?: string;
  customDates: SpaceDate[];
  archived: boolean;
  createdAt: number;
};

const KEY = "legato.spaces.v1";
const EVENT = "legato:spaces";

export const RELATION_LABEL: Record<string, string> = {
  pere: "Père", mere: "Mère", conjoint: "Conjoint·e", enfant: "Enfant",
  frere_soeur: "Frère ou sœur", grand_parent: "Grand-parent",
  ami: "Ami·e", collegue: "Collègue", animal: "Animal", autre: "Proche",
};

function load(): Space[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Space[]) : [];
    return list.map((s) => ({ ...s, customDates: s.customDates ?? [] }));
  } catch {
    return [];
  }
}

function save(list: Space[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* quota — on ignore */
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/** Crée l'espace initial à partir de l'onboarding, une seule fois. */
function seedIfEmpty(): Space[] {
  if (typeof window === "undefined") return [];
  const existing = load();
  if (existing.length) return existing;
  let name = "";
  let relation: Relation | null = null;
  try {
    name = JSON.parse(window.localStorage.getItem("lg.lovedLabel") ?? '""') || "";
    relation = JSON.parse(window.localStorage.getItem("lg.lovedOneRelation") ?? "null");
  } catch {
    /* rien */
  }
  if (!name && !relation) return [];
  const seeded: Space[] = [{
    id: uid(),
    name: name || RELATION_LABEL[relation ?? "autre"] || "Proche",
    relation,
    birthday: null,
    deathDate: null,
    customDates: [],
    archived: false,
    createdAt: Date.now(),
  }];
  save(seeded);
  return seeded;
}

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSpaces(seedIfEmpty());
    setHydrated(true);
    const sync = () => setSpaces(load());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addSpace = useCallback((input: Partial<Space> & { name: string }) => {
    const next: Space = {
      id: uid(),
      name: input.name.trim() || "Proche",
      relation: input.relation ?? null,
      birthday: input.birthday ?? null,
      deathDate: input.deathDate ?? null,
      note: input.note ?? "",
      customDates: input.customDates ?? [],
      archived: false,
      createdAt: Date.now(),
    };
    const list = [...load(), next];
    save(list);
    setSpaces(list);
    return next;
  }, []);

  const updateSpace = useCallback((id: string, patch: Partial<Space>) => {
    const list = load().map((s) => (s.id === id ? { ...s, ...patch } : s));
    save(list);
    setSpaces(list);
  }, []);

  const removeSpace = useCallback((id: string) => {
    const list = load().filter((s) => s.id !== id);
    save(list);
    setSpaces(list);
  }, []);

  const addDate = useCallback((id: string, label: string, date: string) => {
    const list = load().map((s) =>
      s.id === id
        ? { ...s, customDates: [...s.customDates, { id: uid(), label: label.trim() || "Une date", date }] }
        : s,
    );
    save(list);
    setSpaces(list);
  }, []);

  const removeDate = useCallback((id: string, dateId: string) => {
    const list = load().map((s) =>
      s.id === id ? { ...s, customDates: s.customDates.filter((d) => d.id !== dateId) } : s,
    );
    save(list);
    setSpaces(list);
  }, []);

  return { spaces, hydrated, addSpace, updateSpace, removeSpace, addDate, removeDate };
}

/* ───────── Dates à venir, tous espaces confondus ───────── */

export type UpcomingDate = {
  key: string;
  spaceId: string;
  spaceName: string;
  label: string;
  kind: "birthday" | "death" | "custom";
  daysAway: number;
  date: Date;
};

function nextOccurrence(iso: string, from = new Date()): Date | null {
  const parts = iso.split("-").map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [, m, d] = parts;
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const candidate = new Date(from.getFullYear(), m - 1, d, 12, 0, 0);
  if (candidate.getTime() < today.getTime()) return new Date(from.getFullYear() + 1, m - 1, d, 12, 0, 0);
  return candidate;
}

function daysUntil(d: Date, from = new Date()): number {
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const b = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  return Math.round((a - b) / 86400000);
}

export function upcomingForSpaces(spaces: Space[], windowDays = 400): UpcomingDate[] {
  const now = new Date();
  const out: UpcomingDate[] = [];
  for (const s of spaces) {
    if (s.archived) continue;
    const push = (key: string, label: string, iso: string | null | undefined, kind: UpcomingDate["kind"]) => {
      if (!iso) return;
      const d = nextOccurrence(iso, now);
      if (!d) return;
      const days = daysUntil(d, now);
      if (days < 0 || days > windowDays) return;
      out.push({ key, spaceId: s.id, spaceName: s.name, label, kind, daysAway: days, date: d });
    };
    push(`${s.id}-b`, "Son anniversaire", s.birthday, "birthday");
    push(`${s.id}-d`, "Date du départ", s.deathDate, "death");
    for (const c of s.customDates) push(`${s.id}-${c.id}`, c.label, c.date, "custom");
  }
  return out.sort((a, b) => a.daysAway - b.daysAway);
}

export function formatDaysAway(days: number): string {
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Demain";
  if (days < 31) return `Dans ${days} jours`;
  const months = Math.round(days / 30);
  return months <= 1 ? "Dans un mois" : `Dans ${months} mois`;
}
