import { createFileRoute, redirect } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/wishes")({
  beforeLoad: () => { throw redirect({ to: "/practical/wishes" }); },
  head: () => legatoHead("Volontés personnelles", "Retrouver les souhaits, les messages et les personnes à prévenir."),
});
