import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, SectionLabel, Row } from "@/components/legato/ds";

export const Route = createFileRoute("/care/")({
  head: () => ({
    meta: [
      { title: "Soutien — Legato" },
      { name: "description", content: "Prendre soin de vous : se confier, respirer, écrire, trouver un professionnel." },
      { property: "og:title", content: "Soutien — Legato" },
      { property: "og:description", content: "Prendre soin de vous, maintenant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Soutien,
});

function Soutien() {
  return (
    <StandardLayout space="support" title="Soutien" activeTab="/care">
      <PageTitle space="support" className="mt-12">Prendre soin<br /><em>de vous.</em></PageTitle>
      <SectionLabel space="support" className="mt-9">Maintenant</SectionLabel>
      <div className="mt-2">
        <Row space="support" title="Se confier" subtitle="À Présence, à un bénévole, à un groupe" to="/care/aide" />
        <Row space="support" title="Respirer, se poser" subtitle="Trois minutes, ou plus" to="/care/respirer" />
        <Row space="support" title="Prendre soin de votre corps" subtitle="Dormir, manger, se laver" to="/help/corps" last />
      </div>
      <div className="mt-10 px-5" style={{ background: "var(--sp-block)" }}>
        <Row space="support" title="Écrire" subtitle="Journal et lettres" to="/care/journal" />
        <Row space="support" title="Lire, écouter" subtitle="Livres et podcasts choisis" to="/care/resources" />
        <Row space="support" title="Trouver un professionnel" subtitle="Psychologues, associations" to="/care/help" last />
      </div>
    </StandardLayout>
  );
}
