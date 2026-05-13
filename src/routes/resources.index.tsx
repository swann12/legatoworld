import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { CATEGORIES } from "@/lib/resources-data";

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      { title: "Ressources & Accompagnement — Legato" },
      {
        name: "description",
        content:
          "Des personnes choisies avec soin, à rencontrer quand vous êtes prêt·e.",
      },
    ],
  }),
  component: ResourcesIndex,
});

function ResourcesIndex() {
  return (
    <Shell>
      <header className="px-7 pt-14">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-dusk/40">
          Ressources & accompagnement
        </p>
        <h1 className="font-serif text-[2.2rem] leading-[1.1] font-light text-dusk text-balance">
          Des mains tendues,
          <br />
          <span className="italic text-dusk/85">quand vous êtes prêt·e.</span>
        </h1>
        <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-dusk/60">
          Des personnes choisies avec soin. Rien ici n'est urgent.
        </p>
      </header>

      <section className="mt-10 px-7 space-y-4">
        {CATEGORIES.map(({ id, label, intent, Icon, tint }) => (
          <Link
            key={id}
            to="/resources/$category"
            params={{ category: id }}
            className="paper-card block px-5 py-5 transition-all hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div
                className="ceramic-soft flex size-12 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `linear-gradient(160deg, color-mix(in oklab, ${tint} 30%, var(--paper)), color-mix(in oklab, ${tint} 55%, var(--clay)))`,
                }}
              >
                <Icon size={20} strokeWidth={1.4} className="text-dusk/75" />
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/45">
                  {label}
                </p>
                <p className="mt-1.5 font-serif text-[1.15rem] italic leading-snug text-dusk">
                  {intent}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <p className="mx-7 mt-10 text-center text-[12px] italic leading-relaxed text-dusk/50">
        Chaque personne ici a été rencontrée et choisie pour son approche.
      </p>
    </Shell>
  );
}