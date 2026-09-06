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

type Item = { title: string; hint: string; to: string; bg: string };
type Block = { label: string; intro: string; items: Item[] };

const BLOCKS: Block[] = [
  {
    label: "À lire",
    intro: "Des livres qui disent juste, sans consoler de force.",
    items: [
      { title: "Livres du deuil", hint: "Quatre titres, lus et choisis.", to: "/library/lectures", bg: "var(--blush)" },
      { title: "Écrire soi-même", hint: "Une page, quand les mots viennent.", to: "/care/journal", bg: "var(--whisper)" },
    ],
  },
  {
    label: "À écouter",
    intro: "Des voix qui tiennent compagnie.",
    items: [
      { title: "Podcasts", hint: "Épisodes courts, ton juste.", to: "/library/podcasts", bg: "var(--sun)" },
      { title: "Respirer", hint: "Trois minutes guidées.", to: "/care/respirer", bg: "var(--sage)" },
    ],
  },
  {
    label: "À regarder",
    intro: "Des films doux, jamais larmoyants.",
    items: [
      { title: "Films", hint: "Trois films qui laissent respirer.", to: "/library/films", bg: "var(--sky)" },
    ],
  },
  {
    label: "Pour comprendre",
    intro: "Ce qui se passe en vous, et autour.",
    items: [
      { title: "Rituels du monde", hint: "D'où viennent ces gestes.", to: "/library/rituels", bg: "var(--peach)" },
      { title: "Aider un proche", hint: "Quoi dire, quoi faire.", to: "/care/community", bg: "var(--whisper)" },
      { title: "Parler à un professionnel", hint: "Psychologues, écoute, associations.", to: "/practical/pros", bg: "var(--whisper)" },
    ],
  },
  {
    label: "Pour aujourd'hui",
    intro: "Si la journée est difficile, commencez par là.",
    items: [
      { title: "Le corps", hint: "Trois questions, une à trois pistes.", to: "/help/corps", bg: "var(--blush)" },
      { title: "Si ça déborde", hint: "Une présence humaine, tout de suite.", to: "/crisis", bg: "var(--terracotta)" },
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

        {BLOCKS.map((b) => (
          <section key={b.label} className="px-5 pt-9">
            <div className="px-1">
              <p className="mono-label">{b.label}</p>
              <p className="mt-2 text-[12.5px] leading-[1.55] text-dusk/55 max-w-[32ch]">{b.intro}</p>
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              {b.items.map((it) => (
                <Link
                  key={it.title}
                  to={it.to as "/care"}
                  className="block rounded-[18px] px-5 py-4"
                  style={{
                    background: it.bg,
                    color: it.bg === "var(--terracotta)" ? "var(--paper)" : "var(--dusk)",
                  }}
                >
                  <p className="font-serif text-[18px] leading-[1.15]">{it.title}</p>
                  <p className="mt-1 text-[12.5px]" style={{ opacity: 0.7 }}>{it.hint}</p>
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
