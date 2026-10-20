import { createFileRoute } from "@tanstack/react-router";
import { BloqueHome } from "@/components/legato/BloquePages";
import { legatoHead } from "@/lib/legato-head";

/** D077 · Je suis bloqué */
export const Route = createFileRoute("/practical/bloque/")({
  head: () => legatoHead("Je suis bloqué", "Mots de passe, argent, papiers, premières heures : par où commencer."),
  component: BloqueHome,
});
