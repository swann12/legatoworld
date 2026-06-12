import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { categoriesBySpace, type ResourceSpace } from "@/lib/resources-data";
import { z } from "zod";

export const Route = createFileRoute("/resources/")({
  validateSearch: (s) =>
    z.object({ space: z.enum(["care", "practical"]).optional() }).parse(s),
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
  const { space } = Route.useSearch();
  const activeSpace: ResourceSpace = space ?? "care";
  const cats = categoriesBySpace(activeSpace);
  const eyebrow = activeSpace === "care"
    ? "Prendre soin de soi"
    : "Organiser & avancer";
  const title = activeSpace === "care" ? (
    <>Des mains tendues,<br /><span className="italic text-dusk/85">quand vous êtes prêt·e.</span></>
  ) : (
    <>Des professionnels,<br /><span className="italic text-dusk/85">pour avancer sereinement.</span></>
  );
  const subtitle = activeSpace === "care"
    ? "Thérapeutes, médecines douces, lignes d'écoute et groupes — choisis avec soin."
    : "Pompes funèbres, notaires, débarras, administrations — transparents et sans pression.";
  return (
    <Shell>
      <header className="px-7 pt-14">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-dusk/40">
          {eyebrow}
        </p>
        <h1 className="font-serif text-[2.2rem] leading-[1.1] font-light text-dusk text-balance">
          {title}
        </h1>
        <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-dusk/60">
          {subtitle}
        </p>
      </header>

      <section className="mt-10 px-7 space-y-4">
        {cats.map(({ id, label, intent, Icon, tint }) => (
          <Link
            key={id}
            to="/resources/$category"
            params={{ category: id }}
            search={{ space: activeSpace }}
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