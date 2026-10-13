import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, SectionLabel, PrimaryButton } from "@/components/legato/ds";
import { RitualsLayout, DateBadge } from "@/components/legato/RitualsUI";
import { useMyRituals, splitRituals, type MyRitual } from "@/lib/my-rituals";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/mes-rituels")({
  head: () => legatoHead("Vos rituels", "Les rituels prévus et ceux déjà faits pour votre proche."),
  component: MesRituels,
});

const badge = (r: MyRitual) => {
  if (!r.date) return <DateBadge day="·" month="Projet" />;
  const d = new Date(`${r.date}T12:00:00`);
  return <DateBadge day={String(d.getDate())} month={d.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()} />;
};
const Item = ({ r, sub, last }: { r: MyRitual; sub?: string; last: boolean }) => (
  <div className="flex items-center gap-5 py-4" style={{ borderBottom: last ? "none" : "1px solid var(--sp-line)" }}>
    {badge(r)}<span className="min-w-0"><span className="lg-row-title block">{r.title}</span>{(sub ?? r.sub) && <span className="lg-row-sub mt-1 block">{sub ?? r.sub}</span>}</span>
  </div>
);

/** B101 · Vos rituels */
function MesRituels() {
  const { planned, done } = splitRituals(useMyRituals());
  return (
    <RitualsLayout>
      <PageTitle className="pt-8">Vos rituels.</PageTitle>
      <SectionLabel className="mt-7">À venir</SectionLabel>
      {planned.length ? planned.map((r, i) => <Item key={r.id} r={r} sub={r.yearly ? "Chaque année · à la même date" : undefined} last={i === planned.length - 1} />) : <p className="mt-3 text-[14px]" style={{ color: "var(--sp-sub)" }}>Rien de prévu pour l'instant.</p>}
      <SectionLabel className="mt-8">Déjà faits</SectionLabel>
      {done.length ? done.map((r, i) => <Item key={r.id} r={r} last={i === done.length - 1} />) : <p className="mt-3 text-[14px]" style={{ color: "var(--sp-sub)" }}>Aucun geste encore.</p>}
      <div className="mt-8"><PrimaryButton to="/care/rituels">Choisir un rituel</PrimaryButton></div>
    </RitualsLayout>
  );
}
