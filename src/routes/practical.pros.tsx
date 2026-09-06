import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, PRACTICAL_SUBNAV } from "@/components/legato/SubNav";

export const Route = createFileRoute("/practical/pros")({
  head: () => ({ meta: [{ title: "Professionnels — Démarches Legato" }] }),
  component: PracticalPros,
});

const PROS: { label: string; hint: string; category: "pompes" | "fleuristes" | "notaires" | "administrations" | "debarras" | "photographes"; bg: string }[] = [
  { label: "Pompes funèbres", hint: "Maisons transparentes", category: "pompes", bg: "var(--sage)" },
  { label: "Fleuristes", hint: "Compositions de cérémonie", category: "fleuristes", bg: "var(--peach)" },
  { label: "Notaires", hint: "Succession, actes", category: "notaires", bg: "var(--lavender)" },
  { label: "Administratif", hint: "Mairie, caisses, organismes", category: "administrations", bg: "var(--blush)" },
  { label: "Débarras", hint: "Logement, tri, transport", category: "debarras", bg: "var(--sun)" },
  { label: "Photographes", hint: "Garder une trace discrète", category: "photographes", bg: "var(--sky)" },
];

function PracticalPros() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between"><LegatoMark size={22} /><Link to="/practical" className="mono-label text-dusk/55">Démarches →</Link></header>
        <SubNav items={PRACTICAL_SUBNAV} ariaLabel="Sous-navigation Démarches" />
        <section className="px-6 pt-8"><p className="mono-label">Professionnels</p><h1 className="mt-5 ed-page-title">Les bonnes personnes, <span className="italic" style={{ color: "var(--terracotta)" }}>au bon moment</span>.</h1><p className="mt-5 body-meta max-w-[34ch]">Uniquement les ressources liées aux démarches, sans mélange avec le soutien émotionnel.</p></section>
        <section className="px-5 pt-8 grid grid-cols-2 gap-3">{PROS.map((p) => <Link key={p.category} to="/resources/$category" params={{ category: p.category }} search={{ space: "practical" }} className="rounded-[18px] px-4 py-5 min-h-[118px] flex flex-col justify-between" style={{ background: p.bg }}><p className="mono-label text-dusk/55">Pro</p><div><p className="font-serif text-[18px] leading-tight">{p.label}</p><p className="mt-1 text-[11.5px] text-dusk/60">{p.hint}</p></div></Link>)}</section>
        <section className="px-5 pt-7"><Link to="/resources" search={{ space: "practical" }} className="block rounded-[18px] border border-dusk/12 bg-paper px-5 py-4"><p className="mono-label" style={{ color: "var(--terracotta)" }}>Voir tout</p><p className="mt-1 font-serif text-[18px]">Annuaire démarches complet →</p></Link></section>
      </div>
    </Shell>
  );
}