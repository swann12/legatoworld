import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { BookPreview } from "@/components/legato/garden/BookPages";
export const Route=createFileRoute("/care/garden/livre/apercu")({head: () => legatoHead('L’aperçu du livre', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: BookPreview});
