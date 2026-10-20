import { createFileRoute } from "@tanstack/react-router";
import { GuideAider } from "@/components/legato/HelpLinkPages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/aide/$article/aider")({
  head: () => { const h = legatoHead("Pour les proches", "Comment aider une personne en deuil."); return { ...h, meta: [...h.meta, { name: "robots", content: "noindex" }] }; },
  component: Page,
});

function Page() {
  const { article } = Route.useParams();
  return <GuideAider lien={article} />;
}
