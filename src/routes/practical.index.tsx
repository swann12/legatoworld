import { createFileRoute } from "@tanstack/react-router";
import { Practical } from "@/components/legato/PracticalHome";

export const Route = createFileRoute("/practical/")({
  head: () => ({
    meta: [
      { title: "Démarches — Legato" },
      { name: "description", content: "Ce qu'il reste à faire, semaine par semaine, avec la durée et le délai de chaque démarche." },
      { property: "og:title", content: "Démarches — Legato" },
      { property: "og:description", content: "Ce qu'il reste à faire, à votre rythme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Practical,
});
