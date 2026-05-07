import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/practical")({
  head: () => ({
    meta: [
      { title: "Accompagnement concret — Legato" },
      { name: "description", content: "Une aide pratique, douce et claire pour les premiers jours." },
    ],
  }),
  component: Practical,
});

const STEPS = [
  {
    n: "01",
    kind: "Premiers jours",
    title: "Les démarches qui ne peuvent pas attendre",
    body: "Constat de décès, mairie, employeur. Trois choses, dans cet ordre — rien d'autre pour aujourd'hui.",
  },
  {
    n: "02",
    kind: "Obsèques",
    title: "Choisir le déroulé qui vous ressemble",
    body: "Inhumation ou crémation, cérémonie civile ou religieuse, lieu, musique. Nous allons doucement.",
  },
  {
    n: "03",
    kind: "Cercueil & cérémonie",
    title: "Ce qu'on peut décider sans tout savoir",
    body: "Une page calme pour comparer, sans tableau ni vendeur. Vous gardez la main.",
  },
  {
    n: "04",
    kind: "Administratif",
    title: "Banque, abonnements, courrier",
    body: "Une checklist tenue pour vous. Vous cochez quand vous le pouvez — pas avant.",
  },
  {
    n: "05",
    kind: "Autour de vous",
    title: "Demander à quelqu'un de prendre une tâche",
    body: "Nous écrivons le message à votre place. Vous l'envoyez d'un geste.",
  },
];

function Practical() {
  const { mode } = useLegato();
  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10 flex items-center justify-between">
            <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Accueil</Link>
            <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">Mode pratique</span>
          </div>

          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              Accompagnement concret
            </p>
            <h1 className="mt-3 font-serif text-[2.3rem] leading-[1.05] font-light text-dusk text-balance">
              On s'occupe du <span className="italic">comment.</span>
              <br />
              Vous, du <span className="italic">qui.</span>
            </h1>
            <p className="mt-5 max-w-[34ch] text-[14.5px] leading-relaxed text-dusk/65">
              Cinq étapes, dans l'ordre. Une seule à la fois. Rien à mémoriser :
              ce qui doit revenir, reviendra ici doucement.
            </p>
          </header>

          {/* primary CTA — single intention */}
          <div className="px-7 mt-9">
            <button className="ceramic organic-radius-3 w-full px-6 py-5 text-center">
              <span className="block font-serif text-xl italic text-dusk">
                Commencer par l'étape 01
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-dusk/50">
                trois choses, pas plus
              </span>
            </button>
          </div>

          {/* steps as a vertical, very airy list */}
          <div className="px-7 mt-12 space-y-5">
            {STEPS.map((s) => (
              <article key={s.n} className="paper-card p-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-[26px] font-light text-dusk/40 leading-none">
                    {s.n}
                  </span>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
                      {s.kind}
                    </p>
                    <h3 className="mt-1 font-serif text-[19px] italic text-dusk leading-snug">
                      {s.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-dusk/65">{s.body}</p>
              </article>
            ))}
          </div>

          <div className="px-7 mt-12 mb-4 text-center">
            <p className="font-serif italic text-[15px] text-dusk/55 max-w-[28ch] mx-auto text-balance">
              « Ralentir n'est pas perdre du temps — c'est en gagner pour soi. »
            </p>
          </div>

          <div className="px-7 mt-8">
            <Link to="/presence" className="block border-t border-dusk/10 pt-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Si vous voulez parler</p>
              <p className="mt-1 font-serif text-base italic text-dusk">Ouvrir la Présence →</p>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}