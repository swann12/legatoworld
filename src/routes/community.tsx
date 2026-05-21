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

const CIRCLES: Circle[] = [
  { kind: "Perte d'un parent",   title: "Le cercle des enfants devenus orphelins", body: "Pour la mort d'un père, d'une mère. Souvent à l'âge adulte.", cadence: "Mardi · 20h00 · 1h" },
  { kind: "Perte d'un conjoint", title: "Veuvage — vivre sans l'autre",            body: "Un cercle pour ceux et celles qui apprennent un autre quotidien.", cadence: "Jeudi · 19h30 · 1h15" },
  { kind: "Perte d'un enfant",   title: "Les parents endeuillés",                  body: "Un espace tenu très doux. Animé par une thérapeute spécialisée.", cadence: "Dimanche · 18h00 · 1h30" },
  { kind: "Perte d'un animal",   title: "Le cercle des animaux aimés",             body: "Pour la disparition d'un chat, d'un chien, d'un compagnon de vie.", cadence: "Lundi · 18h30 · 1h" },
  { kind: "Deuil anticipé",      title: "Vivre avec ce qui vient",                  body: "Quand un proche est en fin de vie. Parler à d'autres qui traversent la même attente.", cadence: "Mercredi · 19h00 · 1h" },
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
            title={<>Vous n'êtes pas <span className="italic">la seule personne</span> à traverser ça.</>}
            subtitle="Des cercles en ligne, tenus chaque semaine par des thérapeutes du deuil. Petits effectifs. Aucune obligation de parler."
          />

          <Section className="mt-10 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45 mb-2">Cercles ouverts</p>
            {CIRCLES.map((c) => (
              <article key={c.title} className="ceramic-soft organic-radius-3 px-7 py-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/45">{c.kind}</p>
                <h3 className="mt-2 font-serif italic text-[1.05rem] text-dusk leading-snug">{c.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-dusk/65">{c.body}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-dusk/60">{c.cadence}</span>
                  <button
                    type="button"
                    className="ceramic px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.18em] text-dusk/85 hover:opacity-90 transition"
                  >
                    Rejoindre →
                  </button>
                </div>
              </article>
            ))}
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