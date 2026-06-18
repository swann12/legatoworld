import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, CARE_SUBNAV } from "@/components/legato/SubNav";
import { useLovedName } from "@/lib/loved-name";

export const Route = createFileRoute("/care/garden/$zone")({
  head: () => ({ meta: [{ title: "Parcelle — Jardin Legato" }] }),
  component: GardenZone,
});

function GardenZone() {
  const { zone } = Route.useParams();
  const lovedName = useLovedName();
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between"><LegatoMark to="/space" size={22} /><Link to="/care/garden" className="mono-label text-dusk/55">Jardin →</Link></header>
        <SubNav items={CARE_SUBNAV} ariaLabel="Sous-navigation Soutien" />
        <section className="px-6 pt-8"><p className="mono-label">Parcelle</p><h1 className="mt-5 ed-page-title"><span className="italic" style={{ color: "var(--terracotta)" }}>{lovedName}</span></h1><p className="mt-4 text-[13px] text-dusk/60">Photo, note, souvenir, voix, musique, citation, bouquet et rituel.</p></section>
        <section className="px-5 pt-8 grid grid-cols-2 gap-3">{["Photo", "Note", "Voix", "Musique", "Citation", "Rituel"].map((item) => <div key={item} className="rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-4 py-5"><p className="font-serif text-[18px]">{item}</p><p className="mt-2 mono-label text-dusk/45">{zone}</p></div>)}</section>
      </div>
    </Shell>
  );
}