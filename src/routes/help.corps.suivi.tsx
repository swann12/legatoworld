import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StandardLayout, PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";
import { GESTES, dayKey, gentleNote, loadSuivi, saveSuivi, weekDays, type Geste, type Suivi } from "@/lib/corps-suivi";

export const Route = createFileRoute("/help/corps/suivi")({
  head: () => ({
    meta: [
      { title: "Votre petit suivi — Legato" },
      { name: "description", content: "Dormi, mangé, lavé, sorti : la semaine en points, sans note ni objectif." },
      { property: "og:title", content: "Votre petit suivi — Legato" },
      { property: "og:description", content: "Juste pour voir ce qui va un peu mieux." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SuiviPage,
});

const LETTERS = ["L", "M", "M", "J", "V", "S", "D"];

/** B021 · Votre petit suivi — la semaine en points (§10). Gardé sur le téléphone. */
function SuiviPage() {
  const [s, setS] = useState<Suivi>({});
  const [editing, setEditing] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setS(loadSuivi()); setNow(new Date()); }, []);
  const days = now ? weekDays(now) : [];
  const today = now ? dayKey(now) : "";
  const toggle = (g: Geste) => {
    const next = { ...s, [today]: { ...s[today], [g]: !s[today]?.[g] } };
    setS(next); saveSuivi(next);
  };
  const note = now ? gentleNote(s, now) : null;
  const grid = "grid grid-cols-[88px_repeat(7,1fr)]";

  return (
    <StandardLayout space="support" back="/help/corps" backLabel="Le corps" activeTab="/care">
      <PageTitle className="pt-[30px]">Votre<br /><em>petit suivi.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Sans note, sans objectif. Juste pour voir ce qui va un peu mieux.</Lead>
      <div className="mt-7">
        <div className={`${grid} pb-[6px]`}>
          <span />{LETTERS.map((l, i) => <span key={i} className="lg-mono text-center" style={{ color: "var(--sp-sub)" }}>{l}</span>)}
        </div>
        {GESTES.map((g, gi) => (
          <div key={g.id} className={`${grid} items-center py-4`} style={{ borderBottom: gi === GESTES.length - 1 ? "none" : "1px solid var(--sp-line)" }}>
            <span style={{ fontFamily: "var(--lg-serif)", fontSize: 19 }}>{g.label}</span>
            {days.map((d) => {
              const k = dayKey(d), filled = !!s[k]?.[g.id], isToday = k === today;
              const dot = <span className="block size-4 rounded-full" style={{ background: filled ? "var(--sp-ink)" : "transparent", border: filled ? "none" : "1px solid var(--sp-line-2)" }} />;
              return isToday && editing
                ? <button key={k} type="button" aria-pressed={filled} aria-label={`${g.label} aujourd'hui`} onClick={() => toggle(g.id)} className="flex min-h-11 items-center justify-center">{dot}</button>
                : <span key={k} className="flex justify-center">{dot}</span>;
            })}
          </div>
        ))}
      </div>
      {editing && <p className="mt-3 text-[13px]" style={{ color: "var(--sp-sub)" }}>Touchez les points d'aujourd'hui.</p>}
      {note && <p className="mt-[22px] max-w-[310px] text-[14px] leading-[1.55]">{note}</p>}
      <div className="pt-6">
        <PrimaryButton onClick={() => setEditing((e) => !e)}>{editing ? "C'est noté" : "Noter aujourd'hui"}</PrimaryButton>
      </div>
    </StandardLayout>
  );
}
