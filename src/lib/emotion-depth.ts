/* Deuxième niveau du check-in : ce qui permet d'affiner réellement les propositions.
   Rien ici n'est une injonction — ce sont des repères et des propositions concrètes. */

import type { Emotion } from "./legato-state";

/* ── Ce qui se passe, pour chaque état. Un vrai contenu, pas un conseil jeté. ── */
export const MECHANISM: Record<Emotion, string> = {
  tristesse:
    "La tristesse du deuil arrive par vagues : quelques minutes très intenses, puis un reflux. Elle n'est pas continue, même quand on a l'impression qu'elle ne partira jamais. Laisser passer la vague, sans lutter, l'écourte le plus souvent.",
  colere:
    "La colère est une réaction courante et normale du deuil. Elle vise souvent une cible injuste — un soignant, un proche, soi-même — parce qu'elle a besoin d'un endroit où se poser. La décharger dans le corps ou sur le papier évite qu'elle abîme les liens.",
  peur:
    "Après un décès, le sentiment de sécurité s'effondre. Le corps reste en alerte : cœur rapide, souffle court, sursauts. Ce n'est pas de l'imagination, c'est un système nerveux qui n'a pas encore compris que le danger immédiat est passé.",
  anxiete:
    "L'anxiété tente de tout anticiper à la fois : démarches, avenir, argent, autres proches. La tête accélère parce qu'elle cherche à reprendre le contrôle. Réduire le champ à une seule chose la fait redescendre plus sûrement que de tout planifier.",
  sideration:
    "La sidération est une protection : l'esprit met à distance ce qu'il ne peut pas encore recevoir. On se sent irréel, anesthésié, spectateur. Rien d'important ne devrait se décider dans cet état.",
  culpabilite:
    "La culpabilité relit le passé avec ce qu'on sait aujourd'hui — une information qu'on n'avait pas sur le moment. Elle donne l'illusion d'un contrôle qu'on n'a jamais eu. La formuler à voix haute ou par écrit lui enlève une grande part de sa force.",
  solitude:
    "L'entourage se retire souvent après quelques semaines, quand le deuil, lui, commence à peine. Ce décalage est presque systématique. Il ne dit rien de votre valeur ni de la qualité de vos liens.",
  fatigue:
    "Le chagrin consomme autant d'énergie qu'un travail à temps plein : sommeil fragmenté, vigilance permanente, digestion perturbée. La fatigue du deuil ne se répare pas par la volonté, seulement par du repos accordé sans culpabilité.",
  confusion:
    "Mémoire, attention et sens de l'orientation flanchent — c'est un effet documenté du deuil, transitoire. Écrire ce qui doit être retenu vaut mieux que d'essayer de s'en souvenir.",
  nostalgie:
    "Se souvenir n'est pas reculer. Les souvenirs, même douloureux, sont ce qui maintient le lien vivant. Ils s'adoucissent quand on leur donne une place choisie plutôt qu'un surgissement subi.",
  soulagement:
    "Le soulagement après une longue maladie est fréquent et n'annule pas l'amour. Il dit la fin d'une souffrance — celle de la personne, et la vôtre en tant qu'accompagnant. Il n'a pas à être caché.",
  vide:
    "Le vide n'est pas l'absence d'émotion : c'est une saturation. Le système a tellement reçu qu'il coupe le son. Des sensations simples — chaud, froid, texture, lumière — le remettent en route mieux que les mots.",
  besoin_calme:
    "Chercher le calme est déjà un soin. Le corps sait redescendre : l'expiration longue est le seul levier volontaire dont vous disposez sur le système nerveux.",
  besoin_aide:
    "Demander de l'aide maintenant est la bonne décision, et c'est un geste de lucidité, pas de faiblesse. Une présence humaine change réellement l'intensité d'un moment.",
};

/* ── Depuis quand ── */
export type Duration = "today" | "days" | "weeks" | "months";
export const DURATIONS: { id: Duration; label: string }[] = [
  { id: "today", label: "Aujourd'hui" },
  { id: "days", label: "Quelques jours" },
  { id: "weeks", label: "Des semaines" },
  { id: "months", label: "Des mois" },
];
export const DURATION_NOTE: Record<Duration, string> = {
  today: "Un jour difficile n'annonce rien. Prenez le plus petit geste possible.",
  days: "Plusieurs jours de suite : c'est le rythme habituel du deuil, par vagues.",
  weeks:
    "Sur plusieurs semaines, en parler à quelqu'un de formé aide souvent plus que d'attendre. Ce n'est pas un échec.",
  months:
    "Quand cela dure des mois sans répit, un accompagnement professionnel est indiqué. Beaucoup de deuils s'apaisent nettement avec un soutien.",
};

