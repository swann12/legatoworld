import { createFileRoute } from "@tanstack/react-router";
import { CorpsTopic, CORPS } from "@/components/legato/CorpsPage";

const t = CORPS["manger"];
export const Route = createFileRoute("/help/corps/manger")({
  head: () => ({
    meta: [
      { title: "Manger — Legato" },
      { name: "description", content: t.lead },
      { property: "og:title", content: "Manger — Legato" },
      { property: "og:description", content: t.lead },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <CorpsTopic sujet="manger" />,
});
