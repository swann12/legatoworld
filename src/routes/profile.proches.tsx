import { createFileRoute } from "@tanstack/react-router";
import { CirclePage } from "@/components/legato/CirclePage";

export const Route = createFileRoute("/profile/proches")({
  head: () => ({
    meta: [
      { title: "Votre cercle — Legato" },
      { name: "description", content: "Les proches qui partagent cet espace avec vous. Chacun ne voit que ce que vous lui ouvrez." },
      { property: "og:title", content: "Votre cercle — Legato" },
      { property: "og:description", content: "Inviter un proche et choisir ce que vous lui ouvrez." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CirclePage,
});
