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
  | "questionnement" | "volontes";

export type Relation =
  | "pere" | "mere" | "conjoint" | "enfant" | "frere_soeur"
  | "grand_parent" | "ami" | "collegue" | "animal" | "autre";

export type Timeframe = never;

export type Stage =
  | "nouvelle" | "obseques_a_organiser" | "obseques_prevues" | "obseques_passees" | "demarches" | "apres" | "inconnu"
  | "malade" | "fin_de_vie_proche" | "inquietude" | "peur_recurrente" | "parler_difficile"
  | "proche" | "aidant" | "loin" | "coordonner" | "sans_reperes"
  | "mots" | "aide_concrete" | "comprendre" | "duree" | "rejoindre_cercle"
  | "peur_mourir" | "peur_perdre" | "pensee_recurrente" | "reflechir" | "parler_proches" | "apprendre"
  | "ceremonie" | "documents" | "messages" | "medical" | "personnes" | "indecis";

export type PrimaryNeed = "emotional" | "practical" | "both";

export type Emotion =
  | "tristesse" | "colere" | "peur" | "anxiete" | "sideration"
  | "culpabilite" | "solitude" | "fatigue" | "confusion"
  | "nostalgie" | "soulagement" | "vide" | "besoin_calme" | "besoin_aide";

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
  { id: "besoin_calme", label: "Besoin de calme" },
  { id: "besoin_aide",  label: "Besoin d'aide" },
];

export const SITUATIONS: { id: Situation; label: string }[] = [
  { id: "perdu",          label: "J'ai perdu quelqu'un" },
  { id: "peur",           label: "J'ai peur de perdre quelqu'un" },
  { id: "accompagner",    label: "J'accompagne quelqu'un en fin de vie" },
  { id: "soutenir",       label: "Je soutiens une personne endeuillée" },
  { id: "questionnement", label: "Je me questionne sur la mort" },
  { id: "volontes",       label: "Je veux préparer mes volontés" },
];

export const RELATIONS: { id: Relation; label: string }[] = [
  { id: "pere",         label: "Mon père" },
  { id: "mere",         label: "Ma mère" },
  { id: "conjoint",     label: "Mon / ma conjoint·e" },
  { id: "enfant",       label: "Mon enfant" },
  { id: "frere_soeur",  label: "Un frère ou une sœur" },
  { id: "grand_parent", label: "Un grand-parent" },
  { id: "ami",          label: "Un ami ou une amie" },
  { id: "collegue",     label: "Un collègue" },
  { id: "animal",       label: "Mon animal" },
  { id: "autre",        label: "Une autre personne" },
];

export const TIMEFRAMES: { id: Timeframe; label: string }[] = [];

export const STAGES_BY_SITUATION: Record<Situation, { id: Stage; label: string }[]> = {
  perdu: [
    { id: "nouvelle", label: "Je viens d'apprendre la nouvelle" },
    { id: "obseques_a_organiser", label: "Les obsèques ne sont pas encore organisées" },
    { id: "obseques_prevues", label: "Les obsèques sont prévues" },
    { id: "obseques_passees", label: "Les obsèques sont passées" },
    { id: "demarches", label: "Je suis dans les démarches administratives" },
    { id: "apres", label: "Je suis dans l'après, à plus long terme" },
    { id: "inconnu", label: "Je ne sais pas où j'en suis" },
  ],
  peur: [
    { id: "malade", label: "La personne est gravement malade" },
    { id: "fin_de_vie_proche", label: "La fin de vie approche" },
    { id: "inquietude", label: "Je suis inquiet·ète sans certitude" },
    { id: "peur_recurrente", label: "Je vis avec une peur récurrente" },
    { id: "parler_difficile", label: "Je ne sais pas comment en parler" },
  ],
  accompagner: [
    { id: "proche", label: "Je suis un proche" },
    { id: "aidant", label: "Je suis aidant·e au quotidien" },
    { id: "loin", label: "Je suis loin géographiquement" },
    { id: "coordonner", label: "Je dois organiser avec d'autres proches" },
    { id: "sans_reperes", label: "Je ne sais pas comment aider" },
  ],
  soutenir: [
    { id: "mots", label: "Trouver les bons mots" },
    { id: "aide_concrete", label: "Proposer une aide concrète" },
    { id: "comprendre", label: "Comprendre ce que la personne traverse" },
    { id: "duree", label: "Être présent·e dans le temps" },
    { id: "rejoindre_cercle", label: "Rejoindre son cercle de soutien" },
  ],
  questionnement: [
    { id: "peur_mourir", label: "J'ai peur de mourir" },
    { id: "peur_perdre", label: "J'ai peur de perdre les autres" },
    { id: "pensee_recurrente", label: "Je pense souvent à la mort" },
    { id: "reflechir", label: "Je veux réfléchir à ce qui compte" },
    { id: "parler_proches", label: "Je veux aborder le sujet avec mes proches" },
    { id: "apprendre", label: "Je veux lire, écouter, comprendre" },
  ],
  volontes: [
    { id: "ceremonie", label: "Mes souhaits de cérémonie" },
    { id: "documents", label: "Mes documents importants" },
    { id: "messages", label: "Mes messages à transmettre" },
    { id: "medical", label: "Mes volontés médicales" },
    { id: "personnes", label: "Les personnes à prévenir" },
    { id: "indecis", label: "Je ne sais pas encore" },
  ],
};

