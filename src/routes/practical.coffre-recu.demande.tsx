import { createFileRoute } from "@tanstack/react-router";
import { CoffreDemande } from "@/components/legato/CoffrePages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/coffre-recu/demande")({
  head: () => legatoHead("Recevoir les documents", "Déposer l'acte de décès pour recevoir les documents confiés."),
  component: CoffreDemande,
});

