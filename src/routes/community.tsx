import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { Halos } from "@/components/legato/Halos";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Communauté — Legato" }] }),
  component: Community,
});

type Circle = {
  kind: string;
  title: string;
  body: string;
  cadence: string;
};

const CIRCLES: (Circle & { tint: string; seats: string })[] = [
  { kind: "Perte d'un parent",   title: "Le cercle des enfants devenus orphelins", body: "Pour la mort d'un père, d'une mère. Souvent à l'âge adulte.", cadence: "Mardi · 20h00 · 1h",     tint: "var(--blush)",  seats: "3 places restantes" },
  { kind: "Perte d'un conjoint", title: "Veuvage — vivre sans l'autre",            body: "Pour ceux et celles qui apprennent un autre quotidien.",          cadence: "Jeudi · 19h30 · 1h15",  tint: "var(--mist)",   seats: "5 places restantes" },
  { kind: "Perte d'un enfant",   title: "Les parents endeuillés",                  body: "Un espace tenu très doux. Animé par une thérapeute spécialisée.", cadence: "Dimanche · 18h00 · 1h30", tint: "var(--sage)",   seats: "2 places restantes" },
  { kind: "Perte d'un animal",   title: "Le cercle des animaux aimés",             body: "Pour la disparition d'un chat, d'un chien, d'un compagnon.",     cadence: "Lundi · 18h30 · 1h",     tint: "var(--sun)",    seats: "Places ouvertes" },
  { kind: "Deuil anticipé",      title: "Vivre avec ce qui vient",                  body: "Quand un proche est en fin de vie. Parler à d'autres en attente.", cadence: "Mercredi · 19h00 · 1h",  tint: "var(--peach)",  seats: "4 places restantes" },
];

function Community() {
  const { mode } = useLegato();
  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10">
            <Link
              to="/help"
              className="text-[11px] uppercase tracking-[0.22em] text-dusk/55 hover:text-dusk transition-colors"
            >
              ← Aide
            </Link>
          </div>

          <ScreenHeader
            eyebrow="Communauté — petits cercles"
            title={<>Vous n'êtes pas <span className="italic" style={{ color: "var(--terracotta)" }}>la seule personne</span> à traverser ça.</>}
            subtitle="Des cercles en ligne, tenus chaque semaine par des thérapeutes du deuil. Petits effectifs. Aucune obligation de parler."
          />

          <Section className="mt-10">
            <p
              className="text-[10px] uppercase tracking-[0.22em] text-dusk/55 mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Cinq cercles ouverts cette semaine
            </p>
            <div className="space-y-3">
              {CIRCLES.map((c) => (
                <article
                  key={c.title}
                  className="rounded-[20px] overflow-hidden border border-dusk/8"
                  style={{ background: `color-mix(in oklab, ${c.tint} 30%, var(--paper))` }}
                >
                  <div className="px-6 pt-5 pb-4">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="size-2 rounded-full"
                        style={{ background: c.tint }}
                      />
                      <p
                        className="text-[10px] uppercase tracking-[0.22em] text-dusk/60"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {c.kind}
                      </p>
                    </div>
                    <h3 className="mt-3 font-serif text-[22px] leading-[1.15] text-dusk">
                      {c.title}
                    </h3>
                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-dusk/70">{c.body}</p>
                  </div>
                  <div className="px-6 py-3.5 flex items-center justify-between bg-paper/70 border-t border-dusk/8">
                    <div>
                      <p
                        className="text-[11px] uppercase tracking-[0.18em] text-dusk/75"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {c.cadence}
                      </p>
                      <p className="mt-0.5 text-[11.5px] italic text-dusk/55">{c.seats}</p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-paper hover:opacity-90 transition"
                      style={{ background: "var(--dusk)", fontFamily: "var(--font-mono)" }}
                    >
                      Rejoindre →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </Section>

          <Section className="mt-10 mb-10">
            <div className="border-t border-dusk/10 pt-6">
              <p className="font-serif italic text-[14px] text-dusk/60 max-w-[34ch] text-balance">
                Vous pouvez juste écouter. C'est suffisant. Personne ne vous demandera de parler.
              </p>
            </div>
          </Section>
        </div>
      </div>
    </Shell>
  );
}