export const STAGES: { id: Stage; label: string }[] = Object.values(STAGES_BY_SITUATION).flat();

/** Helpers de regroupement par lien. */
export function isAnimal(r: Relation | null): boolean { return r === "animal"; }
export function isFriendOrColleague(r: Relation | null): boolean { return r === "ami" || r === "collegue"; }
export function isFamilyClose(r: Relation | null): boolean {
  return r === "pere" || r === "mere" || r === "conjoint" || r === "enfant" || r === "frere_soeur" || r === "grand_parent";
}

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
  lovedLabel: string;
  setLovedLabel: (s: string) => void;
  lovedOther: string;
  setLovedOther: (s: string) => void;
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

  // Mode « Alléger » : moins de contenu, une action à la fois
  lightMode: boolean;
  setLightMode: (v: boolean) => void;

  // Mode « aujourd'hui c'est dur »
  softDay: boolean;
  toggleSoftDay: () => void;

  // Mode nuit override
  nightModeOverride: boolean | null;
  setNightModeOverride: (v: boolean | null) => void;

  // Vrai après le 1er useEffect côté client — protège contre les mismatches SSR
  hydrated: boolean;

  // Statuts de tâches pratiques (persistés)
  taskStatus: Record<string, TaskStatus>;
  setTaskStatus: (id: string, status: TaskStatus) => void;

  // Vrai si l'utilisateur est légalement impliqué (ami/collègue/autre)
  legallyInvolved: boolean | null;
  setLegallyInvolved: (v: boolean | null) => void;
};

export type TaskStatus =
  | "todo" | "doing" | "done" | "delegated"
  | "blocked" | "missing_doc" | "snoozed" | "not_concerned";

const LegatoContext = createContext<Ctx | null>(null);

