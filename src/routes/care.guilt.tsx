import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, SectionLabel, Tip, PrimaryButton } from "@/components/legato/ds";

export const Route = createFileRoute("/care/guilt")({
  head: () => ({
    meta: [
      { title: "Si vous vous sentez coupable — Legato" },
      { name: "description", content: "Après une euthanasie ou un accident, la culpabilité est très fréquente. Trois repères pour l'apaiser." },
      { property: "og:title", content: "Si vous vous sentez coupable — Legato" },
      { property: "og:description", content: "Ces pensées disent surtout combien vous l'aimiez." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Guilt,
});

/** B029 · La culpabilité */
function Guilt() {
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle className="pt-[30px]">Si vous vous sentez<br /><em>coupable.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[320px]">« J'aurais dû voir plus tôt. » « Ai-je décidé trop vite ? » Ces pensées sont très fréquentes. Elles disent surtout combien vous l'aimiez.</Lead>
      <SectionLabel className="mt-8">Ce qui aide</SectionLabel>
      <Tip n={1}>Rappelez-vous que vous avez décidé avec ce que vous saviez à ce moment-là.</Tip>
      <Tip n={2}>L'euthanasie a évité qu'il souffre davantage : c'est un dernier soin.</Tip>
      <Tip n={3} last>Parlez-en à votre vétérinaire : il peut répondre à vos questions.</Tip>
      <div className="pt-6"><PrimaryButton to="/presence">En parler à Présence</PrimaryButton></div>
    </StandardLayout>
  );
}
