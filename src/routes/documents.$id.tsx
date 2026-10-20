import { createFileRoute } from "@tanstack/react-router";
import { DocumentView } from "@/components/legato/shared-pages";
import { legatoHead } from "@/lib/legato-head";

/** D008 · x-document : lire un document du coffre. */
export const Route = createFileRoute("/documents/$id")({
  head: () => legatoHead("Un document", "Lire, télécharger ou partager un document rangé dans le coffre."),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <DocumentView id={id} />;
}
