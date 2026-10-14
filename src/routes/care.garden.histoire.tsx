import { createFileRoute } from "@tanstack/react-router";
import { SelfHistoire } from "@/components/legato/SelfSpace";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/garden/histoire")({ head: () => legatoHead('Raconter votre vie', 'Douze questions, une à la fois, pour raconter votre vie.'), component: SelfHistoire });
