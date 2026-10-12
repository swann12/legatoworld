/* Parcours d'ouverture (écrans 006 → 010) : petites données partagées
   entre les routes /onboarding, /onboarding/practical et /onboarding/care. */

export type ForWhom = "personne" | "animal" | "malade" | "moi";
export type Need = "tenir" | "demarches" | "parler" | "memoire";
export type PapersState = "rien" | "obseques" | "presque" | "delegue";

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

/** Les démarches n'ont de sens que pour une personne décédée. */
export const showsPapers = (w: ForWhom | null) => w === "personne" || w === null;
/** L'écran « Son prénom » ne concerne pas « Moi ». */
export const showsName = (w: ForWhom | null) => w !== "moi";

export const TOTAL_STEPS = 4;
