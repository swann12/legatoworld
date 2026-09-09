import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead, Tabs } from "@/components/legato/EditorialUI";
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
      { property: "og:title", content: "Démarches — Legato" },
      { property: "og:description", content: "Une étape à la fois, dans l'ordre qui compte." },
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
  const pct = all.length ? Math.round((doneCount / all.length) * 100) : 0;

  const groups = ORDER.map((b) => ({ bucket: b, items: shown.filter((c) => PRACTICAL_BUCKETS[c] === b) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-36">
        <PageHeader back="/practical" title="DÉMARCHES" />

        <section className="px-6 pt-2">
          <h1 className="ed-page-title text-[30px]">
            <span className="italic" style={{ color: "var(--terracotta)" }}>Une étape</span> à la fois.
          </h1>
        </section>

        {/* Avancement — un seul chiffre, une seule barre */}
        {all.length > 0 && (
          <section className="px-5 pt-7">
            <div className="craft px-5 pt-5 pb-5">
              <div className="flex items-baseline justify-between">
                <p className="font-serif text-[42px] leading-none tabular-nums">{pct}%</p>
                <p className="text-[12px] tabular-nums tracking-[0.08em] text-dusk/50">
                  {doneCount} / {all.length} terminées
                </p>
              </div>
              <div className="mt-4 h-[6px] w-full overflow-hidden rounded-full" style={{ background: "color-mix(in oklab, var(--dusk) 10%, transparent)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--terracotta)" }} />
              </div>
            </div>
          </section>
        )}

        {!light && (
          <section className="px-6 pt-7">
            <Tabs
              value={view}
              onChange={setView}
              options={[
                { id: "active" as View, label: "À faire" },
                { id: "archived" as View, label: "Terminées" },
              ]}
            />
          </section>
        )}

        {groups.length === 0 && (
          <p className="mx-5 mt-8 craft px-5 py-6 text-center text-[13px] italic text-dusk/55">Rien ici pour le moment.</p>
        )}

        {groups.map((g) => (
          <section key={g.bucket} className="px-5 pt-9">
            <SectionHead label={BUCKET_LABELS[g.bucket].label} meta={String(g.items.length).padStart(2, "0")} />

            <ul className="surf-cream mt-3 rounded-[18px] px-5">
              {g.items.map((c, i) => {
                const cfg = PRACTICAL_LABELS[c];
                const st = hydrated ? taskStatus[c] : undefined;
                const done = st === "done";
                return (
                  <li
                    key={c}
                    className="border-b border-dashed last:border-0"
                    style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
                  >
                    <Link
                      to="/practical/tasks/$id"
                      params={{ id: c }}
                      className="flex items-start gap-4 py-4 transition-opacity active:opacity-70"
                    >
                      {/* Puce d'état — vide, en cours, faite */}
                      <span
                        aria-hidden
                        className="mt-[5px] grid size-[16px] shrink-0 place-items-center rounded-full"
                        style={{
                          border: done ? "none" : "1px solid color-mix(in oklab, var(--dusk) 28%, transparent)",
                          background: done ? "var(--terracotta)" : "transparent",
                        }}
                      >
                        {done && <span className="block text-[9px] leading-none" style={{ color: "var(--paper)" }}>✓</span>}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className="block font-serif text-[17.5px] leading-[1.2]"
                          style={{ opacity: done ? 0.5 : 1 }}
                        >
                          {cfg.label}
                        </span>
                        <span className="mt-1 block truncate text-[12.5px] surf-sub">
                          {st && st !== "todo" ? TASK_STATUS_LABELS[st] : cfg.hint}
                        </span>
                      </span>
                      <span className="shrink-0 self-start pt-[5px] text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
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
