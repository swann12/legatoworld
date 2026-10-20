import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { RelativesPage } from "@/components/legato/garden/MemoryPages";
export const Route=createFileRoute("/care/garden/proches/")({head: () => legatoHead('Avec vos proches', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: RelativesPage});
