import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Branch =
  | "person"
  | "animal"
  | "fear"
  | "anxiety"
  | "practical"
  | "unknown";

export type Mode = "cocoon" | "anchoring" | "breath" | "relay";
export type Lang = "fr" | "en";
export type ThemeMode = "auto" | "light" | "dark";

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

export const BRANCHES: { id: Branch; label: string; whisper: string }[] = [
  { id: "person",  label: "Une personne qui me manque",   whisper: "Une absence qui se fait sentir." },
  { id: "animal",  label: "Un animal aimé",               whisper: "Une présence fidèle, qui compte." },
  { id: "fear",    label: "La peur de perdre quelqu'un",  whisper: "Un être cher fragile, gardé en pensée." },
  { id: "anxiety", label: "Vivre avec l'idée de la mort", whisper: "Approcher la question, sans qu'elle pèse." },
  { id: "unknown", label: "Je ne sais pas encore",        whisper: "Rien à nommer, et c'est très bien." },
];

export const PRACTICAL_BRANCH = {
  id: "practical" as const,
  label: "Une perte récente",
  whisper: "Traverser les premiers jours, sans tout porter d'un coup.",
};

/** Suggested label for the "who is missing" step, per branch. */
export const LOST_NAME_LABEL: Record<Branch, { fr: string; en: string; placeholder: string }> = {
  person:    { fr: "Son prénom",                  en: "Their first name",       placeholder: "Prénom…" },
  animal:    { fr: "Son nom",                     en: "Their name",             placeholder: "Nom…" },
  fear:      { fr: "Le prénom de ce proche",      en: "Their first name",       placeholder: "Prénom…" },
  anxiety:   { fr: "Un mot pour ce qui pèse",     en: "A word for what weighs", placeholder: "Un mot…" },
  practical: { fr: "Son prénom",                  en: "Their first name",       placeholder: "Prénom…" },
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
};

const LegatoContext = createContext<Ctx | null>(null);

export function LegatoProvider({ children }: { children: ReactNode }) {
  const [branch, setBranch] = useState<Branch>("person");
  const [mode, setMode] = useState<Mode>("cocoon");
  const [name, setName] = useState<string>("Swann");
  const [lostName, setLostName] = useState<string>("Élise");
  const [lang, setLang] = useState<Lang>("fr");
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "auto";
    return (localStorage.getItem("legato-theme") as ThemeMode | null) ?? "auto";
  });
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  const resolvedTheme: "light" | "dark" =
    theme === "auto" ? (systemDark ? "dark" : "light") : theme;
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
