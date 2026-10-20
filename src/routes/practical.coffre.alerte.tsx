import { createFileRoute } from "@tanstack/react-router";
import { CoffreAlerte } from "@/components/legato/CoffrePages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/coffre/alerte")({
  head: () => legatoHead("Une demande sur votre coffre", "Pendant les sept jours de sécurité, vous pouvez tout arrêter."),
  component: CoffreAlerte,
});

