import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, SectionLabel, Tip, Block } from "@/components/legato/ds";

export const Route = createFileRoute("/home/en-parler")({
  head: () => ({
    meta: [
      { title: "En parler avec ses proches — Legato" },
      { name: "description", content: "Comment ouvrir la conversation sur ce que vous voudriez, plus tard." },
      { property: "og:title", content: "En parler avec ses proches — Legato" },
      { property: "og:description", content: "Une phrase pour commencer, et ce qui aide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

/** 104 · En parler avec ses proches */
function Page() {
  return (
    <StandardLayout back="/home" backLabel="Questions sur la mort" activeTab="/home">
      <PageTitle className="pt-8">En parler<br /><em>avec ses proches.</em></PageTitle>
      <Lead className="mt-3">Ce n'est pas une conversation facile. Elle soulage souvent ceux qui restent.</Lead>
      <Block className="mt-8" label="Une phrase pour commencer">
        <p className="-mt-3 italic" style={{ fontFamily: "var(--lg-serif)", fontSize: 21, lineHeight: 1.3 }}>
          « J'ai pensé à ce que je voudrais, plus tard. Est-ce que je peux t'en parler ? »
        </p>
      </Block>
      <SectionLabel className="mt-8">Ce qui aide</SectionLabel>
      <Tip n={1}>Choisir un moment calme, sans urgence.</Tip>
      <Tip n={2} last>Parler de ce qui compte pour vous, pas seulement des papiers.</Tip>
    </StandardLayout>
  );
}
