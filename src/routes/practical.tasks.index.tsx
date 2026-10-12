import { createFileRoute } from "@tanstack/react-router";
import { Practical } from "./practical.index";

/** /practical/tasks montre le même écran que /practical (055). */
export const Route = createFileRoute("/practical/tasks/")({
  head: () => ({
    meta: [
      { title: "Mes démarches — Legato" },
      { name: "description", content: "Ce qu'il reste à faire, semaine par semaine." },
      { property: "og:title", content: "Mes démarches — Legato" },
      { property: "og:description", content: "Ce qu'il reste à faire, à votre rythme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Practical,
});
