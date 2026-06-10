import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Branch =
  | "person"
  | "animal"
  | "fear"
  | "anxiety"
  | "practical"
  | "wishes"
  | "unknown";

export type Mode = "cocoon" | "anchoring" | "breath" | "relay";
export type Lang = "fr" | "en";
export type ThemeMode = "auto" | "light" | "dark";

/** Les deux espaces strictement séparés du brief.
 *  `null` = l'utilisateur n'a pas encore choisi (avant la bifurcation). */
export type Space = "psy" | "concrete" | null;

/** État émotionnel déclaré le jour même (espace psy).
 *  Pilote le ton, l'ordre des cartes et la densité. */
export type TodayState =
  | "stunned" | "exhausted" | "anxious" | "sad"
  | "angry" | "empty" | "isolated" | "overwhelmed"
  | "soothed" | "undecided";

export const TODAY_STATES: { id: TodayState; label: string; mode: Mode }[] = [
  { id: "stunned",      label: "Sidéré·e",                 mode: "cocoon"    },
  { id: "exhausted",    label: "Épuisé·e",                 mode: "cocoon"    },
  { id: "anxious",      label: "Anxieux·se",               mode: "breath"    },
  { id: "sad",          label: "Triste",                   mode: "cocoon"    },
  { id: "angry",        label: "En colère",                mode: "anchoring" },
  { id: "empty",        label: "Vide",                     mode: "cocoon"    },
  { id: "isolated",     label: "Isolé·e",                  mode: "relay"     },
  { id: "overwhelmed",  label: "Submergé·e",               mode: "relay"     },
  { id: "soothed",      label: "Apaisé·e par moments",     mode: "breath"    },
  { id: "undecided",    label: "Je ne sais pas choisir",   mode: "cocoon"    },
];

/** Priorités du jour pour l'espace concret (brief §4.1 step 12).
 *  Sert à construire automatiquement le plan et la « prochaine étape ». */
export type ConcretePriority =
  | "first-steps" | "ceremony" | "documents" | "tell-loved-ones"
  | "accounts"    | "housing"  | "estate"    | "budget"
  | "find-pro"    | "unsure";

export const CONCRETE_PRIORITIES: {
  id: ConcretePriority;
  label: string;
  whisper: string;
  next: { title: string; why: string; duration: string };
}[] = [
  { id: "first-steps", label: "Premières démarches", whisper: "Constat, mairie, employeur — l'essentiel des premiers jours.",
    next: { title: "Faire établir le constat de décès", why: "Première étape officielle, faite par un médecin.", duration: "15 min" } },
  { id: "ceremony", label: "Organiser la cérémonie", whisper: "Inhumation ou crémation, lieu, déroulé, intervenants.",
    next: { title: "Contacter une entreprise de pompes funèbres", why: "Premier rendez-vous pour organiser la mise en bière et la cérémonie.", duration: "10 min" } },
  { id: "documents", label: "Rassembler les documents", whisper: "Pièce d'identité, livret de famille, contrats.",
    next: { title: "Réunir les documents essentiels", why: "Ils seront demandés pour la plupart des démarches à venir.", duration: "1 h" } },
  { id: "tell-loved-ones", label: "Prévenir les proches", whisper: "À votre rythme. On peut préparer un message ensemble.",
    next: { title: "Prévenir les proches", why: "On peut préparer un message court à envoyer.", duration: "20 min" } },
  { id: "accounts", label: "Comptes et abonnements", whisper: "Téléphone, énergie, banque, presse. Sans urgence.",
    next: { title: "Lister les comptes et abonnements à clôturer", why: "Pour avancer ensuite, un à un, sans précipitation.", duration: "30 min" } },
  { id: "housing", label: "Logement", whisper: "Clés, bail, assurance, objets importants.",
    next: { title: "Faire le point sur le logement", why: "Quelques décisions simples, à étaler dans le temps.", duration: "à votre rythme" } },
  { id: "estate", label: "Succession et droits", whisper: "Orientation vers notaire, étapes et aides.",
    next: { title: "Prendre rendez-vous chez un notaire", why: "Pour la succession. Dans les semaines à venir.", duration: "1 h" } },
  { id: "budget", label: "Budget", whisper: "Estimer, comparer, choisir sans se précipiter.",
    next: { title: "Définir un budget indicatif", why: "Pour vous repérer dans les devis et propositions.", duration: "20 min" } },
  { id: "find-pro", label: "Trouver un professionnel", whisper: "Pompes funèbres, célébrant·e, fleuriste, notaire.",
    next: { title: "Trouver un·e professionnel·le près de chez vous", why: "Filtres clairs, disponibilité, budget.", duration: "10 min" } },
  { id: "unsure", label: "Je ne sais pas par où commencer", whisper: "On vous propose la suite, pas à pas.",
    next: { title: "Commencer par une seule chose", why: "On vous propose la prochaine étape la plus utile aujourd'hui.", duration: "5 min" } },
];

