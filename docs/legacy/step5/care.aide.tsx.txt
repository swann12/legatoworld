import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";
import type { CategoryId } from "@/lib/resources-data";

export const Route = createFileRoute("/care/aide")({
  head: () => ({
    meta: [
      { title: "Aide humaine — Legato" },
      { name: "description", content: "Thérapeutes du deuil, médecines douces, associations et lignes d'écoute." },
      { property: "og:title", content: "Aide humaine — Legato" },
      { property: "og:description", content: "Des personnes à qui parler : thérapeutes, médecines douces, associations, écoute." },
    ],
  }),
  component: CareAide,
});

type Appui = { id: CategoryId; label: string; role: string; when: string };

const APPUIS: Appui[] = [
  {
    id: "therapeutes",
    label: "Thérapeutes du deuil",
    role: "Un espace pour déposer ce qui pèse, avec quelqu'un de formé au deuil.",
    when: "Quand la peine ne se dit à personne, ou dure sans relâche.",
  },
  {
    id: "medecines-douces",
    label: "Médecines douces",
    role: "Sophrologie, ostéopathie, acupuncture, massage : passer par le corps.",
    when: "Quand le sommeil, le souffle ou les tensions prennent toute la place.",
  },
  {
    id: "ecoute",
    label: "Associations & lignes d'écoute",
    role: "Groupes de parole et bénévoles qui ont traversé la même chose.",
    when: "Quand parler à des personnes qui comprennent fait plus de bien qu'un cabinet.",
  },
];

function CareAide() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-36">
        <PageHeader title="AIDE HUMAINE" back="/care" />

        <section className="px-6 pt-2">
          <h1 className="ed-page-title text-[30px]">
            Des personnes à qui <span className="italic" style={{ color: "var(--terracotta)" }}>parler</span>.
          </h1>
          <p className="mt-4 max-w-[30ch] text-[13px] leading-[1.6] text-dusk/55">
            Ici, seulement du soutien. Les obsèques, les papiers et le notaire restent dans Démarches.
          </p>
        </section>

        <section className="px-6 pt-9">
          {APPUIS.map((a, i) => (
            <Link
              key={a.id}
              to="/resources/$category"
              params={{ category: a.id }}
              search={{ space: "care" as const }}
              className="block border-b border-dashed py-5 last:border-0"
              style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
            >
              <span className="text-[10.5px] tabular-nums tracking-[0.14em] text-dusk/35" style={{ fontFamily: "var(--font-mono)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-1.5 block font-serif text-[21px] leading-[1.15]">{a.label}</span>
              <span className="mt-1.5 block max-w-[36ch] text-[13px] leading-[1.5] text-dusk/60">{a.role}</span>
              <span className="mt-2 block max-w-[36ch] text-[12.5px] italic leading-[1.5] text-dusk/45">{a.when}</span>
            </Link>
          ))}
        </section>

        <section className="px-6 pt-9">
          <Link to="/crisis" className="mono-label" style={{ color: "var(--bordeaux)" }}>
            Besoin d'aide tout de suite →
          </Link>
        </section>
      </div>
    </Shell>
  );
}
