import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/care/resources")({
  head: () => ({
    meta: [
      { title: "Ressources — Soutien Legato" },
      { name: "description", content: "À lire, à écouter, à regarder, pour comprendre, et pour aujourd'hui : une sélection courte pour traverser." },
      { property: "og:title", content: "Ressources — Soutien Legato" },
      { property: "og:description", content: "Une sélection courte pour traverser : lectures, écoutes, films, repères." },
    ],
  }),
  component: CareResources,
});

type Item = { title: string; hint: string; to: string; strong?: boolean };
type Block = { label: string; intro: string; items: Item[] };

const BLOCKS: Block[] = [
  {
    label: "À lire",
    intro: "Des livres qui disent juste, sans consoler de force.",
    items: [
      { title: "Livres du deuil", hint: "Quatre titres, lus et choisis.", to: "/library/lectures" },
      { title: "Écrire soi-même", hint: "Une page, quand les mots viennent.", to: "/care/journal" },
    ],
  },
  {
    label: "À écouter",
    intro: "Des voix qui tiennent compagnie.",
    items: [
      { title: "Podcasts", hint: "Épisodes courts, ton juste.", to: "/library/podcasts" },
      { title: "Respirer", hint: "Trois minutes guidées.", to: "/care/respirer" },
    ],
  },
  {
    label: "À regarder",
    intro: "Des films doux, jamais larmoyants.",
    items: [
      { title: "Films", hint: "Trois films qui laissent respirer.", to: "/library/films" },
    ],
  },
  {
    label: "Pour comprendre",
    intro: "Ce qui se passe en vous, et autour.",
    items: [
      { title: "Rituels du monde", hint: "D'où viennent ces gestes.", to: "/library/rituels" },
      { title: "Aider un proche", hint: "Quoi dire, quoi faire.", to: "/care/community" },
      { title: "Parler à un professionnel", hint: "Psychologues, écoute, associations.", to: "/practical/pros" },
    ],
  },
  {
    label: "Pour aujourd'hui",
    intro: "Si la journée est difficile, commencez par là.",
    items: [
      { title: "Le corps", hint: "Trois questions, une à trois pistes.", to: "/help/corps" },
      { title: "Besoin d’aide tout de suite", hint: "Une présence humaine, tout de suite.", to: "/crisis", strong: true },
    ],
  },
];

function CareResources() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="RESSOURCES" back="/care" />

        <section className="px-6 pt-2 pb-2">
          <h1 className="ed-page-title text-[30px]">
            Pour vous <span className="italic" style={{ color: "var(--terracotta)" }}>accompagner</span>.
          </h1>
        </section>

        {BLOCKS.map((b, bi) => (
          <section key={b.label} className="px-6 pt-8">
            <div className="flex items-baseline gap-3">
              <span className="mono-label" style={{ color: "var(--terracotta)" }}>
                {String(bi + 1).padStart(2, "0")}
              </span>
              <p className="mono-label">{b.label}</p>
            </div>
            <div className="mt-3">
              {b.items.map((it) => (
                <Link
                  key={it.title}
                  to={it.to as "/care"}
                  className="flex items-center justify-between gap-4 border-b border-dashed border-dusk/20 py-3.5"
                >
                  <span className="font-serif text-[18px] leading-[1.15]" style={{ color: it.strong ? "var(--terracotta)" : undefined }}>
                    {it.title}
                  </span>
                  <span aria-hidden className="shrink-0 text-dusk/35">→</span>
                </Link>
              ))}
            </div>
          </section>

        ))}

        <div className="pt-10" />
      </div>
    </Shell>
  );
}
