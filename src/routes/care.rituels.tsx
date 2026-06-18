import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, CARE_SUBNAV } from "@/components/legato/SubNav";
import { useLovedName } from "@/lib/loved-name";

export const Route = createFileRoute("/care/rituels")({
  head: () => ({
    meta: [
      { title: "Rituels d'hommage — Legato" },
      { name: "description", content: "Des rituels du monde pour honorer un être perdu : 2 minutes, ou plusieurs jours." },
    ],
  }),
  component: CareRituels,
});

type Ritual = {
  id: string;
  title: string;
  origin: string;
  duration: string;
  hint: string;
  bg: string;
};

const RITUALS: Ritual[] = [
  { id: "bougie",    title: "Allumer une bougie",  origin: "Universel",       duration: "2 min",    hint: "Un nom prononcé, une flamme tenue.",     bg: "var(--sun)"    },
  { id: "obon",      title: "Lanterne sur l'eau",  origin: "Japon — Obon",    duration: "10 min",   hint: "Une lumière qu'on confie au courant.",   bg: "var(--sky)"    },
  { id: "muertos",   title: "Petite offrande",     origin: "Mexique — Día",   duration: "20 min",   hint: "Ses fleurs, ses plats, sa photo.",       bg: "var(--blush)"  },
  { id: "kaddish",   title: "Lire à voix haute",   origin: "Judaïsme",        duration: "5 min",    hint: "Un texte, dit pour la mémoire.",         bg: "var(--whisper)"},
  { id: "ancestors", title: "Repas partagé",       origin: "Afrique de l'Ouest", duration: "1 soir", hint: "Réunir, raconter, manger ensemble.",    bg: "var(--sun)"    },
  { id: "marche",    title: "Marche silencieuse",  origin: "Bouddhisme zen",  duration: "30 min",   hint: "Marcher en pensant à elle, à lui.",      bg: "var(--sky)"    },
  { id: "shiva",     title: "Sept jours présents", origin: "Tradition juive", duration: "7 jours",  hint: "Recevoir, ne pas être seul·e.",          bg: "var(--blush)"  },
  { id: "lettre",    title: "Lettre brûlée",       origin: "Taoïsme",         duration: "15 min",   hint: "Écrire ce qu'on n'a pas dit, le confier.", bg: "var(--whisper)"},
];

function CareRituels() {
  const lovedName = useLovedName();
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <Link to="/care/garden" className="mono-label text-dusk/55">Jardin →</Link>
        </header>
        <SubNav items={CARE_SUBNAV} ariaLabel="Sous-navigation Soutien" />

        <section className="px-6 pt-8">
          <p className="mono-label">Rituels d'hommage</p>
          <h1 className="mt-4 ed-page-title">
            Honorer <span className="italic" style={{ color: "var(--terracotta)" }}>{lovedName}</span>.
          </h1>
          <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Des gestes qui viennent d'ailleurs. Choisissez celui qui résonne.
          </p>
        </section>

        <section className="px-5 pt-8 flex flex-col gap-3">
          {RITUALS.map((r) => (
            <article key={r.id} className="rounded-[18px] px-5 py-5" style={{ background: r.bg }}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="mono-label text-dusk/65">{r.origin}</p>
                <span className="mono-label text-dusk/50">{r.duration}</span>
              </div>
              <h2 className="mt-2 font-serif text-[22px] leading-[1.15]">{r.title}</h2>
              <p className="mt-2 text-[13px] text-dusk/70">{r.hint}</p>
            </article>
          ))}
        </section>
      </div>
    </Shell>
  );
}