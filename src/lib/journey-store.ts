/**
 * Mini-store local pour le parcours organisationnel (brief §5–§7).
 * Persistance localStorage. Pas de back-end pour cette première passe —
 * la persistance Cloud sera ajoutée plus tard.
 */

export type TaskStatus = "todo" | "progress" | "delegated" | "waiting" | "done";
export type TaskCategory =
  | "first"        // Premières priorités
  | "ceremony"     // Organiser les obsèques
  | "coordinate"   // Informer / coordonner
  | "documents"    // Documents et comptes
  | "housing"      // Logement et affaires
  | "estate"       // Succession et administratif
  | "after";       // Après la cérémonie

export const CATEGORY_LABEL: Record<TaskCategory, string> = {
  first: "Premières priorités",
  ceremony: "Organiser les obsèques",
  coordinate: "Informer et coordonner",
  documents: "Documents et comptes",
  housing: "Logement et affaires",
  estate: "Succession et droits",
  after: "Après la cérémonie",
};

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "À faire",
  progress: "En cours",
  delegated: "Délégué",
  waiting: "En attente",
  done: "Terminé",
};

export type JourneyTask = {
  id: string;
  title: string;
  why: string;
  category: TaskCategory;
  status: TaskStatus;
  /** 1 = priorité maximale, 5 = peut attendre. */
  urgency: 1 | 2 | 3 | 4 | 5;
  durationMin: number;
  /** Échéance ISO (YYYY-MM-DD) ou null. */
  deadline: string | null;
  documentsNeeded: string[];
  /** Si déléguée, à qui. */
  delegatedTo?: string;
  delegatedAt?: string;
};

const SEED: JourneyTask[] = [
  {
    id: "constat",
    title: "Faire établir le constat de décès",
    why: "Première étape officielle, faite par un médecin. Elle permet d'engager toutes les démarches suivantes.",
    category: "first",
    status: "done",
    urgency: 1,
    durationMin: 15,
    deadline: null,
    documentsNeeded: [],
  },
  {
    id: "mairie",
    title: "Déclarer le décès en mairie",
    why: "Démarche obligatoire dans les 24 heures ouvrées. L'acte de décès vous sera remis à l'issue et conditionne la suite.",
    category: "first",
    status: "progress",
    urgency: 1,
    durationMin: 30,
    deadline: addDays(1),
    documentsNeeded: ["Constat de décès", "Pièce d'identité du défunt", "Livret de famille"],
  },
  {
    id: "pf",
    title: "Contacter une entreprise de pompes funèbres",
    why: "Pour organiser la prise en charge et comparer les premières possibilités, sans engagement.",
    category: "first",
    status: "todo",
    urgency: 1,
    durationMin: 10,
    deadline: addDays(2),
    documentsNeeded: [],
  },
  {
    id: "proches",
    title: "Prévenir les proches",
    why: "À votre rythme. Nous pouvons préparer un message court avec vous.",
    category: "coordinate",
    status: "delegated",
    urgency: 2,
    durationMin: 30,
    deadline: null,
    documentsNeeded: [],
    delegatedTo: "Marie (sœur)",
    delegatedAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: "employeur",
    title: "Prévenir l'employeur",
    why: "Un message court suffit. Un justificatif suivra plus tard.",
    category: "coordinate",
    status: "todo",
    urgency: 3,
    durationMin: 10,
    deadline: addDays(3),
    documentsNeeded: [],
  },
  {
    id: "docs",
    title: "Rassembler les documents essentiels",
    why: "Pièce d'identité, livret de famille, contrats, dernier avis d'imposition.",
    category: "documents",
    status: "waiting",
    urgency: 2,
    durationMin: 60,
    deadline: null,
    documentsNeeded: ["Pièce d'identité", "Livret de famille", "Contrats d'assurance"],
  },
  {
    id: "banque",
    title: "Prévenir la banque",
    why: "Pour bloquer les comptes individuels du défunt et identifier les prélèvements à arrêter.",
    category: "documents",
    status: "todo",
    urgency: 3,
    durationMin: 20,
    deadline: addDays(7),
    documentsNeeded: ["Acte de décès"],
  },
  {
    id: "ceremony",
    title: "Décider du déroulé de la cérémonie",
    why: "Inhumation ou crémation, lieu, intervenants. Vous pouvez vous faire aider à chaque étape.",
    category: "ceremony",
    status: "todo",
    urgency: 2,
    durationMin: 45,
    deadline: addDays(6),
    documentsNeeded: [],
  },
  {
    id: "notaire",
    title: "Prendre rendez-vous chez un notaire",
    why: "Pour la succession. À envisager dans les premières semaines.",
    category: "estate",
    status: "todo",
    urgency: 4,
    durationMin: 60,
    deadline: addDays(30),
    documentsNeeded: ["Acte de décès", "Livret de famille"],
  },
  {
    id: "logement",
    title: "Faire le point sur le logement",
    why: "Clés, bail, assurance, objets importants. Rien ne presse.",
    category: "housing",
    status: "todo",
    urgency: 5,
    durationMin: 0,
    deadline: null,
    documentsNeeded: [],
  },
];

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const KEY = "legato.journey.v1";

