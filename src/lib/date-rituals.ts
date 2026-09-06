import type { UpcomingDate } from "./spaces-store";

/* Rituels proposés pour une date sensible — gestes courts, jamais imposés. */

export type DateRitual = {
  id: string;
  title: string;
  body: string;
  cta: string;
  to: "/care/garden" | "/care/journal" | "/care/rituels" | "/presence" | "/care/respirer";
};

const LETTRE: DateRitual = {
  id: "lettre",
  title: "Écrire une lettre",
  body: "Quelques lignes, adressées à cette personne. Personne d'autre ne les lira.",
  cta: "Ouvrir la lettre",
  to: "/care/journal",
};
const BOUGIE: DateRitual = {
  id: "bougie",
  title: "Allumer une bougie",
  body: "Un geste de cinq minutes pour marquer le jour, seul·e ou à plusieurs.",
  cta: "Voir les rituels",
  to: "/care/rituels",
};
const DEPOSER: DateRitual = {
  id: "deposer",
  title: "Déposer un souvenir",
  body: "Une photo, une voix, une phrase — dans sa parcelle du jardin.",
  cta: "Ouvrir le jardin",
  to: "/care/garden",
};
const PARLER: DateRitual = {
  id: "parler",
  title: "Parler à quelqu'un",
  body: "Une oreille disponible, sans jugement, à toute heure.",
  cta: "Ouvrir Présence",
  to: "/presence",
};
const SOUFFLE: DateRitual = {
  id: "souffle",
  title: "Respirer deux minutes",
  body: "Si la journée serre la poitrine, commencer par là.",
  cta: "Respirer",
  to: "/care/respirer",
};

export function ritualsForDate(d: Pick<UpcomingDate, "kind" | "daysAway">): DateRitual[] {
  if (d.kind === "birthday") return [DEPOSER, BOUGIE, LETTRE];
  if (d.kind === "death") return [BOUGIE, LETTRE, d.daysAway <= 1 ? PARLER : DEPOSER];
  return [LETTRE, SOUFFLE, PARLER];
}
