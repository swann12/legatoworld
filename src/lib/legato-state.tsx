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
  "nav.space":    { fr: "Mon espace",en: "My space" },
  "common.back":  { fr: "Retour",    en: "Back" },
  "common.continue":{ fr: "Continuer", en: "Continue" },
  "nav.wishes":   { fr: "Volontés",  en: "Wishes" },
  "home.aujourdhui":{ fr: "Aujourd'hui", en: "Today" },
  "home.greeting": { fr: "un instant pour vous poser, sans rien chercher.", en: "a moment to settle in, without looking for anything." },
  "home.parler":   { fr: "Parler à une présence", en: "Speak to a presence" },
  "home.parlerSub":{ fr: "Quelques minutes à voix basse.", en: "A few quiet minutes." },
  "home.parlerBody":{ fr: "Une présence qui écoute, sans rien attendre.", en: "A presence that listens, expecting nothing." },
  "home.enter":    { fr: "Entrer doucement", en: "Step inside" },
  "home.practical":{ fr: "Démarches concrètes", en: "Practical steps" },
  "home.practicalSub":{ fr: "Une chose à la fois, sans urgence.", en: "One thing at a time, no rush." },
  "home.practicalAlways":{ fr: "Toujours là, quand vous en aurez besoin.", en: "Always here, when you need it." },
  "home.journal":  { fr: "Journal", en: "Journal" },
  "home.journalSub":{ fr: "Un mot, une phrase, une pensée à déposer.", en: "A word, a sentence, a thought to set down." },
  "home.nowords":  { fr: "Sans mots", en: "Without words" },
  "home.nowordsSub":{ fr: "Quand parler est trop : un son, une lumière, un souffle.", en: "When words are too much: a sound, a light, a breath." },
  "home.wishes":   { fr: "Mes volontés", en: "My wishes" },
  "home.wishesSub":{ fr: "À votre rythme, ce que vous aimeriez pour plus tard.", en: "At your own pace, what you would wish for later." },
  "home.inspiration":{ fr: "Inspirations pour un proche", en: "Inspirations for a loved one" },
  "home.inspirationSub":{ fr: "Décrire la personne, recevoir des gestes qui lui ressemblent.", en: "Describe the person, receive gestures that look like them." },
  "home.crisis.label":{ fr: "Si aujourd'hui pèse trop", en: "If today feels too heavy" },
  "home.crisis.title":{ fr: "Une porte calme reste ouverte.", en: "A quiet door stays open." },
  "garden.title":  { fr: "Le jardin de", en: "The garden of" },
  "garden.subtitle":{ fr: "Promenez-vous, touchez une touffe pour y entrer.", en: "Wander, touch a patch to step into it." },
  "garden.plant":  { fr: "Planter une trace", en: "Plant a trace" },
  "garden.plantSub":{ fr: "Voix · note · photo · vidéo", en: "Voice · note · photo · video" },
  "garden.belong": { fr: "Ce jardin appartient à", en: "This garden belongs to" },
  "journal.title": { fr: "Journal", en: "Journal" },
  "journal.subtitle":{ fr: "Une page à vous : sans titre, sans plan, sans attente.", en: "A page just for you: no title, no plan, no expectation." },
  "journal.placeholder":{ fr: "Écrivez, ou laissez la page respirer…", en: "Write, or let the page breathe…" },
  "journal.save":  { fr: "Garder cette page", en: "Keep this page" },
  "journal.empty": { fr: "Aucune page. La première peut tenir en un mot.", en: "No page yet. The first can fit in one word." },
  "journal.to.self":{ fr: "à moi-même", en: "to myself" },
  "journal.to.them":{ fr: "à la personne qui me manque", en: "to the person I miss" },
  "journal.to.free":{ fr: "librement",   en: "freely" },
  "nowords.title": { fr: "Sans mots", en: "Without words" },
  "nowords.subtitle":{ fr: "Glissez, arrêtez-vous sur ce qui vous apaise.", en: "Swipe, stop on what soothes you." },
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
