import { createFileRoute, notFound } from "@tanstack/react-router";
import { CorpsContenus, CORPS, isSujet } from "@/components/legato/CorpsPage";

export const Route = createFileRoute("/help/corps/$sujet/contenus")({
  loader: ({ params }) => {
    if (!isSujet(params.sujet)) throw notFound();
    return { label: CORPS[params.sujet].label };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.label} · écouter, lire, en parler — Legato` : "Contenus — Legato";
    const d = "Des contenus choisis : écouter, lire, en parler. Prenez seulement ce qui vous fait du bien.";
    return {
      meta: [
        { title }, { name: "description", content: d },
        { property: "og:title", content: title }, { property: "og:description", content: d },
        { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: Page,
});

function Page() {
  const { sujet } = Route.useParams();
  return isSujet(sujet) ? <CorpsContenus sujet={sujet} /> : null;
}
