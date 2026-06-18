import type { Situation, PrimaryNeed, Stage } from "./legato-state";

export type CareModule =
  | "checkin" | "journal" | "breathe" | "sleep" | "meditations"
  | "sounds" | "letters" | "community" | "therapists" | "crisis"
  | "anticipated" | "caregiver" | "supporting";

export type PracticalCategory =
  | "first" | "obseques" | "ceremony" | "flowers" | "documents"
  | "letters" | "succession" | "finances" | "rights"
  | "digital" | "housing" | "pros" | "wishes" | "vault";

export type MemoryModule = "garden" | "timeline" | "voices" | "letters" | "dates";

export type JourneyModules = {
  home: ("checkin" | "task" | "memory" | "support" | "wishes")[];
  care: CareModule[];
  practical: PracticalCategory[];
  memory: MemoryModule[];
};

export function journeyModules(
  situation: Situation | null,
  primaryNeed: PrimaryNeed | null,
  stage: Stage | null,
): JourneyModules {
  const baseCare: CareModule[] = ["checkin", "journal", "breathe", "sleep", "meditations", "sounds", "community", "therapists", "crisis"];

  switch (situation) {
    case "peur":
      return {
        home: ["checkin", "memory", "support"],
        care: ["checkin", "breathe", "journal", "anticipated", "letters", "community", "therapists", "crisis"],
        practical: ["wishes", "documents"],
        memory: ["voices", "letters", "timeline"],
      };
    case "accompagner":
      return {
        home: ["checkin", "task", "memory"],
        care: ["checkin", "caregiver", "breathe", "sleep", "journal", "community", "therapists", "crisis"],
        practical: ["wishes", "documents", "ceremony", "pros"],
        memory: ["voices", "letters", "garden", "timeline"],
      };
    case "soutenir":
      return {
        home: ["checkin", "support"],
        care: ["supporting", "journal", "community", "therapists", "crisis"],
        practical: [],
        memory: ["dates"],
      };
    case "questionnement":
      return {
        home: ["checkin", "memory"],
        care: ["journal", "meditations", "sounds", "community", "therapists", "crisis"],
        practical: [],
        memory: ["timeline", "letters"],
      };
    case "volontes":
      return {
        home: ["wishes", "task"],
        care: [],
        practical: ["wishes", "ceremony", "flowers", "letters", "documents", "vault", "succession"],
        memory: ["letters", "voices"],
      };
    case "demarches":
      return {
        home: ["task"],
        care: ["crisis"],
        practical: ["first", "obseques", "ceremony", "documents", "letters", "succession", "finances", "rights", "digital", "housing", "pros", "vault"],
        memory: [],
      };
    case "soutien":
      return {
        home: ["checkin", "support"],
        care: baseCare,
        practical: [],
        memory: ["garden", "dates"],
      };
    case "perdu":
    default: {
      const isRecent = stage === "recent" || stage === "obseques_a_organiser";
      const isAfter = stage === "apres" || stage === "obseques_passees";
      if (primaryNeed === "practical") {
        return {
          home: ["task", "support"],
          care: ["crisis"],
          practical: isRecent
            ? ["first", "obseques", "ceremony", "documents", "letters", "pros", "vault"]
            : ["documents", "letters", "succession", "finances", "rights", "digital", "housing", "pros", "vault"],
          memory: [],
        };
      }
      if (primaryNeed === "emotional") {
        return {
          home: ["checkin", "memory", "support"],
          care: baseCare,
          practical: [],
          memory: isAfter ? ["garden", "dates", "voices", "letters", "timeline"] : ["garden", "voices", "letters"],
        };
      }
      return {
        home: ["checkin", "task", "memory"],
        care: baseCare,
        practical: isRecent
          ? ["first", "obseques", "ceremony", "documents", "letters", "pros", "vault"]
          : ["documents", "letters", "succession", "finances", "digital", "housing", "pros", "vault"],
        memory: ["garden", "voices", "letters", "dates"],
      };
    }
  }
}

