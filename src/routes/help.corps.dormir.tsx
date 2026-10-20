import { createFileRoute } from "@tanstack/react-router";
import { CorpsTopicPage } from "@/components/legato/CorpsTopicPage";
import { legatoHead } from "@/lib/legato-head";

/** D015 · Le corps · 01 · Dormir */
export const Route = createFileRoute("/help/corps/dormir")({
  head: () => legatoHead("Dormir", "Mal dormir est très fréquent les premières semaines : trois gestes qui aident."),
  component: () => (
    <CorpsTopicPage
      label="01 · Dormir"
      title={<>Quand le sommeil<br /><em>ne vient pas.</em></>}
      lead="Mal dormir est très fréquent les premières semaines."
      tips={[
        "Gardez la même heure de lever, même après une mauvaise nuit.",
        "Pas de sommeil après vingt minutes ? Levez-vous, puis revenez.",
        "Si cela dure plus de deux semaines, parlez-en à votre médecin.",
      ]}
      primary={{ label: "Faire l'exercice du soir", to: "/help/corps/exercice" }}
      secondary={{ label: "Écouter des sons pour s'endormir", to: "/care/sons" }}
    />
  ),
});
