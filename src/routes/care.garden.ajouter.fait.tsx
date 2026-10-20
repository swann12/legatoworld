import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { SavedMemory } from "@/components/legato/garden/MemoryPages";
export const Route=createFileRoute("/care/garden/ajouter/fait")({head: () => legatoHead('Votre souvenir est gardé', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), validateSearch:(s:Record<string,unknown>)=>({id:typeof s.id==="string"?s.id:undefined}), component: Page});
function Page(){const {id}=Route.useSearch();return <SavedMemory id={id}/>;}
