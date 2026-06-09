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
        {/* ─── Header sobre : date + identité ─── */}
        <header className="px-6 pt-12 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="eyebrow">Legato · {today}</span>
          </div>
          <Link
            to="/space"
            aria-label={`Mon espace · ${spaceLabel}`}
            className="size-9 rounded-full border border-dusk/15 flex items-center justify-center hover:bg-dusk/[0.04] transition-colors"
          >
            <span className="text-[13px] text-dusk">
              {(name || "S").charAt(0).toUpperCase()}
            </span>
          </Link>
        </header>

        {/* ─── Salutation ─── */}
        <section className="px-6 pt-14">
          <h1
            className="font-serif text-[36px] leading-[1.05] text-dusk font-light text-balance"
          >
            Bonjour {name || "Swann"}.
          </h1>
          <p className="mt-3 max-w-[32ch] text-[15px] leading-[1.55] text-dusk/65 text-balance">
            {greeting}
          </p>
        </section>

        {/* ─── Contenu adapté à l'espace ─── */}
        {isConcrete ? <ConcreteHome priority={priority} /> : <PsyHome primary={primary} />}

        {/* ─── Pied : état du jour ─── */}
        <section className="px-6 pt-10">
          <div className="border-t border-dusk/12 pt-5 flex items-baseline justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="eyebrow-sm">
                {isConcrete ? "Priorité du jour" : "État du jour"}
              </span>
              <span className="text-[14px] text-dusk">
                {isConcrete ? priority.label : todayLabel}
              </span>
            </div>
          </div>
        </section>

        {/* ─── Porte de crise — filet terracotta ─── */}
        <section className="px-6 pt-8">
          <Link to="/crisis" className="block group" aria-label="Si aujourd'hui pèse trop">
            <div className="flex items-center gap-3 text-[color:var(--terracotta)]">
              <span className="eyebrow whitespace-nowrap text-[color:var(--terracotta)]">
                Si aujourd'hui pèse trop
              </span>
              <span className="h-px flex-1 bg-[color:var(--terracotta)]/25" />
              <span className="text-[12px]">→</span>
            </div>
            <p className="mt-2 text-[15px] text-dusk group-hover:opacity-80 transition-opacity">
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
        <Link to={primary.to} className="surface-feature block px-8 py-8">
          <p className="eyebrow text-[color:var(--paper)]/65">{primary.eyebrow}</p>
          <p className="mt-5 font-serif text-[26px] leading-[1.12] font-light text-balance">
            {primary.title}
          </p>
          <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--paper)]/75 max-w-[34ch]">
            {primary.sub}
          </p>
          <div className="mt-8 flex items-center justify-between">
            <span className="eyebrow text-[color:var(--paper)] border-b border-[color:var(--paper)]/30 pb-1">
              Commencer
            </span>
            <span className="text-[color:var(--paper)]/70 text-base">→</span>
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
        <Link to="/plan" className="surface-feature block px-8 py-8">
          <p className="eyebrow text-[color:var(--paper)]/65">
            Prochaine étape · {next.duration}
          </p>
          <p className="mt-5 font-serif text-[26px] leading-[1.12] font-light text-balance">
            {next.title}
          </p>
          <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--paper)]/75 max-w-[34ch]">
            {next.why}
          </p>
          <div className="mt-8 flex items-center justify-between">
            <span className="eyebrow text-[color:var(--paper)] border-b border-[color:var(--paper)]/30 pb-1">
              Voir cette étape
            </span>
            <span className="text-[color:var(--paper)]/70 text-base">→</span>
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
      className="surface block p-5 h-28 flex flex-col justify-between hover:bg-dusk/[0.02] transition-colors"
    >
      <span className="eyebrow-sm">{eyebrow}</span>
      <h3 className="text-[15px] text-dusk leading-tight">{title}</h3>
    </Link>
  );
}