import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/dates")({
  head: () => ({ meta: [{ title: "Dates sensibles — Legato" }] }),
  component: Dates,
});

const DATES = [
  { kind: "Anniversaire", title: "Un an", date: "16 mai", inDays: 12, soft: true },
  { kind: "Naissance", title: "Ses 64 ans", date: "2 juillet", inDays: 59, soft: false },
  { kind: "Mémoire", title: "Le jour au lac", date: "24 août", inDays: 112, soft: false },
  { kind: "Récurrent", title: "Les déjeuners du dimanche", date: "Chaque dimanche", inDays: 3, soft: true },
];

function Dates() {
  const { mode } = useLegato();
  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10">
            <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Accueil</Link>
          </div>
          <ScreenHeader
            eyebrow="Dates sensibles"
            title={<>Des jours qui <br /><span className="italic">savent déjà.</span></>}
            subtitle="Un calendrier discret. Si vous le souhaitez, nous adoucirons l'app autour de ces jours."
          />

          <Section className="mt-10 space-y-3">
            {DATES.map((d) => (
              <article key={d.title} className={`organic-radius-3 p-5 ${d.soft ? "ceramic" : "ceramic-soft"}`}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40">{d.kind}</p>
                    <h3 className="mt-1.5 font-serif text-xl italic text-dusk">{d.title}</h3>
                    <p className="mt-1 text-[13px] text-dusk/55">{d.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-serif text-3xl font-light text-dusk leading-none">{d.inDays}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40 mt-1">jours</p>
                  </div>
                </div>
              </article>
            ))}
          </Section>

          <Section className="mt-8">
            <button className="ceramic organic-radius-3 w-full px-7 py-5 text-center">
              <span className="font-serif text-lg italic text-dusk">Ajouter une date</span>
            </button>
          </Section>
        </div>
      </div>
    </Shell>
  );
}