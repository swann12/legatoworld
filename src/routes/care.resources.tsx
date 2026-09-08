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
          <p className="mt-4 text-[13px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Peu de choses, choisies. Prenez-en une, laissez le reste.
          </p>
        </section>

        {BLOCKS.map((b, bi) => (
          <section key={b.label} className="px-5 pt-9">
            <div className="flex items-baseline gap-3 px-1">
              <span className="mono-label" style={{ color: "var(--terracotta)" }}>
                {String(bi + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="mono-label">{b.label}</p>
                <p className="mt-2 text-[12.5px] leading-[1.55] text-dusk/55 max-w-[32ch]">{b.intro}</p>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-[18px] border border-dusk/10">
              {b.items.map((it, i) => (
                <Link
                  key={it.title}
                  to={it.to as "/care"}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors"
                  style={{
                    background: it.strong ? "var(--clay)" : "var(--whisper)",
                    color: "var(--dusk)",
                    borderTop: i === 0 ? "none" : "1px solid color-mix(in oklab, var(--dusk) 8%, transparent)",
                  }}
                >
                  <span className="min-w-0">
                    <span className="block font-serif text-[18px] leading-[1.15]">{it.title}</span>
                    <span className="mt-1 block text-[12.5px] text-dusk/60">{it.hint}</span>
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
