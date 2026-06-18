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

export type Feeling =
  | "triste" | "perdu" | "epuise" | "anxieux" | "seul"
  | "colere" | "engourdi" | "submerge" | "apaise" | "inconnu";

export const FEELINGS: { id: Feeling; label: string }[] = [
  { id: "triste",    label: "triste" },
  { id: "perdu",     label: "perdu·e" },
  { id: "epuise",    label: "épuisé·e" },
  { id: "anxieux",   label: "anxieux·se" },
  { id: "seul",      label: "seul·e" },
  { id: "colere",    label: "en colère" },
  { id: "engourdi",  label: "engourdi·e" },
  { id: "submerge",  label: "submergé·e" },
  { id: "apaise",    label: "apaisé·e" },
  { id: "inconnu",   label: "je ne sais pas" },
];

export type PracticalWho = "recent" | "endoflife" | "self" | "other";
export const PRACTICAL_WHO: { id: PracticalWho; label: string }[] = [
  { id: "recent",     label: "Une personne récemment décédée" },
  { id: "endoflife",  label: "Un proche dont la fin de vie approche" },
  { id: "self",       label: "Moi-même, pour préparer mes volontés" },
  { id: "other",      label: "Autre situation" },
];

export type PracticalContext = {
  who: PracticalWho | null;
  deathDate: string | null;     // ISO or special: "unknown" | "notyet"
  guided: boolean | null;       // true = guidez-moi
};

/* ─── Onboarding conditionnel ─── */

export type Situation =
  | "perdu" | "peur" | "accompagner" | "soutenir"
  | "questionnement" | "volontes" | "demarches" | "soutien";

export type Relation =
  | "parent" | "conjoint" | "enfant" | "ami" | "animal" | "autre";

export type Timeframe =
  | "today" | "thisWeek" | "thisMonth" | "months" | "overYear";

export type Stage =
  | "recent" | "obseques_a_organiser" | "obseques_passees" | "demarches" | "apres";

export type PrimaryNeed = "emotional" | "practical" | "both";

export type Emotion =
  | "tristesse" | "colere" | "peur" | "anxiete" | "sideration"
  | "culpabilite" | "solitude" | "fatigue" | "confusion"
  | "nostalgie" | "soulagement" | "vide" | "calme" | "aide";

export const EMOTIONS: { id: Emotion; label: string }[] = [
  { id: "tristesse",    label: "Tristesse" },
  { id: "colere",       label: "Colère" },
  { id: "peur",         label: "Peur" },
  { id: "anxiete",      label: "Anxiété" },
  { id: "sideration",   label: "Sidération" },
  { id: "culpabilite",  label: "Culpabilité" },
  { id: "solitude",     label: "Solitude" },
  { id: "fatigue",      label: "Fatigue" },
  { id: "confusion",    label: "Confusion" },
  { id: "nostalgie",    label: "Nostalgie" },
  { id: "soulagement",  label: "Soulagement" },
  { id: "vide",         label: "Vide" },
  { id: "calme",        label: "Calme" },
  { id: "aide",         label: "Besoin d'aide" },
];

export const SITUATIONS: { id: Situation; label: string; primaryNeed: PrimaryNeed }[] = [
  { id: "perdu",          label: "J'ai perdu quelqu'un",                primaryNeed: "both" },
  { id: "peur",           label: "J'ai peur de perdre quelqu'un",       primaryNeed: "emotional" },
  { id: "accompagner",    label: "J'accompagne quelqu'un en fin de vie", primaryNeed: "both" },
  { id: "soutenir",       label: "Je soutiens une personne endeuillée", primaryNeed: "emotional" },
  { id: "questionnement", label: "Je me questionne sur la mort",        primaryNeed: "emotional" },
  { id: "volontes",       label: "Je veux préparer mes volontés",       primaryNeed: "practical" },
  { id: "demarches",      label: "Je veux surtout de l'aide pour les démarches", primaryNeed: "practical" },
  { id: "soutien",        label: "Je veux surtout du soutien émotionnel", primaryNeed: "emotional" },
];

export const RELATIONS: { id: Relation; label: string }[] = [
  { id: "parent",   label: "Un parent" },
  { id: "conjoint", label: "Mon ou ma conjoint·e" },
  { id: "enfant",   label: "Mon enfant" },
  { id: "ami",      label: "Un·e ami·e" },
  { id: "animal",   label: "Un animal" },
  { id: "autre",    label: "Une autre personne" },
];

export const TIMEFRAMES: { id: Timeframe; label: string }[] = [
  { id: "today",      label: "Aujourd'hui ou ces derniers jours" },
  { id: "thisWeek",   label: "Cette semaine" },
  { id: "thisMonth",  label: "Ce mois-ci" },
  { id: "months",     label: "Il y a quelques mois" },
  { id: "overYear",   label: "Il y a plus d'un an" },
];

