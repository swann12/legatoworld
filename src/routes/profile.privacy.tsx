import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, TagRow } from "@/components/legato/ds";

export const Route = createFileRoute("/profile/privacy")({
  head: () => ({
    meta: [
      { title: "Qui voit quoi — Legato" },
      { name: "description", content: "Par défaut, tout est privé. Vous choisissez ce que vous ouvrez à votre cercle." },
      { property: "og:title", content: "Qui voit quoi — Legato" },
      { property: "og:description", content: "Journal, humeur, Présence : vous seul. Souvenirs : vous et votre cercle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

/** 025 · Qui voit quoi */
function Privacy() {
  return (
    <StandardLayout back="/profile" backLabel="Mon compte" activeTab="/home">
      <PageTitle className="pt-8">Qui voit <em>quoi.</em></PageTitle>
      <Lead className="mt-3">Par défaut, tout est privé. Vous choisissez ce que vous ouvrez à votre cercle.</Lead>
      <div className="mt-6" style={{ borderTop: "1px solid var(--sp-line-2)" }}>
        <TagRow title="Votre journal" tag="Vous seul" />
        <TagRow title="Votre humeur" tag="Vous seul" />
        <TagRow title="Vos échanges avec Présence" tag="Vous seul" />
        <TagRow title="Les souvenirs" tag="Vous et votre cercle" />
        <TagRow title="Une démarche confiée" tag="La personne choisie" last />
      </div>
    </StandardLayout>
  );
}
