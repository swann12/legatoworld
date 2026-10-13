import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Row } from "@/components/legato/ds";
import { useCeremonyPlan } from "@/lib/ceremony-flow";
import { loadPractical, savePractical } from "@/lib/practical-store";
import { CEREMONY_OBJECTS, toggleCeremonyObject } from "@/lib/ceremony-objects";
import { legatoHead } from "@/lib/legato-head";
import { Step10Extras } from "@/components/legato/Step10Extras";
import { LegacyObjects } from "@/components/legato/legacy/Step10Objects";

export const Route = createFileRoute("/practical/objects")({
  head: () => legatoHead("Cercueil, urne, plaque", "Les principales options et des prix indicatifs pour préparer le devis avec les pompes funèbres."),
  component: Objects,
});
function Objects() {
  const { state } = useCeremonyPlan();
  return <StandardLayout space="practical" back="/practical/atmosphere" backLabel="Les détails" activeTab="/practical">
    <PageTitle space="practical" className="mt-[30px]">Cercueil, urne,<br /><em>plaque.</em></PageTitle>
    <Lead space="practical" className="mt-3">Les principales options et leur prix moyen, pour arriver préparé chez les pompes funèbres.</Lead>
    <div className="mt-[14px]">{CEREMONY_OBJECTS.map((item, i) => <Row key={item.id} space="practical" title={item.title} subtitle={`${i < 2 ? "Cercueil · " : ""}${item.price}`} status={state.selectedObjects.includes(item.title) ? "choisi" : undefined} onClick={() => savePractical({ selectedObjects: toggleCeremonyObject(loadPractical().selectedObjects, item.title) })} last={i === 3} />)}</div>
    <p className="lg-step10-note mt-7">Rien n'est à payer ici. Ces choix servent seulement à préparer le devis.</p>
    <Step10Extras><LegacyObjects /></Step10Extras>
  </StandardLayout>;
}
