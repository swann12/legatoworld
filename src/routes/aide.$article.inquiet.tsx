import { createFileRoute } from "@tanstack/react-router";
import { GuideInquiet } from "@/components/legato/HelpLinkPages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/aide/$article/inquiet")({
  head: () => { const h = legatoHead("Pour les proches", "Comment aider une personne en deuil."); return { ...h, meta: [...h.meta, { name: "robots", content: "noindex" }] }; },
  component: Page,
});

function Page() {
  const { article } = Route.useParams();
  return <GuideInquiet lien={article} />;
}
