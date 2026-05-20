import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { ModeSelector } from "@/components/legato/ModeSelector";
import { useLegato, BRANCHES } from "@/lib/legato-state";
import type { Mode, Branch } from "@/lib/legato-state";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Accueil — Legato" },
      { name: "description", content: "Votre intérieur tranquille, aujourd'hui." },
    ],
  }),
  component: Home,
});

function Home() {
  const { name, mode, t, lang, setLang } = useLegato();
  // branchMeta kept to avoid breaking the FR/EN dictionaries — not displayed here.
  const branch = useLegato().branch;
  const branchMeta = BRANCHES.find((b) => b.id === branch);
  const cfg = MODE_HOME[mode];

  return (
    <Shell>
      <div className="relative min-h-dvh px-7">
        <div className="relative">
          {/* top bar — language toggle + space */}
          <div className="flex items-center justify-between pt-10">
            <span className="font-serif text-xl italic text-dusk">Legato</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                className="glass-card px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-dusk/70"
                aria-label="Toggle language"
              >
                {lang.toUpperCase()}
              </button>
              <Link
                to="/space"
                className="glass-card size-10 rounded-full flex items-center justify-center !rounded-full"
              >
                <span className="font-serif italic text-sm text-dusk">
                  {name.charAt(0).toUpperCase()}
                </span>
              </Link>
            </div>
          </div>

          {/* greeting */}
          <header className="pt-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              {t("home.aujourdhui")}
            </p>
            <h1
              className="mt-4 font-serif text-[2rem] leading-[1.12] font-light text-dusk"
              style={{ textWrap: "balance" }}
            >
              Bonjour {name}, <span className="italic text-dusk/85">{t("home.greeting")}</span>
            </h1>
            <p
              key={`sub-${mode}`}
              className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/65 animate-fade-in"
              style={{ textWrap: "pretty" }}
            >
              {cfg.subtitle}
            </p>
            {branchMeta ? null : null}
          </header>

          {/* Mode chips — always visible */}
          <div className="mt-8 -mx-7">
            <ModeSelector compact />
          </div>

          <div key={`cards-${mode}`} className="mt-9 space-y-3 animate-fade-in">
            {cfg.cards.map((c) => (
              <ModeCard key={c.id} card={c} />
            ))}
          </div>

          {/* Crisis door — always present, never loud */}
          <div className="mt-10">
            <Link
              to="/crisis"
              className="block border-t border-dusk/10 pt-6 flex items-baseline justify-between"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
                  {t("home.crisis.label")}
                </p>
                <p className="mt-1 font-serif text-base italic text-dusk">
                  {t("home.crisis.title")}
                </p>
              </div>
              <span className="text-dusk/40 text-sm">→</span>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ─── Mode-driven home configuration ─────────────────────────────────
 * Each mode controls: page background, subtitle, card order & per-card style.
 */
type CardId = "presence" | "nowords" | "journal" | "wishes" | "practical" | "relay";
type CardStyle = "highlight" | "normal" | "muted";
type CardCfg = {
  id: CardId;
  style: CardStyle;
  title: string;       // overrides default
  bg?: string;         // when highlight
  accent?: string;     // left border color when highlight
  hideArrow?: boolean;
};
type ModeHomeCfg = {
  subtitle: string;
  cards: CardCfg[];
};

const MODE_HOME: Record<Mode, ModeHomeCfg> = {
  cocoon: {
    subtitle: "Se replier un peu, le souvenir tout près.",
    cards: [
      { id: "presence", style: "highlight", title: "Une oreille calme, à toute heure.", accent: "#E8A0A0" },
      { id: "nowords",  style: "highlight", title: "Traverser sans avoir à dire.",      accent: "#E8A0A0" },
      { id: "journal",  style: "normal",    title: "Déposer une pensée, sans relire." },
      { id: "wishes",   style: "normal",    title: "Préparer, en douceur, ce que l'on voudrait." },
      { id: "practical",style: "muted",     title: "Démarches concrètes — quand vous serez prêt·e.", hideArrow: true },
    ],
  },
  anchoring: {
    subtitle: "Des repères simples, en pensant à elle, à lui.",
    cards: [
      { id: "practical",style: "highlight", title: "Avancer une étape à la fois.",       accent: "#90B090" },
      { id: "journal",  style: "highlight", title: "Poser ce qui s'est passé aujourd'hui.", accent: "#90B090" },
      { id: "presence", style: "normal",    title: "Une oreille calme, à toute heure." },
      { id: "wishes",   style: "normal",    title: "Préparer, en douceur, ce que l'on voudrait." },
      { id: "nowords",  style: "normal",    title: "Sons, souffles et lumières lentes." },
    ],
  },
  breath: {
    subtitle: "Un peu d'air entre les pensées.",
    cards: [
      { id: "nowords",  style: "highlight", title: "Sons, souffles et lumières lentes.", accent: "#A8C4E0" },
      { id: "journal",  style: "highlight", title: "Laisser sortir, sans chercher les mots.", accent: "#A8C4E0" },
      { id: "presence", style: "normal",    title: "Une oreille calme, à toute heure." },
      { id: "practical",style: "normal",    title: "Avancer une étape à la fois." },
      { id: "wishes",   style: "normal",    title: "Préparer, en douceur, ce que l'on voudrait." },
    ],
  },
  relay: {
    subtitle: "Ne pas porter ce manque seul·e.",
    cards: [
      { id: "relay",    style: "highlight", title: "Proches, professionnels, ligne d'écoute.", accent: "#C8B8E0" },
      { id: "presence", style: "highlight", title: "Une oreille calme, à toute heure.",        accent: "#C8B8E0" },
      { id: "journal",  style: "normal",    title: "Déposer une pensée, sans relire." },
      { id: "nowords",  style: "normal",    title: "Sons, souffles et lumières lentes." },
      { id: "practical",style: "normal",    title: "Avancer une étape à la fois." },
    ],
  },
};

const CARD_META: Record<CardId, { eyebrow: string; to: string }> = {
  presence: { eyebrow: "Parler à une présence", to: "/presence" },
  nowords:  { eyebrow: "Sans mots",             to: "/no-words" },
  journal:  { eyebrow: "Journal intime",        to: "/journal" },
  wishes:   { eyebrow: "Préparer",              to: "/wishes" },
  practical:{ eyebrow: "Démarches concrètes",   to: "/practical" },
  relay:    { eyebrow: "Demander un appui",     to: "/help" },
};

function ModeCard({ card }: { card: CardCfg }) {
  const meta = CARD_META[card.id];
  if (card.style === "muted") {
    return (
      <Link
        to={meta.to}
        className="block rounded-2xl px-5 py-4 border border-dashed border-dusk/15"
      >
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
          {meta.eyebrow}
        </p>
        <p className="mt-1 font-serif italic text-[15px] leading-snug text-dusk/65">
          {card.title}
        </p>
      </Link>
    );
  }
  if (card.style === "highlight") {
    return (
      <Link
        to={meta.to}
        className="glass-card-accent block px-5 py-5 relative overflow-hidden"
        style={{ borderLeftColor: card.accent }}
      >
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/55">{meta.eyebrow}</p>
            <p className="mt-1.5 font-serif italic text-[1.15rem] leading-snug text-dusk">
              {card.title}
            </p>
          </div>
          {!card.hideArrow && <span className="text-dusk/40 text-sm shrink-0">→</span>}
        </div>
      </Link>
    );
  }
  // normal
  return (
    <Link to={meta.to} className="glass-card block p-5">
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{meta.eyebrow}</p>
          <p className="mt-1.5 font-serif italic text-[1.05rem] leading-snug text-dusk">
            {card.title}
          </p>
        </div>
        {!card.hideArrow && <span className="text-dusk/40 text-sm shrink-0">→</span>}
      </div>
    </Link>
  );
}

/* Phrase d'accompagnement par (mode × branche).
 * Pas de template générique : chaque combinaison est rédigée à la main,
 * en français naturel, sans mot orphelin et sans tournure traduite. */
function modeAccompaniment(mode: Mode, branch: Branch, lang: string): string {
  if (lang === "fr") return FR[mode][branch];
  return EN[mode][branch];
}

const FR: Record<Mode, Record<Branch, string>> = {
  cocoon: {
    person:    "Se replier un peu, le souvenir tout près.",
    animal:    "Se reposer, cette présence à vos côtés.",
    fear:      "Ralentir, sans rien lâcher.",
    anxiety:   "Mettre les grandes questions de côté.",
    practical: "Les démarches attendront.",
    unknown:   "Rien à nommer. Se poser.",
  },
  anchoring: {
    person:    "Des repères simples, en pensant à elle, à lui.",
    animal:    "Un pas tranquille, cette présence proche.",
    fear:      "Tenir droit, malgré l'inquiétude.",
    anxiety:   "Un pied après l'autre.",
    practical: "Un pas concret, sans pression.",
    unknown:   "Un peu de sol sous les pieds.",
  },
  breath: {
    person:    "Un peu d'air, le souvenir respire avec vous.",
    animal:    "Laisser la tendresse passer.",
    fear:      "L'inquiétude se desserre, doucement.",
    anxiety:   "Les pensées passent, sans les retenir.",
    practical: "Les papiers attendront. D'abord, respirer.",
    unknown:   "Un peu d'air, sans rien à dire.",
  },
  relay: {
    person:    "Ne pas porter ce manque seul·e.",
    animal:    "Partager cette peine, à deux.",
    fear:      "Une main amie, le temps que ça desserre.",
    anxiety:   "Dire ce qui revient, à quelqu'un.",
    practical: "Quelqu'un fait un pas avec vous.",
    unknown:   "Être accompagné·e, sans expliquer.",
  },
};

const EN: Record<Mode, Record<Branch, string>> = {
  cocoon: {
    person:    "You fold inward, the memory kept quietly close.",
    animal:    "You rest a moment, that presence by your side.",
    fear:      "You slow your pace, without letting go.",
    anxiety:   "You set the larger questions aside, briefly.",
    practical: "The paperwork waits. You come first.",
    unknown:   "Nothing to name. Settle here, simply.",
  },
  anchoring: {
    person:    "A little simple ground, without leaving your thoughts of them.",
    animal:    "A quiet pace, that presence close by.",
    fear:      "Standing steady through the worry.",
    anxiety:   "One step, then another. Calmly.",
    practical: "One concrete step, no pressure.",
    unknown:   "A bit of ground under your feet again.",
  },
  breath: {
    person:    "A little air. The memory breathes with you.",
    animal:    "Tenderness moves through, softly.",
    fear:      "The worry loosens, just a little.",
    anxiety:   "Thoughts pass through, undisturbed.",
    practical: "The paperwork waits. Air first.",
    unknown:   "Some air, without finding the words.",
  },
  relay: {
    person:    "Not carrying this absence alone. Lean on someone.",
    animal:    "Letting someone share this grief.",
    fear:      "A kind hand, while the fear softens.",
    anxiety:   "Opening up. Saying what keeps coming back.",
    practical: "Someone takes one step with you.",
    unknown:   "Letting yourself be accompanied, simply.",
  },
};

function PresenceBlock({ t, primary, ctaLabel }: { t: (k: string) => string; primary: boolean; ctaLabel: string }) {
  return (
    <Link
      to="/presence"
      className={`${primary ? "ceramic organic-radius-3 px-6 py-7" : "paper-card p-6"} block relative overflow-hidden`}
    >
      <div className="relative flex items-center gap-5">
        <div className={`${primary ? "size-14" : "size-11"} rounded-full ceramic-soft flex items-center justify-center shrink-0`}>
          <div
            className={`${primary ? "size-5" : "size-3.5"} rounded-full breath`}
            style={{ background: "radial-gradient(circle, var(--peach), var(--rose))" }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/50">
            {t("home.parler")}
          </p>
          <h3
            className={`mt-1.5 font-serif italic text-dusk leading-[1.15] ${primary ? "text-[1.35rem]" : "text-lg"}`}
            style={{ textWrap: "balance" }}
          >
            Une oreille calme, à toute heure.
          </h3>
          {primary && (
            <p className="mt-2 text-[12.5px] text-dusk/60" style={{ textWrap: "pretty" }}>
              On vous écoute, sans jugement, sans réponse à donner.
            </p>
          )}
        </div>
        <span className="text-dusk/40 text-sm">→</span>
      </div>
    </Link>
  );
}

function JournalBlock({ t, primary, lang }: { t: (k: string) => string; primary: boolean; lang: string }) {
  return (
    <Link to="/journal" className={`${primary ? "ceramic organic-radius-3 p-7" : "paper-card p-6"} block`}>
      <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{t("home.journal")}</p>
      <p className={`mt-1.5 font-serif italic text-dusk leading-snug ${primary ? "text-[1.4rem]" : "text-lg"}`}>
        {t("home.journalSub")}
      </p>
      {primary && (
        <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-dusk/55">
          {lang === "fr" ? "Ouvrir une page →" : "Open a page →"}
        </p>
      )}
    </Link>
  );
}

function PracticalBlock({ t, primary }: { t: (k: string) => string; primary: boolean }) {
  return (
    <Link to="/practical" className={`${primary ? "ceramic organic-radius-3 p-7" : "paper-card p-6"} block`}>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{t("home.practical")}</p>
          <p className={`mt-1.5 font-serif italic text-dusk leading-snug whitespace-pre-line ${primary ? "text-[1.4rem]" : "text-lg"}`}>
            {t("home.practicalSub")}
          </p>
        </div>
        <span className="text-dusk/40">→</span>
      </div>
      {primary && (
        <p className="mt-3 text-[12px] text-dusk/55">{t("home.practicalAlways")}</p>
      )}
    </Link>
  );
}

function RelayBlock({ primary }: { primary: boolean }) {
  return (
    <Link to="/help" className={`${primary ? "ceramic organic-radius-3 p-7" : "paper-card p-6"} block`}>
      <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Demander un appui</p>
      <p className={`mt-1.5 font-serif italic text-dusk leading-snug ${primary ? "text-[1.4rem]" : "text-lg"}`}>
        Proches, professionnels, ligne d'écoute.
      </p>
      {primary && (
        <p className="mt-3 text-[12px] text-dusk/55">
          Une main tendue, quand les forces manquent.
        </p>
      )}
    </Link>
  );
}

function NoWordsBlock({ t }: { t: (k: string) => string }) {
  return (
    <Link to="/no-words" className="paper-card block p-6">
      <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{t("home.nowords")}</p>
      <p className="mt-1.5 font-serif text-lg italic text-dusk leading-snug">{t("home.nowordsSub")}</p>
    </Link>
  );
}

function WishesBlock({ t }: { t: (k: string) => string }) {
  return (
    <Link to="/wishes" className="paper-card block p-6">
      <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{t("home.wishes")}</p>
      <p className="mt-1.5 font-serif text-lg italic text-dusk leading-snug">{t("home.wishesSub")}</p>
    </Link>
  );
}

function InspirationBlock({ t }: { t: (k: string) => string }) {
  return (
    <Link to="/inspiration" className="paper-card block p-6">
      <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{t("home.inspiration")}</p>
      <p className="mt-1.5 font-serif text-lg italic text-dusk leading-snug">{t("home.inspirationSub")}</p>
    </Link>
  );
}
