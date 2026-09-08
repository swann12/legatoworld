/* Une ou deux propositions, jamais une liste. Toujours reportables ou ignorables. */

import { daysAway, type AgendaEvent } from "./agenda-store";
import { loadSelfCare, activitiesFor } from "./self-care";
import type { Emotion } from "./legato-state";

export type NextAction = {
  id: string;
  label: string;
  title: string;
  hint: string;
  to: string;
};

const KEY = "lg.next.dismissed.v1";

type Dismissed = Record<string, string>; // id → ISO jusqu'à laquelle on n'affiche plus

function readDismissed(): Dismissed {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Dismissed; } catch { return {}; }
}

export function dismissAction(id: string, days: number) {
  if (typeof window === "undefined") return;
  const d = readDismissed();
  d[id] = new Date(Date.now() + days * 864e5).toISOString();
  try { window.localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* indisponible */ }
}

export function nextActions(input: {
  emotions: Emotion[];
  events: AgendaEvent[];
  pendingTask?: { id: string; label: string } | null;
  lightMode?: boolean;
}): NextAction[] {
  const out: NextAction[] = [];
  const self = loadSelfCare();
  const heavy = input.emotions.some((e) => ["fatigue", "anxiete", "peur", "besoin_calme", "besoin_aide"].includes(e));

  const today = input.events.filter((e) => daysAway(e.date) === 0);
  const tomorrow = input.events.filter((e) => daysAway(e.date) === 1);

  if (today.length) {
    const first = today[0];
    out.push({
      id: "agenda-" + first.id,
      label: "Aujourd'hui",
      title: first.title,
      hint: first.time ? `À ${first.time}` : "Dans la journée",
      to: "/agenda",
    });
  } else if (tomorrow.length) {
    out.push({
      id: "agenda-" + tomorrow[0].id,
      label: "Demain",
      title: tomorrow[0].title,
      hint: "Rien d'autre à préparer ce soir.",
      to: "/agenda",
    });
  }

  if (heavy || !self.answeredAt) {
    const a = activitiesFor(self.answers)[0];
    out.push({
      id: "soin-" + (a?.id ?? "corps"),
      label: "Pour vous",
      title: a ? a.title : "Prendre trois minutes",
      hint: a ? `${a.minutes} min · ${a.kind}` : "Un point rapide sur le corps.",
      to: a ? `/help/corps/soin/${a.id}` : "/help/corps",
    });
  }

  if (out.length < 2 && input.pendingTask) {
    out.push({
      id: "task-" + input.pendingTask.id,
      label: "Une démarche",
      title: input.pendingTask.label,
      hint: "Une seule, si c'est possible aujourd'hui.",
      to: "/practical/tasks",
    });
  }

  const dismissed = readDismissed();
  const now = Date.now();
  const kept = out.filter((a) => {
    const until = dismissed[a.id];
    return !until || new Date(until).getTime() < now;
  });
  return kept.slice(0, input.lightMode ? 1 : 2);
}
