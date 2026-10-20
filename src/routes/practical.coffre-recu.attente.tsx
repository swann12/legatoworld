import { createFileRoute } from "@tanstack/react-router";
import { CoffreAttente } from "@/components/legato/CoffrePages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/coffre-recu/attente")({
  head: () => legatoHead("Votre demande est en cours", "Vérification, délai de sécurité, puis les documents."),
  component: CoffreAttente,
});

