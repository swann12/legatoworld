import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Row } from "@/components/legato/ds";

export const Route = createFileRoute("/help/corps/soin/")({
  head: () => ({
    meta: [
      { title: "Un moment de soin — Legato" },
      { name: "description", content: "Dix minutes de soin guidées pas à pas : les mains, le visage, les épaules." },
      { property: "og:title", content: "Un moment de soin — Legato" },
      { property: "og:description", content: "Dix minutes pour vous, guidées pas à pas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Soin,
});

const ITEMS = [
  { title: "Les mains", subtitle: "Une crème, lentement · 3 min", to: "/help/corps/soin/mains" },
  { title: "Le visage", subtitle: "De l'eau tiède, une serviette chaude · 3 min", to: "/help/corps/soin/visage" },
  { title: "Les épaules", subtitle: "Relâcher la tension · 4 min", to: "/help/corps/soin/epaules" },
];

function Soin() {
  return (
    <StandardLayout space="support" back="/help/corps" backLabel="Le corps" activeTab="/care">
      <PageTitle space="support" className="pt-8">Un moment<br /><em>pour vous.</em></PageTitle>
      <Lead space="support" className="mt-4">Dix minutes de soin, guidées pas à pas. Choisissez par où commencer.</Lead>
      <div className="mt-8">
        {ITEMS.map((it, i) => <Row key={it.to} space="support" n={i + 1} {...it} last={i === ITEMS.length - 1} />)}
      </div>
    </StandardLayout>
  );
}
