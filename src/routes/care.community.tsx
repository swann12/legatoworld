import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, CARE_SUBNAV } from "@/components/legato/SubNav";

export const Route = createFileRoute("/care/community")({
  head: () => ({ meta: [{ title: "Communauté — Soutien Legato" }] }),
  component: CareCommunity,
});

const SEGMENTS = ["conjoint", "parent", "enfant", "périnatal", "animal", "suicide", "mort soudaine", "aidants", "peur", "questionnement"];

function CareCommunity() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between"><LegatoMark to="/space" size={22} /><Link to="/_authenticated/circle" className="mono-label text-dusk/55">Cercle →</Link></header>
        <SubNav items={CARE_SUBNAV} ariaLabel="Sous-navigation Soutien" />
        <section className="px-6 pt-8"><p className="mono-label">Communauté</p><h1 className="mt-5 ed-page-title">Lire, répondre, ou rester <span className="italic" style={{ color: "var(--terracotta)" }}>silencieux·se</span>.</h1><p className="mt-5 text-[13px] text-dusk/60">Groupes segmentés et modérés humainement.</p></section>
        <section className="px-5 pt-8 flex flex-wrap gap-2">{SEGMENTS.map((s) => <span key={s} className="rounded-full border border-dusk/15 bg-[color:var(--whisper)] px-4 py-2 text-[13px]">{s}</span>)}</section>
      </div>
    </Shell>
  );
}