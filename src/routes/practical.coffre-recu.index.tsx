import { createFileRoute } from "@tanstack/react-router";
import { CoffreRecus } from "@/components/legato/CoffrePages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/coffre-recu/")({
  head: () => legatoHead("Les documents reçus", "Les documents qu'un proche vous a confiés, privés."),
  component: CoffreRecus,
});

