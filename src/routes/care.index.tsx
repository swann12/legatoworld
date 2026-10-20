import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, SectionLabel, Row, Lead, PrimaryButton } from "@/components/legato/ds";
import { useActiveSpace } from "@/lib/use-active-space";
import { SelfSoutien } from "@/components/legato/SelfSpace";

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
  if (kind === "questions") return <SelfSoutien />;
  if (kind === "animal") return <AnimalSoutien name={space?.name ?? "lui"} />;
  return <SoutienAccueil />;
}

/** D050 · Soutien, accueil (ajouts-4) */
function SoutienAccueil() {
  return (
    <StandardLayout space="support" title="Soutien" activeTab="/care">
      <PageTitle space="support" size={30} className="pt-5">Ce qui peut <em>vous aider.</em></PageTitle>
      <section className="mt-4 flex items-center justify-between gap-3 px-[18px] py-[14px]" style={{ background: "var(--sp-block)", color: "var(--sp-block-ink)" }}>
        <span className="flex flex-col gap-1">
          <span className="lg-mono">Pour vous, en ce moment</span>
          <span style={{ fontFamily: "var(--lg-serif)", fontSize: 20, lineHeight: 1.15 }}>Votre point du mois</span>
          <span className="text-[12px]" style={{ color: "var(--sp-sub)" }}>3 questions · 2 min</span>
        </span>
        <PrimaryButton space="support" to="/care/point" className="!h-10 whitespace-nowrap px-6">Faire le point</PrimaryButton>
      </section>
      <SectionLabel space="support" className="mt-4">Maintenant</SectionLabel>
      <Row space="support" title="Respirer, des sons pour s'apaiser" subtitle="3 minutes, ou toute la nuit" to="/care/sons" />
      <Row space="support" title="Écrire à Présence" subtitle="elle écoute, et vous oriente" to="/presence" last />
      <SectionLabel space="support" className="mt-4">Être entouré</SectionLabel>
      <Row space="support" title="Ce qui m'aiderait" subtitle="dire à vos proches ce dont vous avez besoin" to="/care/aide" />
      <Row space="support" title="Parler à quelqu'un" subtitle="médecin, psychologue, groupe" to="/care/parler" last />
      <SectionLabel space="support" className="mt-4">Prendre soin de vous</SectionLabel>
      <Row space="support" title="Le corps" subtitle="dormir, manger, bouger" to="/help/corps" />
      <Row space="support" title="Reprendre le travail" subtitle="quand vous serez prêt" to="/care/travail" last />

      {/* Hors maquette D050 : conservé replié en attendant votre accord. */}
      <details className="mt-8">
        <summary className="lg-mono cursor-pointer py-3" style={{ color: "var(--sp-sub)" }}>Autres pages</summary>
        <Row space="support" title="Écrire" subtitle="Journal et lettres" to="/care/journal" />
        <Row space="support" title="Lire, écouter" subtitle="Livres et podcasts choisis" to="/care/resources" />
        <Row space="support" title="Respirer, se poser" subtitle="Trois minutes, ou plus" to="/care/respirer" />
        <Row space="support" title="Trouver un professionnel" subtitle="Psychologues, associations" to="/care/help" last />
      </details>
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
      <Row title="Se confier" subtitle="À Présence, ou à des personnes qui ont vécu la même chose" to="/care/parler" />
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
      <Row title="Se confier" subtitle="À Présence, ou à une ligne d'écoute pour les aidants" to="/care/parler" />
      <Row title="Si vous n'en pouvez plus" subtitle="Les signes, et comment souffler" to="/care/epuisement" last />
      <div className="mt-8 px-5" style={{ background: "var(--sp-block)" }}>
        <Row title="Respirer, dormir" subtitle="Trois minutes, ou plus" to="/care/respirer" />
        <Row title="Écrire" subtitle="Ce que vous n'osez pas lui dire" to="/care/journal" />
        <Row title="Trouver un psychologue" subtitle="Spécialisé dans l'accompagnement" to="/care/help" last />
      </div>
    </StandardLayout>
  );
}
