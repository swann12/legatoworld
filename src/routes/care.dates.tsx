import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, CARE_SUBNAV } from "@/components/legato/SubNav";
import { upcomingSensitiveDates } from "@/lib/sensitive-dates";

export const Route = createFileRoute("/care/dates")({
  head: () => ({ meta: [{ title: "Dates sensibles — Soutien Legato" }] }),
  component: CareDates,
});

function CareDates() {
  const dates = upcomingSensitiveDates({ windowDays: 30 });
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between"><LegatoMark size={22} /><Link to="/care/journal" className="mono-label text-dusk/55">Lettre →</Link></header>
        <SubNav items={CARE_SUBNAV} ariaLabel="Sous-navigation Soutien" />
        <section className="px-6 pt-8"><p className="mono-label">Dates sensibles</p><h1 className="mt-5 ed-page-title">Anticiper les jours <span className="italic" style={{ color: "var(--terracotta)" }}>qui pèsent</span>.</h1></section>
        <section className="px-5 pt-8 space-y-3">{dates.map((d) => <div key={d.id} className="rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4"><p className="font-serif text-[18px]">{d.label}</p><p className="mt-1 text-[12.5px] text-dusk/60">{d.daysAway === 0 ? "Aujourd'hui" : `Dans ${d.daysAway} jours`} · lettre, voix, rituel ou contact proche</p></div>)}<button className="w-full rounded-[18px] border border-dusk/12 px-5 py-4 font-serif">Ajouter une date</button></section>
      </div>
    </Shell>
  );
}