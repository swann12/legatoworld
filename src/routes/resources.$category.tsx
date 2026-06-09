import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { ChevronLeft, MapPin, Video, Home as HomeIcon, Sparkles } from "lucide-react";
import { getCategory, providersByCategory, type CategoryId } from "@/lib/resources-data";

export const Route = createFileRoute("/resources/$category")({
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
type When = "tous" | "rapide" | "flexible";
type Price = "tous" | "doux" | "moyen" | "premium";

/** Heuristique simple sur nextSlot (« demain », « lundi 12 »…) */
function isQuickSlot(slot: string) {
  const s = slot.toLowerCase();
  return s.includes("demain") || s.includes("24h") || s.includes("aujourd");
}
/** Heuristique prix sur la première offre. */
function priceBucket(p: { offers: { price: string }[] }): Price {
  const raw = p.offers[0]?.price ?? "";
  const n = parseInt(raw.replace(/[^0-9]/g, ""), 10);
  if (Number.isNaN(n)) return "moyen";
  if (n < 80) return "doux";
  if (n < 300) return "moyen";
  return "premium";
}

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = getCategory(category);
  if (!cat) throw notFound();

  const all = providersByCategory(category as CategoryId);
  const [filter, setFilter] = useState<Filter>("tous");
  const [when, setWhen] = useState<When>("tous");
  const [price, setPrice] = useState<Price>("tous");
  const [city, setCity] = useState("");
  const [showAll, setShowAll] = useState(false);

  const list = all.filter((p) => {
    if (filter === "visio" && !p.modes.includes("visio")) return false;
    if (filter === "presentiel" && !p.modes.some((m) => m === "cabinet" || m === "domicile"))
      return false;
    if (city.trim() && !p.city.toLowerCase().includes(city.trim().toLowerCase())) return false;
    if (when === "rapide" && !isQuickSlot(p.nextSlot)) return false;
    if (when === "flexible" && isQuickSlot(p.nextSlot)) return false;
    if (price !== "tous" && priceBucket(p) !== price) return false;
    return true;
  });
  const visible = showAll ? list : list.slice(0, 3);
  const hidden = Math.max(0, list.length - visible.length);

  return (
    <Shell>
      <div className="px-7 pt-10">
        <Link to="/resources" className="eyebrow inline-flex items-center gap-1 hover:text-dusk">
          <ChevronLeft size={12} /> Ressources
        </Link>
        <p className="mt-8 eyebrow">{cat.label}</p>
        <h1 className="mt-3 font-serif text-[30px] leading-[1.06] font-light text-dusk text-balance">
          {cat.intent}
        </h1>
      </div>

      {/* Filtres doux */}
      <div className="mt-8 px-7">
        <p className="eyebrow">Trouver ce qui vous correspond</p>
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
        {/* Disponibilité */}
        <div className="mt-2 flex flex-wrap gap-2">
          {([
            ["tous", "Quand vous voulez"],
            ["rapide", "Disponible cette semaine"],
            ["flexible", "Plus tard, sans urgence"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setWhen(id)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] tracking-wide transition-all ${
                when === id ? "bg-dusk text-paper" : "paper-card text-dusk/65 hover:text-dusk"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Budget */}
        <div className="mt-2 flex flex-wrap gap-2">
          {([
            ["tous", "Tous budgets"],
            ["doux", "Doux · < 80 €"],
            ["moyen", "Moyen · 80–300 €"],
            ["premium", "Sur mesure · 300 €+"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setPrice(id)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] tracking-wide transition-all ${
                price === id ? "bg-dusk text-paper" : "paper-card text-dusk/65 hover:text-dusk"
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
        {visible.length > 0 && (
          <p className="eyebrow">Trois personnes, choisies pour vous</p>
        )}
        {visible.map((p) => (
          <article key={p.id} className="surface overflow-hidden">
            <div className="flex gap-4 p-4">
              <div
                className="size-16 shrink-0 rounded-2xl"
                aria-hidden
                style={{ background: `color-mix(in oklab, ${cat.tint} 30%, var(--paper))` }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-serif text-[18px] font-light leading-tight text-dusk">
                  {p.firstName} {p.lastName}
                </p>
                <p className="mt-1 text-[12.5px] text-dusk/65">{p.speciality}</p>
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

            <div className="flex items-center justify-between border-t border-dusk/10 px-4 py-3">
              <span
                className="inline-flex items-center gap-1.5 eyebrow-sm"
                title="Rencontré·e et choisi·e pour son approche."
              >
                <Sparkles size={10} className="text-dusk/45" />
                Recommandé
              </span>
              <Link
                to="/resources/$category/$providerId"
                params={{ category, providerId: p.id }}
                className="text-[12px] text-dusk underline-offset-4 hover:underline"
              >
                Voir les disponibilités →
              </Link>
            </div>
          </article>
        ))}
        {hidden > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full paper-card px-5 py-4 text-center text-[12px] uppercase tracking-[0.2em] text-dusk/65 hover:text-dusk"
          >
            Voir {hidden} autre{hidden > 1 ? "s" : ""} · à votre rythme
          </button>
        )}
        {showAll && list.length > 3 && (
          <button
            onClick={() => setShowAll(false)}
            className="w-full px-5 py-3 text-center text-[11px] uppercase tracking-[0.2em] text-dusk/45 hover:text-dusk"
          >
            Revenir aux trois suggestions
          </button>
        )}
      </section>
    </Shell>
  );
}