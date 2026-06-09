import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { useLegato, TODAY_STATES, CONCRETE_PRIORITIES, type TodayState } from "@/lib/legato-state";

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
  const { name, lang, space, todayState, concretePriority } = useLegato();
  const today = new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    day: "2-digit", month: "long",
  }).format(new Date());
  const isConcrete = space === "concrete";
  const primary = PSY_PRIMARY_BY_STATE[todayState];
  const priority = CONCRETE_PRIORITIES.find((p) => p.id === concretePriority) ?? CONCRETE_PRIORITIES[0];
  const greeting = isConcrete
    ? `Aujourd'hui, ${priority.label.toLowerCase()}.`
    : PSY_GREETING_BY_STATE[todayState];
  const todayLabel = TODAY_STATES.find((t) => t.id === todayState)?.label ?? "";
  const spaceLabel = isConcrete ? "Aide concrète" : "Accompagnement";

  return (
    <Shell>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        {/* ─── Header sobre : date + identité, le reste vit dans /space ─── */}
        <header className="px-6 pt-12 flex items-start justify-between">
          <div className="flex flex-col">
            <span
              className="text-[10px] uppercase tracking-[0.28em] text-dusk/55"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Legato · {today}
            </span>
            <Link
              to="/space"
              className="mt-4 inline-flex items-baseline gap-2 hover:opacity-80 transition-opacity"
            >
              <span
                className="text-[10px] uppercase tracking-[0.22em] text-dusk/50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Espace · {spaceLabel}
              </span>
              <span className="text-dusk/30 text-[10px]">↔</span>
            </Link>
          </div>
          <Link
            to="/space"
            aria-label="Mon espace"
            className="size-9 rounded-full border border-dusk/15 flex items-center justify-center hover:bg-dusk/[0.04] transition-colors"
          >
            <span className="font-serif italic text-[14px] text-dusk">
              {(name || "S").charAt(0).toUpperCase()}
            </span>
          </Link>
        </header>

        {/* ─── Salutation ─── */}
        <section className="px-6 pt-16">
          <h1
            className="font-serif text-[44px] leading-[1.0] text-dusk font-light"
            style={{ textWrap: "balance" }}
          >
            Bonjour {name || "Swann"}.
          </h1>
          <p
            className="mt-3 max-w-[32ch] font-serif italic text-[19px] leading-snug text-dusk/70"
            style={{ textWrap: "balance" }}
          >
            {greeting}
          </p>
        </section>

        {/* ─── Contenu adapté à l'espace ─── */}
        {isConcrete ? <ConcreteHome priority={priority} /> : <PsyHome primary={primary} />}

        {/* ─── Pied : état du jour ─── */}
        <section className="px-6 pt-10">
          <div className="border-t border-dusk/12 pt-5 flex items-baseline justify-between">
            <div className="flex flex-col gap-1">
              <span
                className="text-[9px] uppercase tracking-[0.24em] text-dusk/45"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {isConcrete ? "Priorité du jour" : "État du jour"}
              </span>
              <span className="font-serif italic text-[15px] text-dusk">
                {isConcrete ? priority.label : todayLabel}
              </span>
            </div>
            <Link
              to="/space"
              className="text-[9px] uppercase tracking-[0.24em] text-dusk/50 hover:text-dusk border-b border-transparent hover:border-dusk/40 pb-0.5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Modifier
            </Link>
          </div>
        </section>

        {/* ─── Porte de crise — filet terracotta ─── */}
        <section className="px-6 pt-8">
          <Link
            to="/crisis"
            className="block group"
            aria-label="Si aujourd'hui pèse trop"
          >
            <div className="flex items-center gap-3 text-[color:var(--terracotta)]">
              <span
                className="text-[9px] uppercase tracking-[0.22em] whitespace-nowrap"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Si aujourd'hui pèse trop
              </span>
              <span className="h-px flex-1 bg-[color:var(--terracotta)]/25" />
              <span className="text-[12px]">→</span>
            </div>
            <p className="mt-1.5 font-serif italic text-[17px] text-dusk group-hover:opacity-80 transition-opacity">
              Une porte calme, ouverte.
            </p>
          </Link>
        </section>
      </div>
    </Shell>
  );
}

function PsyHome({ primary }: { primary: Primary }) {
  return (
    <>
      <section className="px-6 pt-10">
        <Link
          to={primary.to}
          className="block rounded-[2px] overflow-hidden text-[color:var(--paper)] shadow-sm"
          style={{ background: "var(--bordeaux)" }}
        >
          <div className="px-8 pt-8 pb-8">
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--paper)]/60"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {primary.eyebrow}
            </p>
            <p
              className="mt-6 font-serif text-[30px] leading-[1.08] italic"
              style={{ textWrap: "balance" }}
            >
              {primary.title}
            </p>
            <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--paper)]/75 max-w-[34ch]">
              {primary.sub}
            </p>
            <div className="mt-10 flex items-end justify-between">
              <span
                className="text-[10px] uppercase tracking-[0.26em] text-[color:var(--paper)] border-b border-[color:var(--paper)]/30 pb-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Commencer
              </span>
              <span className="text-[color:var(--paper)]/70 text-base">→</span>
            </div>
          </div>
        </Link>
      </section>

      <section className="px-6 pt-4 grid grid-cols-2 gap-3">
        <HairlineTile to="/accompany" eyebrow="Soutien" title="Être accompagné·e" />
        <HairlineTile to="/garden"    eyebrow="Mémoire" title="Le jardin" />
      </section>
    </>
  );
}

function ConcreteHome({ priority }: { priority: (typeof CONCRETE_PRIORITIES)[number] }) {
  const next = priority.next;
  return (
    <>
      <section className="px-6 pt-10">
        <Link
          to="/plan"
          className="block rounded-[2px] overflow-hidden text-[color:var(--paper)] shadow-sm"
          style={{ background: "var(--bordeaux)" }}
        >
          <div className="px-8 pt-8 pb-8">
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--paper)]/60"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Votre prochaine étape · {next.duration}
            </p>
            <p
              className="mt-6 font-serif text-[28px] leading-[1.1] italic"
              style={{ textWrap: "balance" }}
            >
              {next.title}
            </p>
            <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--paper)]/75 max-w-[34ch]">
              {next.why}
            </p>
            <div className="mt-10 flex items-end justify-between">
              <span
                className="text-[10px] uppercase tracking-[0.26em] text-[color:var(--paper)] border-b border-[color:var(--paper)]/30 pb-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Voir cette étape
              </span>
              <span className="text-[color:var(--paper)]/70 text-base">→</span>
            </div>
          </div>
        </Link>
      </section>

      <section className="px-6 pt-4 grid grid-cols-2 gap-3">
        <HairlineTile to="/plan"      eyebrow="Plan"      title="Voir mon plan" />
        <HairlineTile to="/resources" eyebrow="Pros"      title="Trouver une aide" />
        <HairlineTile to="/documents" eyebrow="Documents" title="Mes documents" />
        <HairlineTile to="/circle"    eyebrow="Proches"   title="Mon cercle" />
      </section>
    </>
  );
}

function HairlineTile({ to, eyebrow, title }: { to: string; eyebrow: string; title: string }) {
  return (
    <Link
      to={to}
      className="block border border-dusk/12 p-5 h-32 flex flex-col justify-between bg-paper hover:bg-dusk/[0.02] transition-colors"
    >
      <span
        className="text-[9px] uppercase tracking-[0.24em] text-dusk/45"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {eyebrow}
      </span>
      <h3 className="font-serif italic text-[18px] text-dusk leading-tight">{title}</h3>
    </Link>
  );
}