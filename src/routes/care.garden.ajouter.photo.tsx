import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { AddForm } from "@/components/legato/garden/MemoryPages";
export const Route=createFileRoute("/care/garden/ajouter/photo")({head: () => legatoHead('Garder photo', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: Page});
function Page(){return <AddForm kind="photo"/>;}
