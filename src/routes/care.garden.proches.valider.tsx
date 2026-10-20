import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { ReviewPage } from "@/components/legato/garden/MemoryPages";
export const Route=createFileRoute("/care/garden/proches/valider")({head: () => legatoHead('Valider les souvenirs de vos proches', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: ReviewPage});
