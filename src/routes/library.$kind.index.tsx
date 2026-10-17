import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LibraryList, type LibTab } from "@/components/legato/LibraryList";

const toTab = (k: string): LibTab => (k === "ecouter" || k === "podcasts" ? "ecouter" : k === "voir" || k === "gardes" ? k : "lire");

export const Route = createFileRoute("/library/$kind/")({
  head: () => ({
    meta: [
      { title: "Bibliothèque : lire, écouter, voir — Legato" },
      { name: "description", content: "Livres, articles et podcasts choisis pour traverser un deuil." },
      { property: "og:title", content: "Bibliothèque : lire, écouter, voir — Legato" },
      { property: "og:description", content: "Livres et podcasts choisis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { kind } = Route.useParams();
  const navigate = useNavigate();
  return <LibraryList tab={toTab(kind)} onTab={(t) => navigate({ to: "/library/$kind", params: { kind: t }, replace: true })} />;
}
