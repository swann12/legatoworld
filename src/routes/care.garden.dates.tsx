import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { DatesPage } from "@/components/legato/garden/MemoryPages";
export const Route=createFileRoute("/care/garden/dates")({head: () => legatoHead('Ses dates', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: DatesPage});
