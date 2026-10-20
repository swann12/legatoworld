import { createFileRoute } from "@tanstack/react-router";
import { GuideDates } from "@/components/legato/HelpLinkPages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/aide/$article/dates")({
  head: () => { const h = legatoHead("Pour les proches", "Comment aider une personne en deuil."); return { ...h, meta: [...h.meta, { name: "robots", content: "noindex" }] }; },
  component: Page,
});

function Page() {
  const { article } = Route.useParams();
  return <GuideDates lien={article} />;
}
