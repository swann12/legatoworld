import { createFileRoute } from "@tanstack/react-router";
import { useActiveSpace } from "@/lib/use-active-space";
import { StandardLayout, PageTitle, Lead, SectionLabel, Tip, TextLink } from "@/components/legato/ds";

export const Route = createFileRoute("/home/ses-affaires")({
  head: () => ({
    meta: [
      { title: "Ses affaires, à votre rythme — Legato" },
      { name: "description", content: "Que garder, que donner après la mort d'un animal : rien ne presse." },
      { property: "og:title", content: "Ses affaires, à votre rythme — Legato" },
      { property: "og:description", content: "Garder un objet, donner le reste, ou tout laisser en place pour l'instant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

/** 102 · Ses affaires */
function Page() {
  const { space } = useActiveSpace();
  return (
    <StandardLayout back="/home" backLabel={`Espace ${space?.name ?? ""}`.trim()} activeTab="/home">
      <PageTitle className="pt-8">Ses affaires,<br /><em>à votre rythme.</em></PageTitle>
      <Lead className="mt-3">Rien ne presse. Certaines personnes gardent tout un temps, d'autres préfèrent ranger vite.</Lead>
      <SectionLabel className="mt-8">Vous pouvez</SectionLabel>
      <Tip n={1}>Garder un objet qui lui ressemble : son collier, sa balle.</Tip>
      <Tip n={2}>Donner le reste à un refuge, quand vous serez prêt.</Tip>
      <Tip n={3} last>Laisser tout en place pour l'instant.</Tip>
      <div className="mt-6">
        <TextLink onClick={() => window.open("https://www.google.com/maps/search/refuge+animaux+près+de+moi", "_blank", "noopener")}>Trouver un refuge près de chez vous</TextLink>
      </div>
    </StandardLayout>
  );
}
