import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, Lead } from "@/components/legato/ds";
import { RitualsLayout, TimedRow } from "@/components/legato/RitualsUI";
import { GESTURES_ALONE } from "@/lib/rituals-catalog";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/maintenant")({
  head: () => legatoHead("Un geste, maintenant", "Des rituels à faire seul, en quelques minutes, venus de traditions du monde entier."),
  component: Maintenant,
});

/** B092 · Un geste, maintenant */
function Maintenant() {
  return (
    <RitualsLayout>
      <PageTitle className="pt-8">Un geste,<br /><em>maintenant.</em></PageTitle>
      <Lead className="mt-3">Seul, en quelques minutes. Touchez un rituel pour savoir d'où il vient et comment le faire.</Lead>
      <div className="mt-6">
        {GESTURES_ALONE.map((g, i) => g.id === "bougie"
          ? <TimedRow key={g.id} title={g.title} sub={g.origin} right={g.duration} to="/care/rituels/fait" search={{ geste: "bougie" }} />
          : g.to ? <TimedRow key={g.id} title={g.title} sub={g.origin} right={g.duration} to={g.to} last={i === GESTURES_ALONE.length - 1} />
          : <TimedRow key={g.id} title={g.title} sub={g.origin} right={g.duration} to="/care/rituels/$id" params={{ id: g.id }} last={i === GESTURES_ALONE.length - 1} />)}
      </div>
    </RitualsLayout>
  );
}
