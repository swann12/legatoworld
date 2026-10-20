import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { BookHome } from "@/components/legato/garden/BookPages";
export const Route=createFileRoute("/care/garden/livre/")({head: () => legatoHead('Un livre de souvenirs', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: BookHome});
