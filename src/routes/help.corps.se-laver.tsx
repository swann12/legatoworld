import { createFileRoute } from "@tanstack/react-router";
import { CorpsTopicPage } from "@/components/legato/CorpsTopicPage";
import { legatoHead } from "@/lib/legato-head";

/** D017 · Le corps · 03 · Se laver */
export const Route = createFileRoute("/help/corps/se-laver")({
  head: () => legatoHead("Se laver, un geste à la fois", "Une douche peut sembler impossible. On peut commencer plus petit."),
  component: () => (
    <CorpsTopicPage
      label="03 · Se laver"
      title={<>Se laver,<br /><em>un geste à la fois.</em></>}
      lead="Une douche peut sembler impossible. On peut commencer plus petit."
      tips={[
        "De l'eau sur le visage et les mains, c'est déjà beaucoup.",
        "Préparez une serviette et des vêtements propres avant.",
        "Deux minutes sous la douche comptent autant qu'une longue.",
      ]}
      primary={{ label: "Faire l'exercice guidé", to: "/help/corps/exercice" }}
      secondary={{ label: "Un moment de soin, plus doux", to: "/help/corps/soin" }}
    />
  ),
});
