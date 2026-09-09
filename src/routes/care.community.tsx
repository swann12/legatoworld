import { PageHeader } from "@/components/legato/EditorialUI";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

export const Route = createFileRoute("/care/community")({
  head: () => ({ meta: [{ title: "Communauté — Soutien Legato" }] }),
  component: CareCommunity,
});

const SEGMENTS = ["conjoint", "parent", "enfant", "périnatal", "animal", "suicide", "mort soudaine", "aidants", "peur", "questionnement"];

function CareCommunity() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader back="/care" title="COMMUNAUTÉ" />
        <section className="px-6 pt-8"><h1 className="mt-5 ed-page-title">Lire, répondre, ou rester <span className="italic" style={{ color: "var(--terracotta)" }}>silencieux·se</span>.</h1><p className="mt-5 text-[13px] text-dusk/60">Groupes segmentés et modérés humainement.</p></section>
        <section className="px-5 pt-8 flex flex-wrap gap-2">{SEGMENTS.map((s) => <span key={s} className="rounded-full border border-dusk/15 bg-[color:var(--whisper)] px-4 py-2 text-[13px]">{s}</span>)}</section>
      </div>
    </Shell>
  );
}