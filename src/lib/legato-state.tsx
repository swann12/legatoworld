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
  { id: "person",  label: "Une personne qui me manque",      whisper: "Quelqu'un dont l'absence se fait sentir aujourd'hui." },
  { id: "animal",  label: "Un animal aimé",                  whisper: "Une présence fidèle, qui compte autant qu'un proche." },
  { id: "fear",    label: "La peur de perdre quelqu'un",     whisper: "Pour un être cher fragile, que l'on garde en pensée." },
  { id: "anxiety", label: "Vivre avec l'idée de la mort",    whisper: "Approcher la question, sans qu'elle pèse trop lourd." },
  { id: "unknown", label: "Je ne sais pas encore",           whisper: "Rien à nommer aujourd'hui, et c'est très bien comme ça." },
];

export const PRACTICAL_BRANCH = {
  id: "practical" as const,
  label: "Une perte récente",
  whisper: "Pour traverser les tout premiers jours, sans avoir à tout porter d'un coup.",
};

export const MODES: { id: Mode; label: string; whisper: string; tint: string }[] = [
  { id: "cocoon",    label: "Cocon",    whisper: "Se replier un instant et se laisser envelopper, sans rien devoir.", tint: "rose" },
  { id: "anchoring", label: "Ancrage",  whisper: "Reposer un pied sur la terre, retrouver des repères très simples.", tint: "sage" },
  { id: "breath",    label: "Souffle",  whisper: "S'alléger un peu, laisser passer un peu d'air entre les pensées.",  tint: "mist" },
  { id: "relay",     label: "Relais",   whisper: "Confier une part de ce qui pèse, ne pas tout porter aujourd'hui.",  tint: "lavender" },
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
  "home.greeting": { fr: "prenez un instant pour vous poser, sans rien chercher.", en: "take a moment to settle in, without looking for anything." },
  "home.parler":   { fr: "Parler à une présence", en: "Speak to a presence" },
  "home.parlerSub":{ fr: "Quelques minutes à voix basse, juste pour vous.", en: "A few quiet minutes, just for you." },
  "home.parlerBody":{ fr: "Une présence qui écoute en silence, sans attendre quoi que ce soit en retour.", en: "A presence that listens in silence, expecting nothing in return." },
  "home.enter":    { fr: "Entrer doucement", en: "Step inside" },
  "home.practical":{ fr: "Démarches concrètes", en: "Practical steps" },
  "home.practicalSub":{ fr: "Une seule chose à la fois, à votre rythme et sans urgence.", en: "One thing at a time, at your own pace, without rush." },
  "home.practicalAlways":{ fr: "Toujours là, le jour où vous en aurez besoin.", en: "Always here, on the day you need it." },
  "home.journal":  { fr: "Journal", en: "Journal" },
  "home.journalSub":{ fr: "Poser un mot, une phrase, une pensée à laisser de côté.", en: "Set down a word, a sentence, a thought to leave aside." },
  "home.nowords":  { fr: "Sans mots", en: "Without words" },
  "home.nowordsSub":{ fr: "Quand parler est trop, juste un son, une lumière, une respiration.", en: "When words are too much, just a sound, a light, a breath." },
  "home.wishes":   { fr: "Mes volontés", en: "My wishes" },
  "home.wishesSub":{ fr: "Poser, à votre rythme, ce que vous aimeriez pour plus tard.", en: "Set down, at your own pace, what you would wish for later." },
  "home.inspiration":{ fr: "Inspirations pour un proche", en: "Inspirations for a loved one" },
  "home.inspirationSub":{ fr: "Décrire la personne, recevoir des gestes simples qui lui ressemblent.", en: "Describe the person, receive gentle gestures that look like them." },
  "home.crisis.label":{ fr: "Si aujourd'hui pèse trop", en: "If today feels too heavy" },
  "home.crisis.title":{ fr: "Une porte calme reste ouverte, quand vous voudrez.", en: "A quiet door stays open, whenever you wish." },
  "garden.title":  { fr: "Le jardin de", en: "The garden of" },
  "garden.subtitle":{ fr: "Promenez-vous librement, et touchez une touffe pour entrer dans cette zone.", en: "Wander freely, and touch a patch to step into that zone." },
  "garden.plant":  { fr: "Planter une trace", en: "Plant a trace" },
  "garden.plantSub":{ fr: "Voix · note · photo · vidéo", en: "Voice · note · photo · video" },
  "garden.belong": { fr: "Ce jardin appartient à", en: "This garden belongs to" },
  "journal.title": { fr: "Journal", en: "Journal" },
  "journal.subtitle":{ fr: "Une page rien qu'à vous, sans titre, sans plan, sans attente.", en: "A page just for you, with no title, no plan, no expectation." },
  "journal.placeholder":{ fr: "Écrivez ici, ou laissez simplement la page respirer un moment…", en: "Write here, or simply let the page breathe for a moment…" },
  "journal.save":  { fr: "Garder cette page", en: "Keep this page" },
  "journal.empty": { fr: "Aucune page encore. La première peut tenir en un seul mot.", en: "No page yet. The first can fit in a single word." },
  "journal.to.self":{ fr: "à moi-même", en: "to myself" },
  "journal.to.them":{ fr: "à la personne qui me manque", en: "to the person I miss" },
  "journal.to.free":{ fr: "librement",   en: "freely" },
  "nowords.title": { fr: "Sans mots", en: "Without words" },
  "nowords.subtitle":{ fr: "Glissez doucement, et arrêtez-vous sur l'ambiance qui vous apaise.", en: "Swipe gently, and stop on the ambience that soothes you." },
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
