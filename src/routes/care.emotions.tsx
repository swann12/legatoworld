import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, CARE_SUBNAV } from "@/components/legato/SubNav";
import { EMOTIONS, useLegato, type Emotion } from "@/lib/legato-state";

export const Route = createFileRoute("/care/emotions")({
  head: () => ({ meta: [{ title: "Émotions — Legato" }] }),
  component: CareEmotions,
});

function CareEmotions() {
  const { currentEmotions, setCurrentEmotions } = useLegato();
  const toggle = (id: Emotion) => setCurrentEmotions(currentEmotions.includes(id) ? currentEmotions.filter((e) => e !== id) : [...currentEmotions, id]);
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between"><LegatoMark to="/space" size={22} /><span className="mono-label text-dusk/45">Soutien</span></header>
        <SubNav items={CARE_SUBNAV} ariaLabel="Sous-navigation Soutien" />
        <section className="px-6 pt-8"><p className="mono-label">Check-in émotionnel</p><h1 className="mt-5 ed-page-title">Comment vous sentez-vous <span className="italic" style={{ color: "var(--terracotta)" }}>maintenant&nbsp;?</span></h1></section>
        <section className="px-6 pt-8 flex flex-wrap gap-2">
          {EMOTIONS.map((e) => <button key={e.id} onClick={() => toggle(e.id)} className={`rounded-full border px-4 py-2 text-[13px] ${currentEmotions.includes(e.id) ? "border-dusk/40 bg-[color:var(--whisper)]" : "border-dusk/15 bg-paper text-dusk/70"}`}>{e.label}</button>)}
        </section>
      </div>
    </Shell>
  );
}