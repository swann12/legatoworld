import { createFileRoute } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
import { BookOrder } from "@/components/legato/garden/BookPages";
export const Route=createFileRoute("/care/garden/livre/commande")({head: () => legatoHead('Commander le livre', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: BookOrder});
