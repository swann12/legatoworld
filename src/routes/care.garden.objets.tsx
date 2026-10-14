import { createFileRoute } from "@tanstack/react-router";
import { SelfObjets } from "@/components/legato/SelfSpace";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/garden/objets")({ head: () => legatoHead('Vos objets, et à qui les confier', 'Une simple liste de vos objets pour vos proches.'), component: SelfObjets });
