import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";
import { RitualsLayout, TimedRow } from "@/components/legato/RitualsUI";
import { RITUALS_TOGETHER } from "@/lib/rituals-catalog";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/ensemble")({
  head: () => legatoHead("Un rituel à plusieurs", "Repas et récits, veillée, cercle de parole : Legato prépare l'invitation pour vos proches."),
  component: Ensemble,
});

/** B093 · Un rituel à plusieurs */
function Ensemble() {
  return (
    <RitualsLayout>
      <PageTitle className="pt-8">Un rituel<br /><em>à plusieurs.</em></PageTitle>
      <Lead className="mt-3">Choisissez un rituel, puis Legato prépare l'invitation pour vos proches.</Lead>
      <div className="mt-6">
        {RITUALS_TOGETHER.map((g, i) => g.to
          ? <TimedRow key={g.id} title={g.title} sub={g.origin} right={g.duration} to={g.to} search={g.id === "repas" ? { rituel: "repas" } : undefined} last={i === RITUALS_TOGETHER.length - 1} />
          : <TimedRow key={g.id} title={g.title} sub={g.origin} right={g.duration} to="/care/rituels/$id" params={{ id: g.id }} last={i === RITUALS_TOGETHER.length - 1} />)}
      </div>
      <div className="mt-8"><PrimaryButton to="/care/rituels/organiser">Organiser un rituel</PrimaryButton></div>
    </RitualsLayout>
  );
}
