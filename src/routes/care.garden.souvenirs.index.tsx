import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { MemoriesPage } from "@/components/legato/garden/MemoryPages";
export const Route=createFileRoute("/care/garden/souvenirs/")({head: () => legatoHead('Tous ses souvenirs', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), validateSearch: (s:Record<string,unknown>)=>({type: ["photo","voix","lettre","lieu"].includes(String(s.type)) ? String(s.type) : undefined}), component: Page});
function Page(){const {type}=Route.useSearch();return <MemoriesPage filter={type}/>;}
