import { useCallback, useEffect, useState } from "react";
import { scopedKey, ACTIVE_SPACE_EVENT } from "./active-space";

/* Espace « je pense beaucoup à la mort » (B072–B090) : tout reste sur le téléphone, par espace. */

export type Moment = "questions" | "angoisse" | "envie";
export type Concern = "peur" | "proches" | "apres" | "papiers" | "sens";
export type PrepareId = "obseques" | "confiance" | "directives" | "don" | "testament" | "contrat";

export type Obseques = { choix: string; ceremonie: string; musique: string; cendres: string; quiConnait: string; date?: string };
export type Lettre = { id: string; pour: string; quand: string; texte: string; createdAt: number };
export type Objet = { id: string; objet: string; pour: string };
export type SelfData = {
  obseques?: Obseques;
  confiance?: { name: string };
  ready: PrepareId[];
  histoire: string[];
  lettres: Lettre[];
  objets: Objet[];
  peur?: { text: string; date: string };
  cafe?: boolean;
};

export const PREPARE_ITEMS: { id: PrepareId; title: string; sub: string; to: string }[] = [
  { id: "obseques", title: "Mes souhaits pour mes obsèques", sub: "Cérémonie, musique, lieu", to: "/practical/obseques" },
  { id: "confiance", title: "Ma personne de confiance", sub: "Celle que les médecins consulteront", to: "/practical/confiance" },
  { id: "directives", title: "Mes directives anticipées", sub: "Pour ma fin de vie", to: "/practical/directives" },
  { id: "don", title: "Le don d'organes", sub: "Dire mon choix", to: "/practical/don-organes" },
  { id: "testament", title: "Mon testament", sub: "Seul ou avec un notaire", to: "/practical/testament" },
  { id: "contrat", title: "Un contrat obsèques", sub: "Ne rien laisser à payer", to: "/practical/contrat-obseques" },
];

export const LIFE_QUESTIONS = [
  "Où êtes-vous né, et dans quelle famille ?",
  "Qui vous a élevé, et comment était la maison ?",
  "Quel est votre premier souvenir ?",
  "À quoi jouiez-vous, enfant ?",
  "Qui a compté pour vous à l'école ?",
  "Quel a été votre premier travail ?",
  "Comment avez-vous rencontré celles et ceux que vous aimez ?",
  "De quoi êtes-vous le plus fier ?",
  "Qu'avez-vous appris d'un moment difficile ?",
  "Quels lieux comptent pour vous ?",
  "Qu'aimeriez-vous transmettre à ceux qui viennent après vous ?",
  "Que voudriez-vous qu'on dise de vous ?",
];

const EMPTY: SelfData = { ready: [], histoire: [], lettres: [], objets: [] };
const KEY = "lg.selfSpace.v1";
const EVENT = "legato:self-space";

/** Un élément est prêt quand il est rempli (obsèques, confiance) ou marqué comme prêt. */
export function isReady(d: SelfData, id: PrepareId): boolean {
  if (id === "obseques" && d.obseques?.date) return true;
  if (id === "confiance" && d.confiance?.name.trim()) return true;
  return d.ready.includes(id);
}
export const readyCount = (d: SelfData) => PREPARE_ITEMS.filter((i) => isReady(d, i.id)).length;

/** Phrase de la ligne « Préparer » d'Aujourd'hui. */
export function prepareSummary(d: SelfData): string {
  const n = readyCount(d);
  if (d.confiance?.name.trim()) return `${n} sur 6 · votre personne de confiance est choisie`;
  if (n === 0) return "0 sur 6 · à votre rythme";
  return `${n} sur 6 · ${n > 1 ? "prêts" : "prêt"}`;
}

/** Sécurité (§7) : « Parfois, l'envie de ne plus être là » ouvre tout de suite l'écran 3114. */
export const momentNext = (m: Moment | null) => (m === "envie" ? "/home/penser-a-mourir" : "/onboarding?etape=pret");

/** Prochain jeudi à 19 h (le jour même si on est jeudi avant 19 h). */
export function nextThursday(from: Date): Date {
  const d = new Date(from); d.setHours(19, 0, 0, 0);
  let add = (4 - d.getDay() + 7) % 7;
  if (add === 0 && from.getTime() >= d.getTime()) add = 7;
  d.setDate(d.getDate() + add);
  return d;
}

export function readSelf(): SelfData {
  if (typeof window === "undefined") return EMPTY;
  try { return { ...EMPTY, ...(JSON.parse(window.localStorage.getItem(scopedKey(KEY)) || "{}") as Partial<SelfData>) }; } catch { return EMPTY; }
}
export function updateSelf(patch: Partial<SelfData> | ((d: SelfData) => Partial<SelfData>)) {
  const cur = readSelf();
  const next = { ...cur, ...(typeof patch === "function" ? patch(cur) : patch) };
  try { window.localStorage.setItem(scopedKey(KEY), JSON.stringify(next)); window.dispatchEvent(new Event(EVENT)); } catch { /* stockage indisponible */ }
}
export const newId = () => Math.random().toString(36).slice(2, 10);

export function useSelf(): SelfData {
  const [d, setD] = useState<SelfData>(EMPTY);
  const load = useCallback(() => setD(readSelf()), []);
  useEffect(() => {
    load();
    window.addEventListener(EVENT, load); window.addEventListener(ACTIVE_SPACE_EVENT, load);
    return () => { window.removeEventListener(EVENT, load); window.removeEventListener(ACTIVE_SPACE_EVENT, load); };
  }, [load]);
  return d;
}
