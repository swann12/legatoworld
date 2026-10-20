import { createFileRoute, notFound } from "@tanstack/react-router";
import { FamilyPage, SituationPage, QuotidienPage, PreparerPage } from "@/components/legato/BloquePages";
import { familyBySlug, findSituation } from "@/lib/je-suis-bloque";
import { legatoHead } from "@/lib/legato-head";

/** D079–D108 · familles et situations de « Je suis bloqué », un seul composant par type. */
export const Route = createFileRoute("/practical/bloque/$id")({
  loader: ({ params }) => {
    const { id } = params;
    if (familyBySlug(id) || findSituation(id) || id === "quotidien" || id === "preparer") return { id };
    throw notFound();
  },
  head: ({ params }) => {
    const s = findSituation(params.id);
    const f = familyBySlug(params.id);
    const t = s?.titre ?? f?.label ?? (params.id === "preparer" ? "Ne pas laisser vos proches bloqués" : params.id === "quotidien" ? "La maison, les enfants, l'animal" : "Je suis bloqué");
    return legatoHead(t, "Ce qu'il faut faire dans l'ordre, les papiers nécessaires et la source officielle.");
  },
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const f = familyBySlug(id);
  if (f) return <FamilyPage family={f} />;
  if (id === "quotidien") return <QuotidienPage />;
  if (id === "preparer") return <PreparerPage />;
  const s = findSituation(id);
  return s ? <SituationPage s={s} /> : null;
}
