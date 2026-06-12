import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { ChevronLeft, MapPin, Video, Home as HomeIcon, Sparkles } from "lucide-react";
import { getCategory, providersByCategory, type CategoryId } from "@/lib/resources-data";
import { z } from "zod";

export const Route = createFileRoute("/resources/$category")({
  validateSearch: (s) =>
    z.object({ space: z.enum(["care", "practical"]).optional() }).parse(s),
  component: CategoryPage,
  notFoundComponent: () => (
    <Shell>
      <div className="px-7 pt-20">
        <p className="font-serif text-[1.6rem] italic text-dusk">
          Cette catégorie n'est pas encore ouverte.
        </p>
        <Link to="/resources" className="mt-4 inline-block text-sm text-dusk/60 underline">
          Revenir aux catégories
        </Link>
      </div>
    </Shell>
  ),
});

type Filter = "tous" | "visio" | "presentiel";

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = getCategory(category);
  if (!cat) throw notFound();

  const all = providersByCategory(category as CategoryId);
  const [filter, setFilter] = useState<Filter>("tous");
  const [city, setCity] = useState("");

  const list = all.filter((p) => {
    if (filter === "visio" && !p.modes.includes("visio")) return false;
    if (filter === "presentiel" && !p.modes.some((m) => m === "cabinet" || m === "domicile"))
      return false;
    if (city.trim() && !p.city.toLowerCase().includes(city.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <Shell>
      <div className="px-7 pt-10">
        <Link
          to="/resources"
          className="inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.18em] text-dusk/55"
        >
          <ChevronLeft size={14} /> Retour
        </Link>
        <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-dusk/45">{cat.label}</p>
        <h1 className="mt-2 font-serif text-[1.9rem] italic leading-tight text-dusk">
          {cat.intent}
        </h1>
      </div>

      {/* Filtres doux */}
      <div className="mt-8 px-7">
        <p className="text-[11px] uppercase tracking-[0.2em] text-dusk/50">
          Trouver ce qui vous correspond
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {([
            ["tous", "Toutes les approches"],
            ["visio", "À distance"],
            ["presentiel", "En présentiel"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] tracking-wide transition-all ${
                filter === id
                  ? "bg-dusk text-paper"
                  : "paper-card text-dusk/65 hover:text-dusk"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Une ville en tête ?"
          className="mt-3 w-full rounded-full border border-dusk/10 bg-paper/70 px-4 py-2.5 text-[13px] text-dusk placeholder:text-dusk/35 focus:border-dusk/25 focus:outline-none"
        />
      </div>

      <section className="mt-8 px-7 space-y-5 pb-4">
        {list.length === 0 && (
          <p className="paper-card px-5 py-6 text-center text-[13px] italic text-dusk/55">
            Personne ne correspond à votre recherche pour l'instant.
          </p>
        )}
        {list.map((p) => (
          <article key={p.id} className="paper-card overflow-hidden">
            <div className="flex gap-4 p-4">
              <div
                className="ceramic-soft size-20 shrink-0 rounded-2xl"
                aria-hidden
                style={{
                  background: `linear-gradient(160deg, color-mix(in oklab, ${cat.tint} 35%, var(--paper)), color-mix(in oklab, ${cat.tint} 65%, var(--clay)))`,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-serif text-[1.2rem] leading-tight text-dusk">
                  {p.firstName} {p.lastName}
                </p>
                <p className="mt-1 text-[12px] italic text-dusk/65">{p.speciality}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-dusk/55">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} /> {p.city}
                  </span>
                  {p.modes.includes("visio") && (
                    <span className="inline-flex items-center gap-1">
                      <Video size={11} /> visio
                    </span>
                  )}
                  {p.modes.includes("domicile") && (
                    <span className="inline-flex items-center gap-1">
                      <HomeIcon size={11} /> à domicile
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[12px] text-dusk/70">
                  Prochain créneau&nbsp;: <span className="text-dusk">{p.nextSlot}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-dusk/8 px-4 py-3">
              <span
                className="group inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-dusk/55"
                title="Rencontré·e et choisi·e pour son approche."
              >
                <Sparkles size={11} className="text-dusk/45" />
                Recommandé par Legato
              </span>
              <Link
                to="/resources/$category/$providerId"
                params={{ category, providerId: p.id }}
                className="text-[12px] italic text-dusk underline-offset-4 hover:underline"
              >
                Voir les disponibilités →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </Shell>
  );
}