import { createFileRoute } from "@tanstack/react-router";
import { CoffreAjouter } from "@/components/legato/CoffrePages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/coffre/ajouter")({
  head: () => legatoHead("Ajouter un document", "Ranger un document dans votre coffre pour vos proches."),
  component: CoffreAjouter,
});

