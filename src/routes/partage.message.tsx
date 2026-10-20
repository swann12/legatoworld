import { createFileRoute } from "@tanstack/react-router";
import { MessagePret } from "@/components/legato/shared-pages";
import { legatoHead } from "@/lib/legato-head";

type MessageSearch = { destinataires?: string; texte?: string };

/** D006 · x-message : page réutilisée, le contenu vient du bouton qui l'ouvre. */
export const Route = createFileRoute("/partage/message")({
  validateSearch: (s: Record<string, unknown>): MessageSearch => ({
    destinataires: typeof s.destinataires === "string" ? s.destinataires : undefined,
    texte: typeof s.texte === "string" ? s.texte : undefined,
  }),
  head: () => legatoHead("Un message prêt à envoyer", "Relire et envoyer un message préparé, par SMS, e-mail ou en le copiant."),
  component: Page,
});

function Page() {
  const { destinataires, texte } = Route.useSearch();
  return (
    <MessagePret
      destinataires={destinataires?.split(",").filter(Boolean) ?? ["Claire", "Paul"]}
      texte={texte ?? "« Je voulais vous prévenir moi-même : Anne nous a quittés le 8 septembre. Les obsèques auront lieu le 14, à 10 h. Merci d'être là. Victor »"}
    />
  );
}
