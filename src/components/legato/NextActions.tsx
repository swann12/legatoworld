import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLegato } from "@/lib/legato-state";
import { useAgenda } from "@/lib/agenda-store";
import { nextActions, dismissAction, type NextAction } from "@/lib/next-actions";
import { journeyModules, PRACTICAL_LABELS } from "@/lib/journey-config";
import { isHiddenFromActive } from "@/lib/task-status";

/** Une ou deux propositions prioritaires. Reportables, ignorables, jamais culpabilisantes. */
export function NextActions() {
  const {
    currentEmotions, hydrated, lightMode, taskStatus,
    situation, primaryNeed, stage, lovedOneRelation, legallyInvolved,
  } = useLegato();
  const { events, hydrated: agendaReady } = useAgenda();
  const [actions, setActions] = useState<NextAction[]>([]);
  const [tick, setTick] = useState(0);

  const { practical } = journeyModules(situation, primaryNeed, stage, { relation: lovedOneRelation, legallyInvolved });
  const pending = practical.find((c) => !isHiddenFromActive(taskStatus[c]));

  useEffect(() => {
    if (!hydrated || !agendaReady) return;
    setActions(nextActions({
      emotions: currentEmotions,
      events,
      pendingTask: pending ? { id: pending, label: PRACTICAL_LABELS[pending].label } : null,
      lightMode,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, agendaReady, events.length, currentEmotions.join(","), pending, lightMode, tick]);

  if (!actions.length) return null;

  return (
    <section className="px-5 pt-8">
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="mono-label">Si vous ne faites qu'une chose</p>
        <Link to="/agenda" className="mono-label text-dusk/45">Agenda →</Link>
      </div>
      <div className="mt-4 space-y-3">
        {actions.map((a) => (
          <div key={a.id} className="rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4">
            <Link to={a.to as "/agenda"} className="block">
              <p className="mono-label text-dusk/55">{a.label}</p>
              <p className="mt-1.5 font-serif text-[18px] leading-[1.15]">{a.title}</p>
              <p className="mt-1 text-[12.5px] text-dusk/55">{a.hint}</p>
            </Link>
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                onClick={() => { dismissAction(a.id, 1); setTick((t) => t + 1); }}
                className="mono-label text-dusk/45"
              >
                Plus tard
              </button>
              <button
                type="button"
                onClick={() => { dismissAction(a.id, 30); setTick((t) => t + 1); }}
                className="mono-label text-dusk/45"
              >
                Ne plus proposer
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 px-1 text-[11.5px] text-dusk/45">Ne rien faire est une réponse valable.</p>
    </section>
  );
}
