import { createFileRoute, Outlet } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
export const Route=createFileRoute("/care/garden/proches")({head: () => legatoHead('Mémoire', 'Garder les souvenirs de votre proche dans son jardin Legato, à votre rythme.'), component: Outlet});
