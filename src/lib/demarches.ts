import { useEffect, useMemo, useState } from "react";
import { useLegato, type TaskStatus } from "./legato-state";
import { PRACTICAL_LABELS, PRACTICAL_BUCKETS, type PracticalCategory } from "./journey-config";
import { taskGuide } from "./task-guides";
import { isHiddenFromActive } from "./task-status";

/**
 * Démarches concrètes (écrans 055–062). Le statut vit dans legato-state (taskStatus),
 * les étapes cochées dans task-steps. Les anciennes catégories restent ouvrables par leur id.
 */
export type Bucket = "week" | "month" | "later";
export type Demarche = {
  id: string;
  title: [string, string];
  bucket: Bucket;
  minutes: number;
  meta?: string;
  dueDays?: number;
  dueText?: string;
  who: string;
  howMany?: string;
  steps: string[];
  online?: { label: string; url: string };
  letter?: { to: string; ref: string; attach: string };
  ask: string;
  defaultDone?: boolean;
  custom?: boolean;
};

export const DEMARCHES: Demarche[] = [
  {
    id: "acte-deces", title: ["Commander l'acte", "de décès."], bucket: "week", minutes: 10, dueDays: 4,
    who: "Mairie du lieu de décès", howMany: "10 copies, gratuites",
    steps: ["Trouver la mairie du lieu de décès", "Demander l'acte, sur place ou en ligne", "Ranger les copies dans Mes documents"],
    online: { label: "Faire la demande en ligne", url: "https://www.service-public.fr/particuliers/vosdroits/R1406" },
    ask: "Pourrais-tu commander l'acte de décès à la mairie ? Tout est expliqué ici. Merci.",
  },
  {
    id: "banque", title: ["Prévenir", "la banque."], bucket: "week", minutes: 15, meta: "modèle de courrier prêt",
    who: "La banque du défunt", howMany: "Un courrier, avec l'acte de décès",
    steps: ["Retrouver le numéro de compte", "Relire le courrier préparé", "L'envoyer avec l'acte de décès"],
    letter: { to: "la banque", ref: "titulaire du compte n°", attach: "l'acte de décès" },
    ask: "Pourrais-tu prévenir la banque ? Le courrier est prêt. Merci.",
  },
  {
    id: "obseques", title: ["Choisir les", "pompes funèbres."], bucket: "week", minutes: 30, defaultDone: true,
    who: "Pompes funèbres", steps: ["Demander deux devis", "Comparer poste par poste", "Signer le devis retenu"],
    ask: "Pourrais-tu m'aider à comparer les devis des pompes funèbres ? Merci.",
  },
  {
    id: "retraite", title: ["Prévenir la caisse", "de retraite."], bucket: "month", minutes: 20, meta: "en ligne",
    who: "Caisse de retraite", howMany: "Une déclaration en ligne",
    steps: ["Se connecter au service en ligne", "Déclarer le décès", "Demander la pension de réversion si besoin"],
    online: { label: "Faire la démarche en ligne", url: "https://www.info-retraite.fr" },
    letter: { to: "la caisse de retraite", ref: "numéro de sécurité sociale", attach: "l'acte de décès" },
    ask: "Pourrais-tu prévenir la caisse de retraite en ligne ? Tout est expliqué ici. Merci.",
  },
  {
    id: "employeur", title: ["Prévenir", "l'employeur."], bucket: "month", minutes: 15, defaultDone: true,
    who: "Employeur du défunt", steps: ["Appeler les ressources humaines", "Demander le solde de tout compte"],
    ask: "Pourrais-tu prévenir son employeur ? Merci.",
  },
  {
    id: "mutuelle", title: ["Prévenir", "la mutuelle."], bucket: "month", minutes: 15, defaultDone: true,
    who: "Mutuelle", steps: ["Envoyer l'acte de décès", "Demander le capital décès s'il existe"],
    ask: "Pourrais-tu prévenir la mutuelle ? Merci.",
  },
  {
    id: "notaire", title: ["Prendre rendez-vous", "chez le notaire."], bucket: "later", minutes: 20, dueText: "dans les six mois",
    who: "Notaire", howMany: "Un premier rendez-vous",
    steps: ["Choisir un notaire", "Rassembler les papiers demandés", "Faire le point sur la succession"],
    ask: "Pourrais-tu m'aider à trouver un notaire ? Merci.",
  },
  {
    id: "logement", title: ["S'occuper", "du logement."], bucket: "later", minutes: 30,
    who: "Bailleur ou syndic", steps: ["Prévenir le bailleur", "Résilier l'énergie et internet"],
    letter: { to: "votre bailleur", ref: "locataire du logement situé", attach: "l'acte de décès" },
    ask: "Pourrais-tu m'aider pour le logement ? Merci.",
  },
];

