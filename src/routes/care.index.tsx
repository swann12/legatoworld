import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, SectionLabel, Row, Lead } from "@/components/legato/ds";
import { useActiveSpace } from "@/lib/use-active-space";

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
  const { kind, space } = useActiveSpace();
  if (kind === "malade") return <MaladeSoutien />;
  if (kind === "animal") return <AnimalSoutien name={space?.name ?? "lui"} />;
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

/** B028 · Soutien, espace animal */
function AnimalSoutien({ name }: { name: string }) {
  return (
    <StandardLayout space="support" title="Soutien" activeTab="/care">
      <PageTitle className="pt-[30px]">Prendre soin<br /><em>de vous.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Perdre un animal, c'est perdre une présence de chaque jour. Votre peine est légitime.</Lead>
      <SectionLabel className="mt-8">Maintenant</SectionLabel>
      <Row title="Se confier" subtitle="À Présence, ou à des personnes qui ont vécu la même chose" to="/care/aide" />
      <Row title="Si vous vous sentez coupable" subtitle="Après une euthanasie ou un accident" to="/care/guilt" />
      <Row title={`Écrire une lettre à ${name}`} subtitle="Lui dire ce qui n'a pas été dit" to="/care/journal" last />
      <div className="mt-8 px-5" style={{ background: "var(--sp-block)" }}>
        <Row title="En parler à un enfant" subtitle="Des mots simples et vrais" to="/home/parler-enfant" />
        <Row title="Un autre animal, un jour ?" subtitle="Rien ne presse" to="/care/new-animal" last />
      </div>
    </StandardLayout>
  );
}

/** B054 · Soutien, espace proche malade */
function MaladeSoutien() {
  return (
    <StandardLayout space="support" title="Soutien" activeTab="/care">
      <PageTitle className="pt-[30px]">Prendre soin<br /><em>de vous aussi.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[320px]">On s'oublie vite quand on accompagne. Commencez par ce qui demande le moins d'effort.</Lead>
      <SectionLabel className="mt-8">Maintenant</SectionLabel>
      <Row title="Se confier" subtitle="À Présence, ou à une ligne d'écoute pour les aidants" to="/care/aide" />
      <Row title="Si vous n'en pouvez plus" subtitle="Les signes, et comment souffler" to="/care/epuisement" last />
      <div className="mt-8 px-5" style={{ background: "var(--sp-block)" }}>
        <Row title="Respirer, dormir" subtitle="Trois minutes, ou plus" to="/care/respirer" />
        <Row title="Écrire" subtitle="Ce que vous n'osez pas lui dire" to="/care/journal" />
        <Row title="Trouver un psychologue" subtitle="Spécialisé dans l'accompagnement" to="/care/help" last />
      </div>
    </StandardLayout>
  );
}
