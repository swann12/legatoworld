import { createFileRoute } from "@tanstack/react-router";
import { SelfDon } from "@/components/legato/SelfSpace";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/don-organes")({ head: () => legatoHead("Le don d'organes", "Dire votre choix sur le don d'organes, à vos proches ou au registre."), component: SelfDon });
