import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, Section } from "@/components/legato/Shell";
import { ModeSelector } from "@/components/legato/ModeSelector";
import { useLegato, BRANCHES, modeProfile } from "@/lib/legato-state";
import type { Branch, Mode } from "@/lib/legato-state";
import { LivingPatch } from "@/components/legato/LivingPatch";

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
  const { name, mode, branch, t, lang, setLang } = useLegato();
  const branchMeta = BRANCHES.find((b) => b.id === branch);
  const profile = modeProfile(mode);
  const gap = profile.density === "tight" ? "mt-3" : profile.density === "open" ? "mt-6" : "mt-4";

  // Re-order content blocks by mode
  const blocks = orderForMode(profile.primary);

  return (
    <Shell>
      <div className="relative">
          <Halos mode={mode} variant={profile.halo} />

        <div className="relative z-10">
          {/* top bar — language toggle + space */}
          <div className="flex items-center justify-between px-7 pt-10">
            <span className="font-serif text-xl italic text-dusk">Legato</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                className="paper-card px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-dusk/70"
                aria-label="Toggle language"
              >
                {lang.toUpperCase()}
              </button>
              <Link
                to="/space"
                className="ceramic-soft size-10 rounded-full flex items-center justify-center"
              >
                <span className="font-serif italic text-sm text-dusk">
                  {name.charAt(0).toUpperCase()}
                </span>
              </Link>
            </div>
          </div>

          {/* Garden patch — small plot seen from above, above the greeting */}
          <div className="px-7 pt-8 flex justify-center">
            <div className="relative w-[180px] h-[90px]">
              <div
                aria-hidden
                className="absolute inset-0 organic-radius-2"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 60%, color-mix(in oklab, var(--sage) 55%, var(--paper)), color-mix(in oklab, var(--clay) 80%, transparent) 75%, transparent 100%)",
                  filter: "blur(0.4px)",
                }}
              />
              <LivingPatch beingId={`home-${name}`} density={0.6} tint="var(--sage)" tint2="var(--peach)" />
            </div>
          </div>

          {/* greeting */}
          <header className={`px-7 ${profile.density === "tight" ? "pt-8" : profile.density === "open" ? "pt-6" : "pt-7"}`}>
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              {t("home.aujourdhui")}
            </p>
            <h1
              className="mt-4 font-serif text-[2rem] leading-[1.12] font-light text-dusk"
              style={{ textWrap: "balance" }}
            >
              Bonjour {name}, <span className="italic text-dusk/85">{t("home.greeting")}</span>
            </h1>
            {branchMeta && (
              <p
                className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/60"
                style={{ textWrap: "pretty" }}
              >
                {modeAccompaniment(mode, branch, lang)}
              </p>
            )}
          </header>

          {/* Mode chips — always visible */}
          <div className="mt-8">
            <ModeSelector compact />
          </div>

          <Section className="mt-9">
            {blocks.map((b, i) => (
              <div key={b} className={i === 0 ? "" : gap}>
                {b === "presence" && <PresenceBlock t={t} primary={profile.primary === "presence"} ctaLabel={profile.ctaLabel} />}
                {b === "journal" && <JournalBlock t={t} primary={profile.primary === "journal"} lang={lang} />}
                {b === "practical" && <PracticalBlock t={t} primary={profile.primary === "practical"} />}
                {b === "relay" && <RelayBlock primary={profile.primary === "relay"} />}
                {b === "nowords" && <NoWordsBlock t={t} />}
                {b === "wishes" && <WishesBlock t={t} />}
                {b === "inspiration" && <InspirationBlock t={t} />}
              </div>
            ))}
          </Section>

          {/* Crisis door — always present, never loud */}
          <Section className="mt-10">
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
          </Section>
        </div>
      </div>
    </Shell>
  );
}

type BlockId = "presence" | "journal" | "practical" | "relay" | "nowords" | "wishes" | "inspiration";
function orderForMode(primary: "presence" | "practical" | "journal" | "relay"): BlockId[] {
  const all: BlockId[] = ["presence", "journal", "practical", "inspiration", "nowords"];
  if (primary === "relay") return ["relay", "practical", "presence", "journal", "nowords"];
  // place primary first
  const ordered = [primary as BlockId, ...all.filter((x) => x !== primary)];
  return ordered;
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
          <p className={`mt-1.5 font-serif italic text-dusk leading-snug ${primary ? "text-[1.4rem]" : "text-lg"}`}>
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
