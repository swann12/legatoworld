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
  { id: "person", label: "Une personne", whisper: "Quelqu'un qui vous manque, aujourd'hui." },
  { id: "animal", label: "Un animal", whisper: "Une présence fidèle, qui compte." },
  { id: "fear", label: "La peur d'une perte", whisper: "Pour un proche fragile, qu'on garde en pensée." },
  { id: "anxiety", label: "Vivre avec l'idée de la mort", whisper: "Approcher les grandes questions, en douceur." },
  { id: "unknown", label: "Je ne sais pas encore", whisper: "Ne rien nommer, c'est déjà une place." },
];

export const PRACTICAL_BRANCH = {
  id: "practical" as const,
  label: "Une perte récente",
  whisper: "Pour traverser les premiers jours, pas à pas.",
};

export const MODES: { id: Mode; label: string; whisper: string; tint: string }[] = [
  { id: "cocoon",    label: "Cocon",    whisper: "Se replier, se reposer, se laisser envelopper.", tint: "rose" },
  { id: "anchoring", label: "Ancrage",  whisper: "Retrouver des repères, avancer pas à pas.",      tint: "sage" },
  { id: "breath",    label: "Souffle",  whisper: "Reprendre de l'air, s'alléger un peu.",          tint: "mist" },
  { id: "relay",     label: "Relais",   whisper: "Se laisser aider, ne pas porter seul·e.",        tint: "lavender" },
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
  "nav.space":    { fr: "Mon espace",en: "My space" },
  "common.back":  { fr: "Retour",    en: "Back" },
  "common.continue":{ fr: "Continuer", en: "Continue" },
  "nav.wishes":   { fr: "Volontés",  en: "Wishes" },
  "home.aujourdhui":{ fr: "Aujourd'hui", en: "Today" },
  "home.greeting": { fr: "prenez le temps de vous poser, juste un moment.", en: "take a moment to settle in, gently." },
  "home.parler":   { fr: "Parler à la présence", en: "Speak to the presence" },
  "home.parlerSub":{ fr: "Quelques minutes pour soi, à votre rythme.", en: "A few minutes for yourself, at your own pace." },
  "home.parlerBody":{ fr: "Une présence qui écoute, simplement, sans rien attendre en retour.", en: "A presence that listens, simply, expecting nothing in return." },
  "home.enter":    { fr: "Entrer doucement", en: "Step inside" },
  "home.practical":{ fr: "Démarches concrètes", en: "Practical steps" },
  "home.practicalSub":{ fr: "Les premiers jours, organisés pas à pas.", en: "The first days, organised step by step." },
  "home.practicalAlways":{ fr: "Toujours là, quand vous en aurez besoin.", en: "Always here, whenever you need." },
  "home.journal":  { fr: "Journal", en: "Journal" },
  "home.journalSub":{ fr: "Poser un mot, une pensée, une page.", en: "Set down a word, a thought, a page." },
  "home.nowords":  { fr: "Sans mots", en: "Without words" },
  "home.nowordsSub":{ fr: "Quand parler est trop : un son, une lumière, une respiration.", en: "When words are too much: a sound, a light, a breath." },
  "home.wishes":   { fr: "Mes volontés", en: "My wishes" },
  "home.wishesSub":{ fr: "Déposer, à votre rythme, ce que vous souhaitez pour plus tard.", en: "Set down, at your own pace, what you would wish for later." },
  "home.inspiration":{ fr: "Inspirations", en: "Inspirations" },
  "home.inspirationSub":{ fr: "Décrire un être cher, recevoir des gestes simples à poser.", en: "Describe a loved one, receive gentle, concrete gestures." },
  "home.crisis.label":{ fr: "Si aujourd'hui pèse trop", en: "If today weighs too much" },
  "home.crisis.title":{ fr: "Une porte calme reste ouverte ici.", en: "A quiet door remains open here." },
  "garden.title":  { fr: "Le jardin de", en: "The garden of" },
  "garden.subtitle":{ fr: "Promenez-vous. Touchez une touffe pour entrer dans une zone.", en: "Wander. Touch a patch to enter a zone." },
  "garden.plant":  { fr: "Planter une trace", en: "Plant a trace" },
  "garden.plantSub":{ fr: "Voix · note · photo · vidéo", en: "Voice · note · photo · video" },
  "garden.belong": { fr: "Ce jardin appartient à", en: "This garden belongs to" },
  "journal.title": { fr: "Journal", en: "Journal" },
  "journal.subtitle":{ fr: "Une page rien qu'à vous, sans titre et sans attente.", en: "A page just for you, untitled, with no expectation." },
  "journal.placeholder":{ fr: "Écrivez ici, ou laissez simplement la page respirer…", en: "Write here, or simply let the page breathe…" },
  "journal.save":  { fr: "Garder cette page", en: "Keep this page" },
  "journal.empty": { fr: "Aucune page encore. La première peut tenir en un seul mot.", en: "No page yet. The first can fit in a single word." },
  "journal.to.self":{ fr: "à moi-même", en: "to myself" },
  "journal.to.them":{ fr: "à elle, à lui", en: "to them" },
  "journal.to.free":{ fr: "librement",   en: "freely" },
  "nowords.title": { fr: "Sans mots", en: "Without words" },
  "nowords.subtitle":{ fr: "Faites glisser, et arrêtez-vous sur ce qui vous apaise.", en: "Swipe, and stop on what feels gentle." },
  "nowords.sound": { fr: "Son d'ambiance", en: "Ambient sound" },
  "nowords.silence":{ fr: "Silence", en: "Silence" },
  "practical.always":{ fr: "Démarches concrètes", en: "Practical steps" },
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