export function LegatoProvider({ children }: { children: ReactNode }) {
  const [branch, setBranch] = useState<Branch>("person");
  const [mode, setMode] = useState<Mode>("cocoon");
  const [name, setName] = useState<string>("");
  const [lostName, setLostName] = useState<string>("Élise");
  const [lang, setLang] = useState<Lang>("fr");
  const [theme, setThemeState] = useState<ThemeMode>("auto");
  const [systemDark, setSystemDark] = useState<boolean>(false);
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

  const [situation, setSituationState] = useState<Situation | null>(null);
  const setSituation = (s: Situation | null) => { setSituationState(s); lsSet("lg.situation", s); };

  const [lovedLabel, setLovedLabelState] = useState<string>("");
  const setLovedLabel = (s: string) => { setLovedLabelState(s); lsSet("lg.lovedLabel", s); lsSet("lg.lovedOneName", s); };
  const lovedOneName = lovedLabel;
  const setLovedOneName = setLovedLabel;

  const [lovedOther, setLovedOtherState] = useState<string>("");
  const setLovedOther = (s: string) => { setLovedOtherState(s); lsSet("lg.lovedOther", s); };

  const [lovedOneRelation, setLovedOneRelationState] = useState<Relation | null>(null);
  const setLovedOneRelation = (r: Relation | null) => { setLovedOneRelationState(r); lsSet("lg.lovedOneRelation", r); };

  const [timeframe, setTimeframeState] = useState<Timeframe | null>(null);
  const setTimeframe = (t: Timeframe | null) => { setTimeframeState(t); lsSet("lg.timeframe", t); };

  const [stage, setStageState] = useState<Stage | null>(null);
  const setStage = (s: Stage | null) => { setStageState(s); lsSet("lg.stage", s); };

  const [primaryNeed, setPrimaryNeedState] = useState<PrimaryNeed | null>(null);
  const setPrimaryNeed = (p: PrimaryNeed | null) => { setPrimaryNeedState(p); lsSet("lg.primaryNeed", p); };

  const [lightMode, setLightModeState] = useState(false);
  const setLightMode = (v: boolean) => { setLightModeState(v); lsSet("lg.lightMode", v); };

  const [currentEmotions, setCurrentEmotionsState] = useState<Emotion[]>([]);
  const [currentEmotionAt, setCurrentEmotionAt] = useState<string | null>(null);
  const setCurrentEmotions = (e: Emotion[]) => {
    setCurrentEmotionsState(e);
    const now = new Date().toISOString();
    setCurrentEmotionAt(now);
    lsSet("lg.currentEmotions", e);
    lsSet("lg.currentEmotionAt", now);
  };

  const isStoredSoftDayActive = () => {
    const at = lsGet<string | null>("lg.softDayAt", null);
    if (!at) return false;
    const d = new Date(at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };
  const [softDay, setSoftDay] = useState<boolean>(false);
  const toggleSoftDay = () => {
    const next = !softDay;
    setSoftDay(next);
    lsSet("lg.softDayAt", next ? new Date().toISOString() : null);
  };

  const [nightModeOverride, setNightModeOverrideState] = useState<boolean | null>(null);
  const setNightModeOverride = (v: boolean | null) => { setNightModeOverrideState(v); lsSet("lg.nightOverride", v); };

  const [hydrated, setHydrated] = useState(false);

  const [taskStatus, setTaskStatusState] = useState<Record<string, TaskStatus>>({});
  const setTaskStatus = (id: string, status: TaskStatus) => {
    setTaskStatusState((prev) => {
      const next = { ...prev, [id]: status };
      lsSet("lg.taskStatus", next);
      return next;
    });
  };

  const [legallyInvolved, setLegallyInvolvedState] = useState<boolean | null>(null);
  const setLegallyInvolved = (v: boolean | null) => { setLegallyInvolvedState(v); lsSet("lg.legallyInvolved", v); };

  useEffect(() => {
    setThemeState(lsGet("legato-theme", "auto" as ThemeMode));
    setSystemDark(window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);
    setSituationState(lsGet("lg.situation", null));
    setLovedLabelState(lsGet("lg.lovedLabel", lsGet("lg.lovedOneName", "")));
    setLovedOtherState(lsGet("lg.lovedOther", ""));
    setLovedOneRelationState(lsGet("lg.lovedOneRelation", null));
    setTimeframeState(lsGet("lg.timeframe", null));
    setStageState(lsGet("lg.stage", null));
    setPrimaryNeedState(lsGet("lg.primaryNeed", null));
    setCurrentEmotionsState(lsGet("lg.currentEmotions", [] as Emotion[]));
    setCurrentEmotionAt(lsGet("lg.currentEmotionAt", null));
    setLightModeState(lsGet("lg.lightMode", false));
    setSoftDay(isStoredSoftDayActive());
    setNightModeOverrideState(lsGet("lg.nightOverride", null));
    setTaskStatusState(lsGet("lg.taskStatus", {} as Record<string, TaskStatus>));
    setLegallyInvolvedState(lsGet("lg.legallyInvolved", null));
    setHydrated(true);
  }, []);

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
        lovedLabel, setLovedLabel,
        lovedOther, setLovedOther,
        lovedOneRelation, setLovedOneRelation,
        timeframe, setTimeframe,
        stage, setStage,
        primaryNeed, setPrimaryNeed,
        currentEmotions, setCurrentEmotions,
        currentEmotionAt,
        lightMode, setLightMode,
        softDay, toggleSoftDay,
        nightModeOverride, setNightModeOverride,
        hydrated,
        taskStatus, setTaskStatus,
        legallyInvolved, setLegallyInvolved,
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
