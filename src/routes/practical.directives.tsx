import { createFileRoute } from "@tanstack/react-router";
import { SelfDirectives } from "@/components/legato/SelfSpace";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/directives")({ head: () => legatoHead('Mes directives anticipées', 'Ce que vous souhaitez pour la fin de votre vie, au cas où vous ne pourriez plus le dire.'), component: SelfDirectives });
