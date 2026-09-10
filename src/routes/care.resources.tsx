import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead, Tabs } from "@/components/legato/EditorialUI";

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

type Item = { title: string; hint: string; to: string; meta?: string; strong?: boolean };
type Family = "lire" | "ecouter" | "regarder" | "comprendre" | "aujourdhui";
type Block = { id: Family; label: string; intro: string; items: Item[] };

const BLOCKS: Block[] = [
  {
    id: "lire",
    label: "Lire",
    intro: "Des livres qui disent juste, sans consoler de force.",
    items: [
      { title: "Livres du deuil", hint: "Quatre titres, lus et choisis", to: "/library/lectures", meta: "4" },
      { title: "Écrire soi-même", hint: "Une page, quand les mots viennent", to: "/care/journal", meta: "5 min" },
    ],
  },
  {
    id: "ecouter",
    label: "Écouter",
    intro: "Des voix qui tiennent compagnie.",
    items: [
      { title: "Podcasts", hint: "Épisodes courts, ton juste", to: "/library/podcasts", meta: "6" },
      { title: "Souffles sans mots", hint: "Nappes sonores, rien à comprendre", to: "/no-words", meta: "13" },
      { title: "Respirer", hint: "Trois minutes guidées", to: "/care/respirer", meta: "3 min" },
    ],
  },
  {
    id: "regarder",
    label: "Regarder",
    intro: "Des films doux, jamais larmoyants.",
    items: [{ title: "Films", hint: "Trois films qui laissent respirer", to: "/library/films", meta: "3" }],
  },
  {
    id: "comprendre",
    label: "Comprendre",
    intro: "Ce qui se passe en vous, et autour.",
    items: [
      { title: "Rituels du monde", hint: "D'où viennent ces gestes", to: "/library/rituels", meta: "12" },
      { title: "Aider un proche", hint: "Quoi dire, quoi faire", to: "/care/community" },
      { title: "Parler à un professionnel", hint: "Thérapeutes, médecines douces, associations", to: "/care/aide" },
    ],
  },
  {
    id: "aujourdhui",
    label: "Aujourd'hui",
    intro: "Si la journée est difficile, commencez par là.",
    items: [
      { title: "Le corps", hint: "Quatre questions, des pistes concrètes", to: "/help/corps" },
      { title: "Besoin d'aide tout de suite", hint: "Une présence humaine, maintenant", to: "/crisis", strong: true },
    ],
  },
];

function CareResources() {
  const [family, setFamily] = useState<Family | "tout">("tout");
  const visible = family === "tout" ? BLOCKS : BLOCKS.filter((b) => b.id === family);

  return (
    <Shell livingBg={false}>
      <div className="wash-sky min-h-dvh text-dusk pb-36">
        <PageHeader title="RESSOURCES" back="/care" />

        <section className="px-6 pt-2">
          <h1 className="ed-page-title text-[30px]">
            Pour vous <span className="italic" style={{ color: "var(--terracotta)" }}>accompagner</span>.
          </h1>
          <p className="mt-4 max-w-[30ch] text-[13px] leading-[1.6] text-dusk/60">
            Une sélection courte. Chaque entrée mène exactement à ce qu'elle annonce.
          </p>
        </section>

        <section className="px-6 pt-7">
          <Tabs
            scroll
            value={family}
            onChange={setFamily}
            options={[{ id: "tout" as const, label: "Tout" }, ...BLOCKS.map((b) => ({ id: b.id, label: b.label }))]}
          />
        </section>

        {visible.map((b, bi) => (
          <section key={b.id} className="px-5 pt-9">
            <SectionHead label={`${String(bi + 1).padStart(2, "0")} · ${b.label}`} meta={String(b.items.length).padStart(2, "0")} />
            <p className="mt-3 px-1 text-[12.5px] italic text-dusk/55">{b.intro}</p>

            <ul className="tint-sky mt-3 rounded-[18px] px-5">
              {b.items.map((it) => (
                <li
                  key={it.title}
                  className="border-b border-dashed last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
                >
                  <Link to={it.to as "/care"} className="flex items-start gap-4 py-4 transition-opacity active:opacity-70">
                    <span className="min-w-0 flex-1">
                      <span
                        className="block font-serif text-[17.5px] leading-[1.2]"
                        style={{ color: it.strong ? "var(--terracotta)" : undefined }}
                      >
                        {it.title}
                      </span>
                      <span className="mt-1 block text-[12.5px] surf-sub">{it.hint}</span>
                    </span>
                    <span className="shrink-0 self-start pt-[3px] text-[11px] tabular-nums text-dusk/40">
                      {it.meta ?? "→"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="pt-10" />
      </div>
    </Shell>
  );
}
