import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, PRACTICAL_SUBNAV } from "@/components/legato/SubNav";

export const Route = createFileRoute("/practical/pros")({
  head: () => ({ meta: [{ title: "Professionnels — Démarches Legato" }] }),
  component: PracticalPros,
});

const PROS = ["Pompes funèbres", "Fleuristes", "Notaires", "Aides administratives", "Conseillers succession", "Assurances"];

function PracticalPros() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between"><LegatoMark to="/space" size={22} /><Link to="/practical" className="mono-label text-dusk/55">Démarches →</Link></header>
        <SubNav items={PRACTICAL_SUBNAV} ariaLabel="Sous-navigation Démarches" />
        <section className="px-6 pt-8"><p className="mono-label">Professionnels</p><h1 className="mt-5 ed-page-title">Les bonnes personnes, <span className="italic" style={{ color: "var(--terracotta)" }}>au bon moment</span>.</h1></section>
        <section className="px-5 pt-8 grid grid-cols-2 gap-3">{PROS.map((p) => <Link key={p} to="/resources" search={{ space: "practical" }} className="rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-4 py-5"><p className="font-serif text-[18px] leading-tight">{p}</p></Link>)}</section>
      </div>
    </Shell>
  );
}