import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, Lead, Row, Field, OutlineButton } from "@/components/legato/ds";
import { getCategory, providersByCategory, type CategoryId } from "@/lib/resources-data";
import { z } from "zod";
import { FuneralProviders } from "@/components/legato/FuneralProviders";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/resources/$category/")({
  validateSearch: (s) =>
    z.object({ space: z.enum(["care", "practical"]).optional() }).parse(s),
  head: ({ params }) => legatoHead(getCategory(params.category)?.label ?? "Annuaire", "Des professionnels pour vous accompagner, à votre rythme."),
  component: CategoryPage,
  notFoundComponent: () => (
    <StandardLayout space="support" back="/resources" backLabel="Ressources">
      <div className="px-7 pt-20">
        <p className="ed-page-title">Cette catégorie n'est pas encore ouverte.</p>
        <Link to="/resources" className="mt-4 inline-block lg-row-sub underline">
          Revenir aux catégories
        </Link>
      </div>
    </StandardLayout>
  ),
});

type Filter = "tous" | "visio" | "presentiel";

function CategoryPage() {
  const { category } = Route.useParams();
  const { space } = Route.useSearch();
  const cat = getCategory(category);
  const [filter, setFilter] = useState<Filter>("tous");
  const [city, setCity] = useState("");
  if (!cat) throw notFound();
  if (space && space !== cat.space) {
    return (
      <StandardLayout space={cat.space === "care" ? "support" : "practical"} back="/resources" backLabel="Ressources">
        <div className="pt-8">
          <p className="mono-label">Ressource déplacée</p>
          <h1 className="mt-5 ed-page-title">Cette rubrique appartient à l'autre espace.</h1>
          <Link to="/resources" search={{ space: cat.space }} className="mt-8 inline-block underline">
            Ouvrir le bon espace →
          </Link>
        </div>
      </StandardLayout>
    );
  }

  if (category === "pompes") return <FuneralProviders />;

  const all = providersByCategory(category as CategoryId);

  const list = all.filter((p) => {
    if (filter === "visio" && !p.modes.includes("visio")) return false;
    if (filter === "presentiel" && !p.modes.some((m) => m === "cabinet" || m === "domicile"))
      return false;
    const q = city.trim().toLowerCase();
    if (q && !p.city.toLowerCase().includes(q) && !(p.zip ?? "").startsWith(q)) return false;
    return true;
  });

  return (
    <StandardLayout space={cat.space === "care" ? "support" : "practical"} back="/resources" backLabel="Ressources" activeTab={cat.space === "care" ? "/care" : "/practical"}>

        <section className="pt-8 pb-6">
          <p className="mono-label">{cat.label}</p>
          <PageTitle className="mt-4">
            <span className="italic">{cat.intent}</span>
          </PageTitle>
        </section>

        {/* Filtres */}
        <div>
          <p className="eyebrow">Filtrer</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {([
              ["tous", "Toutes"],
              ["visio", "À distance"],
              ["presentiel", "En présentiel"],
            ] as const).map(([id, label]) => (
              <OutlineButton
                key={id}
                onClick={() => setFilter(id)}
              >
                {filter === id ? "✓ " : ""}{label}
              </OutlineButton>
            ))}
          </div>
          <Field label="Une ville ou un code postal"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Une ville ou un code postal"
            inputMode="text"
            className="mt-4"
          />
        </div>

      <section className="mt-8 pb-4">
        {list.length === 0 && (
          <p className="card-plain px-5 py-6 text-center body-meta italic">
            Personne ne correspond à votre recherche pour l'instant.
          </p>
        )}
        {list.map((p) => (
          <article key={p.id} className="py-5" style={{ borderBottom: "1px solid var(--sp-line)" }}>
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-serif text-[20px] leading-tight">
                  {p.firstName} {p.lastName}
                </p>
                <p className="mt-1 body-meta italic">{p.speciality}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-dusk/60">
                  <span className="inline-flex items-center gap-1.5">
                    {p.city}
                  </span>
                  {p.modes.includes("visio") && (
                    <span className="inline-flex items-center gap-1.5">
                      visio
                    </span>
                  )}
                  {p.modes.includes("domicile") && (
                    <span className="inline-flex items-center gap-1.5">
                      à domicile
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[12.5px] text-dusk/70">
                  Prochain créneau&nbsp;: <span className="font-medium text-dusk">{p.nextSlot}</span>
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/resources/$category/$providerId"
                params={{ category, providerId: p.id }}
                className="text-[12.5px] font-medium underline underline-offset-4"
                style={{ color: "var(--sp-stroke)" }}
              >
                Voir disponibilités →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </StandardLayout>
  );
}