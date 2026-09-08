/* Agenda sensible : rendez-vous, obligations, repos.
   Legato ne déplace jamais rien : il suggère, l'utilisateur décide. */

import { useCallback, useEffect, useState } from "react";

export type Importance = "essentiel" | "normal" | "reportable";
export type EventKind = "rdv" | "demarche" | "repos" | "pour_soi";

export type AgendaEvent = {
  id: string;
  title: string;
  date: string;      // YYYY-MM-DD
  time?: string;     // HH:MM
  kind: EventKind;
  importance: Importance;
  movable: boolean;
  note?: string;
};

export const KIND_LABELS: Record<EventKind, string> = {
  rdv: "Rendez-vous",
  demarche: "Démarche",
  repos: "Repos",
  pour_soi: "Pour soi",
};

export const IMPORTANCE_LABELS: Record<Importance, string> = {
  essentiel: "Incontournable",
  normal: "Important",
  reportable: "Peut attendre",
};

const KEY = "lg.agenda.v1";

function read(): AgendaEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AgendaEvent[]) : [];
  } catch { return []; }
}

function write(list: AgendaEvent[]) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* indisponible */ }
}

export function useAgenda() {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setEvents(read()); setHydrated(true); }, []);

  const persist = useCallback((list: AgendaEvent[]) => {
    const sorted = [...list].sort((a, b) => (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")));
    setEvents(sorted);
    write(sorted);
  }, []);

  const add = useCallback((e: Omit<AgendaEvent, "id">) => {
    persist([...read(), { ...e, id: Math.random().toString(36).slice(2, 9) }]);
  }, [persist]);

  const update = useCallback((id: string, patch: Partial<AgendaEvent>) => {
    persist(read().map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, [persist]);

  const remove = useCallback((id: string) => {
    persist(read().filter((e) => e.id !== id));
  }, [persist]);

  return { events, hydrated, add, update, remove };
}

export function daysAway(date: string): number {
  const d = new Date(date + "T12:00:00");
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 864e5);
}

export function formatDay(date: string): string {
  return new Date(date + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

/** Suggestions croisant l'agenda et l'état (jamais d'action automatique). */
export function agendaSuggestions(
  events: AgendaEvent[],
  opts: { lowEnergy: boolean; badSleep: boolean; heavyEmotion: boolean },
): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = [];
  const soon = events.filter((e) => { const d = daysAway(e.date); return d >= 0 && d <= 2; });
  const dayCount = new Map<string, AgendaEvent[]>();
  soon.forEach((e) => dayCount.set(e.date, [...(dayCount.get(e.date) ?? []), e]));

  dayCount.forEach((list, date) => {
    if (list.filter((e) => e.kind !== "repos").length >= 3) {
      out.push({ id: "charge-" + date, text: `${formatDay(date)} compte ${list.length} choses. Vous pourriez en garder deux et déplacer le reste.` });
    }
    if (!list.some((e) => e.kind === "repos" || e.kind === "pour_soi")) {
      out.push({ id: "repos-" + date, text: `Rien pour vous le ${formatDay(date)}. Un temps de repos peut y trouver sa place.` });
    }
  });

  if ((opts.lowEnergy || opts.badSleep) && soon.some((e) => e.movable && e.importance === "reportable")) {
    const e = soon.find((x) => x.movable && x.importance === "reportable")!;
    out.push({ id: "reporter-" + e.id, text: `« ${e.title} » peut attendre et vous êtes fatigué·e. Le reporter serait raisonnable — à vous de voir.` });
  }
  if (opts.heavyEmotion && soon.some((e) => e.kind === "demarche")) {
    out.push({ id: "demarche-lourde", text: "Une démarche est prévue dans un moment lourd. Vous pouvez demander à un proche de vous accompagner." });
  }
  if (!events.length) {
    out.push({ id: "vide", text: "Rien de noté. Vous pouvez ajouter un rendez-vous, ou laisser cet agenda vide." });
  }
  return out.slice(0, 3);
}

/* ─── Rappels doux, entièrement paramétrables ─── */

export type ReminderPrefs = { enabled: boolean; moment: "matin" | "midi" | "soir"; frequency: "quotidien" | "hebdo" };
const RKEY = "lg.reminders.v1";
export const DEFAULT_REMINDERS: ReminderPrefs = { enabled: false, moment: "matin", frequency: "hebdo" };

export function loadReminders(): ReminderPrefs {
  if (typeof window === "undefined") return DEFAULT_REMINDERS;
  try {
    const raw = window.localStorage.getItem(RKEY);
    return raw ? { ...DEFAULT_REMINDERS, ...(JSON.parse(raw) as ReminderPrefs) } : DEFAULT_REMINDERS;
  } catch { return DEFAULT_REMINDERS; }
}

export function saveReminders(p: ReminderPrefs) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(RKEY, JSON.stringify(p)); } catch { /* indisponible */ }
}
