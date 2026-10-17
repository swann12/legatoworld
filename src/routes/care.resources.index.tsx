import { createFileRoute } from "@tanstack/react-router";
import { toLibTab } from "@/lib/library-data";
import { useActiveSpace } from "@/lib/use-active-space";
import { SelfResources } from "@/components/legato/SelfSpace";
import { LibraryList, type LibTab } from "@/components/legato/LibraryList";

export const Route = createFileRoute("/care/resources/")({
  validateSearch: (search: Record<string, unknown>) => ({ tab: toLibTab(search.tab) }),
  head: () => ({
    meta: [
      { title: "Lire, écouter, voir — Legato" },
      { name: "description", content: "Livres, podcasts, musiques, films, séries et documentaires choisis pour traverser un deuil." },
      { property: "og:title", content: "Lire, écouter, voir — Legato" },
      { property: "og:description", content: "Livres et podcasts choisis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { kind } = useActiveSpace();
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const setTab = (next: LibTab) => navigate({ search: { tab: next }, replace: true });
  if (kind === "questions") return <SelfResources />;
  return <LibraryList tab={tab} onTab={setTab} />;
}
