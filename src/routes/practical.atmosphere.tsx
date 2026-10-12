import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Row, PrimaryButton } from "@/components/legato/ds";
import { useCeremonyPlan } from "@/lib/ceremony-flow";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/atmosphere")({
  head: () => legatoHead("Les détails de la cérémonie", "Des fleurs, des textes, de la musique et un livret qui lui ressemblent."),
  component: Atmosphere,
});
function Atmosphere() {
  const { plan } = useCeremonyPlan();
  return <StandardLayout space="practical" back="/practical/ceremony" backLabel="La cérémonie" activeTab="/practical">
    <PageTitle space="practical" className="mt-[30px]">Les détails<br /><em>de la cérémonie.</em></PageTitle>
    <Lead space="practical" className="mt-3">Présence peut vous faire des propositions à partir de ce que vous lui dites d'elle.</Lead>
    <div className="mt-[14px]">
      <Row space="practical" n={1} title={<span className="flex flex-wrap items-center gap-3">Les fleurs {plan.flowersChosen && <span className="lg-mono text-lg-coral-text">Choisies</span>}</span>} subtitle="Décrire, ou répondre à trois questions" to="/practical/flowers" />
      <Row space="practical" n={2} title="Textes et musique" subtitle="Des propositions qui lui ressemblent" to="/practical/texts" />
      <Row space="practical" n={3} title="Cercueil, urne, plaque" subtitle="Les options et leur prix moyen" to="/practical/objects" />
      <Row space="practical" n={4} title="Le livret" subtitle="Sa photo et le déroulé, à imprimer" to="/practical/booklet" last />
    </div>
    <PrimaryButton space="practical" to="/practical/share" className="mt-[22px]">Envoyer mes choix</PrimaryButton>
  </StandardLayout>;
}