export type JournalEntry = {
  id: string;
  date: string;       // ISO
  title?: string;
  body: string;
  to?: "self" | "them" | "free"; // address
};

export type Wishes = {
  ceremony: string;       // inhumation, crémation, autre…
  ambiance: string;
  flowers: string;
  music: string;
  texts: string;
  objects: string;
  colors: string;
  materials: string;
  iWant: string;
  iDontWant: string;
  toLovedOnes: string;
  sharedWith: string[];   // noms ou e-mails autorisés
};

const EMPTY_WISHES: Wishes = {
  ceremony: "", ambiance: "", flowers: "", music: "", texts: "",
  objects: "", colors: "", materials: "", iWant: "", iDontWant: "",
  toLovedOnes: "", sharedWith: [],
};

/** Six situations proposées à l'onboarding (cohérentes graphiquement). */
export const BRANCHES: { id: Branch; label: string; whisper: string }[] = [
  { id: "person",    label: "Une personne me manque",        whisper: "Une absence qui se fait sentir." },
  { id: "animal",    label: "Un animal aimé me manque",      whisper: "Une présence fidèle, qui compte." },
  { id: "fear",      label: "J'ai peur de perdre quelqu'un", whisper: "Un être cher fragile, gardé en pensée." },
  { id: "practical", label: "Je traverse une perte récente", whisper: "Traverser les premiers jours, sans tout porter d'un coup." },
  { id: "wishes",    label: "Je souhaite préparer mes volontés", whisper: "Poser doucement ce que l'on voudrait." },
  { id: "unknown",   label: "Je ne sais pas encore",         whisper: "Rien à nommer, et c'est très bien." },
];

/** Kept for backward compat — `practical` is now part of BRANCHES. */
export const PRACTICAL_BRANCH = BRANCHES.find((b) => b.id === "practical")!;

/** Suggested label for the "who is missing" step, per branch. */
export const LOST_NAME_LABEL: Record<Branch, { fr: string; en: string; placeholder: string }> = {
  person:    { fr: "Son prénom",                  en: "Their first name",       placeholder: "Prénom…" },
  animal:    { fr: "Son nom",                     en: "Their name",             placeholder: "Nom…" },
  fear:      { fr: "Le prénom de ce proche",      en: "Their first name",       placeholder: "Prénom…" },
  anxiety:   { fr: "Un mot pour ce qui pèse",     en: "A word for what weighs", placeholder: "Un mot…" },
  practical: { fr: "Son prénom",                  en: "Their first name",       placeholder: "Prénom…" },
  wishes:    { fr: "Un mot, si vous voulez",      en: "A word, if you wish",    placeholder: "Un mot…" },
  unknown:   { fr: "Un mot, si vous voulez",      en: "A word, if you wish",    placeholder: "Un mot…" },
};

export const MODES: { id: Mode; label: string; whisper: string; tint: string }[] = [
  { id: "cocoon",    label: "Cocon",    whisper: "Se replier un instant, sans rien devoir.",        tint: "rose" },
  { id: "anchoring", label: "Ancrage",  whisper: "Un pied sur la terre, des repères simples.",      tint: "sage" },
  { id: "breath",    label: "Souffle",  whisper: "Un peu d'air entre les pensées.",                 tint: "mist" },
  { id: "relay",     label: "Relais",   whisper: "Confier ce qui pèse, ne pas tout porter seul·e.", tint: "lavender" },
];

/** Visual/UX profile per mode — used to differentiate ambiance and content order. */
export type ModeProfile = {
  density: "tight" | "calm" | "open";   // vertical spacing rhythm
  halo: "calm" | "default" | "rich";    // intensity of ambient halos
  primary: "presence" | "practical" | "journal" | "relay"; // most prominent block on /home
  ctaLabel: string;
};
export function modeProfile(mode: Mode): ModeProfile {
  switch (mode) {
    case "cocoon":    return { density: "tight", halo: "rich",    primary: "presence",  ctaLabel: "Rester encore un instant" };
    case "anchoring": return { density: "calm",  halo: "calm",    primary: "practical", ctaLabel: "Faire un seul petit pas" };
    case "breath":    return { density: "open",  halo: "calm",    primary: "journal",   ctaLabel: "Reprendre un peu d'air" };
    case "relay":     return { density: "calm",  halo: "default", primary: "relay",     ctaLabel: "Demander un appui" };
  }
}

