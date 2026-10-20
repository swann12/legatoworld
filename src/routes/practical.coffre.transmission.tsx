import { createFileRoute } from "@tanstack/react-router";
import { CoffreTransmission } from "@/components/legato/CoffrePages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/coffre/transmission")({
  head: () => legatoHead("Comment ils seront transmis", "Acte de décès vérifié, sept jours de sécurité, chacun ses documents."),
  component: CoffreTransmission,
});

