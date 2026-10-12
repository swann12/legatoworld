import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LibraryList, type LibTab } from "@/components/legato/LibraryList";

export const Route = createFileRoute("/care/resources")({
  head: () => ({
    meta: [
      { title: "Lire, écouter — Legato" },
      { name: "description", content: "Livres, articles et podcasts choisis pour traverser un deuil." },
      { property: "og:title", content: "Lire, écouter — Legato" },
      { property: "og:description", content: "Livres et podcasts choisis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const [tab, setTab] = useState<LibTab>("lire");
  return <LibraryList tab={tab} onTab={setTab} />;
}
