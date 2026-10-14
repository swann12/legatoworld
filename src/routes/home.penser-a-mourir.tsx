import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Row } from "@/components/legato/ds";
import { ResumeOnboarding } from "@/components/legato/SelfSpace";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/home/penser-a-mourir")({
  validateSearch: (s: Record<string, unknown>): { suite?: number } => ({ suite: s.suite ? 1 : undefined }),
  head: () => legatoHead("Penser à la mort, ou penser à mourir ?", "Si vous pensez à mettre fin à vos jours, appelez le 3114, gratuit, jour et nuit."),
  component: PenserAMourir,
});

/** B073 · Sécurité (§7) : le 3114 garde son bloc bordeaux, comme toutes les pages d'urgence. */
function PenserAMourir() {
  const { suite } = Route.useSearch();
  return (
    <StandardLayout space="today" back="/home" backLabel="Aujourd'hui" activeTab="/home">
      <PageTitle size={32} className="pt-[28px]">Penser à la mort,<br /><em>ou penser à mourir ?</em></PageTitle>
      <Lead className="mt-3 max-w-[310px]">Penser souvent à la mort est très humain. Si vous pensez à mettre fin à vos jours, ne restez pas seul avec cette pensée.</Lead>
      <div className="lg-urgent-block mt-[30px] flex items-center justify-between gap-3 p-[22px]">
        <span className="flex flex-col gap-[6px]">
          <span style={{ fontFamily: "var(--lg-serif)", fontSize: 44, lineHeight: 0.9 }}>3114</span>
          <span className="text-[13px]">Gratuit, jour et nuit</span>
        </span>
        <a href="tel:3114" className="lg-urgent-call inline-flex h-[42px] items-center rounded-full px-[22px] text-[14px]">Appeler</a>
      </div>
      <div className="mt-[14px]">
        <Row title="Écrire à Présence" subtitle="Elle vous écoute et vous oriente" to="/presence" />
        <Row title="Parler à votre médecin" subtitle="L'angoisse et les idées noires se soignent" to="/care/help" last />
      </div>
      {suite && <ResumeOnboarding />}
    </StandardLayout>
  );
}
