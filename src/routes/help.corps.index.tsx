import { createFileRoute, Link } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Row } from "@/components/legato/ds";

export const Route = createFileRoute("/help/corps/")({
  head: () => ({
    meta: [
      { title: "Prendre soin de votre corps — Legato" },
      { name: "description", content: "Dormir, manger, se laver, s'habiller, bouger, un soin : six gestes simples pendant le deuil." },
      { property: "og:title", content: "Prendre soin de votre corps — Legato" },
      { property: "og:description", content: "Six gestes simples pour prendre soin de votre corps pendant le deuil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Corps,
});

const TILES = [
  { n: "01", title: "Dormir", sub: "les nuits", to: "/help/corps/nuits" },
  { n: "02", title: "Manger", sub: "même peu", to: "/help/corps/manger" },
  { n: "03", title: "Se laver", sub: "un geste à la fois", to: "/help/corps/eau" },
  { n: "04", title: "S'habiller", sub: "sans y penser", to: "/help/corps/habiller" },
  { n: "05", title: "Bouger", sub: "dix minutes", to: "/help/corps/bouger" },
  { n: "06", title: "Un soin", sub: "pour vous", to: "/help/corps/soin" },
];
const MORE = [
  { title: "Ce que le deuil fait au corps", to: "/help/corps/comprendre" },
  { title: "Quand consulter", to: "/help/corps/consulter" },
  { title: "Votre petit suivi", to: "/help/corps/suivi" },
];

/** B017 · Le corps · sommaire (§10) */
function Corps() {
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle className="pt-[30px]">Prendre soin<br /><em>de votre corps.</em></PageTitle>
      <div className="mt-6 grid grid-cols-2 gap-[10px]">
        {TILES.map((t) => (
          <Link key={t.to} to={t.to} className="flex h-[92px] flex-col justify-between px-4 py-[14px]" style={{ background: "var(--lg-linen)", color: "var(--sp-ink)" }}>
            <span className="lg-mono">{t.n}</span>
            <span className="flex flex-col gap-[2px]">
              <span style={{ fontFamily: "var(--lg-serif)", fontSize: 21, lineHeight: 1.1 }}>{t.title}</span>
              <span className="text-[12px]" style={{ color: "var(--sp-sub)" }}>{t.sub}</span>
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-[30px]" style={{ fontFamily: "var(--lg-serif)", fontSize: 17, fontStyle: "italic", color: "var(--sp-ink)" }}>Comprendre et suivre —</p>
      {MORE.map((m, i) => <Row key={m.to} title={m.title} to={m.to} icon="arrow" last={i === MORE.length - 1} />)}
    </StandardLayout>
  );
}
