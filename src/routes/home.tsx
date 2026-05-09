import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, Section } from "@/components/legato/Shell";
import { ModeSelector } from "@/components/legato/ModeSelector";
import { useLegato, BRANCHES, modeProfile } from "@/lib/legato-state";
import type { Branch, Mode } from "@/lib/legato-state";

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
  const all: BlockId[] = ["presence", "journal", "practical", "wishes", "inspiration", "nowords"];
  if (primary === "relay") return ["relay", "practical", "presence", "wishes", "journal", "nowords"];
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
    person:    "Aujourd'hui, vous avez besoin de vous replier un peu, en gardant tout près de vous le souvenir de cette personne.",
    animal:    "Aujourd'hui, vous voulez vous reposer un instant, sans quitter la pensée de cette présence fidèle.",
    fear:      "Aujourd'hui, vous préférez ralentir le pas, sans rien lâcher de l'attention que vous portez à ce proche fragile.",
    anxiety:   "Aujourd'hui, vous laissez ces grandes questions de côté, juste le temps de souffler.",
    practical: "Aujourd'hui, vous mettez les démarches en pause, et vous prenez soin de vous d'abord.",
    unknown:   "Aujourd'hui, vous n'avez rien à nommer, et vous pouvez simplement vous poser ici.",
  },
  anchoring: {
    person:    "Aujourd'hui, vous cherchez à retrouver des repères très simples, sans cesser de penser à elle, à lui.",
    animal:    "Aujourd'hui, vous voulez avancer d'un pas tranquille, en gardant cette présence à vos côtés.",
    fear:      "Aujourd'hui, vous voulez vous tenir droit·e malgré l'inquiétude, pour pouvoir rester là pour ce proche.",
    anxiety:   "Aujourd'hui, vous voulez poser un pied après l'autre, sans laisser ces pensées tout occuper.",
    practical: "Aujourd'hui, vous voulez avancer d'un pas concret, sans vous mettre la pression du reste.",
    unknown:   "Aujourd'hui, vous voulez simplement retrouver un peu de sol sous les pieds.",
  },
  breath: {
    person:    "Aujourd'hui, vous vous accordez un peu d'air, en laissant le souvenir respirer avec vous.",
    animal:    "Aujourd'hui, vous laissez la tendresse pour ce compagnon vous traverser, sans pleurer ni serrer.",
    fear:      "Aujourd'hui, vous laissez l'inquiétude se desserrer, juste assez pour reprendre votre souffle.",
    anxiety:   "Aujourd'hui, vous laissez les pensées passer, sans chercher à les comprendre toutes.",
    practical: "Aujourd'hui, vous mettez les papiers de côté, et vous reprenez un peu d'air avant tout.",
    unknown:   "Aujourd'hui, vous laissez simplement entrer un peu d'air, sans avoir à mettre des mots.",
  },
  relay: {
    person:    "Aujourd'hui, vous acceptez de ne pas porter seul·e ce manque, et de demander un peu d'appui.",
    animal:    "Aujourd'hui, vous laissez quelqu'un partager la peine, même si elle ne se voit pas pour les autres.",
    fear:      "Aujourd'hui, vous cherchez une main amie pour vous tenir, le temps que cette peur se desserre.",
    anxiety:   "Aujourd'hui, vous acceptez d'ouvrir la porte, et de parler de ce qui revient sans cesse.",
    practical: "Aujourd'hui, vous laissez quelqu'un faire un pas avec vous, plutôt que de tout porter seul·e.",
    unknown:   "Aujourd'hui, vous acceptez simplement d'être accompagné·e, sans avoir à expliquer pourquoi.",
  },
};

const EN: Record<Mode, Record<Branch, string>> = {
  cocoon: {
    person:    "Today, you need to fold inward a little, keeping the memory of that person quietly close.",
    animal:    "Today, you'd like to rest for a moment, without leaving the thought of that faithful companion.",
    fear:      "Today, you'd rather slow your pace, without easing the care you hold for someone fragile.",
    anxiety:   "Today, you set the larger questions aside, just long enough to breathe.",
    practical: "Today, you pause the practical steps, and tend to yourself first.",
    unknown:   "Today, there's nothing to name — and you can simply settle here.",
  },
  anchoring: {
    person:    "Today, you're looking for very simple ground, without stepping away from your thoughts of them.",
    animal:    "Today, you want to move at a quiet pace, keeping that presence close by.",
    fear:      "Today, you want to stand steady through the worry, so you can keep being there for them.",
    anxiety:   "Today, you want to take one step after another, without letting the thoughts take all the room.",
    practical: "Today, you want to take one concrete step, without piling on the rest.",
    unknown:   "Today, you just want to feel a bit of ground under your feet again.",
  },
  breath: {
    person:    "Today, you let yourself breathe, allowing the memory to breathe alongside you.",
    animal:    "Today, you let the tenderness for that companion move through you, softly.",
    fear:      "Today, you let the worry loosen a little, just enough to catch your breath.",
    anxiety:   "Today, you let the thoughts pass through, without trying to understand them all.",
    practical: "Today, you set the paperwork aside, and take some air before anything else.",
    unknown:   "Today, you simply let in some air, without having to put it into words.",
  },
  relay: {
    person:    "Today, you accept not to carry this absence alone, and to lean on someone.",
    animal:    "Today, you let someone share the grief, even if it isn't visible to others.",
    fear:      "Today, you reach for a kind hand to hold, while the fear softens its grip.",
    anxiety:   "Today, you let yourself open up, and speak of what keeps coming back.",
    practical: "Today, you let someone take one step with you, instead of carrying it all.",
    unknown:   "Today, you simply allow yourself to be accompanied, without having to explain why.",
  },
};

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
