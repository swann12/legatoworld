import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Row } from "@/components/legato/ds";

export const Route = createFileRoute("/help/corps/")({
  head: () => ({
    meta: [
      { title: "Prendre soin de votre corps — Legato" },
      { name: "description", content: "Dormir, manger, se laver, s'habiller : un seul sujet à la fois, pendant le deuil." },
      { property: "og:title", content: "Prendre soin de votre corps — Legato" },
      { property: "og:description", content: "En deuil, on oublie souvent de dormir, de manger, de se laver." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Corps,
});

const ITEMS = [
  { title: "Dormir", subtitle: "Quand le sommeil ne vient pas", to: "/help/corps/nuits" },
  { title: "Manger", subtitle: "Même peu, même sans faim", to: "/help/corps/manger" },
  { title: "Se laver", subtitle: "Une douche, ou juste le visage", to: "/help/corps/eau" },
  { title: "S'habiller", subtitle: "Sortir du pyjama, sans effort", to: "/help/corps/habiller" },
  { title: "Un moment de soin", subtitle: "Dix minutes pour vous", to: "/help/corps/soin" },
];

function Corps() {
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" className="pt-8">Prendre soin<br /><em>de votre corps.</em></PageTitle>
      <Lead space="support" className="mt-4">En deuil, on oublie souvent de dormir, de manger, de se laver. Choisissez un seul sujet.</Lead>
      <div className="mt-8">
        {ITEMS.map((it, i) => <Row key={it.to} space="support" n={i + 1} {...it} last={i === ITEMS.length - 1} />)}
      </div>
    </StandardLayout>
  );
}
