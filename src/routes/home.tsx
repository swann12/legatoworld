import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, Section } from "@/components/legato/Shell";
import { ModeSelector } from "@/components/legato/ModeSelector";
import { useLegato, MODES, BRANCHES, modeProfile } from "@/lib/legato-state";

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

          {/* greeting */}
          <header className={`px-7 ${profile.density === "tight" ? "pt-14" : profile.density === "open" ? "pt-10" : "pt-12"}`}>
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
                {modeAccompaniment(mode, branchMeta.label, lang)}
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
  const all: BlockId[] = ["presence", "journal", "practical", "wishes", "inspiration", "nowords"];
  if (primary === "relay") return ["relay", "practical", "presence", "wishes", "journal", "nowords"];
  // place primary first
  const ordered = [primary as BlockId, ...all.filter((x) => x !== primary)];
  return ordered;
}

/* Phrase d'accompagnement, naturelle, par mode + branche.
 * Remplace l'ancien template "En mode cocon, avec une personne tout près."
 * qui sonnait traduit et coupait mal. */
function modeAccompaniment(
  mode: "cocoon" | "anchoring" | "breath" | "relay",
  branchLabel: string,
  lang: string,
): string {
  const b = branchLabel.toLowerCase();
  if (lang !== "fr") {
    const map = {
      cocoon: `Today, you've chosen to settle quietly — with ${b} held close in mind.`,
      anchoring: `Today, you're looking for steady ground — with ${b} held close in mind.`,
      breath: `Today, you're letting things breathe a little — with ${b} held close in mind.`,
      relay: `Today, you don't have to carry it alone — with ${b} held close in mind.`,
    } as const;
    return map[mode];
  }
  const map = {
    cocoon:    `Vous avez choisi de vous replier un peu, doucement, en gardant ${b} tout près.`,
    anchoring: `Vous cherchez à retrouver des repères, pas à pas, en gardant ${b} tout près.`,
    breath:    `Vous vous accordez un peu d'air, sans pression, en gardant ${b} tout près.`,
    relay:     `Vous acceptez de vous laisser aider aujourd'hui, en gardant ${b} tout près.`,
  } as const;
  return map[mode];
}

function PresenceBlock({ t, primary, ctaLabel }: { t: (k: string) => string; primary: boolean; ctaLabel: string }) {
  return (
    <Link
      to="/presence"
      className={`${primary ? "ceramic organic-radius-3 p-7" : "paper-card p-6"} block relative overflow-hidden`}
    >
      {primary && (
        <div
          className="absolute -right-10 -top-10 size-40 rounded-full opacity-60 halo"
          style={{ background: "radial-gradient(circle, var(--peach), transparent 70%)" }}
        />
      )}
      <div className="relative">
        <div className="flex items-center gap-4">
          {primary && (
            <div className="relative size-14 rounded-full ceramic-soft flex items-center justify-center shrink-0">
              <div
                className="size-6 rounded-full breath"
                style={{ background: "radial-gradient(circle, var(--peach), var(--rose))" }}
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{t("home.parler")}</p>
            <h3 className={`mt-1 font-serif italic text-dusk leading-tight ${primary ? "text-[1.4rem]" : "text-lg"}`}>
              {t("home.parlerSub")}
            </h3>
          </div>
        </div>
        {primary && (
          <>
            <p className="mt-4 text-[13px] leading-relaxed text-dusk/65 max-w-[32ch]">
              {t("home.parlerBody")}
            </p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-dusk/55">{ctaLabel} →</p>
          </>
        )}
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
      <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">S'appuyer sur les autres</p>
      <p className={`mt-1.5 font-serif italic text-dusk leading-snug ${primary ? "text-[1.4rem]" : "text-lg"}`}>
        Proches, professionnels, lignes d'écoute
      </p>
      {primary && (
        <p className="mt-3 text-[12px] text-dusk/55">
          Quelques mains tendues, quand vos forces s'épuisent.
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
