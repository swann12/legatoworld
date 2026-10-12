import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Row } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/pros/")({
  head: () => legatoHead("Les professionnels", "Les professionnels et quand les appeler, dans l'ordre où vous en aurez besoin."),
  component: PracticalPros,
});
function PracticalPros() {
  return <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
    <PageTitle space="practical" size={32} className="mt-[30px]">Les professionnels<br /><em>et quand les appeler.</em></PageTitle>
    <Lead space="practical" className="mt-3">Dans l'ordre où vous en aurez besoin.</Lead>
    <div className="mt-[14px]">
      <Row space="practical" n={1} title="Pompes funèbres" subtitle="Dans les 24 à 48 heures" to="/resources/pompes" />
      <Row space="practical" n={2} title="Officiant" subtitle="Avant la cérémonie" to="/practical/pros/officiant" />
      <Row space="practical" n={3} title="Fleuriste" subtitle="Trois ou quatre jours avant" to="/practical/flowers" />
      <Row space="practical" n={4} title="Marbrier" subtitle="Après les obsèques, sans urgence" to="/practical/pros/marbrier" />
      <Row space="practical" n={5} title="Notaire" subtitle="Dans le premier mois" to="/practical/pros/notaire" last />
    </div>
  </StandardLayout>;
}
