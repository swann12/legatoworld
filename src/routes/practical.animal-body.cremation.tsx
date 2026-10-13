import { createFileRoute } from "@tanstack/react-router";
import { Lead } from "@/components/legato/ds";
import { AnimalSheet, Spec, Steps } from "@/components/legato/AnimalPractical";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/animal-body/cremation")({
  head: () => legatoHead("La crémation d'un animal", "Individuelle ou collective : le vétérinaire l'organise avec un crématorium pour animaux."),
  component: Cremation,
});

/** B034 · La crémation */
function Cremation() {
  return (
    <AnimalSheet back="/practical/animal-body" backLabel="Crémation ou enterrement" title={<>La <em>crémation.</em></>}>
      <Lead className="mt-[10px] max-w-[310px]">Le vétérinaire l'organise avec un crématorium pour animaux. Comptez une à deux semaines.</Lead>
      <Spec className="mt-7" items={[
        { label: "Individuelle", value: "Ses cendres vous sont rendues dans une urne" },
        { label: "Collective", value: "Avec d'autres animaux, sans retour des cendres" },
        { label: "Prix", value: "Selon son poids : demandez un devis" },
      ]} />
      <Steps id="animal-cremation" taskId="animal-body" steps={["Dire au vétérinaire la formule choisie", "Choisir une urne, si vous le souhaitez", "Récupérer ses cendres"]} />
    </AnimalSheet>
  );
}
