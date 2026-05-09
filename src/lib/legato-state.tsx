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
  { id: "person", label: "Une personne", whisper: "Quelqu'un qui vous manque." },
  { id: "animal", label: "Un animal", whisper: "Une présence fidèle." },
  { id: "fear", label: "La peur d'une perte", whisper: "Un proche fragile, en pensée." },
  { id: "anxiety", label: "Penser à la mort", whisper: "Les grandes questions, en douceur." },
  { id: "unknown", label: "Je ne sais pas encore", whisper: "C'est aussi une place." },
];

export const PRACTICAL_BRANCH = {
  id: "practical" as const,
  label: "Une perte récente",
  whisper: "Besoin d'aide concrète, maintenant.",
};

export const MODES: { id: Mode; label: string; whisper: string; tint: string }[] = [
  { id: "cocoon",    label: "Cocon",    whisper: "Se replier, se reposer, être enveloppé·e.", tint: "rose" },
  { id: "anchoring", label: "Ancrage",  whisper: "Retrouver des repères, étape par étape.",   tint: "sage" },
  { id: "breath",    label: "Souffle",  whisper: "Reprendre de l'air, alléger un peu.",        tint: "mist" },
  { id: "relay",     label: "Relais",   whisper: "S'appuyer sur les autres, demander de l'aide.", tint: "lavender" },
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
    case "cocoon":    return { density: "tight", halo: "rich",    primary: "presence",  ctaLabel: "Rester un instant" };
    case "anchoring": return { density: "calm",  halo: "calm",    primary: "practical", ctaLabel: "Avancer d'un pas" };
    case "breath":    return { density: "open",  halo: "calm",    primary: "journal",   ctaLabel: "Respirer un peu" };
    case "relay":     return { density: "calm",  halo: "default", primary: "relay",     ctaLabel: "Demander de l'aide" };
  }
}

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
  "nav.wishes":   { fr: "Volontés",  en: "Wishes" },
  "home.aujourdhui":{ fr: "Aujourd'hui", en: "Today" },
  "home.posezvous":{ fr: "posez-vous ici", en: "settle in here" },
  "home.unmoment": { fr: "un instant.", en: "for a moment." },
  "home.parler":   { fr: "Parler à la Présence", en: "Speak with the Presence" },
  "home.parlerSub":{ fr: "Quelques minutes tranquilles", en: "A few quiet minutes" },
  "home.parlerBody":{ fr: "Une présence qui écoute, sans rien attendre.", en: "A presence that listens, expecting nothing." },
  "home.enter":    { fr: "Entrer", en: "Enter" },
  "home.practical":{ fr: "Accompagnement concret", en: "Practical support" },
  "home.practicalSub":{ fr: "Étape par étape, pour les premiers jours.", en: "Step by step, for the first days." },
  "home.practicalAlways":{ fr: "Toujours à portée.", en: "Always within reach." },
  "home.journal":  { fr: "Journal", en: "Journal" },
  "home.journalSub":{ fr: "Déposer un mot, une pensée.", en: "Set down a word, a thought." },
  "home.nowords":  { fr: "Sans mots", en: "Without words" },
  "home.nowordsSub":{ fr: "Quand parler est trop. Des textures à parcourir.", en: "When speaking is too much. Textures to drift through." },
  "home.wishes":   { fr: "Mes volontés", en: "My wishes" },
  "home.wishesSub":{ fr: "Écrire ce que je voudrais, pour le jour venu.", en: "Write what I would want, when the time comes." },
  "home.inspiration":{ fr: "Inspirations", en: "Inspirations" },
  "home.inspirationSub":{ fr: "Décrire une personne, recevoir des pistes douces.", en: "Describe a person, receive gentle suggestions." },
  "home.crisis.label":{ fr: "Si aujourd'hui est trop lourd", en: "If today is too heavy" },
  "home.crisis.title":{ fr: "Une porte calme, juste là", en: "A quiet door, right here" },
  "garden.title":  { fr: "Le jardin de", en: "The garden of" },
  "garden.subtitle":{ fr: "Promenez-vous. Touchez une touffe pour entrer dans une zone.", en: "Wander. Touch a patch to enter a zone." },
  "garden.plant":  { fr: "Planter une trace", en: "Plant a trace" },
  "garden.plantSub":{ fr: "voix · note · photo · vidéo", en: "voice · note · photo · video" },
  "garden.belong": { fr: "Ce jardin appartient à", en: "This garden belongs to" },
  "journal.title": { fr: "Journal", en: "Journal" },
  "journal.subtitle":{ fr: "Une page à vous. Sans titre, sans pression.", en: "A page that's yours. No title, no pressure." },
  "journal.placeholder":{ fr: "Écrivez ici, ou laissez la page respirer…", en: "Write here, or let the page breathe…" },
  "journal.save":  { fr: "Garder cette page", en: "Keep this page" },
  "journal.empty": { fr: "Aucune page encore. La première peut tenir en un mot.", en: "No page yet. The first can be a single word." },
  "journal.to.self":{ fr: "à moi-même", en: "to myself" },
  "journal.to.them":{ fr: "à elle / lui", en: "to them" },
  "journal.to.free":{ fr: "librement",   en: "freely" },
  "nowords.title": { fr: "Sans mots", en: "Without words" },
  "nowords.subtitle":{ fr: "Glissez. Arrêtez-vous sur ce qui apaise.", en: "Swipe. Stop on what feels good." },
  "nowords.sound": { fr: "Son apaisant", en: "Calming sound" },
  "nowords.silence":{ fr: "Silence", en: "Silence" },
  "practical.always":{ fr: "Accompagnement concret", en: "Practical support" },
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
