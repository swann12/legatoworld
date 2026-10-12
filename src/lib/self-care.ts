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
  /** Écran 054 : retour vers la page d'origine. */
  from?: { to: string; label: string };
  /** Écran 054 : chaque étape en deux lignes (droite / italique) + phrase douce. */
  lines?: { a: string; b: string; sub?: string }[];
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

const G = (id: string, title: string, minutes: number, from: { to: string; label: string }, lines: { a: string; b: string; sub?: string }[], closing: string): Activity => ({
  id, title, kind: "geste", minutes, intro: "", from, lines, closing,
  steps: lines.map((l) => ({ text: `${l.a} ${l.b}`, seconds: 60 })),
});
const NUITS = { to: "/help/corps/nuits", label: "Dormir" };
const MANGER = { to: "/help/corps/manger", label: "Manger" };
const EAU = { to: "/help/corps/eau", label: "Se laver" };
const HABILLER = { to: "/help/corps/habiller", label: "S'habiller" };
const SOIN = { to: "/help/corps/soin", label: "Un moment de soin" };
const WAIT = "Prenez le temps qu'il faut.";

ACTIVITIES.push(
  G("nuits", "Préparer la nuit", 8, NUITS, [
    { a: "Posez le téléphone", b: "loin du lit.", sub: WAIT },
    { a: "Éteignez les écrans,", b: "baissez la lumière.", sub: WAIT },
    { a: "Allongez-vous,", b: "laissez le corps peser.", sub: WAIT },
    { a: "Expirez plus longtemps", b: "que vous n'inspirez.", sub: "Le sommeil viendra, ou pas. Ce n'est pas un échec." },
  ], "La nuit fera ce qu'elle peut."),
  G("manger", "Manger un peu", 5, MANGER, [
    { a: "Choisissez une chose", b: "qui ne demande rien.", sub: "Une soupe, un yaourt, une banane." },
    { a: "Asseyez-vous,", b: "même deux minutes.", sub: WAIT },
    { a: "Mangez lentement,", b: "quelques bouchées.", sub: WAIT },
    { a: "Si vous vous arrêtez là,", b: "c'est très bien.", sub: "Le corps a reçu quelque chose." },
  ], "Le corps a reçu quelque chose."),
  G("eau", "Un geste d'eau", 3, EAU, [
    { a: "Faites couler", b: "de l'eau tiède.", sub: WAIT },
    { a: "Passez-la sur le visage", b: "et sur les mains.", sub: WAIT },
    { a: "Séchez-vous", b: "avec une serviette douce.", sub: WAIT },
    { a: "C'est déjà", b: "prendre soin de vous.", sub: "Une douche pourra venir plus tard." },
  ], "C'est déjà prendre soin de vous."),
  G("habiller", "S'habiller simplement", 5, HABILLER, [
    { a: "Prenez le vêtement", b: "le plus confortable.", sub: WAIT },
    { a: "Enfilez-le", b: "sans vous presser.", sub: WAIT },
    { a: "Mettez un manteau,", b: "même sur le pyjama.", sub: WAIT },
    { a: "Sortez cinq minutes,", b: "juste devant la porte.", sub: "Rentrez quand vous voulez." },
  ], "Vous êtes sorti·e un moment."),
  G("mains", "Les mains", 3, SOIN, [
    { a: "Prenez un peu", b: "de crème dans la paume.", sub: WAIT },
    { a: "Frottez doucement", b: "le dos des mains.", sub: WAIT },
    { a: "Massez chaque doigt,", b: "lentement.", sub: WAIT },
    { a: "Posez les mains", b: "sur vos genoux.", sub: "Sentez la chaleur qui reste." },
  ], "Vos mains ont reçu un peu de soin."),
  G("visage", "Le visage", 3, SOIN, [
    { a: "Faites couler", b: "de l'eau tiède.", sub: WAIT },
    { a: "Mouillez une serviette,", b: "essorez-la.", sub: WAIT },
    { a: "Posez-la sur le visage,", b: "les yeux fermés.", sub: "Respirez sous la chaleur." },
    { a: "Retirez-la", b: "doucement.", sub: WAIT },
  ], "Le visage est un peu plus doux."),
  G("epaules", "Les épaules", 4, SOIN, [
    { a: "Montez les épaules", b: "vers les oreilles.", sub: "Gardez trois secondes." },
    { a: "Laissez-les", b: "retomber d'un coup.", sub: WAIT },
    { a: "Faites rouler les épaules", b: "vers l'arrière.", sub: "Cinq fois, lentement." },
    { a: "Laissez les bras", b: "peser le long du corps.", sub: WAIT },
  ], "Quelque chose s'est desserré."),
);

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
