import { createFileRoute } from "@tanstack/react-router";
import { SelfConfiance } from "@/components/legato/SelfSpace";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/confiance")({ head: () => legatoHead('Ma personne de confiance', "Celle que l'équipe médicale consultera si vous ne pouvez plus vous exprimer."), component: SelfConfiance });
