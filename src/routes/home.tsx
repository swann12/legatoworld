import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { ThemeToggle } from "@/components/legato/ThemeToggle";
import { useLegato, MODES, type Mode } from "@/lib/legato-state";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Aujourd'hui — Legato" },
      { name: "description", content: "Un seul pas suffit pour aujourd'hui." },
    ],
  }),
  component: Home,
});

/* Bloc principal — une seule suggestion prioritaire, qui varie selon le mode. */
type Primary = { eyebrow: string; title: string; sub: string; to: string };
const PRIMARY: Record<Mode, Primary> = {
  cocoon:    { eyebrow: "Pour aujourd'hui", title: "Respirer deux minutes",  sub: "Rien à porter. Juste un souffle.",            to: "/no-words" },
  anchoring: { eyebrow: "Pour aujourd'hui", title: "Consulter la prochaine étape", sub: "Un seul pas, à votre rythme.",           to: "/practical" },
  breath:    { eyebrow: "Pour aujourd'hui", title: "Écrire quelques mots",   sub: "Sans titre, sans plan, sans attente.",        to: "/journal"  },
  relay:     { eyebrow: "Pour aujourd'hui", title: "Parler à une présence",  sub: "Une oreille calme, à toute heure.",           to: "/presence" },
};

const GREETING_LINE: Record<Mode, string> = {
  cocoon:    "Prenez le temps qu'il vous faut.",
  anchoring: "Un seul pas suffit pour aujourd'hui.",
  breath:    "Aujourd'hui, vous pouvez avancer doucement.",
  relay:     "Vous n'avez rien à porter seul·e.",
};

function Home() {
  const { name, mode, lang, setLang } = useLegato();
  const today = new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    weekday: "long", day: "numeric", month: "long",
  }).format(new Date());
  const primary = PRIMARY[mode];
  const modeLabel = MODES.find((m) => m.id === mode)?.label ?? "";

  return (
    <Shell>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        {/* ─── Bandeau ─── */}
        <header className="px-7 pt-10 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
            Legato · {today}
          </p>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="text-[10px] uppercase tracking-[0.22em] text-dusk/55 px-2 py-1"
              style={{ fontFamily: "var(--font-mono)" }}
              aria-label="Toggle language"
            >
              {lang.toUpperCase()}
            </button>
            <Link
              to="/space"
              className="size-8 rounded-full border border-dusk/20 flex items-center justify-center hover:bg-dusk/5 transition-colors"
              aria-label="Mon espace"
            >
              <span className="font-serif italic text-[14px] text-dusk">
                {(name || "S").charAt(0).toUpperCase()}
              </span>
            </Link>
          </div>
        </header>

        {/* ─── Salutation ─── */}
        <section className="px-7 pt-16">
          <h1 className="font-serif text-[40px] leading-[1.02] text-dusk font-light" style={{ textWrap: "balance" }}>
            Bonjour {name || "Swann"}.
          </h1>
          <p className="mt-5 max-w-[32ch] font-serif italic text-[20px] leading-snug text-dusk/75" style={{ textWrap: "balance" }}>
            {GREETING_LINE[mode]}
          </p>
        </section>

        {/* ─── Bloc principal : une seule grande suggestion prioritaire ─── */}
        <section className="px-7 pt-12">
          <Link
            to={primary.to}
            className="block rounded-[20px] overflow-hidden text-[color:var(--paper)]"
            style={{ background: "var(--bordeaux)" }}
          >
            <div className="px-6 pt-8 pb-7">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--paper)]/60" style={{ fontFamily: "var(--font-mono)" }}>
                {primary.eyebrow}
              </p>
              <p className="mt-4 font-serif text-[30px] leading-[1.1] italic" style={{ textWrap: "balance" }}>
                {primary.title}
              </p>
              <p className="mt-4 text-[14px] leading-[1.55] text-[color:var(--paper)]/75 max-w-[34ch]">
                {primary.sub}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--paper)]/80" style={{ fontFamily: "var(--font-mono)" }}>
                  Commencer
                </span>
                <span className="text-[color:var(--paper)]/70 text-base">→</span>
              </div>
            </div>
          </Link>
        </section>

        {/* ─── Bloc secondaire : deux accès seulement ─── */}
        <section className="px-7 pt-6 space-y-3">
          <Link
            to="/accompany"
            className="block rounded-[16px] border border-dusk/12 bg-paper p-5 flex items-baseline justify-between gap-4 hover:bg-dusk/[0.02] transition-colors"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
                Soutien
              </p>
              <p className="mt-1.5 font-serif italic text-[19px] text-dusk leading-snug">Être accompagné·e</p>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-dusk/65 max-w-[34ch]">
                Parler, respirer, écrire, retrouver un peu d'espace.
              </p>
            </div>
            <span className="text-dusk/40 shrink-0">→</span>
          </Link>

          <Link
            to="/practical"
            className="block rounded-[16px] border border-dusk/12 bg-paper p-5 flex items-baseline justify-between gap-4 hover:bg-dusk/[0.02] transition-colors"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
                Organisation
              </p>
              <p className="mt-1.5 font-serif italic text-[19px] text-dusk leading-snug">Avancer concrètement</p>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-dusk/65 max-w-[34ch]">
                Être guidé·e dans les démarches, une étape après l'autre.
              </p>
            </div>
            <span className="text-dusk/40 shrink-0">→</span>
          </Link>
        </section>

        {/* ─── Mode du jour, discret ─── */}
        <section className="px-7 pt-10">
          <div className="border-t border-dusk/15 pt-5 flex items-baseline justify-between">
            <p className="text-[11px] tracking-[0.22em] text-dusk/55" style={{ fontFamily: "var(--font-mono)" }}>
              <span className="uppercase">Mode du jour :</span>{" "}
              <span className="text-dusk italic font-serif text-[15px] tracking-normal not-italic">{modeLabel}</span>
            </p>
            <Link
              to="/space"
              className="text-[10px] uppercase tracking-[0.24em] text-dusk/55 hover:text-dusk"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Changer de mode
            </Link>
          </div>
        </section>

        {/* ─── Porte de crise ─── */}
        <section className="px-7 pt-8">
          <Link to="/crisis" className="block border-t border-dusk/15 pt-5 flex items-baseline justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--terracotta)]" style={{ fontFamily: "var(--font-mono)" }}>
                Si aujourd'hui pèse trop
              </p>
              <p className="mt-1 font-serif italic text-[17px] text-dusk">Une porte calme, ouverte.</p>
            </div>
            <span className="text-dusk/55 text-sm">→</span>
          </Link>
        </section>
      </div>
    </Shell>
  );
}