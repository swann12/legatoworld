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
    <>Des ressources <br /><span className="italic text-dusk/85">pour vous guider.</span></>
  ) : (
    <>Des appuis concrets, <br /><span className="italic text-dusk/85">au bon moment.</span></>
  );
  const subtitle = activeSpace === "care"
    ? "Thérapeutes, lignes d'écoute, groupes et guides choisis avec soin."
    : "Professionnels, aides administratives et repères utiles pour avancer sans surcharge.";
  return (
    <Shell>
      <header className="px-7 pt-14 pb-7 editorial-hero">
        <p className="mb-3 editorial-kicker">
          {eyebrow}
        </p>
        <h1 className="max-w-[9ch] editorial-display text-dusk">
          {title}
        </h1>
        <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-dusk/65">
          {subtitle}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="editorial-stat-card px-4 py-4" style={{ background: "color-mix(in oklab, var(--sun) 56%, white)" }}>
            <p className="editorial-kicker">Promesse</p>
            <p className="mt-2 font-serif text-[22px] leading-[1.02]">Des appuis choisis avec soin.</p>
          </div>
          <div className="editorial-stat-card px-4 py-4" style={{ background: "color-mix(in oklab, var(--mist) 34%, white)" }}>
            <p className="editorial-kicker">Usage</p>
            <p className="mt-2 text-[13px] leading-relaxed text-dusk/70">On entre par besoin, pas par catalogue.</p>
          </div>
        </div>

        {/* Switch d'espace, discret */}
        <div className="mt-6 inline-flex editorial-chip p-1">
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

      <section className="mt-8 px-5 grid grid-cols-1 gap-3">
        {cats.map(({ id, label, intent, Icon, tint }, i) => (
          <Link
            key={id}
            to="/resources/$category"
            params={{ category: id }}
            search={{ space: activeSpace }}
            className={`rounded-[16px] p-5 border border-dusk/8 flex items-start gap-4 justify-between transition-transform hover:-translate-y-0.5 editorial-tint-card ${
              i === 0 ? "min-h-[144px]" : "min-h-[124px]"
            }`}
            style={{ background: `color-mix(in oklab, ${tint} 26%, white)` }}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-dusk/8 bg-paper/80">
              <Icon size={18} strokeWidth={1.5} className="text-dusk/75" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/60" style={{ fontFamily: "var(--font-mono)" }}>
                {label}
              </p>
              <p className="mt-2 max-w-[12ch] font-serif text-[24px] leading-[1.02] text-dusk">
                {intent}
              </p>
            </div>
            <span className="mt-1 text-dusk/35">→</span>
          </Link>
        ))}
      </section>

      <p className="mx-7 mt-10 text-center text-[12px] italic leading-relaxed text-dusk/50">
        Chaque personne ici a été rencontrée et choisie pour son approche.
      </p>
    </Shell>
  );
}