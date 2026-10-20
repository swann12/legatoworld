import { createFileRoute } from "@tanstack/react-router";
import { DossierView } from "@/components/legato/shared-pages";
import { legatoHead } from "@/lib/legato-head";

/** D009 · x-dossier : les documents d'une catégorie. */
export const Route = createFileRoute("/documents/dossier/$categorie")({
  head: () => legatoHead("Un dossier de documents", "Les papiers rangés d'une catégorie, privés et partageables."),
  component: Page,
});

function Page() {
  const { categorie } = Route.useParams();
  return <DossierView categorie={categorie} />;
}
