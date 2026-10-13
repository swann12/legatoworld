import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";
import { useLovedName } from "@/lib/loved-name";
import { useMemories } from "@/lib/memories-store";

export const Route = createFileRoute("/care/garden/depot")({
  head: () => ({
    meta: [
      { title: "Déposer un souvenir — Legato" },
      { name: "description", content: "Photos, voix, lettres, musiques, objets, citations : déposez un souvenir dans le Jardin." },
      { property: "og:title", content: "Déposer un souvenir — Legato" },
      { property: "og:description", content: "Photos, voix, lettres, musiques, objets, citations." },
    ],
  }),
  component: Depot,
});

const KINDS = [
  { kind: "photo", label: "Photos" },
  { kind: "voix", label: "Voix" },
  { kind: "lettre", label: "Lettres" },
  { kind: "musique", label: "Musiques" },
  { kind: "objet", label: "Objets" },
  { kind: "citation", label: "Citations" },
] as const;

const DASH = "color-mix(in oklab, var(--dusk) 16%, transparent)";

function Depot() {
  const lovedName = useLovedName();
  const all = useMemories();

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader back="/care/garden" title="DÉPOSER" />

        <section className="px-6">
          <p className="mono-label">{lovedName}</p>
          <h1 className="mt-3 ed-page-title">Un souvenir.</h1>
        </section>

        <section className="px-6 pt-8">
          <ul>
            {KINDS.map((k, i) => {
              const n = all.filter((m) => m.zone === k.kind).length;
              return (
                <li key={k.kind} className="border-b border-dashed last:border-0" style={{ borderColor: DASH }}>
                  <Link to="/care/garden/$zone" params={{ zone: k.kind }} className="flex items-center gap-4 py-4">
                    <span className="text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-serif text-[20px] leading-[1.15]">{k.label}</span>
                    <span className="text-[11px] tabular-nums text-dusk/35">{String(n).padStart(2, "0")}</span>
                    <span aria-hidden className="text-dusk/30">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
