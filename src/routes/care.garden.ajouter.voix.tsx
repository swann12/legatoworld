import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { AddForm } from "@/components/legato/garden/MemoryPages";
export const Route=createFileRoute("/care/garden/ajouter/voix")({head: () => legatoHead('Garder voix', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: Page});
function Page(){return <AddForm kind="voix"/>;}