/* ─── i18n — minimal dictionary, only for surfaces touched by the redesign ─── */

type Dict = Record<string, { fr: string; en: string }>;
const DICT: Dict = {
  "nav.home":     { fr: "Accueil",   en: "Home" },
  "nav.garden":   { fr: "Jardin",    en: "Garden" },
  "nav.journal":  { fr: "Journal",   en: "Journal" },
  "nav.presence": { fr: "Présence",  en: "Presence" },
  "nav.avancer":  { fr: "Avancer",   en: "Move on" },
  "nav.today":    { fr: "Aujourd'hui", en: "Today" },
  "nav.space":    { fr: "Mon espace",en: "My space" },
  "common.back":  { fr: "Retour",    en: "Back" },
  "common.continue":{ fr: "Continuer", en: "Continue" },
  "nav.wishes":   { fr: "Volontés",  en: "Wishes" },
  "home.aujourdhui":{ fr: "Aujourd'hui", en: "Today" },
  "home.greeting": { fr: "un instant pour se poser.", en: "a moment to settle in." },
  "home.parler":   { fr: "Parler à une présence", en: "Speak to a presence" },
  "home.parlerSub":{ fr: "Une oreille calme, à toute heure.", en: "A quiet ear, at any hour." },
  "home.parlerBody":{ fr: "On vous écoute, sans jugement, sans réponse à donner.", en: "We listen, without judgment, nothing to answer." },
  "home.enter":    { fr: "Entrer", en: "Enter" },
  "home.practical":{ fr: "Démarches concrètes", en: "Concrete steps" },
  "home.practicalSub":{ fr: "Avancer une étape\nà la fois.", en: "Move one step\nat a time." },
  "home.practicalAlways":{ fr: "Disponible à votre rythme, jour et nuit.", en: "Available at your pace, day or night." },
  "home.journal":  { fr: "Journal intime", en: "Private journal" },
  "home.journalSub":{ fr: "Déposer une pensée, sans relire.", en: "Set down a thought, no re-reading." },
  "home.nowords":  { fr: "Sans mots", en: "Without words" },
  "home.nowordsSub":{ fr: "Sons, lumières et souffles pour s'apaiser.", en: "Sounds, lights and breaths to soothe." },
  "home.wishes":   { fr: "Mes volontés", en: "My wishes" },
  "home.wishesSub":{ fr: "Préparer, en douceur, ce que l'on voudrait.", en: "Gently prepare what you would wish for." },
  "home.inspiration":{ fr: "Préparer pour un proche", en: "Prepare for a loved one" },
  "home.inspirationSub":{ fr: "Préparer une cérémonie, des fleurs, des mots qui lui ressemblent.", en: "Prepare a ceremony, flowers and words that look like them." },
  "home.crisis.label":{ fr: "Si aujourd'hui pèse trop", en: "If today feels too heavy" },
  "home.crisis.title":{ fr: "Une porte calme, ouverte.", en: "A quiet door, open." },
  "garden.title":  { fr: "Le jardin de", en: "The garden of" },
  "garden.subtitle":{ fr: "Touchez une touffe pour y entrer.", en: "Touch a patch to step in." },
  "garden.plant":  { fr: "Planter une trace", en: "Plant a trace" },
  "garden.plantSub":{ fr: "Voix · note · photo", en: "Voice · note · photo" },
  "garden.belong": { fr: "Ce jardin appartient à", en: "This garden belongs to" },
  "journal.title": { fr: "Journal", en: "Journal" },
  "journal.subtitle":{ fr: "Sans titre, sans plan, sans attente.", en: "No title, no plan, no expectation." },
  "journal.placeholder":{ fr: "Écrivez, ou laissez respirer…", en: "Write, or let it breathe…" },
  "journal.save":  { fr: "Garder", en: "Keep" },
  "journal.empty": { fr: "Aucune page. Un mot suffit.", en: "No page yet. One word is enough." },
  "journal.to.self":{ fr: "à moi-même", en: "to myself" },
  "journal.to.them":{ fr: "à la personne qui me manque", en: "to the person I miss" },
  "journal.to.free":{ fr: "librement",   en: "freely" },
  "nowords.title": { fr: "Sans mots", en: "Without words" },
  "nowords.subtitle":{ fr: "Arrêtez-vous sur ce qui apaise.", en: "Stop on what soothes." },
  "nowords.sound": { fr: "Son d'ambiance", en: "Ambient sound" },
  "nowords.silence":{ fr: "Silence", en: "Silence" },
  "practical.always":{ fr: "Démarches", en: "Steps" },
};

/* ─── Context ─── */

