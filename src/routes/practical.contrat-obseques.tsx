import { createFileRoute } from "@tanstack/react-router";
import { SelfContrat } from "@/components/legato/SelfSpace";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/contrat-obseques")({ head: () => legatoHead('Un contrat obsèques', "Une assurance pour que vos proches n'aient rien à avancer."), component: SelfContrat });
