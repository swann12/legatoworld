import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, SectionLabel, Tip } from "@/components/legato/ds";

export const Route = createFileRoute("/care/new-animal")({
  head: () => ({
    meta: [
      { title: "Un autre animal, un jour ? — Legato" },
      { name: "description", content: "Il n'y a pas de bon délai pour accueillir un nouvel animal. Trois questions à vous poser." },
      { property: "og:title", content: "Un autre animal, un jour ? — Legato" },
      { property: "og:description", content: "Rien ne presse. Trois questions à vous poser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewAnimal,
});

/** B031 · Un autre animal */
function NewAnimal() {
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle className="pt-[30px]">Un autre animal,<br /><em>un jour ?</em></PageTitle>
      <Lead className="mt-[10px] max-w-[320px]">Il n'y a pas de bon délai. Certaines personnes en accueillent un vite, d'autres jamais. Les deux sont normaux.</Lead>
      <SectionLabel className="mt-8">Quelques questions à vous poser</SectionLabel>
      <Tip n={1}>Est-ce que je cherche à le remplacer, ou à accueillir un nouvel animal ?</Tip>
      <Tip n={2}>Est-ce que toute la famille est prête ?</Tip>
      <Tip n={3} last>Est-ce que je pourrai l'aimer pour lui-même ?</Tip>
    </StandardLayout>
  );
}