export const STAGES: { id: Stage; label: string }[] = [
  { id: "recent",                 label: "C'est tout récent" },
  { id: "obseques_a_organiser",   label: "J'organise les obsèques" },
  { id: "obseques_passees",       label: "Les obsèques sont passées" },
  { id: "demarches",              label: "Je suis dans les démarches" },
  { id: "apres",                  label: "C'est plus ancien, je traverse l'après" },
];

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
  feelings: Feeling[];
  setFeelings: (f: Feeling[]) => void;
  practicalContext: PracticalContext;
  setPracticalContext: (p: Partial<PracticalContext>) => void;
  careOnboarded: boolean;
  setCareOnboarded: (v: boolean) => void;
  practicalOnboarded: boolean;
  setPracticalOnboarded: (v: boolean) => void;

  // Onboarding conditionnel
  situation: Situation | null;
  setSituation: (s: Situation | null) => void;
  lovedOneName: string;
  setLovedOneName: (s: string) => void;
  lovedOneRelation: Relation | null;
  setLovedOneRelation: (r: Relation | null) => void;
  timeframe: Timeframe | null;
  setTimeframe: (t: Timeframe | null) => void;
  stage: Stage | null;
  setStage: (s: Stage | null) => void;
  primaryNeed: PrimaryNeed | null;
  setPrimaryNeed: (p: PrimaryNeed | null) => void;

  // Émotion du moment
  currentEmotions: Emotion[];
  setCurrentEmotions: (e: Emotion[]) => void;
  currentEmotionAt: string | null;

  // Mode « aujourd'hui c'est dur »
  softDay: boolean;
  toggleSoftDay: () => void;

  // Mode nuit override
  nightModeOverride: boolean | null;
  setNightModeOverride: (v: boolean | null) => void;
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

  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [practicalContext, setPracticalContextState] = useState<PracticalContext>({
    who: null, deathDate: null, guided: null,
  });
  const setPracticalContext = (p: Partial<PracticalContext>) =>
    setPracticalContextState((prev) => ({ ...prev, ...p }));
  const [careOnboarded, setCareOnboarded] = useState(false);
  const [practicalOnboarded, setPracticalOnboarded] = useState(false);

  // ── persistance localStorage pour le contexte conditionnel ──
  const lsGet = <T,>(k: string, fb: T): T => {
    if (typeof window === "undefined") return fb;
    try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fb; }
    catch { return fb; }
  };
  const lsSet = (k: string, v: unknown) => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ }
  };

  const [situation, setSituationState] = useState<Situation | null>(() => lsGet("lg.situation", null));
  const setSituation = (s: Situation | null) => { setSituationState(s); lsSet("lg.situation", s); };

  const [lovedOneName, setLovedOneNameState] = useState<string>(() => lsGet("lg.lovedOneName", ""));
  const setLovedOneName = (s: string) => { setLovedOneNameState(s); lsSet("lg.lovedOneName", s); };

  const [lovedOneRelation, setLovedOneRelationState] = useState<Relation | null>(() => lsGet("lg.lovedOneRelation", null));
  const setLovedOneRelation = (r: Relation | null) => { setLovedOneRelationState(r); lsSet("lg.lovedOneRelation", r); };

  const [timeframe, setTimeframeState] = useState<Timeframe | null>(() => lsGet("lg.timeframe", null));
  const setTimeframe = (t: Timeframe | null) => { setTimeframeState(t); lsSet("lg.timeframe", t); };

  const [stage, setStageState] = useState<Stage | null>(() => lsGet("lg.stage", null));
  const setStage = (s: Stage | null) => { setStageState(s); lsSet("lg.stage", s); };

  const [primaryNeed, setPrimaryNeedState] = useState<PrimaryNeed | null>(() => lsGet("lg.primaryNeed", null));
  const setPrimaryNeed = (p: PrimaryNeed | null) => { setPrimaryNeedState(p); lsSet("lg.primaryNeed", p); };

  const [currentEmotions, setCurrentEmotionsState] = useState<Emotion[]>(() => lsGet("lg.currentEmotions", [] as Emotion[]));
  const [currentEmotionAt, setCurrentEmotionAt] = useState<string | null>(() => lsGet("lg.currentEmotionAt", null));
  const setCurrentEmotions = (e: Emotion[]) => {
    setCurrentEmotionsState(e);
    const now = new Date().toISOString();
    setCurrentEmotionAt(now);
    lsSet("lg.currentEmotions", e);
    lsSet("lg.currentEmotionAt", now);
  };

  const [softDay, setSoftDay] = useState<boolean>(() => {
    const at = lsGet<string | null>("lg.softDayAt", null);
    if (!at) return false;
    const d = new Date(at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const toggleSoftDay = () => {
    const next = !softDay;
    setSoftDay(next);
    lsSet("lg.softDayAt", next ? new Date().toISOString() : null);
  };

  const [nightModeOverride, setNightModeOverrideState] = useState<boolean | null>(() => lsGet("lg.nightOverride", null));
  const setNightModeOverride = (v: boolean | null) => { setNightModeOverrideState(v); lsSet("lg.nightOverride", v); };

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
        feelings, setFeelings,
        practicalContext, setPracticalContext,
        careOnboarded, setCareOnboarded,
        practicalOnboarded, setPracticalOnboarded,
        situation, setSituation,
        lovedOneName, setLovedOneName,
        lovedOneRelation, setLovedOneRelation,
        timeframe, setTimeframe,
        stage, setStage,
        primaryNeed, setPrimaryNeed,
        currentEmotions, setCurrentEmotions,
        currentEmotionAt,
        softDay, toggleSoftDay,
        nightModeOverride, setNightModeOverride,
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
