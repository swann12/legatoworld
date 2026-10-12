import { createFileRoute } from "@tanstack/react-router";
import { useActiveSpace } from "@/lib/use-active-space";
import { StandardLayout, PageTitle, Lead, SectionLabel, Tip, TextLink } from "@/components/legato/ds";

export const Route = createFileRoute("/home/parler-enfant")({
  head: () => ({
    meta: [
      { title: "En parler à un enfant — Legato" },
      { name: "description", content: "Des mots simples et vrais pour expliquer la mort d'un animal à un enfant." },
      { property: "og:title", content: "En parler à un enfant — Legato" },
      { property: "og:description", content: "Les enfants comprennent mieux des mots simples et vrais que des détours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

/** 103 · En parler à un enfant */
function Page() {
  const { space } = useActiveSpace();
  return (
    <StandardLayout back="/home" backLabel={`Espace ${space?.name ?? ""}`.trim()} activeTab="/home">
      <PageTitle className="pt-8">En parler<br /><em>à un enfant.</em></PageTitle>
      <Lead className="mt-3">Les enfants comprennent mieux des mots simples et vrais que des détours.</Lead>
      <SectionLabel className="mt-8">Ce qui aide</SectionLabel>
      <Tip n={1}>Dire « il est mort », plutôt que « il est parti ».</Tip>
      <Tip n={2}>Répondre à ses questions, même si elles reviennent.</Tip>
      <Tip n={3} last>Lui proposer un geste : un dessin, une photo à garder.</Tip>
      <div className="mt-6"><TextLink to="/care/resources">Lire : expliquer la mort d'un animal</TextLink></div>
    </StandardLayout>
  );
}