/* ── Quand c'est le plus fort ── */
export type Moment = "matin" | "journee" | "soir" | "nuit";
export const MOMENTS: { id: Moment; label: string }[] = [
  { id: "matin", label: "Le matin" },
  { id: "journee", label: "En journée" },
  { id: "soir", label: "Le soir" },
  { id: "nuit", label: "La nuit" },
];
export const MOMENT_NOTE: Record<Moment, string> = {
  matin:
    "Le réveil est souvent le pire moment : la nouvelle se réapprend chaque jour. Un geste prévu à l'avance évite d'avoir à décider.",
  journee:
    "En journée, ce sont les déclencheurs qui frappent : un lieu, une voix, une odeur. Rien à corriger, seulement à traverser.",
  soir:
    "Le soir, la maison se tait et tout revient. Un rituel court fait une frontière entre la journée et la nuit.",
  nuit:
    "La nuit, la pensée tourne sans issue. L'objectif n'est pas de dormir, mais de passer les heures sans lutter.",
};
export const MOMENT_PATH: Record<Moment, { label: string; detail: string; to: string; minutes: number }> = {
  matin: {
    label: "Un premier geste au réveil",
    detail: "Boire un verre d'eau, ouvrir en grand, s'asseoir cinq minutes. Rien de plus n'est demandé avant midi.",
    to: "/help/corps/eau",
    minutes: 5,
  },
  journee: {
    label: "Cinq minutes dehors",
    detail: "La lumière du jour et la marche font redescendre la tension mieux que la réflexion.",
    to: "/help/corps/soin/marche-5",
    minutes: 5,
  },
  soir: {
    label: "Un rituel court avant la nuit",
    detail: "Une bougie, un nom prononcé, une phrase écrite : une frontière nette avant le coucher.",
    to: "/care/rituels",
    minutes: 10,
  },
  nuit: {
    label: "Traverser la nuit",
    detail: "Ce que d'autres ont fait à trois heures du matin, quand se rendormir n'était pas possible.",
    to: "/help/corps/nuits",
    minutes: 10,
  },
};

/* ── Ce que ça fait au corps ── */
export type BodySignal = "sommeil" | "appetit" | "poitrine" | "agitation" | "epuisement" | "larmes";
export const BODY_SIGNALS: { id: BodySignal; label: string }[] = [
  { id: "sommeil", label: "Je dors mal" },
  { id: "appetit", label: "Je ne mange plus vraiment" },
  { id: "poitrine", label: "La poitrine est serrée" },
  { id: "agitation", label: "Je ne tiens pas en place" },
  { id: "epuisement", label: "Je suis épuisé·e" },
  { id: "larmes", label: "Les larmes viennent sans prévenir" },
];
export const BODY_PATH: Record<BodySignal, { label: string; detail: string; to: string; minutes: number }> = {
  sommeil: {
    label: "Préparer la nuit",
    detail: "Un souffle ralenti, expiration deux fois plus longue que l'inspiration, allongé·e, lumière basse.",
    to: "/care/respirer",
    minutes: 6,
  },
  appetit: {
    label: "Manger sans cuisiner",
    detail: "Des propositions tenables quand rien ne passe : quelques bouchées froides, sucrées, sans préparation.",
    to: "/help/corps/manger",
    minutes: 5,
  },
  poitrine: {
    label: "Desserrer la poitrine",
    detail: "Respiration 4·6 guidée : c'est l'expiration longue qui fait baisser le rythme cardiaque.",
    to: "/care/respirer",
    minutes: 3,
  },
  agitation: {
    label: "Décharger le trop-plein",
    detail: "Marcher cinq minutes sans but. Le corps évacue ce que la tête n'arrive pas à formuler.",
    to: "/help/corps/soin/marche-5",
    minutes: 5,
  },
  epuisement: {
    label: "Un repos autorisé",
    detail: "Dix minutes allongé·e, sans obligation de dormir. Le repos sans sommeil compte aussi.",
    to: "/help/corps/soin/sieste-10",
    minutes: 10,
  },
  larmes: {
    label: "Rester avec, sans lutter",
    detail: "Un espace sans mots ni consigne. Les vagues durent rarement plus de quelques minutes.",
    to: "/presence",
    minutes: 5,
  },
};

/* ── Ce que chaque proposition contient concrètement. ── */
export const PATH_DETAIL: Record<string, string> = {
  "/care/respirer": "Trois rythmes guidés au choix, avec un cercle qui donne la cadence. Aucune consigne à retenir.",
  "/care/journal": "Une page vide, jamais relue par personne. Écrire dix lignes suffit à faire baisser la charge.",
  "/care/garden": "Photos, voix, objets, dates : l'endroit où le lien reste vivant, quand vous le décidez.",
  "/no-words": "Des sons longs, sans parole ni mélodie à suivre. À écouter les yeux fermés.",
  "/care/community": "Des récits d'autres personnes en deuil, sur le même sujet que ce que vous vivez.",
  "/care/rituels": "Des gestes courts et concrets à faire seul·e ou à plusieurs, avec un déroulé pas à pas.",
  "/practical/pros": "Psychologues, associations et groupes de parole, avec ce qu'ils font et quand les appeler.",
  "/practical/tasks": "Les démarches triées par urgence réelle : une seule à ouvrir, jamais toute la liste.",
  "/circle": "Prévenir un proche en un message, ou lui confier une démarche précise à porter.",
  "/crisis": "Des lignes d'écoute joignables immédiatement, jour et nuit, sans rendez-vous.",
  "/presence": "Un espace sans contenu ni consigne, seulement pour rester un moment.",
  "/agenda": "Voir la semaine, alléger ce qui peut l'être, déplacer ce qui n'est pas urgent.",
  "/help/corps/manger": "Des idées tenables quand rien ne passe, sans cuisine ni courses.",
  "/help/corps/nuits": "Ce que d'autres ont fait pendant les nuits blanches, à essayer sans effort.",
  "/help/corps/eau": "Un pas à pas très lent pour retrouver l'eau, quand se laver est devenu difficile.",
  "/help/corps/soin/marche-5": "Cinq minutes de marche guidées, dehors ou dans le couloir.",
  "/help/corps/soin/scan-corps": "Un relâchement guidé, de la mâchoire aux mains, en six minutes.",
  "/help/corps/soin/sieste-10": "Dix minutes allongé·e, guidées, sans obligation de s'endormir.",
  "/help/corps/soin/eau-verre": "Le plus petit geste possible : boire lentement un verre d'eau, guidé.",
  "/help/corps/soin/meditation-presence": "Une méditation pensée pour les jours de chagrin, sans injonction au bien-être.",
};
