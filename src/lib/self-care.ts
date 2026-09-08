/* Soin de soi — état du corps, activités réelles, et « figure » sensible qui évolue.
   Aucune injonction : ne rien faire n'a aucune conséquence négative. */

export type BodyAnswers = { energy?: string; sleep?: string; food?: string; tension?: string };

export type Activity = {
  id: string;
  title: string;
  kind: "respiration" | "repos" | "méditation" | "corps" | "geste";
  minutes: number;
  intro: string;
  steps: { text: string; seconds: number }[];
  closing: string;
};

export const ACTIVITIES: Activity[] = [
  {
    id: "souffle-46",
    title: "Respiration 4·6",
    kind: "respiration",
    minutes: 3,
    intro: "Inspirer un peu moins longtemps qu'on expire suffit à ralentir le cœur.",
    steps: [
      { text: "Posez les deux pieds au sol. Laissez les épaules descendre.", seconds: 20 },
      { text: "Inspirez par le nez en comptant jusqu'à 4.", seconds: 30 },
      { text: "Expirez lentement par la bouche en comptant jusqu'à 6.", seconds: 40 },
      { text: "Continuez à votre rythme. Rien à réussir.", seconds: 60 },
      { text: "Laissez le souffle reprendre seul.", seconds: 30 },
    ],
    closing: "Le corps a ralenti un peu. C'est déjà quelque chose.",
  },
  {
    id: "sieste-10",
    title: "Sieste courte",
    kind: "repos",
    minutes: 10,
    intro: "Dix minutes allongé·e, même sans dormir, reposent réellement le système nerveux.",
    steps: [
      { text: "Allongez-vous, couvrez-vous, laissez la lumière basse.", seconds: 40 },
      { text: "Fermez les yeux. Vous n'avez pas besoin de dormir.", seconds: 60 },
      { text: "Laissez le corps peser sur le support.", seconds: 120 },
      { text: "Restez là, sans rien attendre.", seconds: 180 },
      { text: "Bougez les doigts, puis les pieds, avant de vous relever.", seconds: 40 },
    ],
    closing: "Relevez-vous doucement, sans vous presser.",
  },
  {
    id: "scan-corps",
    title: "Relâcher le corps",
    kind: "corps",
    minutes: 6,
    intro: "Un parcours simple, du haut vers le bas, pour desserrer ce qui s'est tendu.",
    steps: [
      { text: "Desserrez la mâchoire. Laissez la langue retomber.", seconds: 30 },
      { text: "Relâchez le front, les paupières, les tempes.", seconds: 30 },
      { text: "Laissez les épaules descendre de deux centimètres.", seconds: 40 },
      { text: "Ouvrez les mains. Laissez les doigts se dérouler.", seconds: 40 },
      { text: "Sentez le ventre monter et descendre.", seconds: 60 },
      { text: "Laissez le poids passer dans les jambes, jusqu'aux pieds.", seconds: 60 },
    ],
    closing: "Quelque chose s'est desserré. Vous pouvez y revenir quand vous voulez.",
  },
  {
    id: "meditation-presence",
    title: "Méditation guidée",
    kind: "méditation",
    minutes: 7,
    intro: "Une méditation d'attention simple, pensée pour les jours de chagrin.",
    steps: [
      { text: "Asseyez-vous. Les mains posées, la nuque libre.", seconds: 30 },
      { text: "Écoutez trois sons autour de vous, sans les nommer.", seconds: 60 },
      { text: "Revenez à la respiration. Elle se fait toute seule.", seconds: 90 },
      { text: "Si une pensée arrive, laissez-la passer comme un train.", seconds: 90 },
      { text: "Si le chagrin monte, ne le repoussez pas. Faites-lui de la place.", seconds: 90 },
      { text: "Revenez au corps assis, au contact du siège.", seconds: 60 },
    ],
    closing: "Vous êtes revenu·e. Rien d'autre n'est demandé.",
  },
  {
    id: "eau-verre",
    title: "Un verre d'eau",
    kind: "geste",
    minutes: 1,
    intro: "Le plus petit geste possible, et souvent le plus manquant.",
    steps: [
      { text: "Levez-vous, remplissez un verre.", seconds: 30 },
      { text: "Buvez lentement, en entier.", seconds: 40 },
    ],
    closing: "Voilà. C'est fait.",
  },
  {
    id: "manger-simple",
    title: "Manger quelque chose de simple",
    kind: "geste",
    minutes: 5,
    intro: "Pas un repas. Une bouchée facile, qui n'exige rien.",
    steps: [
      { text: "Choisissez ce qui demande le moins : pain, yaourt, fruit, soupe.", seconds: 40 },
      { text: "Asseyez-vous, même deux minutes.", seconds: 40 },
      { text: "Mangez la moitié. Si vous vous arrêtez là, c'est très bien.", seconds: 120 },
    ],
    closing: "Le corps a reçu quelque chose.",
  },
  {
    id: "marche-5",
    title: "Cinq minutes dehors",
    kind: "corps",
    minutes: 5,
    intro: "La lumière du jour aide le sommeil de la nuit suivante.",
    steps: [
      { text: "Sortez, même juste devant la porte.", seconds: 40 },
      { text: "Marchez lentement, sans but.", seconds: 120 },
      { text: "Regardez loin, au-delà de trois mètres.", seconds: 60 },
      { text: "Rentrez quand vous voulez.", seconds: 40 },
    ],
    closing: "L'air a changé quelque chose, même un peu.",
  },
  {
    id: "nuit-preparer",
    title: "Préparer la nuit",
    kind: "repos",
    minutes: 8,
    intro: "On ne décide pas de dormir. On peut préparer le terrain.",
    steps: [
      { text: "Baissez les lumières autour de vous.", seconds: 40 },
      { text: "Posez le téléphone loin du lit.", seconds: 40 },
      { text: "Écrivez en une ligne ce qui tourne dans la tête.", seconds: 90 },
      { text: "Allongez-vous. Expirez plus longtemps que vous n'inspirez.", seconds: 150 },
      { text: "Si le sommeil ne vient pas, ce n'est pas un échec.", seconds: 60 },
    ],
    closing: "La nuit fera ce qu'elle peut. Vous avez fait votre part.",
  },
];

