import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StandardLayout, PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";
import { GESTES, dayKey, gentleNote, loadSuivi, weekDays, type Suivi } from "@/lib/corps-suivi";
import { legatoHead } from "@/lib/legato-head";

/** D023 · Le corps · votre petit suivi — la semaine en points (gardé sur le téléphone). */
export const Route = createFileRoute("/help/corps/suivi")({
  head: () => legatoHead("Votre petit suivi", "Dormi, mangé, lavé, sorti : la semaine en points, sans note ni objectif."),
  component: SuiviPage,
});

const LETTERS = ["L", "M", "M", "J", "V", "S", "D"];

function SuiviPage() {
  const [s, setS] = useState<Suivi>({});
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setS(loadSuivi()); setNow(new Date()); }, []);
  const days = now ? weekDays(now) : [];
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
              const filled = !!s[dayKey(d)]?.[g.id];
              return (
                <span key={dayKey(d)} className="flex justify-center">
                  <span className="block size-4 rounded-full" style={{ background: filled ? "var(--sp-ink)" : "transparent", border: filled ? "none" : "1px solid var(--sp-line-2)" }} />
                </span>
              );
            })}
          </div>
        ))}
      </div>
      {note && <p className="mt-[22px] max-w-[310px] text-[14px] leading-[1.55]">{note}</p>}
      <div className="pt-6">
        <PrimaryButton space="support" to="/help/corps/noter">Noter aujourd'hui</PrimaryButton>
      </div>
    </StandardLayout>
  );
}