type Ctx = {
  branch: Branch;
  setBranch: (b: Branch) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  name: string;            // user's first name
  setName: (s: string) => void;
  lostName: string;        // the being remembered
  setLostName: (s: string) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  resolvedTheme: "light" | "dark";
  t: (key: string) => string;
  journal: JournalEntry[];
  addJournalEntry: (e: Omit<JournalEntry, "id" | "date">) => void;
  wishes: Wishes;
  setWishes: (w: Partial<Wishes>) => void;
  /** Espace actif. `null` tant que la bifurcation n'a pas eu lieu. */
  space: Space;
  setSpace: (s: Space) => void;
  /** État émotionnel du jour (espace psy). */
  todayState: TodayState;
  setTodayState: (t: TodayState) => void;
  /** Priorité du jour (espace concret). */
  concretePriority: ConcretePriority;
  setConcretePriority: (p: ConcretePriority) => void;
};

const LegatoContext = createContext<Ctx | null>(null);

export function LegatoProvider({ children }: { children: ReactNode }) {
  const [branch, setBranchState] = useState<Branch>("person");
  const [mode, setModeState] = useState<Mode>("cocoon");
  const [name, setNameState] = useState<string>("Swann");
  const [space, setSpaceState] = useState<Space>(null);
  const [todayState, setTodayStateState] = useState<TodayState>("undecided");
  const [concretePriority, setConcretePriorityState] = useState<ConcretePriority>("first-steps");

  // Hydrate from localStorage (one-shot)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("legato-profile");
      if (!raw) return;
      const p = JSON.parse(raw) as Partial<{
        space: Space; branch: Branch; mode: Mode; name: string;
        todayState: TodayState; concretePriority: ConcretePriority;
      }>;
      if (p.space === "psy" || p.space === "concrete") setSpaceState(p.space);
      if (p.branch) setBranchState(p.branch);
      if (p.mode) setModeState(p.mode);
      if (p.name) setNameState(p.name);
      if (p.todayState) setTodayStateState(p.todayState);
      if (p.concretePriority) setConcretePriorityState(p.concretePriority);
    } catch { /* ignore */ }
  }, []);
  // Persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        "legato-profile",
        JSON.stringify({ space, branch, mode, name, todayState, concretePriority }),
      );
    } catch { /* ignore */ }
  }, [space, branch, mode, name, todayState, concretePriority]);

  const setBranch = (b: Branch) => setBranchState(b);
  const setMode = (m: Mode) => setModeState(m);
  const setName = (s: string) => setNameState(s);
  const setSpace = (s: Space) => setSpaceState(s);
  const setTodayState = (t: TodayState) => setTodayStateState(t);
  const setConcretePriority = (p: ConcretePriority) => setConcretePriorityState(p);
  const [lostName, setLostName] = useState<string>("Élise");
  const [lang, setLang] = useState<Lang>("fr");
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("legato-theme") as ThemeMode | null) ?? "light";
  });
  const resolvedTheme: "light" | "dark" = "light";
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);
  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    if (typeof window !== "undefined") localStorage.setItem("legato-theme", t);
  };
  const [journal, setJournal] = useState<JournalEntry[]>([
    {
      id: "j-seed-1",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      to: "them",
      body: "Il pleut doucement. J'ai mis ton vieux pull. Je crois que je commence à comprendre ce que tu disais du silence.",
    },
  ]);
  const [wishes, setWishesState] = useState<Wishes>(EMPTY_WISHES);
  const setWishes = (w: Partial<Wishes>) => setWishesState((prev) => ({ ...prev, ...w }));

  const t = (key: string) => DICT[key]?.[lang] ?? key;
  const addJournalEntry = (e: Omit<JournalEntry, "id" | "date">) =>
    setJournal((prev) => [
      { ...e, id: `j-${Date.now()}`, date: new Date().toISOString() },
      ...prev,
    ]);

  return (
    <LegatoContext.Provider
      value={{
        branch, setBranch,
        mode, setMode,
        name, setName,
        lostName, setLostName,
        lang, setLang, t,
        theme, setTheme, resolvedTheme,
        journal, addJournalEntry,
        wishes, setWishes,
        space, setSpace,
        todayState, setTodayState,
        concretePriority, setConcretePriority,
      }}
    >
      {children}
    </LegatoContext.Provider>
  );
}

export function useLegato() {
  const ctx = useContext(LegatoContext);
  if (!ctx) throw new Error("useLegato must be used inside LegatoProvider");
  return ctx;
}

export function modeTint(mode: Mode): string {
  switch (mode) {
    case "cocoon": return "var(--rose)";
    case "anchoring": return "var(--sage)";
    case "breath": return "var(--mist)";
    case "relay": return "var(--lavender)";
  }
}
