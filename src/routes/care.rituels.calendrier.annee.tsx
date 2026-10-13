import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle } from "@/components/legato/ds";
import { RitualsLayout } from "@/components/legato/RitualsUI";
import { YEAR_DATES } from "@/lib/rituals-catalog";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/calendrier/annee")({
  head: () => legatoHead("Toute l'année", "Les jours des morts du monde, mois par mois."),
  component: Annee,
});

/** B112 · Toute l'année */
function Annee() {
  return (
    <RitualsLayout back="/care/rituels/calendrier" backLabel="Calendrier">
      <PageTitle className="pt-8">Toute l'année.</PageTitle>
      <div className="mt-6">
        {YEAR_DATES.map((d, i) => {
          const body = <><span className="lg-mono w-28 shrink-0" style={{ color: "var(--sp-accent)" }}>{d.when}</span><span className="min-w-0"><span className="lg-row-title block">{d.title}</span><span className="lg-row-sub mt-1 block">{d.place}</span></span></>;
          const style = { borderBottom: i < YEAR_DATES.length - 1 ? "1px solid var(--sp-line)" : "none" };
          return d.tradition && d.region
            ? <Link key={d.title} to="/care/rituels/monde/$region/$id" params={{ region: d.region, id: d.tradition }} className="flex items-center gap-4 py-4" style={style}>{body}</Link>
            : <div key={d.title} className="flex items-center gap-4 py-4" style={style}>{body}</div>;
        })}
      </div>
    </RitualsLayout>
  );
}
