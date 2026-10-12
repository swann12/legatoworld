import { createFileRoute } from "@tanstack/react-router";
import { CorpsTopic, CORPS } from "@/components/legato/CorpsPage";

const t = CORPS["nuits"];
export const Route = createFileRoute("/help/corps/nuits")({
  head: () => ({
    meta: [
      { title: "Dormir — Legato" },
      { name: "description", content: t.lead },
      { property: "og:title", content: "Dormir — Legato" },
      { property: "og:description", content: t.lead },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <CorpsTopic sujet="nuits" />,
});
