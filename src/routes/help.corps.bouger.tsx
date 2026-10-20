import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, SplitHeader, Lead, Tip, PrimaryButton } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

/** D021 · Le corps · bouger un peu */
export const Route = createFileRoute("/help/corps/bouger")({
  head: () => legatoHead("Bouger un peu", "Dix minutes, sans sport ni objectif : remettre le corps en mouvement, doucement."),
  component: Bouger,
});

function Bouger() {
  return (
    <StandardLayout space="support" back="/help/corps" backLabel="Le corps" activeTab="/care">
      <SplitHeader title={<>Bouger<br /><em>un peu.</em></>} value="10">
        <span className="lg-mono" style={{ color: "var(--sp-sub)" }}>minutes</span>
      </SplitHeader>
      <Lead className="mt-[22px] max-w-[310px]">Pas de sport, pas d'objectif. Remettre le corps en mouvement, doucement.</Lead>
      <p className="mt-8" style={{ fontFamily: "var(--lg-serif)", fontSize: 17, fontStyle: "italic" }}>Ce qui aide —</p>
      <Tip n={1}>Marcher dehors, même lentement.</Tip>
      <Tip n={2}>Étirer le dos et les épaules en vous levant.</Tip>
      <Tip n={3} last>Le faire avec quelqu'un, si possible.</Tip>
      <div className="pt-6">
        <PrimaryButton space="support" to="/help/corps/marche">Marcher avec une voix</PrimaryButton>
      </div>
    </StandardLayout>
  );
}
