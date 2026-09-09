/* Contenu associé à chaque émotion : ce qui se passe, et ce qui peut aider.
   Aucune injonction : ce sont des propositions, jamais des consignes. */

import type { Emotion } from "./legato-state";

export type EmotionPath = { label: string; hint: string; to: string; minutes?: number };

export type EmotionContent = {
  /** Une phrase qui nomme ce qui se passe, sans expliquer ni consoler de force. */
  note: string;
  /** Ce qui peut aider — 3 pistes maximum, de la plus courte à la plus longue. */
  paths: EmotionPath[];
};

export const EMOTION_CONTENT: Record<Emotion, EmotionContent> = {
  tristesse: {
    note: "La tristesse n'a pas besoin d'être réparée. Elle demande de la place.",
    paths: [
      { label: "Écrire quelques lignes", hint: "Sans relire, sans juger", to: "/care/journal", minutes: 5 },
      { label: "Revenir au jardin", hint: "Photos, voix, souvenirs", to: "/care/garden", minutes: 10 },
      { label: "Un son sans mots", hint: "Rien à comprendre", to: "/no-words", minutes: 3 },
    ],
  },
  colere: {
    note: "La colère du deuil est une force. Elle cherche où se poser.",
    paths: [
      { label: "Écrire à ce qui brûle", hint: "Laisser sortir, sans filtrer", to: "/care/journal", minutes: 6 },
      { label: "Cinq minutes dehors", hint: "Le corps décharge avant la tête", to: "/help/corps/soin/marche-5", minutes: 5 },
      { label: "Lire d'autres colères", hint: "Vous n'êtes pas seul·e à la ressentir", to: "/care/community", minutes: 8 },
    ],
  },
  peur: {
    note: "La peur monte souvent la nuit, ou quand tout se calme.",
    paths: [
      { label: "Respirer 4·6", hint: "L'expiration ralentit le cœur", to: "/care/respirer", minutes: 3 },
      { label: "Nommer ce qui fait peur", hint: "Écrit, cela rétrécit", to: "/care/journal", minutes: 5 },
      { label: "Parler à quelqu'un", hint: "Une présence humaine", to: "/crisis", minutes: 1 },
    ],
  },
  anxiete: {
    note: "L'anxiété cherche à tout prévoir d'un coup. Une seule chose suffit.",
    paths: [
      { label: "Respirer 4·6", hint: "Trois minutes guidées", to: "/care/respirer", minutes: 3 },
      { label: "Une seule démarche", hint: "La plus petite d'abord", to: "/practical/tasks", minutes: 10 },
      { label: "Relâcher le corps", hint: "Mâchoire, épaules, mains", to: "/help/corps/soin/scan-corps", minutes: 6 },
    ],
  },
  sideration: {
    note: "Quand tout est blanc, rien n'est à décider aujourd'hui.",
    paths: [
      { label: "Rester un instant", hint: "Sans rien devoir", to: "/presence", minutes: 5 },
      { label: "Un verre d'eau", hint: "Le plus petit geste", to: "/help/corps/soin/eau-verre", minutes: 1 },
      { label: "Prévenir un proche", hint: "Quelqu'un peut porter la suite", to: "/circle", minutes: 2 },
    ],
  },
  culpabilite: {
    note: "La culpabilité relit le passé avec ce qu'on sait aujourd'hui. C'est injuste.",
    paths: [
      { label: "Écrire ce poids", hint: "Ce qui n'a pas pu être dit", to: "/care/journal", minutes: 8 },
      { label: "Une lettre confiée", hint: "Un rituel pour déposer", to: "/care/rituels", minutes: 15 },
      { label: "En parler à un·e professionnel·le", hint: "Formé·e au deuil", to: "/practical/pros", minutes: 5 },
    ],
  },
  solitude: {
    note: "L'entourage se retire souvent après quelques semaines. Ce n'est pas votre faute.",
    paths: [
      { label: "Rejoindre la communauté", hint: "D'autres traversent aussi", to: "/care/community", minutes: 10 },
      { label: "Écrire à quelqu'un du cercle", hint: "Un message suffit", to: "/circle", minutes: 3 },
      { label: "Groupes de parole", hint: "Près de chez vous", to: "/practical/pros", minutes: 5 },
    ],
  },
  fatigue: {
    note: "Le chagrin consomme autant qu'un travail. La fatigue est logique.",
    paths: [
      { label: "Sieste courte", hint: "Dix minutes, même sans dormir", to: "/help/corps/soin/sieste-10", minutes: 10 },
      { label: "Manger simple", hint: "Une bouchée facile", to: "/help/corps/manger", minutes: 5 },
      { label: "Alléger la journée", hint: "Reporter ce qui peut l'être", to: "/agenda", minutes: 5 },
    ],
  },
  confusion: {
    note: "La mémoire et l'attention flanchent. C'est un effet connu du deuil.",
    paths: [
      { label: "Une seule chose à la fois", hint: "La prochaine étape, rien d'autre", to: "/practical/tasks", minutes: 10 },
      { label: "Poser ce qui tourne", hint: "Écrire vide la tête", to: "/care/journal", minutes: 5 },
      { label: "Relâcher le corps", hint: "Avant de reprendre", to: "/help/corps/soin/scan-corps", minutes: 6 },
    ],
  },
  nostalgie: {
    note: "Se souvenir n'est pas reculer. C'est une manière de continuer.",
    paths: [
      { label: "Déposer un souvenir", hint: "Photo, voix, objet", to: "/care/garden", minutes: 10 },
      { label: "Un rituel court", hint: "Une bougie, un nom prononcé", to: "/care/rituels", minutes: 2 },
      { label: "Écrire une lettre", hint: "Lui dire ce qui vient", to: "/care/journal", minutes: 10 },
    ],
  },
  soulagement: {
    note: "Le soulagement après une longue maladie n'annule pas l'amour.",
    paths: [
      { label: "Écrire ce qui s'est dénoué", hint: "Sans se justifier", to: "/care/journal", minutes: 6 },
      { label: "Lire des témoignages", hint: "Beaucoup le ressentent", to: "/care/community", minutes: 8 },
    ],
  },
  vide: {
    note: "Le vide n'est pas l'absence de sentiment. C'est une saturation.",
    paths: [
      { label: "Un son sans mots", hint: "Rien à comprendre", to: "/no-words", minutes: 5 },
      { label: "Cinq minutes dehors", hint: "La lumière compte", to: "/help/corps/soin/marche-5", minutes: 5 },
      { label: "Rester avec Présence", hint: "Sans rien devoir", to: "/presence", minutes: 5 },
    ],
  },
  besoin_calme: {
    note: "Chercher le calme est déjà un soin.",
    paths: [
      { label: "Respirer au calme", hint: "Trois minutes", to: "/care/respirer", minutes: 3 },
      { label: "Méditation guidée", hint: "Pensée pour les jours de chagrin", to: "/help/corps/soin/meditation-presence", minutes: 7 },
      { label: "Un son sans mots", hint: "Une nappe lente", to: "/no-words", minutes: 5 },
    ],
  },
  besoin_aide: {
    note: "Demander de l'aide maintenant est la bonne décision.",
    paths: [
      { label: "Parler à quelqu'un maintenant", hint: "Écoute humaine, 24 h/24", to: "/crisis", minutes: 1 },
      { label: "Mon cercle", hint: "Prévenir un proche", to: "/circle", minutes: 2 },
      { label: "Trouver un·e professionnel·le", hint: "Psychologue, association", to: "/practical/pros", minutes: 5 },
    ],
  },
};

/** Repères de langage pour l'intensité (1 → 10). */
export function intensityWords(v: number): string {
  if (v <= 2) return "En arrière-plan";
  if (v <= 4) return "Présent, supportable";
  if (v <= 6) return "Ça pèse";
  if (v <= 8) return "Très fort";
  return "Ça déborde";
}

/** Au-delà de ce seuil, on propose systématiquement une présence humaine. */
export const CRISIS_THRESHOLD = 9;
