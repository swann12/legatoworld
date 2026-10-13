import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Row, TextLink } from "@/components/legato/ds";

export const Route = createFileRoute("/help/corps/comprendre")({
  head: () => ({
    meta: [
      { title: "Ce que le deuil fait au corps — Legato" },
      { name: "description", content: "Fatigue, gorge serrée, appétit coupé, douleurs : c'est fréquent, et cela s'apaise avec le temps." },
      { property: "og:title", content: "Ce que le deuil fait au corps — Legato" },
      { property: "og:description", content: "C'est fréquent, et cela s'apaise avec le temps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Comprendre,
});

const SIGNS = [
  ["Une fatigue lourde", "même après une nuit complète"],
  ["La gorge serrée, la poitrine oppressée", "souvent par vagues"],
  ["L'appétit coupé, ou l'envie de grignoter", "les deux sont fréquents"],
  ["Des douleurs : tête, ventre, dos", "le corps porte la tension"],
];

/** B018 · Ce que le deuil fait au corps */
function Comprendre() {
  return (
    <StandardLayout space="support" back="/help/corps" backLabel="Le corps" activeTab="/care">
      <PageTitle className="pt-[30px]">Ce que le deuil<br /><em>fait au corps.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">C'est fréquent, et cela s'apaise avec le temps.</Lead>
      <div className="mt-6">
        {SIGNS.map(([t, s], i) => <Row key={t} title={t} subtitle={s} icon="arrow" status={<span />} last={i === SIGNS.length - 1} />)}
      </div>
      <div className="pt-6"><TextLink to="/help/corps/consulter">Quand faut-il consulter ?</TextLink></div>
    </StandardLayout>
  );
}
