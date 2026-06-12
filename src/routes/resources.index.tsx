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
        <p
          className="mb-3 text-[10px] uppercase tracking-[0.22em] text-dusk/55"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {eyebrow}
        </p>
        <h1 className="font-serif text-[2.4rem] leading-[1.05] font-normal text-dusk text-balance">
          {title}
        </h1>
        <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-dusk/65">
          {subtitle}
        </p>

        {/* Switch d'espace, discret */}
        <div className="mt-6 inline-flex rounded-full border border-dusk/12 p-1 bg-paper">
          <Link
            to="/resources" search={{ space: "care" }}
            className={`px-3.5 py-1.5 rounded-full text-[10.5px] uppercase tracking-[0.18em] transition-colors ${
              activeSpace === "care" ? "bg-dusk text-paper" : "text-dusk/60 hover:text-dusk"
            }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Soi
          </Link>
          <Link
            to="/resources" search={{ space: "practical" }}
            className={`px-3.5 py-1.5 rounded-full text-[10.5px] uppercase tracking-[0.18em] transition-colors ${
              activeSpace === "practical" ? "bg-dusk text-paper" : "text-dusk/60 hover:text-dusk"
            }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Démarches
          </Link>
        </div>
      </header>

      <section className="mt-9 px-5 grid grid-cols-2 gap-3">
        {cats.map(({ id, label, intent, Icon, tint }, i) => (
          <Link
            key={id}
            to="/resources/$category"
            params={{ category: id }}
            search={{ space: activeSpace }}
            className={`rounded-[20px] p-5 border border-dusk/8 flex flex-col justify-between transition-transform hover:-translate-y-0.5 ${
              i % 5 === 0 ? "col-span-2 min-h-[140px]" : "min-h-[160px]"
            }`}
            style={{ background: `color-mix(in oklab, ${tint} 32%, var(--paper))` }}
          >
            <div className="flex items-start justify-between">
              <p
                className="text-[10px] uppercase tracking-[0.2em] text-dusk/60"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {label}
              </p>
              <span
                className="flex size-9 items-center justify-center rounded-full bg-paper/70"
              >
                <Icon size={16} strokeWidth={1.5} className="text-dusk/75" />
              </span>
            </div>
            <p className="mt-3 font-serif text-[17px] italic leading-snug text-dusk">
              {intent}
            </p>
          </Link>
        ))}
      </section>

      <p className="mx-7 mt-10 text-center text-[12px] italic leading-relaxed text-dusk/50">
        Chaque personne ici a été rencontrée et choisie pour son approche.
      </p>
    </Shell>
  );
}