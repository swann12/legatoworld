import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, SectionLabel, Row, PrimaryButton, OutlineButton } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";
import { isHeavy, livable, useSoutien } from "@/lib/soutien";
import { useActiveSpace } from "@/lib/use-active-space";
import { getDeathDate } from "@/lib/onboarding-flow";
import { monthlyOffset } from "@/lib/au-bon-moment";

type Search = { vue?: "mois" };

/** D057 / D058 · la réponse du point du mois. Jamais de diagnostic. */
export const Route = createFileRoute("/care/point/resultat")({
  validateSearch: (s: Record<string, unknown>): Search => ({ vue: s.vue === "mois" ? "mois" : undefined }),
  head: () => legatoHead("Votre point du mois", "Ce que disent vos réponses, et ce que Legato vous propose."),
  component: Resultat,
});

const NUM = ["", "Un mois", "Deux mois", "Trois mois", "Quatre mois", "Cinq mois", "Six mois"];

function Resultat() {
  const { vue } = Route.useSearch();
  const { s } = useSoutien();
  const { space } = useActiveSpace();
  const last = s.points[s.points.length - 1];
  if (vue === "mois" || !last || !isHeavy(last.answers)) return <Avance />;

  const death = space?.deathDate ?? getDeathDate();
  const months = death ? monthlyOffset(new Date(death), new Date()).months : 0;
  const since = months >= 1 && months < NUM.length ? `${NUM[months]} après, beaucoup` : "Beaucoup";

  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" size={36} className="pt-[22px]">C'est encore<br /><em>très lourd.</em></PageTitle>
      <Lead className="mt-2 max-w-[310px]">{since} de journées restent difficiles. Ce n'est pas un échec : certains deuils ont besoin d'être accompagnés.</Lead>
      <SectionLabel space="support" className="mt-6">Ce que nous vous proposons</SectionLabel>
      <section className="mt-2 flex items-center justify-between gap-3 px-[18px] py-[14px]" style={{ background: "var(--sp-block)", color: "var(--sp-block-ink)" }}>
        <span className="flex flex-col gap-1">
          <span style={{ fontFamily: "var(--lg-serif)", fontSize: 20, lineHeight: 1.15 }}>En parler à un professionnel</span>
          <span className="text-[12px]" style={{ color: "var(--sp-sub)" }}>Votre médecin, ou un psychologue remboursé</span>
        </span>
        <PrimaryButton space="support" to="/care/parler" className="!h-10 whitespace-nowrap px-6">Voir comment</PrimaryButton>
      </section>
      <Row space="support" title="Dire à vos proches ce qui vous aiderait" subtitle="pour ne pas porter tout seul" to="/care/aide" />
      <Row space="support" title="Revoir vos mois précédents" subtitle="votre humeur, mois par mois" to="/care/point/resultat?vue=mois" last />
    </StandardLayout>
  );
}

const MOIS = ["JANV.", "FÉVR.", "MARS", "AVR.", "MAI", "JUIN", "JUIL.", "AOÛT", "SEPT.", "OCT.", "NOV.", "DÉC."];

function Avance() {
  const { s } = useSoutien();
  const pts = s.points.slice(-4);
  const better = pts.length >= 2 && livable(pts[pts.length - 1]) > livable(pts[pts.length - 2]);
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" size={36} className="pt-[22px]">Ça bouge,<br /><em>doucement.</em></PageTitle>
      <Lead className="mt-2 max-w-[310px]">
        {better ? "Ce mois-ci, plus de journées vivables que le mois dernier." : "Voici vos journées, mois par mois."} Les mauvais jours restent normaux.
      </Lead>
      <div className="mt-8 flex h-[150px] items-end gap-5" style={{ borderBottom: "1px solid var(--sp-line-2)" }}>
        {pts.length === 0 && <p className="text-[13px]" style={{ color: "var(--sp-sub)" }}>Votre premier point du mois apparaîtra ici.</p>}
        {pts.map((p, i) => (
          <div key={p.month} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full" style={{ height: `${20 + livable(p) * 38}px`, background: i === pts.length - 1 ? "var(--lg-deep)" : "var(--sp-block)" }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-5">
        {pts.map((p) => <span key={p.month} className="lg-mono flex-1 text-center" style={{ color: "var(--sp-sub)" }}>{MOIS[Number(p.month.slice(5)) - 1]}</span>)}
      </div>
      <p className="lg-mono mt-4" style={{ color: "var(--sp-sub)" }}>Journées vivables, par mois</p>
      <div className="pt-6"><OutlineButton space="support" to="/care">Continuer comme ça</OutlineButton></div>
    </StandardLayout>
  );
}
