import { createFileRoute } from "@tanstack/react-router";
import { CorpsTopicPage } from "@/components/legato/CorpsTopicPage";
import { legatoHead } from "@/lib/legato-head";

/** D016 · Le corps · 02 · Manger */
export const Route = createFileRoute("/help/corps/manger")({
  head: () => legatoHead("Manger, même un peu", "L'appétit disparaît souvent avec le chagrin : trois gestes qui aident."),
  component: () => (
    <CorpsTopicPage
      label="02 · Manger"
      title={<>Manger,<br /><em>même un peu.</em></>}
      lead="L'appétit disparaît souvent avec le chagrin."
      tips={[
        "Peu mais souvent : une soupe, un yaourt, une banane.",
        "Gardez à portée de main ce qui ne demande aucune préparation.",
        "Acceptez les plats que vos proches proposent.",
      ]}
      primary={{
        label: "Demander un repas à un proche",
        to: "/partage/message",
        search: { destinataires: "", texte: "« Ces jours-ci, cuisiner me demande trop. Un plat de temps en temps m'aiderait beaucoup. Merci. »" },
      }}
      secondary={{ label: "Si vous ne mangez presque plus : quand consulter", to: "/help/corps/consulter" }}
    />
  ),
});
