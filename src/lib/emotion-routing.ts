import type { Emotion } from "./legato-state";

export type EmotionPlan = {
  tone: "doux" | "sobre" | "tendre" | "alerte";
  contentLength: "court" | "moyen";
  primary: { label: string; to: string; hint?: string };
  secondary: { label: string; to: string }[];
  hideHeavyTasks: boolean;
  showCrisis: boolean;
};

const PRIORITY: Emotion[] = [
  "besoin_aide", "peur", "anxiete", "culpabilite", "sideration", "colere",
  "solitude", "tristesse", "fatigue", "vide", "nostalgie",
  "confusion", "soulagement", "besoin_calme",
];

function pick(emotions: Emotion[]): Emotion | null {
  for (const p of PRIORITY) if (emotions.includes(p)) return p;
  return emotions[0] ?? null;
}

export function emotionPlan(emotions: Emotion[]): EmotionPlan {
  const e = pick(emotions);
  switch (e) {
    case "besoin_aide":
      return {
        tone: "alerte", contentLength: "court", showCrisis: true, hideHeavyTasks: true,
        primary: { label: "Parler à quelqu'un maintenant", to: "/crisis", hint: "Aide humaine disponible" },
        secondary: [{ label: "Mon cercle", to: "/_authenticated/circle" }, { label: "Thérapeutes", to: "/care/help" }],
      };
    case "peur":
    case "anxiete":
      return {
        tone: "doux", contentLength: "court", showCrisis: true, hideHeavyTasks: true,
      primary: { label: "Respirer une minute", to: "/no-words?tab=respirer", hint: "Souffle court, ancrage" },
        secondary: [{ label: "Écrire ce qui presse", to: "/care/journal" }, { label: "Si ça déborde", to: "/crisis" }],
      };
    case "culpabilite":
      return {
        tone: "tendre", contentLength: "moyen", showCrisis: false, hideHeavyTasks: false,
        primary: { label: "Écrire ce poids", to: "/care/journal", hint: "Sans relire, sans juger" },
        secondary: [{ label: "Lire un témoignage", to: "/care/resources" }, { label: "Trouver un·e thérapeute", to: "/care/help" }],
      };
    case "sideration":
      return {
        tone: "sobre", contentLength: "court", showCrisis: true, hideHeavyTasks: true,
        primary: { label: "Rester un instant", to: "/presence", hint: "Sans rien devoir" },
        secondary: [{ label: "Appeler un proche", to: "/_authenticated/circle" }],
      };
    case "colere":
      return {
        tone: "sobre", contentLength: "moyen", showCrisis: false, hideHeavyTasks: false,
        primary: { label: "Écrire à ce qui brûle", to: "/care/journal", hint: "Laisser sortir, sans filtrer" },
        secondary: [{ label: "Respirer", to: "/no-words" }],
      };
    case "solitude":
      return {
        tone: "tendre", contentLength: "moyen", showCrisis: false, hideHeavyTasks: false,
        primary: { label: "Rejoindre la communauté", to: "/care/community", hint: "D'autres traversent aussi" },
        secondary: [{ label: "Mon cercle", to: "/_authenticated/circle" }, { label: "Témoignages", to: "/care/resources" }],
      };
    case "fatigue":
      return {
        tone: "doux", contentLength: "court", showCrisis: false, hideHeavyTasks: true,
        primary: { label: "Se poser, respirer", to: "/no-words?tab=respirer", hint: "Rien à faire" },
        secondary: [{ label: "Une seule petite étape", to: "/practical" }],
      };
    case "nostalgie":
      return {
        tone: "tendre", contentLength: "moyen", showCrisis: false, hideHeavyTasks: false,
        primary: { label: "Revenir au jardin", to: "/care/garden", hint: "Voix, photos, souvenirs" },
        secondary: [{ label: "Écrire une lettre", to: "/care/journal" }],
      };
    case "tristesse":
      return {
        tone: "doux", contentLength: "moyen", showCrisis: false, hideHeavyTasks: false,
        primary: { label: "Déposer dans le journal", to: "/care/journal" },
        secondary: [{ label: "Audio doux", to: "/no-words" }, { label: "Garder un souvenir", to: "/care/memory" }],
      };
    case "vide":
      return {
        tone: "sobre", contentLength: "court", showCrisis: false, hideHeavyTasks: true,
        primary: { label: "Sons sans mots", to: "/no-words" },
        secondary: [{ label: "Mon cercle", to: "/_authenticated/circle" }],
      };
    case "soulagement":
      return {
        tone: "tendre", contentLength: "moyen", showCrisis: false, hideHeavyTasks: false,
        primary: { label: "Réfléchir un instant", to: "/care/journal", hint: "Ce qui s'est dénoué" },
        secondary: [],
      };
    case "confusion":
      return {
        tone: "doux", contentLength: "court", showCrisis: false, hideHeavyTasks: true,
        primary: { label: "Une seule chose à la fois", to: "/practical" },
        secondary: [{ label: "Respirer", to: "/no-words" }],
      };
    case "besoin_calme":
      return {
        tone: "sobre", contentLength: "moyen", showCrisis: false, hideHeavyTasks: false,
        primary: { label: "Respirer au calme", to: "/no-words?tab=respirer" },
        secondary: [{ label: "Mémoire", to: "/care/memory" }],
      };
    default:
      return {
        tone: "sobre", contentLength: "moyen", showCrisis: false, hideHeavyTasks: false,
        primary: { label: "Faire un check-in", to: "/care/emotions" },
        secondary: [],
      };
  }
}

/** Mode nuit auto entre 21h et 6h. */
export function isNightHour(d = new Date()): boolean {
  const h = d.getHours();
  return h >= 21 || h < 6;
}

/** Émotion expirée après 4h → re-check-in proposé. */
export function isEmotionStale(iso: string | null): boolean {
  if (!iso) return true;
  const d = new Date(iso).getTime();
  return Date.now() - d > 4 * 60 * 60 * 1000;
}