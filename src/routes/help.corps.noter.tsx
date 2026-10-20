import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { StandardLayout, PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";
import { GESTES, dayKey, loadSuivi, saveSuivi, type Geste, type Suivi } from "@/lib/corps-suivi";
import { legatoHead } from "@/lib/legato-head";

/** D024 · Le corps · noter aujourd'hui */
export const Route = createFileRoute("/help/corps/noter")({
  head: () => legatoHead("Noter aujourd'hui", "Touchez ce qui est vrai aujourd'hui. Rien n'est obligatoire."),
  component: Noter,
});

const LABELS: Record<Geste, string> = { dormi: "Dormi", mange: "Mangé", lave: "Pris une douche", sorti: "Pris l'air" };

function Noter() {
  const navigate = useNavigate();
  const [s, setS] = useState<Suivi>({});
  const [today, setToday] = useState("");
  useEffect(() => { setS(loadSuivi()); setToday(dayKey(new Date())); }, []);
  const toggle = (g: Geste) => setS((prev) => ({ ...prev, [today]: { ...prev[today], [g]: !prev[today]?.[g] } }));
  const save = () => { saveSuivi(s); navigate({ to: "/help/corps/suivi" }); };

  return (
    <StandardLayout space="support" back="/help/corps/suivi" backLabel="Votre petit suivi" activeTab="/care">
      <PageTitle space="support" className="pt-8">Aujourd'hui,<br /><em>vous avez…</em></PageTitle>
      <Lead space="support" className="mt-3 max-w-[310px]">Touchez ce qui est vrai. Rien n'est obligatoire.</Lead>
      <div className="mt-6">
        {GESTES.map((g, i) => {
          const on = !!s[today]?.[g.id];
          return (
            <button key={g.id} type="button" onClick={() => toggle(g.id)} aria-pressed={on}
              className="flex w-full items-center gap-[14px] py-4 text-left"
              style={{ borderBottom: i === GESTES.length - 1 ? "none" : "1px solid var(--sp-line)" }}>
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-md"
                style={on ? { background: "var(--lg-deep)" } : { border: "1px solid var(--sp-line-2)" }}>
                {on && <Check className="size-3" strokeWidth={1.8} style={{ color: "var(--lg-mint)" }} />}
              </span>
              <span style={{ fontFamily: "var(--lg-serif)", fontSize: 19 }}>{LABELS[g.id]}</span>
            </button>
          );
        })}
      </div>
      <div className="pt-6">
        <PrimaryButton space="support" onClick={save} full>Enregistrer</PrimaryButton>
      </div>
    </StandardLayout>
  );
}
