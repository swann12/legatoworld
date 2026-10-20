import { createFileRoute, Outlet } from "@tanstack/react-router";
import { legatoHead } from "@/lib/legato-head";
export const Route=createFileRoute("/care/garden/souvenirs")({head: () => legatoHead('Souvenirs du jardin', 'Retrouver les photos, les voix et les mots gardés pour votre proche.'), validateSearch: (s:Record<string,unknown>)=>({type: ["photo","voix","lettre","lieu"].includes(String(s.type)) ? String(s.type) : undefined}), component: Outlet});
