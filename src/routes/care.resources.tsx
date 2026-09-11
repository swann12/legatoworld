import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/care/resources")({
  head: () => ({
    meta: [
      { title: "Ressources — Soutien Legato" },
      { name: "description", content: "À lire, à écouter, à regarder, pour comprendre : une sélection courte pour traverser." },
      { property: "og:title", content: "Ressources — Soutien Legato" },
      { property: "og:description", content: "Une sélection courte pour traverser : lectures, écoutes, films, repères." },
    ],
  }),
  component: CareResources,
});

type Item = { title: string; hint: string; to: string };
type Block = { label: string; items: Item[] };

const BLOCKS: Block[] = [
  {
    label: "Lire",
    items: [
      { title: "Livres du deuil", hint: "Quatre titres, lus et choisis", to: "/library/lectures" },
      { title: "Écrire soi-même", hint: "Une page, quand les mots viennent", to: "/care/journal" },
    ],
  },
  {
    label: "Écouter",
    items: [
      { title: "Podcasts", hint: "Épisodes courts, ton juste", to: "/library/podcasts" },
      { title: "Souffles sans mots", hint: "Nappes sonores, rien à comprendre", to: "/no-words" },
      { title: "Respirer", hint: "Trois minutes guidées", to: "/care/respirer" },
    ],
  },
  {
    label: "Regarder",
    items: [{ title: "Films", hint: "Trois films qui laissent respirer", to: "/library/films" }],
  },
  {
    label: "Comprendre",
    items: [
      { title: "Rituels du monde", hint: "D'où viennent ces gestes", to: "/library/rituels" },
      { title: "Aider un proche", hint: "Quoi dire, quoi faire", to: "/care/community" },
      { title: "Parler à un professionnel", hint: "Thérapeutes, médecines douces, associations", to: "/care/aide" },
    ],
  },
];

function CareResources() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-36">
        <PageHeader title="RESSOURCES" back="/care" />

        <section className="px-6 pt-2">
          <h1 className="ed-page-title text-[30px]">
            Pour vous <span className="italic" style={{ color: "var(--terracotta)" }}>accompagner</span>.
          </h1>
          <p className="mt-4 max-w-[30ch] text-[13px] leading-[1.6] text-dusk/60">
            Une sélection courte. Chaque entrée mène exactement à ce qu'elle annonce.
          </p>
        </section>

        {/* Si la journée est difficile — une seule porte, en évidence. */}
        <section className="px-5 pt-8">
          <Link
            to="/crisis"
            className="flex items-center justify-between gap-4 rounded-[20px] px-6 py-5"
            style={{ background: "color-mix(in oklab, var(--blush) 60%, var(--paper))" }}
          >
            <span>
              <span className="mono-label block" style={{ color: "var(--bordeaux)" }}>Si c'est trop lourd aujourd'hui</span>
              <span className="mt-2 block font-serif text-[20px] leading-[1.15]">Trouver une présence humaine</span>
            </span>
            <span aria-hidden className="text-dusk/40">→</span>
          </Link>
        </section>

        {BLOCKS.map((b) => (
          <section key={b.label} className="px-6 pt-9">
            <div className="flex items-center gap-3">
              <p className="mono-label">{b.label}</p>
              <div className="h-px flex-1 bg-dusk/12" />
            </div>

            <ul className="mt-1">
              {b.items.map((it) => (
                <li
                  key={it.title}
                  className="border-b border-dashed last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 14%, transparent)" }}
                >
                  <Link to={it.to as "/care"} className="flex items-baseline justify-between gap-4 py-4 active:opacity-70">
                    <span className="min-w-0">
                      <span className="block font-serif text-[18px] leading-[1.2]">{it.title}</span>
                      <span className="mt-1 block text-[12.5px] text-dusk/55">{it.hint}</span>
                    </span>
                    <span aria-hidden className="shrink-0 text-dusk/30">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="px-6 pt-9">
          <Link to="/help/corps" className="text-[13px]" style={{ color: "var(--bordeaux)" }}>
            Prendre soin de son corps aujourd'hui →
          </Link>
        </section>

        <div className="pt-10" />
      </div>
    </Shell>
  );
}
