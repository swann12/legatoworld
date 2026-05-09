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
    body: "Constat de décès, mairie, employeur. Trois choses dans cet ordre. Rien d'autre aujourd'hui.",
  },
  {
    n: "02",
    kind: "Obsèques",
    title: "Choisir un déroulé qui vous ressemble",
    body: "Inhumation ou crémation, cérémonie civile ou religieuse, lieu, musique. On avance doucement.",
  },
  {
    n: "03",
    kind: "Cercueil et cérémonie",
    title: "Décider sans tout savoir",
    body: "Comparer simplement, sans tableau ni argumentaire. Vous gardez la main.",
  },
  {
    n: "04",
    kind: "Administratif",
    title: "Banque, abonnements, courrier",
    body: "Une liste tenue pour vous. Vous cochez quand vous le pouvez, pas avant.",
  },
  {
    n: "05",
    kind: "Autour de vous",
    title: "Confier une tâche à un proche",
    body: "Nous écrivons le message pour vous. Vous l'envoyez d'un geste.",
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
            <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">Accompagnement</span>
          </div>

          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              Accompagnement concret
            </p>
            <h1 className="mt-3 font-serif text-[2.1rem] leading-[1.08] font-light text-dusk text-balance">
              On s'occupe du <span className="italic">comment.</span><br />
              Vous, du <span className="italic">qui.</span>
            </h1>
            <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-dusk/65">
              Cinq étapes, une à la fois. Rien à retenir&nbsp;: tout reste ici, à portée.
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
          <div className="px-7 mt-12 space-y-4">
            {STEPS.map((s) => (
              <article key={s.n} className="paper-card p-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-[24px] font-light text-dusk/40 leading-none w-8 shrink-0">
                    {s.n}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
                      {s.kind}
                    </p>
                    <h3 className="mt-1.5 font-serif text-[18px] italic text-dusk leading-snug">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-dusk/65">{s.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="px-7 mt-10 grid grid-cols-1 gap-3">
            <Link to="/wishes" className="paper-card p-5 flex items-baseline justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Mes volontés</p>
                <p className="mt-1 font-serif text-base italic text-dusk">Écrire ce que je voudrais, pour le jour venu</p>
              </div>
              <span className="text-dusk/40">→</span>
            </Link>
            <Link to="/inspiration" className="paper-card p-5 flex items-baseline justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Inspirations</p>
                <p className="mt-1 font-serif text-base italic text-dusk">Décrire la personne, recevoir des pistes</p>
              </div>
              <span className="text-dusk/40">→</span>
            </Link>
          </div>

          <div className="px-7 mt-8 mb-4 text-center">
            <p className="font-serif italic text-[14px] text-dusk/55 max-w-[28ch] mx-auto text-balance">
              « Ralentir n'est pas perdre du temps. C'est en gagner pour soi. »
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