export function activityById(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}

/** Propositions adaptées aux réponses — 1 à 3, jamais plus. */
export function activitiesFor(a: BodyAnswers): Activity[] {
  const out: string[] = [];
  if (a.energy === "agitee" || a.tension === "tendu") out.push("souffle-46", "scan-corps");
  if (a.sleep === "peu" || a.sleep === "coupe" || a.sleep === "endormir") out.push("nuit-preparer");
  if (a.energy === "vide") out.push("sieste-10", "eau-verre");
  if (a.food === "rien" || a.food === "oubli") out.push("manger-simple");
  if (a.energy === "lente") out.push("marche-5");
  if (a.tension === "ailleurs") out.push("meditation-presence");
  if (!out.length) out.push("souffle-46", "marche-5");
  const uniq = [...new Set(out)].slice(0, 3);
  return uniq.map((id) => activityById(id)!).filter(Boolean);
}

/* ─── Persistance ─── */

const KEY = "lg.selfcare.v1";

export type SelfCareState = {
  answers: BodyAnswers;
  answeredAt: string | null;
  /** ISO des soins terminés, les plus récents en dernier */
  done: { id: string; at: string }[];
};

const EMPTY: SelfCareState = { answers: {}, answeredAt: null, done: [] };

export function loadSelfCare(): SelfCareState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as SelfCareState) };
  } catch {
    return EMPTY;
  }
}

export function saveSelfCare(patch: Partial<SelfCareState>): SelfCareState {
  const next = { ...loadSelfCare(), ...patch };
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* indisponible */ }
  }
  return next;
}

export function recordDone(id: string): SelfCareState {
  const s = loadSelfCare();
  return saveSelfCare({ done: [...s.done, { id, at: new Date().toISOString() }].slice(-60) });
}

/** Vitalité de la figure : 0 → 1. Décroît doucement, jamais en dessous d'un socle. */
export function vitality(s: SelfCareState): number {
  const now = Date.now();
  const week = s.done.filter((d) => now - new Date(d.at).getTime() < 7 * 864e5);
  const recent = s.done.filter((d) => now - new Date(d.at).getTime() < 36 * 36e5);
  const base = 0.28;
  return Math.min(1, base + recent.length * 0.16 + Math.min(week.length, 6) * 0.06);
}

export function vitalityWords(v: number): string {
  if (v > 0.82) return "Elle respire largement.";
  if (v > 0.6) return "Elle s'est un peu ouverte.";
  if (v > 0.42) return "Elle tient.";
  return "Elle est là, repliée. C'est permis.";
}
