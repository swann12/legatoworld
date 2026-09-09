import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";
import { MapPin, Video, Home as HomeIcon, Sparkles } from "lucide-react";
import { getCategory, providersByCategory, type CategoryId } from "@/lib/resources-data";
import { z } from "zod";

export const Route = createFileRoute("/resources/$category")({
  validateSearch: (s) =>
    z.object({ space: z.enum(["care", "practical"]).optional() }).parse(s),
  component: CategoryPage,
  notFoundComponent: () => (
    <Shell>
      <div className="px-7 pt-20">
        <p className="ed-page-title">Cette catégorie n'est pas encore ouverte.</p>
        <Link to="/resources" className="mt-4 inline-block eyebrow underline" style={{ color: "var(--terracotta)" }}>
          Revenir aux catégories
        </Link>
      </div>
    </Shell>
  ),
});

type Filter = "tous" | "visio" | "presentiel";

function CategoryPage() {
  const { category } = Route.useParams();
  const { space } = Route.useSearch();
  const cat = getCategory(category);
  if (!cat) throw notFound();
  const [filter, setFilter] = useState<Filter>("tous");
  const [city, setCity] = useState("");
  if (space && space !== cat.space) {
    return (
      <Shell livingBg={false}>
        <div className="wash-sky min-h-dvh text-dusk px-6 pt-20">
          <p className="mono-label">Ressource déplacée</p>
          <h1 className="mt-5 ed-page-title">Cette rubrique appartient à l'autre espace.</h1>
          <Link to="/resources" search={{ space: cat.space }} className="mt-8 inline-block rounded-full px-6 py-3 font-serif text-[18px]" style={{ background: "var(--terracotta)", color: "var(--paper)" }}>
            Ouvrir le bon espace →
          </Link>
        </div>
      </Shell>
    );
  }

  const all = providersByCategory(category as CategoryId);

  const list = all.filter((p) => {
    if (filter === "visio" && !p.modes.includes("visio")) return false;
    if (filter === "presentiel" && !p.modes.some((m) => m === "cabinet" || m === "domicile"))
      return false;
    if (city.trim() && !p.city.toLowerCase().includes(city.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <Shell livingBg={false}>
      <div className="wash-sky min-h-dvh text-dusk pb-32">
        <PageHeader title="RESSOURCES" back="/resources" />

        <section className="px-6 pt-8 pb-6">
          <p className="mono-label">{cat.label}</p>
          <h1 className="mt-4 ed-page-title">
            <span className="italic">{cat.intent}</span>
          </h1>
        </section>

        {/* Filtres */}
        <div className="px-6">
          <p className="eyebrow">Filtrer</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {([
              ["tous", "Toutes"],
              ["visio", "À distance"],
              ["presentiel", "En présentiel"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`rounded-full px-4 py-2 text-[12px] font-medium tracking-wide transition-all ${
                  filter === id ? "" : "card-plain"
                }`}
                style={filter === id ? { background: "var(--ink)", color: "var(--paper)" } : undefined}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Une ville ?"
            className="mt-3 w-full rounded-full border border-dusk/15 bg-paper px-4 py-3 text-[13.5px] text-dusk placeholder:text-dusk/40 focus:border-dusk/35 focus:outline-none"
          />
        </div>

      <section className="mt-8 px-5 space-y-3 pb-4">
        {list.length === 0 && (
          <p className="card-plain px-5 py-6 text-center body-meta italic">
            Personne ne correspond à votre recherche pour l'instant.
          </p>
        )}
        {list.map((p) => (
          <article key={p.id} className="card-plain overflow-hidden">
            <div className="flex gap-4 p-5">
              <div
                className="size-20 shrink-0 rounded-2xl"
                aria-hidden
                style={{
                  background: `linear-gradient(160deg, color-mix(in oklab, ${cat.tint} 35%, var(--paper)), color-mix(in oklab, ${cat.tint} 65%, var(--clay)))`,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-serif text-[20px] leading-tight">
                  {p.firstName} {p.lastName}
                </p>
                <p className="mt-1 body-meta italic">{p.speciality}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-dusk/60">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={11} /> {p.city}
                  </span>
                  {p.modes.includes("visio") && (
                    <span className="inline-flex items-center gap-1.5">
                      <Video size={11} /> visio
                    </span>
                  )}
                  {p.modes.includes("domicile") && (
                    <span className="inline-flex items-center gap-1.5">
                      <HomeIcon size={11} /> à domicile
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[12.5px] text-dusk/70">
                  Prochain créneau&nbsp;: <span className="font-medium text-dusk">{p.nextSlot}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-dusk/10 px-5 py-3.5">
              <span className="inline-flex items-center gap-1.5 eyebrow" title="Rencontré·e et choisi·e.">
                <Sparkles size={11} /> Recommandé par Legato
              </span>
              <Link
                to="/resources/$category/$providerId"
                params={{ category, providerId: p.id }}
                className="text-[12.5px] font-medium underline underline-offset-4"
                style={{ color: "var(--terracotta)" }}
              >
                Voir disponibilités →
              </Link>
            </div>
          </article>
        ))}
      </section>
      </div>
    </Shell>
  );
}