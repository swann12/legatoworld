import { createFileRoute } from "@tanstack/react-router";
import { SelfLettres } from "@/components/legato/SelfSpace";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/garden/lettres")({ head: () => legatoHead('Des lettres pour plus tard', "Des lettres fermées jusqu'à la date choisie."), component: SelfLettres });
