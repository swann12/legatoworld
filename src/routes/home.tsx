import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, Section } from "@/components/legato/Shell";
import { ModeSelector } from "@/components/legato/ModeSelector";
import { useLegato, MODES, BRANCHES } from "@/lib/legato-state";

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
  const modeMeta = MODES.find((m) => m.id === mode)!;
  const branchMeta = BRANCHES.find((b) => b.id === branch);
  const isCocoon = mode === "cocoon";
  const isBreath = mode === "breath";

  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant={isBreath ? "calm" : isCocoon ? "rich" : "default"} />

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
          <header className={`px-7 ${isCocoon ? "pt-16" : "pt-12"}`}>
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              {t("home.aujourdhui")}
            </p>
            <h1 className="mt-4 font-serif text-[2.4rem] leading-[1.05] font-light text-dusk text-balance">
              {name},<br />
              <span className="italic text-dusk/85">{t("home.posezvous")}</span> {t("home.unmoment")}
            </h1>
            {branchMeta && (
              <p className="mt-5 max-w-[34ch] text-[14.5px] leading-relaxed text-dusk/60">
                {lang === "fr" ? "Tenu·e en " : "Held in "}
                <span className="italic">{modeMeta.label.toLowerCase()}</span>
                {lang === "fr" ? ", avec " : ", with "}
                <span className="italic">{branchMeta.label.toLowerCase()}</span>
                {lang === "fr" ? " tout près." : " close by."}
              </p>
            )}
          </header>

          {/* Mode chips — always visible */}
          <div className="mt-9">
            <ModeSelector compact />
          </div>

          {/* PRIMARY ACTION — Presence */}
          <Section className="mt-10">
            <Link
              to="/presence"
              className="ceramic organic-radius-3 block p-7 relative overflow-hidden"
            >
              <div
                className="absolute -right-10 -top-10 size-40 rounded-full opacity-60 halo"
                style={{ background: "radial-gradient(circle, var(--peach), transparent 70%)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="relative size-16 rounded-full ceramic-soft flex items-center justify-center shrink-0">
                    <div
                      className="size-7 rounded-full breath"
                      style={{ background: "radial-gradient(circle, var(--peach), var(--rose))" }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
                      {t("home.parler")}
                    </p>
                    <h3 className="mt-1 font-serif text-[1.55rem] italic text-dusk leading-tight">
                      {t("home.parlerSub")}
                    </h3>
                  </div>
                </div>
                <p className="mt-5 text-[13.5px] leading-relaxed text-dusk/65 max-w-[32ch]">
                  {t("home.parlerBody")}
                </p>
                <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-dusk/55">
                  {t("home.enter")}
                </p>
              </div>
            </Link>
          </Section>

          {/* Journal — always present, beautifully calm */}
          <Section className="mt-4">
            <Link to="/journal" className="paper-card block p-6 relative overflow-hidden" style={{ borderRadius: 26 }}>
              <div
                className="absolute inset-y-0 right-0 w-24 opacity-50 pointer-events-none"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent 0 14px, color-mix(in oklab, var(--dusk) 8%, transparent) 14px 15px)",
                }}
              />
              <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
                {t("home.journal")}
              </p>
              <p className="mt-1.5 font-serif text-xl italic text-dusk leading-snug">
                {t("home.journalSub")}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-dusk/55">
                {lang === "fr" ? "Ouvrir une page →" : "Open a page →"}
              </p>
            </Link>
          </Section>

          {/* Practical — always reachable, distinct */}
          <Section className="mt-4">
            <Link to="/practical" className="paper-card block p-6" style={{ borderRadius: 26 }}>
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
                    {t("home.practical")}
                  </p>
                  <p className="mt-1.5 font-serif text-lg italic text-dusk leading-snug">
                    {t("home.practicalSub")}
                  </p>
                </div>
                <span className="text-dusk/40">→</span>
              </div>
              <p className="mt-3 text-[11.5px] text-dusk/50">
                {t("home.practicalAlways")}
              </p>
            </Link>
          </Section>

          {/* Without words — quiet alternative */}
          <Section className="mt-4">
            <Link to="/no-words" className="paper-card block p-6" style={{ borderRadius: 26 }}>
              <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
                {t("home.nowords")}
              </p>
              <p className="mt-1.5 font-serif text-lg italic text-dusk leading-snug">
                {t("home.nowordsSub")}
              </p>
            </Link>
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
