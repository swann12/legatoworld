import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, CARE_SUBNAV } from "@/components/legato/SubNav";
import { useLovedName } from "@/lib/loved-name";

export const Route = createFileRoute("/care/garden")({
  head: () => ({ meta: [{ title: "Jardin — Soutien Legato" }] }),
  component: CareGarden,
});

function CareGarden() {
  const lovedName = useLovedName();
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between"><LegatoMark to="/space" size={22} /><Link to="/care/memory" className="mono-label text-dusk/55">Mémoire →</Link></header>
        <SubNav items={CARE_SUBNAV} ariaLabel="Sous-navigation Soutien" />
        <section className="px-6 pt-8"><p className="mono-label">Jardin</p><h1 className="mt-5 ed-page-title">Une parcelle pour <span className="italic" style={{ color: "var(--terracotta)" }}>{lovedName}</span>.</h1></section>
        <section className="px-5 pt-8"><Link to="/care/memory" className="block rounded-[20px] border border-dusk/12 bg-[color:var(--whisper)] px-6 py-8 text-center"><p className="font-serif text-[24px] italic">Déposer un souvenir</p><p className="mt-2 text-[13px] text-dusk/60">photo · voix · lettre · objet · rituel</p></Link></section>
      </div>
    </Shell>
  );
}