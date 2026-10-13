import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, Lead } from "@/components/legato/ds";
import { RitualsLayout, TimedRow } from "@/components/legato/RitualsUI";
import { WORLD_REGIONS, WORLD_TRADITIONS } from "@/lib/rituals-catalog";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/monde/")({
  head: () => legatoHead("Les rituels du monde", "Ailleurs, la mort se vit autrement : 21 traditions d'Asie, des Amériques, d'Afrique, d'Europe et d'Océanie."),
  component: Monde,
});

/** B103 · Les régions */
function Monde() {
  return (
    <RitualsLayout>
      <PageTitle className="pt-8">Ailleurs, la mort<br /><em>se vit autrement.</em></PageTitle>
      <Lead className="mt-3">On danse, on festoie, on parle aux morts, on garde leur place à table. Découvrir ces regards peut aider à vivre le sien.</Lead>
      <div className="mt-6">
        {WORLD_REGIONS.map((r, i) => <TimedRow key={r.id} title={r.label} sub={r.countries} right={String(WORLD_TRADITIONS.filter((t) => t.region === r.id).length)} to="/care/rituels/monde/$region" params={{ region: r.id }} last={i === WORLD_REGIONS.length - 1} />)}
      </div>
      <Link to="/care/rituels/regards" className="mt-8 inline-block text-[13.5px] underline underline-offset-4" style={{ color: "var(--sp-stroke)" }}>D'autres regards sur la mort</Link>
    </RitualsLayout>
  );
}
