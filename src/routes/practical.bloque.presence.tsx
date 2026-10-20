import { createFileRoute } from "@tanstack/react-router";
import { BloquePresence } from "@/components/legato/BloquePages";
import { legatoHead } from "@/lib/legato-head";

/** D078 · décrire sa situation à Présence */
export const Route = createFileRoute("/practical/bloque/presence")({
  head: () => legatoHead("Décrire sa situation à Présence", "Présence, une intelligence artificielle, vous oriente vers la bonne page."),
  component: BloquePresence,
});
