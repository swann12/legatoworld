import { createFileRoute } from "@tanstack/react-router";
import { CorpsTopic, CORPS } from "@/components/legato/CorpsPage";

const t = CORPS["habiller"];
export const Route = createFileRoute("/help/corps/habiller")({
  head: () => ({
    meta: [
      { title: "S'habiller — Legato" },
      { name: "description", content: t.lead },
      { property: "og:title", content: "S'habiller — Legato" },
      { property: "og:description", content: t.lead },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <CorpsTopic sujet="habiller" />,
});
