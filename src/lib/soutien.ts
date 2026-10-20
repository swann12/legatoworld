/* Soutien (D050–D060) : « ce qui m'aiderait », point du mois, reprise du travail.
 * Tout reste sur le téléphone, rangé par espace. Aucun diagnostic. */
import { useCallback, useEffect, useState } from "react";
import { scopedKey } from "./active-space";

export type HelpItem = { id: string; title: string; when: string; checked: boolean; who?: string };
export type Recipient = { name: string; phone?: string };

export const DEFAULT_HELP: HelpItem[] = [
  { id: "repas", title: "Un repas", when: "mardi et jeudi soir", checked: true },
  { id: "courses", title: "Les courses", when: "une fois par semaine", checked: true },
  { id: "notaire", title: "M'accompagner chez le notaire", when: "le 4 novembre", checked: true },
  { id: "enfants", title: "Garder les enfants", when: "un mercredi après-midi", checked: false },
  { id: "visite", title: "Passer me voir", when: "sans prévenir, c'est bien aussi", checked: false },
];

/** Réponses du point du mois. 0 = le plus léger, 3 = le plus lourd. */
export type PointAnswer = 0 | 1 | 2 | 3 | null;
export type PointEntry = { month: string; answers: PointAnswer[]; at: string };

export const POINT_QUESTIONS: { title: [string, string]; options: string[] }[] = [
  { title: ["Ce mois-ci, la peine vous a-t-elle", "empêché de vivre vos journées ?"], options: ["Rarement", "Parfois", "Souvent", "Presque tous les jours"] },
  { title: ["Ce mois-ci, avez-vous pu dormir", "et manger à peu près ?"], options: ["Oui, le plus souvent", "Une partie du temps", "Rarement", "Presque jamais"] },
  { title: ["Ce mois-ci, avez-vous pu partager", "un moment avec quelqu'un ?"], options: ["Plusieurs fois", "Une ou deux fois", "Presque pas", "Pas du tout"] },
];

/** « Lourd » si la peine empêche souvent de vivre, ou si deux réponses sont lourdes. Jamais un diagnostic. */
export function isHeavy(answers: PointAnswer[]): boolean {
  const heavy = answers.filter((a) => a !== null && a >= 2).length;
  return (answers[0] ?? 0) >= 2 || heavy >= 2;
}

/** Journées vivables, de 0 à 3, déduites de la première réponse. */
export function livable(entry: PointEntry): number {
  const a = entry.answers[0];
  return a === null || a === undefined ? 1.5 : 3 - a;
}

export function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export type SoutienState = {
  help: HelpItem[];
  recipients: Recipient[];
  sentAt?: string;
  points: PointEntry[];
  pointOff?: boolean;
  workDate?: string; // AAAA-MM-JJ
};

const EMPTY: SoutienState = { help: DEFAULT_HELP, recipients: [], points: [] };
const BASE = "lg.soutien.v1";
const EVT = "legato:soutien";

export function loadSoutien(): SoutienState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(scopedKey(BASE));
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<SoutienState>) } : EMPTY;
  } catch { return EMPTY; }
}

export function saveSoutien(next: SoutienState) {
  try { window.localStorage.setItem(scopedKey(BASE), JSON.stringify(next)); } catch { /* indisponible */ }
  window.dispatchEvent(new Event(EVT));
}

export function useSoutien() {
  const [s, setS] = useState<SoutienState>(EMPTY);
  useEffect(() => {
    const r = () => setS(loadSoutien());
    r();
    window.addEventListener(EVT, r);
    window.addEventListener("legato:active-space", r);
    return () => { window.removeEventListener(EVT, r); window.removeEventListener("legato:active-space", r); };
  }, []);
  const update = useCallback((fn: (p: SoutienState) => SoutienState) => saveSoutien(fn(loadSoutien())), []);
  return { s, update };
}

export function joinNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} et ${names[names.length - 1]}`;
}

export function frenchDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return "";
  const s = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
