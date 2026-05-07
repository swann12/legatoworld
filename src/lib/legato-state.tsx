import { createContext, useContext, useState, type ReactNode } from "react";

export type Branch =
  | "person"
  | "animal"
  | "fear"
  | "anxiety"
  | "practical"
  | "unknown";

export type Mode = "cocoon" | "anchoring" | "breath" | "relay";
export type Lang = "fr" | "en";

export type JournalEntry = {
  id: string;
  date: string;       // ISO
  title?: string;
  body: string;
  to?: "self" | "them" | "free"; // address
};

export const BRANCHES: { id: Branch; label: string; whisper: string }[] = [
  { id: "person", label: "Une personne", whisper: "Quelqu'un que vous portez." },
  { id: "animal", label: "Un animal", whisper: "Une petite présence dévouée." },
  { id: "fear", label: "La peur de perdre quelqu'un", whisper: "Une anticipation, en amont." },
  { id: "anxiety", label: "Réflexion sur la mort", whisper: "Les grandes questions, tout doucement." },
  { id: "unknown", label: "Je ne sais pas encore", whisper: "C'est un lieu, aussi." },
];

export const PRACTICAL_BRANCH = {
  id: "practical" as const,
  label: "Je traverse une perte récente",
  whisper: "J'ai besoin d'un accompagnement concret, maintenant.",
};

export const MODES: { id: Mode; label: string; whisper: string; tint: string }[] = [
  { id: "cocoon", label: "Cocon", whisper: "Peu d'énergie. Peu de choix. Enveloppé·e.", tint: "rose" },
  { id: "anchoring", label: "Ancrage", whisper: "Du brouillard. Besoin de sol sous les pieds.", tint: "sage" },
  { id: "breath", label: "Souffle", whisper: "Une petite réouverture. Plus d'air.", tint: "mist" },
  { id: "relay", label: "Relais", whisper: "Des mains concrètes. L'aide des autres.", tint: "lavender" },
];

/* ─── i18n — minimal dictionary, only for surfaces touched by the redesign ─── */

type Dict = Record<string, { fr: string; en: string }>;
const DICT: Dict = {
  "nav.home":     { fr: "Accueil",   en: "Home" },
  "nav.garden":   { fr: "Jardin",    en: "Garden" },
  "nav.journal":  { fr: "Journal",   en: "Journal" },
  "nav.presence": { fr: "Présence",  en: "Presence" },
  "nav.space":    { fr: "Espace",    en: "Space" },
  "common.back":  { fr: "Retour",    en: "Back" },
  "common.continue":{ fr: "Continuer", en: "Continue" },
  "home.aujourdhui":{ fr: "Aujourd'hui, lentement", en: "Today, slowly" },
  "home.posezvous":{ fr: "posez-vous ici", en: "settle in here" },
  "home.unmoment": { fr: "un moment.", en: "for a moment." },
  "home.parler":   { fr: "Parler à la Présence", en: "Speak with the Presence" },
  "home.parlerSub":{ fr: "Quelques minutes tranquilles", en: "A few quiet minutes" },
  "home.parlerBody":{ fr: "Une petite présence qui écoute. Aucune tâche, à votre rythme.", en: "A small presence that listens. No task, at your pace." },
  "home.enter":    { fr: "Entrer →", en: "Enter →" },
  "home.practical":{ fr: "Accompagnement concret", en: "Practical support" },
  "home.practicalSub":{ fr: "Étape par étape, pour les premiers jours.", en: "Step by step, for the first days." },
  "home.practicalAlways":{ fr: "Toujours à portée, même en mode tranquille.", en: "Always within reach, even in quiet mode." },
  "home.journal":  { fr: "Le Journal", en: "Journal" },
  "home.journalSub":{ fr: "Écrire un mot, déposer une émotion.", en: "Write a word, set down an emotion." },
  "home.nowords":  { fr: "Sans mots", en: "Without words" },
  "home.nowordsSub":{ fr: "Quand parler est trop. Des textures à parcourir.", en: "When speaking is too much. Textures to drift through." },
  "home.crisis.label":{ fr: "Si aujourd'hui est trop", en: "If today is too much" },
  "home.crisis.title":{ fr: "Une petite porte, calme", en: "A small, quiet door" },
  "garden.title":  { fr: "Le Jardin de", en: "The Garden of" },
  "garden.subtitle":{ fr: "Promenez-vous. Touchez une touffe pour entrer dans une zone du jardin.", en: "Wander. Touch a patch to enter a zone of the garden." },
  "garden.plant":  { fr: "Planter une nouvelle trace", en: "Plant a new trace" },
  "garden.plantSub":{ fr: "voix · note · photo · vidéo", en: "voice · note · photo · video" },
  "garden.belong": { fr: "Ce jardin appartient à", en: "This garden belongs to" },
  "journal.title": { fr: "Le Journal", en: "The Journal" },
  "journal.subtitle":{ fr: "Une page à vous. Sans titre, sans pression. Le geste suffit.", en: "A page that's yours. No title, no pressure. The gesture is enough." },
  "journal.placeholder":{ fr: "Écrivez ici, ou laissez la page respirer…", en: "Write here, or let the page breathe…" },
  "journal.save":  { fr: "Garder cette page", en: "Keep this page" },
  "journal.empty": { fr: "Aucune page encore. La première peut être un seul mot.", en: "No page yet. The first can be a single word." },
  "journal.to.self":{ fr: "à moi-même", en: "to myself" },
  "journal.to.them":{ fr: "à elle / lui", en: "to them" },
  "journal.to.free":{ fr: "librement",   en: "freely" },
  "nowords.title": { fr: "Sans mots", en: "Without words" },
  "nowords.subtitle":{ fr: "Glissez. Arrêtez-vous sur ce qui vous fait du bien.", en: "Swipe. Stop on what feels good." },
  "nowords.sound": { fr: "Son apaisant", en: "Calming sound" },
  "nowords.silence":{ fr: "Silence", en: "Silence" },
  "practical.always":{ fr: "Mode pratique", en: "Practical mode" },
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
  t: (key: string) => string;
  journal: JournalEntry[];
  addJournalEntry: (e: Omit<JournalEntry, "id" | "date">) => void;
};

const LegatoContext = createContext<Ctx | null>(null);

export function LegatoProvider({ children }: { children: ReactNode }) {
  const [branch, setBranch] = useState<Branch>("person");
  const [mode, setMode] = useState<Mode>("cocoon");
  const [name, setName] = useState<string>("Maya");
  const [lostName, setLostName] = useState<string>("Élise");
  const [lang, setLang] = useState<Lang>("fr");
  const [journal, setJournal] = useState<JournalEntry[]>([
    {
      id: "j-seed-1",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      to: "them",
      body: "Il pleut doucement. J'ai mis ton vieux pull. Je crois que je commence à comprendre ce que tu disais sur le silence.",
    },
  ]);

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
        journal, addJournalEntry,
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
