import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Tip, TextLink } from "@/components/legato/ds";

export const Route = createFileRoute("/help/corps/consulter")({
  head: () => ({
    meta: [
      { title: "Quand consulter — Legato" },
      { name: "description", content: "Les signes qui demandent d'appeler le 15 tout de suite, et ceux pour lesquels voir votre médecin." },
      { property: "og:title", content: "Quand consulter — Legato" },
      { property: "og:description", content: "Quand appeler le 15, quand voir votre médecin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Consulter,
});

/** B019 · Quand consulter — le 15 en premier (bloc d'urgence bordeaux, §7). */
function Consulter() {
  return (
    <StandardLayout space="support" back="/help/corps" backLabel="Le corps" activeTab="/care">
      <PageTitle className="pt-[30px]">Quand consulter.</PageTitle>
      <div className="mt-[26px] flex items-center justify-between gap-[14px] px-[22px] py-5" style={{ background: "var(--lg-bordeaux)", color: "var(--lg-blush)" }}>
        <span className="flex flex-col gap-[6px]">
          <span style={{ fontFamily: "var(--lg-serif)", fontSize: 16, fontStyle: "italic" }}>Tout de suite —</span>
          <span className="text-[14px] leading-[1.5]">Douleur dans la poitrine, essoufflement soudain, malaise.</span>
        </span>
        <a href="tel:15" className="inline-flex h-10 shrink-0 items-center rounded-full px-[18px] text-[14px]" style={{ background: "var(--lg-blush)", color: "var(--lg-bordeaux)" }}>Le 15</a>
      </div>
      <p className="mt-[34px]" style={{ fontFamily: "var(--lg-serif)", fontSize: 17, fontStyle: "italic" }}>Votre médecin, si —</p>
      <Tip n={1}>Vous dormez très peu depuis plus de deux semaines.</Tip>
      <Tip n={2}>Vous ne mangez presque plus depuis plusieurs jours.</Tip>
      <Tip n={3} last>La fatigue vous empêche de sortir de chez vous.</Tip>
      <div className="pt-[18px]"><TextLink to="/crisis">Des idées noires ? Parler à quelqu'un maintenant</TextLink></div>
    </StandardLayout>
  );
}
