import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, PrimaryButton } from "@/components/legato/ds";
import { RitualsLayout } from "@/components/legato/RitualsUI";
import { useMemoryPerson } from "@/components/legato/MemoryUI";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/regards")({
  head: () => legatoHead("D'autres regards sur la mort", "Ghana, Nouvelle-Orléans, Suède : d'autres façons de vivre la mort."),
  component: Regards,
});

const ITEMS = [
  ["Au Ghana, on enterre dans un cercueil en forme de ce qu'on aimait.", "Un poisson pour un pêcheur, un avion pour un voyageur : on célèbre une vie."],
  ["À la Nouvelle-Orléans, le cortège part en silence et revient en dansant.", "Le jazz accompagne le chagrin, puis la joie d'avoir connu la personne."],
  ["En Suède, on range sa maison avant de partir.", "Le « döstädning » : trier ses affaires pour alléger ceux qui restent."],
];

/** B113 · D'autres regards */
function Regards() {
  const { name } = useMemoryPerson();
  return (
    <RitualsLayout back="/care/rituels/monde" backLabel="Rituels du monde">
      <PageTitle className="pt-8">D'autres regards<br /><em>sur la mort.</em></PageTitle>
      <div className="mt-6">
        {ITEMS.map(([a, b], i) => (
          <div key={a} className="py-5" style={{ borderBottom: i < ITEMS.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
            <p className="lg-title" style={{ fontSize: 21 }}>{a}</p><p className="mt-2 text-[14px]" style={{ color: "var(--sp-sub)" }}>{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 p-5" style={{ background: "var(--sp-block)" }}>
        <p className="text-[15px]">Présence peut vous raconter d'autres traditions, d'un pays qui vous parle ou d'où venait {name}.</p>
        <div className="mt-4"><PrimaryButton to="/presence">Demander à Présence</PrimaryButton></div>
      </div>
    </RitualsLayout>
  );
}
