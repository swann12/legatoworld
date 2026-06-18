import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, CARE_SUBNAV } from "@/components/legato/SubNav";

export const Route = createFileRoute("/care/resources")({
  head: () => ({ meta: [{ title: "Ressources — Soutien Legato" }] }),
  component: CareResources,
});

const RESOURCES = ["Comprendre le deuil", "Deuil anticipé", "Émotions", "Sommeil", "Respiration", "Rituels", "Podcasts", "Livres", "Témoignages", "Deuil animalier", "Aider un proche"];

function CareResources() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between"><LegatoMark to="/space" size={22} /><Link to="/care/help" className="mono-label text-dusk/55">Aide →</Link></header>
        <SubNav items={CARE_SUBNAV} ariaLabel="Sous-navigation Soutien" />
        <section className="px-6 pt-8"><p className="mono-label">Ressources sensibles</p><h1 className="mt-5 ed-page-title">Lire, écouter, <span className="italic" style={{ color: "var(--terracotta)" }}>comprendre</span>.</h1></section>
        <section className="px-5 pt-8 grid grid-cols-2 gap-3">{RESOURCES.map((r) => <div key={r} className="rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-4 py-4 min-h-[96px]"><p className="font-serif text-[17px] leading-tight text-dusk">{r}</p></div>)}</section>
      </div>
    </Shell>
  );
}