/** Libellés des catégories pratiques. */
export const PRACTICAL_LABELS: Record<PracticalCategory, { label: string; hint: string; to: string }> = {
  first:      { label: "Premières démarches",   hint: "Déclaration, mairie, employeur",     to: "/practical" },
  obseques:   { label: "Obsèques",                hint: "Pompes funèbres, devis",              to: "/practical/ceremony" },
  ceremony:   { label: "Cérémonie",               hint: "Déroulé, hommage, musique",           to: "/practical/ceremony" },
  flowers:    { label: "Fleurs & hommage",        hint: "Bouquet, couronne, geste",            to: "/practical/flowers" },
  documents:  { label: "Documents",               hint: "Acte de décès, identité",             to: "/practical/vault" },
  letters:    { label: "Courriers administratifs", hint: "Modèles à envoyer",                  to: "/practical" },
  succession: { label: "Succession",              hint: "Notaire, héritage",                   to: "/practical" },
  finances:   { label: "Finances",                hint: "Banques, comptes",                    to: "/practical" },
  rights:     { label: "Aides & droits",          hint: "CAF, CPAM, retraite",                 to: "/practical" },
  digital:    { label: "Comptes numériques",      hint: "Mails, réseaux, abonnements",         to: "/practical" },
  housing:    { label: "Logement & biens",        hint: "Bailleur, objets",                    to: "/practical" },
  pros:       { label: "Professionnels",          hint: "Annuaire vérifié",                    to: "/practical" },
  wishes:     { label: "Mes volontés",            hint: "Préparer en douceur",                 to: "/wishes" },
  vault:      { label: "Coffre de documents",     hint: "Tout au même endroit",                to: "/practical/vault" },
};

/** Temporalité par défaut d'une catégorie pratique. */
export type PracticalBucket = "now" | "week" | "month" | "later";

export const PRACTICAL_BUCKETS: Record<PracticalCategory, PracticalBucket> = {
  first:      "now",
  obseques:   "now",
  ceremony:   "week",
  flowers:    "week",
  documents:  "week",
  letters:    "month",
  succession: "month",
  finances:   "month",
  rights:     "month",
  digital:    "later",
  housing:    "later",
  pros:       "later",
  wishes:     "later",
  vault:      "later",
};

export const BUCKET_LABELS: Record<PracticalBucket, { label: string; tone: string }> = {
  now:   { label: "Immédiat",       tone: "var(--terracotta)" },
  week:  { label: "Cette semaine",  tone: "var(--sun)" },
  month: { label: "Ce mois-ci",     tone: "var(--sky)" },
  later: { label: "Plus tard",      tone: "var(--olive)" },
};

export const CARE_LABELS: Record<CareModule, { label: string; hint: string; to: string }> = {
  checkin:      { label: "Check-in émotionnel",  hint: "Comment vous sentez-vous ?",       to: "/checkin" },
  journal:      { label: "Journal",               hint: "Déposer une pensée",                to: "/journal" },
  breathe:      { label: "Respiration",           hint: "1, 3 ou 5 minutes",                 to: "/no-words" },
  sleep:        { label: "Sommeil",               hint: "Sons calmes, 4-7-8",                to: "/no-words" },
  meditations:  { label: "Méditations deuil",     hint: "Séries courtes",                    to: "/resources" },
  sounds:       { label: "Audios éditoriaux",     hint: "Textes, témoignages",               to: "/inspiration" },
  letters:      { label: "Écrire à mon proche",   hint: "Sans destinataire",                 to: "/journal" },
  community:    { label: "Communauté",            hint: "D'autres traversent aussi",         to: "/community" },
  therapists:   { label: "Trouver un·e thérapeute", hint: "Annuaire vérifié",                to: "/resources" },
  crisis:       { label: "Si ça déborde",         hint: "3114 et lignes d'écoute",           to: "/crisis" },
  anticipated:  { label: "Deuil anticipé",        hint: "Vivre avec l'idée de la perte",     to: "/resources" },
  caregiver:    { label: "Fatigue de l'aidant",   hint: "Tenir, sans se perdre",             to: "/resources" },
  supporting:   { label: "Quoi dire, quoi éviter", hint: "Messages prêts à envoyer",         to: "/resources" },
};

export const MEMORY_LABELS: Record<MemoryModule, { label: string; hint: string; to: string }> = {
  garden:    { label: "Le jardin",          hint: "Une parcelle par proche",       to: "/garden" },
  timeline:  { label: "Ligne de vie",       hint: "Dates et étapes",               to: "/memories" },
  voices:    { label: "Voix",                hint: "Garder une voix",               to: "/memories" },
  letters:   { label: "Lettres",             hint: "Reçues, envoyées",              to: "/journal" },
  dates:     { label: "Dates sensibles",     hint: "Anniversaire, fêtes",           to: "/dates" },
};