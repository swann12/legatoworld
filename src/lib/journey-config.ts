import type { Situation, PrimaryNeed, Stage, Relation } from "./legato-state";
import { isAnimal, isFamilyClose, isFriendOrColleague } from "./legato-state";

export type CareModule =
  | "checkin" | "journal" | "breathe" | "sleep" | "meditations"
  | "sounds" | "letters" | "community" | "therapists" | "crisis"
  | "anticipated" | "caregiver" | "supporting";

export type PracticalCategory =
  | "first" | "obseques" | "ceremony" | "flowers" | "documents"
  | "letters" | "succession" | "finances" | "rights"
  | "digital" | "housing" | "pros" | "wishes" | "vault"
  | "vet" | "cremation_animal" | "inhumation_animal" | "souvenir_objet" | "hommage" | "messages" | "cagnotte" | "aide_famille";

const FRIEND_PRACTICAL: PracticalCategory[] = ["ceremony", "flowers", "letters", "pros", "hommage", "messages", "cagnotte", "aide_famille"];

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
  opts: { relation?: Relation | null; legallyInvolved?: boolean | null } = {},
): JourneyModules {
  const baseCare: CareModule[] = ["checkin", "journal", "breathe", "sleep", "meditations", "sounds", "community", "therapists", "crisis"];
  const relation = opts.relation ?? null;
  const legallyInvolved = opts.legallyInvolved ?? false;

  // ── Parcours animal : aucune démarche humaine ──
  if (isAnimal(relation) && (situation === "perdu" || situation === "peur" || situation === "accompagner")) {
    return {
      home: ["checkin", "memory", "support"],
      care: ["checkin", "journal", "breathe", "sleep", "meditations", "sounds", "community", "therapists", "crisis"],
      practical: primaryNeed === "practical" || primaryNeed === "both" ? ["vet", "cremation_animal", "inhumation_animal", "souvenir_objet"] : [],
      memory: ["garden", "voices", "letters", "dates", "timeline"],
    };
  }

  // ── Filtre commun : succession/finances/logement/digital invisibles
  //    pour ami/collègue sauf si légalement impliqué.
  const filterByRelation = (cats: PracticalCategory[]): PracticalCategory[] => {
    if (isFamilyClose(relation) || legallyInvolved) return cats;
    if (isFriendOrColleague(relation) || relation === "autre") {
      const hidden: PracticalCategory[] = ["succession", "finances", "rights", "housing", "digital"];
      return cats.filter((c) => !hidden.includes(c));
    }
    return cats;
  };

  // ── Filtre par stage : obsèques déjà passées → masquer obsèques/cérémonie/fleurs
  const filterByStage = (cats: PracticalCategory[]): PracticalCategory[] => {
    if (stage === "obseques_passees" || stage === "demarches" || stage === "apres") {
      const hidden: PracticalCategory[] = ["obseques", "ceremony", "flowers"];
      return cats.filter((c) => !hidden.includes(c));
    }
    return cats;
  };

  const applyFilters = (cats: PracticalCategory[]) => filterByStage(filterByRelation(cats));

  switch (situation) {
    case "peur":
      return {
        home: ["checkin", "memory", "support"],
        care: ["checkin", "breathe", "journal", "anticipated", "letters", "community", "therapists", "crisis"],
        practical: [],
        memory: ["voices", "letters", "timeline"],
      };
    case "accompagner":
      return {
        home: ["checkin", "task", "memory"],
        care: ["checkin", "caregiver", "breathe", "sleep", "journal", "community", "therapists", "crisis"],
        practical: applyFilters(["wishes", "documents", "ceremony", "pros"]),
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
        practical: ["wishes", "ceremony", "letters", "documents", "vault"],
        memory: ["letters", "voices"],
      };
    case "perdu":
    default: {
      const isRecent = stage === "nouvelle" || stage === "obseques_a_organiser" || stage === "obseques_prevues" || stage === "inconnu";
      const isAfter = stage === "apres" || stage === "obseques_passees";
      if (primaryNeed === "practical") {
        return {
          home: ["task", "support"],
          care: ["crisis"],
          practical: isFriendOrColleague(relation) && !legallyInvolved ? filterByStage(FRIEND_PRACTICAL) : applyFilters(isRecent
            ? ["first", "obseques", "ceremony", "documents", "letters", "pros", "vault"]
            : ["documents", "letters", "succession", "finances", "rights", "digital", "housing", "pros", "vault"]),
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
        practical: isFriendOrColleague(relation) && !legallyInvolved ? filterByStage(FRIEND_PRACTICAL) : applyFilters(isRecent
          ? ["first", "obseques", "ceremony", "documents", "letters", "pros", "vault"]
          : ["documents", "letters", "succession", "finances", "digital", "housing", "pros", "vault"]),
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
  pros:       { label: "Professionnels",          hint: "Annuaire vérifié",                    to: "/practical/pros" },
  wishes:     { label: "Mes volontés",            hint: "Préparer en douceur",                 to: "/practical/wishes" },
  vault:      { label: "Coffre de documents",     hint: "Tout au même endroit",                to: "/practical/vault" },
  vet:        { label: "Vétérinaire",             hint: "Derniers soins, certificat, conseil", to: "/practical/tasks/vet" },
  cremation_animal: { label: "Crémation animale", hint: "Options, délais, lieu de recueil",     to: "/practical/tasks/cremation_animal" },
  inhumation_animal: { label: "Inhumation animale", hint: "Ce qui est possible légalement",     to: "/practical/tasks/inhumation_animal" },
  souvenir_objet: { label: "Objet souvenir",      hint: "Empreinte, collier, photo",            to: "/care/memory" },
  hommage:    { label: "Hommage",                 hint: "Un geste avec les proches",           to: "/care/memory" },
  messages:   { label: "Messages",                hint: "Prévenir, écrire, remercier",         to: "/practical/tasks/messages" },
  cagnotte:   { label: "Cagnotte",                hint: "Participer si c'est pertinent",       to: "/practical/tasks/cagnotte" },
  aide_famille: { label: "Aide à la famille",     hint: "Proposer sans envahir",               to: "/practical/tasks/aide_famille" },
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
  vet:        "now",
  cremation_animal: "week",
  inhumation_animal: "week",
  souvenir_objet: "later",
  hommage:    "week",
  messages:   "now",
  cagnotte:   "week",
  aide_famille: "week",
};

export const BUCKET_LABELS: Record<PracticalBucket, { label: string; tone: string }> = {
  now:   { label: "Immédiat",       tone: "var(--terracotta)" },
  week:  { label: "Cette semaine",  tone: "var(--bordeaux)" },
  month: { label: "Ce mois-ci",     tone: "var(--olive)" },
  later: { label: "Plus tard",      tone: "var(--sage)" },
};


export const CARE_LABELS: Record<CareModule, { label: string; hint: string; to: string }> = {
  checkin:      { label: "Check-in émotionnel",  hint: "Comment vous sentez-vous ?",       to: "/care/emotions" },
  journal:      { label: "Journal",               hint: "Déposer une pensée",                to: "/care/journal" },
  breathe:      { label: "Respirer",              hint: "1, 3 ou 5 minutes",                 to: "/care/respirer" },
  sleep:        { label: "Nuits difficiles",      hint: "Sons calmes pour s'endormir",       to: "/no-words?tab=souffles" },
  meditations:  { label: "Méditations deuil",     hint: "Séries courtes",                    to: "/care/resources" },
  sounds:       { label: "Audios éditoriaux",     hint: "Textes, témoignages",               to: "/care/resources" },
  letters:      { label: "Écrire à mon proche",   hint: "Quelques mots pour iel",            to: "/care/journal" },
  community:    { label: "Communauté",            hint: "D'autres traversent aussi",         to: "/care/community" },
  therapists:   { label: "Trouver un·e thérapeute", hint: "Annuaire vérifié",                to: "/resources?space=care" },
  crisis:       { label: "Besoin d’aide tout de suite",         hint: "3114 et lignes d'écoute",           to: "/crisis" },
  anticipated:  { label: "Deuil anticipé",        hint: "Vivre avec l'idée de la perte",     to: "/care/resources" },
  caregiver:    { label: "Fatigue de l'aidant",   hint: "Tenir, sans se perdre",             to: "/care/resources" },
  supporting:   { label: "Quoi dire, quoi éviter", hint: "Messages prêts à envoyer",         to: "/care/resources" },
};

export const MEMORY_LABELS: Record<MemoryModule, { label: string; hint: string; to: string }> = {
  garden:    { label: "Le jardin",          hint: "Une parcelle par proche",       to: "/care/garden" },
  timeline:  { label: "Ligne de vie",       hint: "Dates et étapes",               to: "/care/memory" },
  voices:    { label: "Voix",                hint: "Garder une voix",               to: "/care/memory" },
  letters:   { label: "Lettres",             hint: "Reçues, envoyées",              to: "/care/journal" },
  dates:     { label: "Dates sensibles",     hint: "Anniversaire, fêtes",           to: "/care/dates" },
};