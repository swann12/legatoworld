import { createFileRoute } from "@tanstack/react-router";
import { Lead, Tip } from "@/components/legato/ds";
import { AnimalSheet, SectionTitle } from "@/components/legato/AnimalPractical";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/animal-body/jardin")({
  head: () => legatoHead("L'enterrer dans votre jardin", "C'est possible si vous êtes propriétaire du terrain, sous quelques conditions."),
  component: Jardin,
});

/** B035 · L'enterrer dans votre jardin */
function Jardin() {
  return (
    <AnimalSheet back="/practical/animal-body" backLabel="Crémation ou enterrement" title={<>L'enterrer<br /><em>dans votre jardin.</em></>}>
      <Lead className="mt-[10px] max-w-[310px]">C'est possible si vous êtes propriétaire du terrain, sous quelques conditions.</Lead>
      <SectionTitle className="mt-8">Les conditions habituelles</SectionTitle>
      <Tip n={1}>Un animal de moins de 40 kg.</Tip>
      <Tip n={2}>À plus de 35 mètres des maisons et des points d'eau.</Tip>
      <Tip n={3} last>Assez profond : au moins un mètre de terre au-dessus.</Tip>
      <p className="mt-6 text-[13px] leading-[1.55]" style={{ color: "var(--sp-sub)" }}>Les règles peuvent varier : vérifiez auprès de votre mairie avant.</p>
    </AnimalSheet>
  );
}
