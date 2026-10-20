import type { ReactNode } from "react";
import { StandardLayout, PageTitle, Lead, Tip, PrimaryButton, TextLink } from "@/components/legato/ds";

/** Page d'un geste du corps (D015–D018) : label numéroté, titre, trois conseils, deux actions. */
export function CorpsTopicPage({ label, title, lead, tips, primary, secondary }: {
  label: string;
  title: ReactNode;
  lead: string;
  tips: string[];
  primary: { label: string; to: string; search?: Record<string, string> };
  secondary: { label: string; to: string };
}) {
  return (
    <StandardLayout space="support" back="/help/corps" backLabel="Le corps" activeTab="/care">
      <p className="lg-mono pt-8" style={{ color: "var(--sp-sub)" }}>{label}</p>
      <PageTitle space="support" className="mt-3">{title}</PageTitle>
      <Lead space="support" className="mt-3 max-w-[310px]">{lead}</Lead>
      <p className="mt-8" style={{ fontFamily: "var(--lg-serif)", fontSize: 17, fontStyle: "italic" }}>Ce qui aide —</p>
      {tips.map((t, i) => <Tip key={i} n={i + 1} last={i === tips.length - 1}>{t}</Tip>)}
      <div className="pt-6">
        <PrimaryButton space="support" to={primary.to} search={primary.search}>{primary.label}</PrimaryButton>
      </div>
      <div className="pt-4">
        <TextLink space="support" to={secondary.to}>{secondary.label}</TextLink>
      </div>
    </StandardLayout>
  );
}
