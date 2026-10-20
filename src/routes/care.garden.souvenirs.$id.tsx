import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { MemoryDetail } from "@/components/legato/garden/MemoryPages";
export const Route=createFileRoute("/care/garden/souvenirs/$id")({head: () => legatoHead('Un souvenir gardé', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: Page});
function Page(){const {id}=Route.useParams();return <MemoryDetail id={id}/>;}
