import { createFileRoute } from "@tanstack/react-router";
import { CoffreDestinataires } from "@/components/legato/CoffrePages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/coffre/destinataires")({
  head: () => legatoHead("Qui reçoit quoi", "Chaque personne ne recevra que ce que vous lui avez destiné."),
  component: CoffreDestinataires,
});

