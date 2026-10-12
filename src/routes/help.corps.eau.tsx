import { createFileRoute } from "@tanstack/react-router";
import { CorpsTopic, CORPS } from "@/components/legato/CorpsPage";

const t = CORPS["eau"];
export const Route = createFileRoute("/help/corps/eau")({
  head: () => ({
    meta: [
      { title: "Se laver — Legato" },
      { name: "description", content: t.lead },
      { property: "og:title", content: "Se laver — Legato" },
      { property: "og:description", content: t.lead },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <CorpsTopic sujet="eau" />,
});
