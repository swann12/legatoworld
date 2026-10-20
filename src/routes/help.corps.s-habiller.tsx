import { createFileRoute } from "@tanstack/react-router";
import { CorpsTopicPage } from "@/components/legato/CorpsTopicPage";
import { legatoHead } from "@/lib/legato-head";

/** D018 · Le corps · 04 · S'habiller */
export const Route = createFileRoute("/help/corps/s-habiller")({
  head: () => legatoHead("S'habiller, sans y penser", "Choisir des vêtements demande de l'énergie. On peut s'en épargner."),
  component: () => (
    <CorpsTopicPage
      label="04 · S'habiller"
      title={<>S'habiller,<br /><em>sans y penser.</em></>}
      lead="Choisir des vêtements demande de l'énergie. On peut s'en épargner."
      tips={[
        "Préparez vos vêtements la veille au soir.",
        "Choisissez le confortable plutôt que le beau.",
        "Sortez cinq minutes, même avec un manteau sur le pyjama.",
      ]}
      primary={{ label: "Préparer ma tenue pour demain", to: "/help/corps/exercice" }}
      secondary={{ label: "Bouger un peu, ensuite", to: "/help/corps/bouger" }}
    />
  ),
});
