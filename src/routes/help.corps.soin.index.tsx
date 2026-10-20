import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Row } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

/** D019 · Le corps · 06 · un moment de soin */
export const Route = createFileRoute("/help/corps/soin/")({
  head: () => legatoHead("Un moment pour vous", "Quelques minutes de soin, guidées pas à pas : les mains, le visage, les épaules."),
  component: Soin,
});

const ITEMS = [
  { title: "Les mains", subtitle: "Une crème, lentement · 3 min" },
  { title: "Le visage", subtitle: "De l'eau tiède, une serviette chaude · 3 min" },
  { title: "Les épaules", subtitle: "Relâcher la tension · 4 min" },
];

function Soin() {
  return (
    <StandardLayout space="support" back="/help/corps" backLabel="Le corps" activeTab="/care">
      <p className="lg-mono pt-8" style={{ color: "var(--sp-sub)" }}>06 · Un soin</p>
      <PageTitle space="support" className="mt-3">Un moment<br /><em>pour vous.</em></PageTitle>
      <Lead space="support" className="mt-3 max-w-[310px]">Quelques minutes de soin, guidées pas à pas. Choisissez par où commencer.</Lead>
      <div className="mt-6">
        {ITEMS.map((it, i) => (
          <Row key={it.title} space="support" n={i + 1} title={it.title} subtitle={it.subtitle}
            to="/help/corps/exercice" icon="arrow" last={i === ITEMS.length - 1} />
        ))}
      </div>
    </StandardLayout>
  );
}
