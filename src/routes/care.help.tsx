import { PageHeader } from "@/components/legato/EditorialUI";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

export const Route = createFileRoute("/care/help")({
  head: () => ({ meta: [{ title: "Aide humaine — Legato" }] }),
  component: CareHelp,
});

function CareHelp() {
  return (
    <Shell livingBg={false}>
      <div className="wash-blush min-h-dvh text-dusk pb-32">
        <PageHeader back="/care" title="AIDE HUMAINE" />
        <section className="px-6 pt-8"><h1 className="mt-5 ed-page-title">Trouver quelqu'un <span className="italic" style={{ color: "var(--terracotta)" }}>à qui parler</span>.</h1></section>
        <section className="px-5 pt-8 space-y-3">
          <Link to="/resources" search={{ space: "care" }} className="block rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4"><p className="font-serif text-[18px]">Thérapeutes et psychologues</p><p className="mt-1 text-[12.5px] text-dusk/60">Annuaire choisi avec soin.</p></Link>
          <Link to="/crisis" className="block rounded-[18px] border border-dusk/12 bg-[color:var(--blush)] px-5 py-4"><p className="font-serif text-[18px]">Besoin d’aide tout de suite</p><p className="mt-1 text-[12.5px] text-dusk/60">3114, lignes d'écoute, aide immédiate.</p></Link>
        </section>
      </div>
    </Shell>
  );
}