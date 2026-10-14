import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, SectionLabel, Tip, PrimaryButton } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/angoisse")({
  head: () => legatoHead("Quand l'angoisse monte", "Trois gestes simples quand l'angoisse de la mort arrive."),
  component: Angoisse,
});

/** B076 · Quand l'angoisse monte */
function Angoisse() {
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle size={36} className="pt-[26px]">Quand l'angoisse<br /><em>monte.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Elle arrive souvent le soir. Elle passe toujours.</Lead>
      <SectionLabel className="mt-[30px]">Ce qui aide</SectionLabel>
      <Tip n={1}>Nommez-la : « c'est de l'angoisse, elle va redescendre ».</Tip>
      <Tip n={2}>Inspirez quatre secondes, expirez six.</Tip>
      <Tip n={3} last>Si elle revient souvent, parlez-en à un médecin : elle se soigne.</Tip>
      <div className="pt-[26px]"><PrimaryButton to="/care/respirer">Respirer trois minutes</PrimaryButton></div>
    </StandardLayout>
  );
}
