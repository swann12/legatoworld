import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { PortraitPage } from "@/components/legato/garden/MemoryPages";
export const Route=createFileRoute("/care/garden/portrait")({head: () => legatoHead('Son portrait', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: PortraitPage});