export function loadJourney(): JourneyTask[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as JourneyTask[];
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED;
    return parsed;
  } catch {
    return SEED;
  }
}

export function saveJourney(list: JourneyTask[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("legato:journey-change"));
}

export function updateTask(id: string, patch: Partial<JourneyTask>): JourneyTask[] {
  const list = loadJourney().map((t) => (t.id === id ? { ...t, ...patch } : t));
  saveJourney(list);
  return list;
}

/**
 * Sélection automatique de la priorité du jour (brief §5.1).
 * L'utilisateur ne doit JAMAIS choisir lui-même la priorité.
 */
export function pickPriorityTask(list: JourneyTask[]): JourneyTask | null {
  const open = list.filter((t) => t.status !== "done" && t.status !== "delegated");
  if (open.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10);
  return [...open].sort((a, b) => {
    // Échéance dépassée ou imminente d'abord
    const ad = a.deadline ?? "9999-12-31";
    const bd = b.deadline ?? "9999-12-31";
    if (ad !== bd) {
      const aLate = ad <= today ? -1 : 0;
      const bLate = bd <= today ? -1 : 0;
      if (aLate !== bLate) return aLate - bLate;
      return ad.localeCompare(bd);
    }
    return a.urgency - b.urgency;
  })[0];
}

export function summary(list: JourneyTask[]) {
  const by = (s: TaskStatus) => list.filter((t) => t.status === s).length;
  const missingDocs = list
    .filter((t) => t.status !== "done")
    .reduce((acc, t) => acc + t.documentsNeeded.length, 0);
  const nextDeadline = [...list]
    .filter((t) => t.status !== "done" && t.deadline)
    .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1))[0]?.deadline ?? null;
  return {
    done: by("done"),
    progress: by("progress"),
    delegated: by("delegated"),
    waiting: by("waiting"),
    todo: by("todo"),
    missingDocs,
    nextDeadline,
  };
}

export function daysUntil(iso: string): number {
  const d = new Date(iso + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 86_400_000);
}

export function deadlineChip(iso: string | null): { text: string; tone: "alert" | "warn" | "neutral" } | null {
  if (!iso) return null;
  const n = daysUntil(iso);
  if (n < 0) return { text: `Dépassée de ${Math.abs(n)} j`, tone: "alert" };
  if (n === 0) return { text: "Aujourd'hui", tone: "alert" };
  if (n <= 3) return { text: `Dans ${n} j`, tone: "alert" };
  if (n <= 14) return { text: `Dans ${n} j`, tone: "warn" };
  return { text: `Le ${iso.slice(8, 10)}/${iso.slice(5, 7)}`, tone: "neutral" };
}