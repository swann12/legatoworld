import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { ThemeToggle } from "@/components/legato/ThemeToggle";
import { SpaceSwitcher } from "@/components/legato/SpaceSwitcher";
import { useLegato, MODES, TODAY_STATES, type Mode, type TodayState } from "@/lib/legato-state";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Aujourd'hui — Legato" },
      { name: "description", content: "Un seul pas suffit pour aujourd'hui." },
    ],
  }),
  component: Home,
});

/* ─── Espace psychologique : suggestion pilotée par l'état émotionnel ─── */
type Primary = { eyebrow: string; title: string; sub: string; to: string };
const PSY_PRIMARY_BY_STATE: Record<TodayState, Primary> = {
  stunned:     { eyebrow: "Pour aujourd'hui", title: "Rester quelques minutes au calme", sub: "Une respiration douce, rien à faire d'autre.", to: "/no-words" },
  exhausted:   { eyebrow: "Pour aujourd'hui", title: "Se laisser porter par un son",     sub: "Pas de mots à chercher.",                        to: "/no-words" },
  anxious:     { eyebrow: "Pour aujourd'hui", title: "Suivre un souffle",                sub: "Cinq cycles, et c'est déjà beaucoup.",           to: "/no-words" },
  sad:         { eyebrow: "Pour aujourd'hui", title: "Déposer quelques mots",            sub: "Sans titre, sans plan, sans relire.",            to: "/journal"  },
  angry:       { eyebrow: "Pour aujourd'hui", title: "Écrire ce qui pèse",               sub: "Vider, sans relire.",                            to: "/journal"  },
  empty:       { eyebrow: "Pour aujourd'hui", title: "Aller voir le jardin",             sub: "Regarder, simplement.",                          to: "/garden"   },
  isolated:    { eyebrow: "Pour aujourd'hui", title: "Parler à une présence",            sub: "Une oreille calme, à toute heure.",              to: "/presence" },
  overwhelmed: { eyebrow: "Pour aujourd'hui", title: "Parler à une présence",            sub: "Vous n'avez rien à porter seul·e.",              to: "/presence" },
  soothed:     { eyebrow: "Pour aujourd'hui", title: "Aller arroser le jardin",          sub: "Un souvenir, une trace, peut-être.",             to: "/garden"   },
  undecided:   { eyebrow: "Pour aujourd'hui", title: "Choisir ce qui vous appelle",      sub: "Une porte calme, sans engagement.",              to: "/accompany" },
};

const PSY_GREETING_BY_STATE: Record<TodayState, string> = {
  stunned:     "Prenez le temps qu'il vous faut.",
  exhausted:   "Rien à porter aujourd'hui.",
  anxious:     "Un souffle après l'autre.",
  sad:         "La tristesse a le droit d'être là.",
  angry:       "La colère aussi peut se déposer.",
  empty:       "C'est une étape, elle bouge.",
  isolated:    "Vous n'êtes pas seul·e ici.",
  overwhelmed: "Vous n'avez rien à porter seul·e.",
  soothed:     "Un peu d'air, c'est précieux.",
  undecided:   "Aucun choix n'est urgent.",
};

