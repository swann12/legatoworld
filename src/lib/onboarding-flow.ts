/* Parcours d'ouverture (écrans 006 → 010) : petites données partagées
   entre les routes /onboarding, /onboarding/practical et /onboarding/care. */

export type ForWhom = "personne" | "animal" | "malade" | "moi";
export type Need = "tenir" | "demarches" | "parler" | "memoire" | "enfant" | "rdv" | "droits" | "aidants";
export type CareState = "hopital" | "maison" | "palliatif" | "incertain";
export type PapersState = "rien" | "obseques" | "presque" | "delegue";
import type { AnimalBodyState } from "./space-navigation";

const K = { forWhom: "lg.onb.forWhom", needs: "lg.onb.needs", papers: "lg.onb.papers", deathDate: "lg.onb.deathDate" };

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = window.localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write(key: string, v: unknown) {
  if (typeof window === "undefined") return;
  try { if (v === null || v === undefined) window.localStorage.removeItem(key); else window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* stockage indisponible */ }
}

export const getForWhom = () => read<ForWhom | null>(K.forWhom, null);
export const setForWhom = (v: ForWhom | null) => write(K.forWhom, v);
export const getNeeds = () => read<Need[]>(K.needs, []);
export const setNeeds = (v: Need[]) => write(K.needs, v);
export const getPapers = () => read<PapersState | null>(K.papers, null);
export const setPapers = (v: PapersState | null) => write(K.papers, v);
export const getDeathDate = () => read<string | null>(K.deathDate, null);
export const setDeathDate = (v: string | null) => write(K.deathDate, v || null);
export const getAnimalBodyState = () => read<AnimalBodyState | null>("lg.onb.animalBody", null);
export const setAnimalBodyState = (v: AnimalBodyState | null) => write("lg.onb.animalBody", v);

/** Les démarches n'ont de sens que pour une personne décédée. */
export const showsPapers = (w: ForWhom | null) => w === "personne" || w === "animal" || w === "malade" || w === null;
/** L'écran « Son prénom » ne concerne pas « Moi ». */
export const showsName = (w: ForWhom | null) => w !== "moi";

export const TOTAL_STEPS = 4;

/** Prénom de la personne qui s'occupe des démarches (réponse « Quelqu'un s'en occupe »). */
export const getPapersHelper = () => read<string>("lg.onb.papersHelper", "");
export const setPapersHelper = (v: string) => write("lg.onb.papersHelper", v.trim() || null);

/** Proche malade : où en est-elle (B044) et ce qui se passe (B043). */
export const getCareState = () => read<CareState | null>("lg.onb.careState", null);
export const setCareState = (v: CareState | null) => write("lg.onb.careState", v);
export const getIllnessNote = () => read<string>("lg.onb.illness", "");
export const setIllnessNote = (v: string) => write("lg.onb.illness", v.trim() || null);
export const CARE_STATE_SUMMARY: Record<CareState, string> = { hopital: "Soignée à l'hôpital", maison: "Soignée à la maison", palliatif: "En soins palliatifs", incertain: "À préciser ensemble" };