/* ——— Démarches ajoutées (depuis un courrier expliqué) ——— */
const CUSTOM_KEY = "legato.demarches.custom.v1";
export function loadCustom(): Demarche[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) ?? "[]"); } catch { return []; }
}
export function addCustom(d: Omit<Demarche, "custom">) {
  const list = loadCustom().filter((x) => x.id !== d.id);
  localStorage.setItem(CUSTOM_KEY, JSON.stringify([...list, { ...d, custom: true }]));
}

/** Ancienne catégorie → démarche, pour que les anciens liens s'ouvrent encore. */
function fromCategory(id: string): Demarche | undefined {
  const cfg = PRACTICAL_LABELS[id as PracticalCategory];
  if (!cfg) return undefined;
  const g = taskGuide(id as PracticalCategory);
  const b = PRACTICAL_BUCKETS[id as PracticalCategory];
  const words = cfg.label.split(" ");
  const cut = Math.max(1, Math.ceil(words.length / 2));
  return {
    id, title: [words.slice(0, cut).join(" "), words.slice(cut).join(" ") + "."], minutes: 15,
    bucket: b === "now" || b === "week" ? "week" : b, who: g.who, dueText: g.when.toLowerCase(), steps: g.steps,
    ask: `Pourrais-tu t'occuper de : ${cfg.label.toLowerCase()} ? Tout est expliqué ici. Merci.`,
  };
}

export function findDemarche(id: string): Demarche | undefined {
  return DEMARCHES.find((d) => d.id === id) ?? loadCustom().find((d) => d.id === id) ?? fromCategory(id);
}

export const titleText = (d: Demarche) => `${d.title[0]} ${d.title[1]}`.replace(/\.$/, "");

/* ——— Dates ——— */
const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
export function dueDate(d: Demarche): Date | null {
  if (d.dueDays === undefined) return null;
  const t = new Date(); t.setHours(12, 0, 0, 0); t.setDate(t.getDate() + d.dueDays); return t;
}
export const dueShort = (d: Demarche) => {
  const t = dueDate(d); return t ? `avant ${DAYS[t.getDay()]} ${t.getDate()}` : d.dueText;
};
export const dueLong = (d: Demarche) => {
  const t = dueDate(d); return t ? `Avant le ${DAYS[t.getDay()]} ${t.getDate()} ${MONTHS[t.getMonth()]}` : d.dueText ? `À faire ${d.dueText}` : BUCKET_LABEL[d.bucket];
};
export const dayName = (t: Date) => DAYS[t.getDay()];
export const longDate = (iso: string) => {
  const t = new Date(iso); return isNaN(+t) ? "" : `${t.getDate()} ${MONTHS[t.getMonth()]} ${t.getFullYear()}`;
};

export const BUCKET_LABEL: Record<Bucket, string> = { week: "Cette semaine", month: "Ce mois-ci", later: "Plus tard" };
export const BUCKETS: Bucket[] = ["week", "month", "later"];

export function subtitle(d: Demarche) {
  return [`${d.minutes} min`, d.meta ?? dueShort(d)].filter(Boolean).join(" · ");
}

const WORDS = ["Aucune", "Une", "Deux", "Trois", "Quatre", "Cinq", "Six", "Sept", "Huit", "Neuf", "Dix", "Onze", "Douze"];
export const inWords = (n: number) => WORDS[n] ?? String(n);

/** Liste vivante : statut de chaque démarche, regroupement, compte. */
export function useDemarches() {
  const { taskStatus, setTaskStatus, hydrated } = useLegato();
  const [custom, setCustom] = useState<Demarche[]>([]);
  useEffect(() => setCustom(loadCustom()), []);
  return useMemo(() => {
    const status = (d: Demarche): TaskStatus => (hydrated ? taskStatus[d.id] : undefined) ?? (d.defaultDone ? "done" : "todo");
    const all = [...DEMARCHES, ...custom].filter((d) => status(d) !== "not_concerned");
    const isDone = (d: Demarche) => status(d) === "done";
    const open = all.filter((d) => !isHiddenFromActive(status(d)));
    const by = (b: Bucket) => ({ all: all.filter((d) => d.bucket === b), open: open.filter((d) => d.bucket === b) });
    const next = open.find((d) => d.bucket === "week") ?? open[0];
    return { all, open, by, isDone, status, setTaskStatus, done: all.filter(isDone).length, total: all.length, next };
  }, [taskStatus, hydrated, custom, setTaskStatus]);
}