function Home() {
  const { name, mode, lang, setLang, space, todayState } = useLegato();
  const today = new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    weekday: "long", day: "numeric", month: "long",
  }).format(new Date());
  const isConcrete = space === "concrete";
  const primary = PSY_PRIMARY_BY_STATE[todayState];
  const greeting = isConcrete
    ? "Un seul pas suffit pour aujourd'hui."
    : PSY_GREETING_BY_STATE[todayState];
  const todayLabel = TODAY_STATES.find((t) => t.id === todayState)?.label ?? "";
  const modeLabel = MODES.find((m) => m.id === mode)?.label ?? "";

  return (
    <Shell>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        {/* ─── Bandeau ─── */}
        <header className="px-7 pt-10 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
            Legato · {today}
          </p>
          <div className="flex items-center gap-2">
            <SpaceSwitcher />
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
            {greeting}
          </p>
        </section>

        {/* ─── Contenu strictement adapté à l'espace actif (brief §1, §7) ─── */}
        {isConcrete ? <ConcreteHome /> : <PsyHome primary={primary} />}

        {/* ─── Pied : état du jour (psy) ou bascule (concret), toujours discret ─── */}
        <section className="px-7 pt-10">
          <div className="border-t border-dusk/15 pt-5 flex items-baseline justify-between">
            {isConcrete ? (
              <p className="text-[11px] tracking-[0.22em] text-dusk/55" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="uppercase">Espace :</span>{" "}
                <span className="text-dusk font-serif text-[15px] tracking-normal">Aide concrète</span>
              </p>
            ) : (
              <p className="text-[11px] tracking-[0.22em] text-dusk/55" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="uppercase">État du jour :</span>{" "}
                <span className="text-dusk font-serif text-[15px] tracking-normal">{todayLabel || modeLabel}</span>
              </p>
            )}
            <Link
              to="/space"
              className="text-[10px] uppercase tracking-[0.24em] text-dusk/55 hover:text-dusk"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Modifier
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

/** Espace psy — UNE seule suggestion principale + accès doux à Présence/Journal/Jardin. */
function PsyHome({ primary }: { primary: Primary }) {
  return (
    <>
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

      <section className="px-7 pt-6 space-y-3">
        <SoftLink to="/accompany" eyebrow="Soutien"   title="Être accompagné·e" body="Parler, respirer, écrire, retrouver un peu d'espace." />
        <SoftLink to="/garden"    eyebrow="Mémoire"   title="Le jardin"          body="Vos parcelles, vos souvenirs, ce qui pousse doucement." />
      </section>
    </>
  );
}

/** Espace concret — Prochaine étape + checklist courte + accès Plan / Pros / Documents. */
function ConcreteHome() {
  return (
    <>
      <section className="px-7 pt-12">
        <Link
          to="/plan"
          className="block rounded-[20px] overflow-hidden text-[color:var(--paper)]"
          style={{ background: "var(--bordeaux)" }}
        >
          <div className="px-6 pt-8 pb-7">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--paper)]/60" style={{ fontFamily: "var(--font-mono)" }}>
              Votre prochaine étape · 10 min
            </p>
            <p className="mt-4 font-serif text-[28px] leading-[1.1] italic" style={{ textWrap: "balance" }}>
              Contacter une entreprise de pompes funèbres
            </p>
            <p className="mt-4 text-[14px] leading-[1.55] text-[color:var(--paper)]/75 max-w-[34ch]">
              Premier rendez-vous pour organiser la mise en bière et la cérémonie.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[color:var(--paper)] text-dusk px-4 py-2 text-[11px] tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                Voir cette étape →
              </span>
            </div>
          </div>
        </Link>
      </section>

      <section className="px-7 pt-6 space-y-3">
        <SoftLink to="/plan"      eyebrow="Plan"       title="Voir mon plan"      body="Vos étapes, par priorité. À votre rythme." />
        <SoftLink to="/resources" eyebrow="Pros"       title="Trouver une aide"   body="Pompes funèbres, notaires, thérapeutes." />
        <SoftLink to="/documents" eyebrow="Documents"  title="Mes documents"      body="Stocker, retrouver, partager les pièces utiles." />
      </section>
    </>
  );
}

function SoftLink({ to, eyebrow, title, body }: { to: string; eyebrow: string; title: string; body: string }) {
  return (
    <Link
      to={to}
      className="block rounded-[16px] border border-dusk/12 bg-paper p-5 flex items-baseline justify-between gap-4 hover:bg-dusk/[0.02] transition-colors"
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.26em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
          {eyebrow}
        </p>
        <p className="mt-1.5 font-serif italic text-[19px] text-dusk leading-snug">{title}</p>
        <p className="mt-1.5 text-[13px] leading-[1.5] text-dusk/65 max-w-[34ch]">{body}</p>
      </div>
      <span className="text-dusk/40 shrink-0">→</span>
    </Link>
  );
}