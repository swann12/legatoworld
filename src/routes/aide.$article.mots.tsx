import { createFileRoute } from "@tanstack/react-router";
import { GuideMots } from "@/components/legato/HelpLinkPages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/aide/$article/mots")({
  head: () => { const h = legatoHead("Pour les proches", "Comment aider une personne en deuil."); return { ...h, meta: [...h.meta, { name: "robots", content: "noindex" }] }; },
  component: Page,
});

function Page() {
  const { article } = Route.useParams();
  return <GuideMots lien={article} />;
}
