import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato } from "@/lib/legato-state";
import {
  journeyModules,
  PRACTICAL_LABELS,
  PRACTICAL_BUCKETS,
  BUCKET_LABELS,
  type PracticalBucket,
  type PracticalCategory,
} from "@/lib/journey-config";
import { TASK_STATUS_LABELS, isHiddenFromActive, isArchived } from "@/lib/task-status";

export const Route = createFileRoute("/practical/tasks/")({
  head: () => ({
    meta: [
      { title: "Démarches — Legato" },
      { name: "description", content: "Vos démarches, une étape à la fois, classées par urgence." },
    ],
  }),
  component: TasksList,
});

type View = "active" | "archived";
const ORDER: PracticalBucket[] = ["now", "week", "month", "later"];

function TasksList() {
  const { situation, primaryNeed, stage, lovedOneRelation, legallyInvolved, hydrated, taskStatus, lightMode } = useLegato();
  const light = hydrated && lightMode;
  const { practical } = journeyModules(situation, primaryNeed, stage, { relation: lovedOneRelation, legallyInvolved });
  const [view, setView] = useState<View>("active");

  const all: PracticalCategory[] =
    practical.length ? practical : hydrated && situation ? [] : (Object.keys(PRACTICAL_LABELS) as PracticalCategory[]);

  const filtered = all.filter((c) => {
    const st = hydrated ? taskStatus[c] : undefined;
    return view === "active" ? !isHiddenFromActive(st) : isArchived(st);
  });
  const shown = light ? filtered.slice(0, 3) : filtered;

  const doneCount = all.filter((c) => taskStatus[c] === "done").length;

  const groups = ORDER.map((b) => ({ bucket: b, items: shown.filter((c) => PRACTICAL_BUCKETS[c] === b) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-36">
        <header className="px-6 pt-7 flex items-center justify-between">
          <Link to="/practical" className="mono-label text-dusk/55">← Aujourd'hui</Link>
          <LegatoMark size={22} />
        </header>

        <section className="px-6 pt-8">
          <p className="mono-label">Démarches</p>
          <h1 className="mt-3 ed-page-title">
            <span className="italic" style={{ color: "var(--terracotta)" }}>Une étape</span> à la fois
          </h1>
          {all.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "color-mix(in oklab, var(--dusk) 14%, transparent)" }}>
                <div className="h-px" style={{ width: `${(doneCount / all.length) * 100}%`, background: "var(--terracotta)" }} />
              </div>
              <span className="text-[11.5px] tabular-nums tracking-[0.1em] text-dusk/50">
                {doneCount} / {all.length}
              </span>
            </div>
          )}
        </section>

        {!light && (
          <section className="px-6 pt-6">
            <div className="flex gap-5">
              {(["active", "archived"] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="pb-1 text-[12.5px] tracking-[0.06em] transition-colors"
                  style={{
                    color: view === v ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 45%, transparent)",
                    borderBottom: view === v ? "1px solid var(--terracotta)" : "1px solid transparent",
                  }}
                >
                  {v === "active" ? "À faire" : "Terminées"}
                </button>
              ))}
            </div>
          </section>
        )}

        {groups.length === 0 && (
          <p className="mx-6 mt-8 craft px-5 py-6 text-center text-[13px] italic text-dusk/55">Rien ici pour le moment.</p>
        )}

        {groups.map((g) => (
          <section key={g.bucket} className="px-5 pt-8">
            <div className="flex items-baseline justify-between px-1">
              <p className="mono-label" style={{ color: BUCKET_LABELS[g.bucket].tone }}>
                {BUCKET_LABELS[g.bucket].label}
              </p>
              <span className="text-[11px] tabular-nums text-dusk/40">{g.items.length}</span>
            </div>

            <ul className="surf-cream mt-3 rounded-[18px] px-5">
              {g.items.map((c) => {
                const cfg = PRACTICAL_LABELS[c];
                const st = hydrated ? taskStatus[c] : undefined;
                return (
                  <li
                    key={c}
                    className="border-b border-dashed last:border-0"
                    style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
                  >
                    <Link
                      to="/practical/tasks/$id"
                      params={{ id: c }}
                      className="flex items-center justify-between gap-4 py-4 transition-opacity active:opacity-70"
                    >
                      <div className="min-w-0">
                        <p className="font-serif text-[17px] leading-[1.15]">{cfg.label}</p>
                        <p className="mt-0.5 truncate text-[12.5px] surf-sub">
                          {st && st !== "todo" ? TASK_STATUS_LABELS[st] : cfg.hint}
                        </p>
                      </div>
                      <span className="text-dusk/30">→</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </Shell>
  );
}
