import { createFileRoute, Link } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, SectionLabel, Row } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";
import { frenchDate, useSoutien } from "@/lib/soutien";
import { ChevronRight } from "lucide-react";

/** D059 · so-travail : reprendre le travail */
export const Route = createFileRoute("/care/travail/")({
  head: () => legatoHead("Reprendre le travail", "S'y préparer un peu, sans tout prévoir."),
  component: Travail,
});

function MsgRow({ title, subtitle, pour, last }: { title: string; subtitle: string; pour: "responsable" | "collegues"; last?: boolean }) {
  return (
    <Link to="/care/travail/message" search={{ pour }} className="flex w-full items-center gap-4 py-[18px]"
      style={{ borderBottom: last ? "none" : "1px solid var(--sp-line)", color: "var(--sp-ink)" }}>
      <span className="min-w-0 flex-1">
        <span className="lg-row-title block">{title}</span>
        <span className="lg-row-sub mt-1 block" style={{ color: "var(--sp-sub)" }}>{subtitle}</span>
      </span>
      <ChevronRight className="size-4 shrink-0" strokeWidth={1.3} />
    </Link>
  );
}

function Travail() {
  const { s, update } = useSoutien();
  const date = frenchDate(s.workDate);
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" size={36} className="pt-[22px]">Reprendre<br /><em>le travail.</em></PageTitle>
      <Lead className="mt-2 max-w-[310px]">{date ? `${date}. ` : ""}On peut s'y préparer un peu, sans tout prévoir.</Lead>
      <label className="mt-3 flex items-center gap-3 text-[13px]" style={{ color: "var(--sp-sub)" }}>
        Date de reprise
        <input type="date" value={s.workDate ?? ""} onChange={(e) => update((p) => ({ ...p, workDate: e.target.value || undefined }))}
          className="bg-transparent py-1 text-[14px] outline-none" style={{ color: "var(--sp-ink)", borderBottom: "1px solid var(--sp-line-2)" }} />
      </label>
      <SectionLabel space="support" className="mt-6">Avant</SectionLabel>
      <MsgRow title="Prévenir votre responsable" subtitle="un message prêt, à adapter" pour="responsable" />
      <MsgRow title="Dire ce que vous voulez à vos collègues" subtitle="ou ne rien dire" pour="collegues" last />
      <SectionLabel space="support" className="mt-4">Si c'est trop tôt</SectionLabel>
      <Row space="support" title="Une reprise progressive" subtitle="à voir avec votre médecin" to="/care/parler" last />
      <SectionLabel space="support" className="mt-4">Au travail</SectionLabel>
      <Row space="support" title="Une minute au calme" subtitle="quand ça déborde au bureau" to="/care/sons/voix" last />
    </StandardLayout>
  );
}
