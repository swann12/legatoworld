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
      <header className="px-7 pt-12">
        <Link to="/home" className="eyebrow inline-block mb-6 hover:text-dusk">← Aujourd'hui</Link>
        <p className="eyebrow">Ressources & accompagnement</p>
        <h1 className="mt-3 font-serif text-[30px] leading-[1.06] font-light text-dusk text-balance">
          Des mains tendues, quand vous êtes prêt·e.
        </h1>
        <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.6] text-dusk/65">
          Des personnes choisies avec soin. Rien ici n'est urgent.
        </p>
      </header>

      <section className="mt-10 px-7 space-y-3">
        {CATEGORIES.map(({ id, label, intent, Icon, tint }) => (
          <Link
            key={id}
            to="/resources/$category"
            params={{ category: id }}
            className="surface block px-5 py-5 hover:bg-dusk/[0.02] transition-colors group"
          >
            <div className="flex items-start gap-4">
              <div
                className="size-10 shrink-0 rounded-full flex items-center justify-center"
                style={{ background: `color-mix(in oklab, ${tint} 25%, var(--paper))` }}
              >
                <Icon size={18} strokeWidth={1.4} className="text-dusk/75" />
              </div>
              <div className="flex-1 pt-0.5 min-w-0">
                <p className="eyebrow">{label}</p>
                <p className="mt-2 font-serif text-[18px] font-light leading-snug text-dusk">{intent}</p>
              </div>
              <span className="text-dusk/40 group-hover:text-dusk transition mt-1">→</span>
            </div>
          </Link>
        ))}
      </section>

      <p className="mx-7 mt-10 text-center text-[12px] text-dusk/55">
        Chaque personne ici a été rencontrée et choisie pour son approche.
      </p>
    </Shell>
  );
}