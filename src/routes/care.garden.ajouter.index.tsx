import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { AddChoices } from "@/components/legato/garden/MemoryPages";
export const Route=createFileRoute("/care/garden/ajouter/")({head: () => legatoHead('Ajouter un souvenir', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: AddChoices});
