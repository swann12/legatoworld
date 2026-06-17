import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { categoriesBySpace, type ResourceSpace } from "@/lib/resources-data";
import { z } from "zod";
import { PageHeader, IvoryCard, SectionLabel } from "@/components/legato/EditorialUI";

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
  const eyebrow = activeSpace === "care" ? "Ressources · Soi" : "Ressources · Démarches";
  const title = activeSpace === "care" ? (
    <>Des appuis <span className="italic" style={{ color: "var(--terracotta)" }}>pour vous</span>.</>
  ) : (
    <>Les bonnes <span className="italic" style={{ color: "var(--terracotta)" }}>personnes</span>, au bon moment.</>
  );
  const subtitle = activeSpace === "care"
    ? "Thérapeutes, lignes d'écoute, groupes et guides — choisis avec soin."
    : "Professionnels, aides administratives et repères utiles pour avancer sans surcharge.";
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="RESSOURCES" />

        <section className="px-6 pt-4 pb-8">
          <p className="mono-label">{eyebrow}</p>
          <h1 className="mt-5 ed-page-title">{title}</h1>
          <p className="mt-5 body-meta max-w-[34ch]">{subtitle}</p>

          {/* Switch d'espace */}
          <div className="mt-7 inline-flex rounded-full border border-dusk/15 bg-paper p-1">
            <Link
              to="/resources" search={{ space: "care" }}
              className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.14em] font-medium transition-colors ${
                activeSpace === "care" ? "bg-dusk text-paper" : "text-dusk/60 hover:text-dusk"
              }`}
            >
              Soi
            </Link>
            <Link
              to="/resources" search={{ space: "practical" }}
              className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.14em] font-medium transition-colors ${
                activeSpace === "practical" ? "bg-dusk text-paper" : "text-dusk/60 hover:text-dusk"
              }`}
            >
              Démarches
            </Link>
          </div>
        </section>

        <section className="px-5 grid grid-cols-1 gap-3">
          {cats.map(({ id, label, intent, Icon, tint }) => (
            <Link
              key={id}
              to="/resources/$category"
              params={{ category: id }}
              search={{ space: activeSpace }}
              className="block rounded-[18px] border border-dusk/10 p-5 flex items-start gap-4 justify-between transition-transform hover:-translate-y-0.5"
              style={{ background: `color-mix(in oklab, ${tint} 22%, var(--paper))` }}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-dusk/10 bg-paper">
                <Icon size={18} strokeWidth={1.5} className="text-dusk/75" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="mono-label">{label}</p>
                <p className="mt-2 max-w-[14ch] font-serif text-[22px] leading-[1.05] text-dusk">
                  {intent}
                </p>
              </div>
              <span className="mt-1 text-dusk/35 font-serif text-[18px]">→</span>
            </Link>
          ))}
        </section>

        <p className="mx-7 mt-10 text-center text-[12px] italic leading-relaxed text-dusk/50">
          Chaque personne ici a été rencontrée et choisie pour son approche.
        </p>
      </div>
    </Shell>
  );
}
