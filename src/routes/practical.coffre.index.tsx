import { createFileRoute } from "@tanstack/react-router";
import { CoffreHome } from "@/components/legato/CoffrePages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/coffre/")({
  head: () => legatoHead("Mon coffre pour mes proches", "Vos documents, transmis seulement quand il le faut, à qui vous avez choisi."),
  component: CoffreHome,
});

