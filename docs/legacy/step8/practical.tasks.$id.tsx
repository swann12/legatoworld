import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead } from "@/components/legato/EditorialUI";
import { useLegato, type TaskStatus } from "@/lib/legato-state";
import { PRACTICAL_LABELS, PRACTICAL_BUCKETS, BUCKET_LABELS, type PracticalCategory } from "@/lib/journey-config";
import { TASK_STATUS_LABELS } from "@/lib/task-status";
import { taskGuide } from "@/lib/task-guides";
import { loadTaskSteps, toggleTaskStep } from "@/lib/task-steps";

export const Route = createFileRoute("/practical/tasks/$id")({
  component: TaskDetail,
});

const SECONDARY: { status: TaskStatus; label: string }[] = [
  { status: "doing", label: "En cours" },
  { status: "delegated", label: "Confié à quelqu'un" },
  { status: "missing_doc", label: "Document manquant" },
  { status: "snoozed", label: "Plus tard" },
  { status: "not_concerned", label: "Pas concerné·e" },
];

function TaskDetail() {
  const { id } = Route.useParams();
  const cat = id as PracticalCategory;
  const cfg = PRACTICAL_LABELS[cat];
  const { taskStatus, setTaskStatus, hydrated } = useLegato();
  const navigate = useNavigate();
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => setChecked(loadTaskSteps(id)), [id]);

  if (!cfg) {
    return (
      <Shell livingBg={false}>
        <div className="wash-butter min-h-dvh text-dusk p-6">
          <p className="font-serif text-[20px]">Démarche introuvable.</p>
          <Link to="/practical/tasks" className="mono-label mt-4 inline-block">← Toutes les démarches</Link>
        </div>
      </Shell>
    );
  }

  const current = hydrated ? taskStatus[cat] : undefined;
  const bucket = PRACTICAL_BUCKETS[cat];
  const guide = taskGuide(cat);
  const done = current === "done";
  const stepsDone = checked.length;

  return (
    <Shell livingBg={false}>
      <div className="wash-butter min-h-dvh text-dusk pb-36">
        <PageHeader back="/practical/tasks" title="DÉMARCHE" />

        {/* Intention — un seul bloc de tête */}
        <section className="px-6 pt-2">
          <p className="mono-label" style={{ color: BUCKET_LABELS[bucket].tone }}>
            {BUCKET_LABELS[bucket].label}
          </p>
          <h1 className="mt-3 font-serif text-[30px] leading-[1.08]">{cfg.label}</h1>
          <p className="mt-4 max-w-[32ch] text-[13.5px] leading-[1.6] text-dusk/65">{guide.why}</p>
        </section>

        {/* En bref — chaque repère sur sa ligne, l'œil descend */}
        <section className="px-5 pt-7">
          <dl className="craft px-5 py-1">
            {[
              { k: "À qui s'adresser", v: guide.who },
              { k: "Dans quel délai", v: guide.when },
              { k: "Étapes", v: `${stepsDone} faite${stepsDone > 1 ? "s" : ""} sur ${guide.steps.length}` },
            ].map((c, i) => (
              <div
                key={c.k}
                className="flex flex-col gap-1 py-3.5"
                style={{
                  borderBottom: i < 2 ? "1px dashed color-mix(in oklab, var(--dusk) 18%, transparent)" : undefined,
                }}
              >
                <dt className="mono-label">{c.k}</dt>
                <dd className="text-[14px] leading-[1.5]">{c.v}</dd>
              </div>
            ))}
          </dl>
        </section>


        {/* Les étapes — cochables, l'œil suit une seule colonne */}
        <section className="px-5 pt-9">
          <SectionHead label="Ce qu'il y a à faire" meta={`${stepsDone} / ${guide.steps.length}`} />
          <ul className="tint-butter mt-3 rounded-[18px] px-5">
            {guide.steps.map((s, i) => {
              const on = checked.includes(i);
              return (
                <li
                  key={s}
                  className="border-b border-dashed last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
                >
                  <button
                    type="button"
                    onClick={() => setChecked(toggleTaskStep(id, i))}
                    aria-pressed={on}
                    className="flex w-full items-start gap-4 py-4 text-left"
                  >
                    <span
                      aria-hidden
                      className="mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-full"
                      style={{
                        border: on ? "none" : "1px solid color-mix(in oklab, var(--dusk) 28%, transparent)",
                        background: on ? "var(--terracotta)" : "transparent",
                      }}
                    >
                      {on && <span className="text-[10px] leading-none" style={{ color: "var(--paper)" }}>✓</span>}
                    </span>
                    <span
                      className="flex-1 text-[14px] leading-[1.5]"
                      style={{ opacity: on ? 0.45 : 1, textDecoration: on ? "line-through" : undefined }}
                    >
                      {s}
                    </span>
                    <span className="shrink-0 pt-[2px] text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Documents */}
        {guide.docs.length > 0 && (
          <section className="px-5 pt-9">
            <SectionHead label="À avoir sous la main" meta={String(guide.docs.length).padStart(2, "0")} />
            <ul className="craft mt-3 px-5 py-4 space-y-2.5">
              {guide.docs.map((d) => (
                <li key={d} className="flex items-baseline gap-3 text-[13.5px] leading-[1.45]">
                  <span aria-hidden className="mt-[7px] h-px w-3 shrink-0" style={{ background: "var(--terracotta)" }} />
                  {d}
                </li>
              ))}
            </ul>
            <Link to="/practical/vault" className="mono-label mt-3 inline-block px-1" style={{ color: "var(--terracotta)" }}>
              Ouvrir le coffre →
            </Link>
          </section>
        )}

        {/* Où j'en suis */}
        <section className="px-5 pt-10">
          <SectionHead label="Où j'en suis" meta={current ? TASK_STATUS_LABELS[current] : "À faire"} />

          <button
            onClick={() => {
              setTaskStatus(cat, done ? "todo" : "done");
              if (!done) setTimeout(() => navigate({ to: "/practical/tasks" }), 250);
            }}
            className="mt-4 w-full rounded-[18px] px-5 py-4 text-[14px] tracking-[0.03em] transition-opacity active:opacity-80"
            style={
              done
                ? { background: "transparent", color: "var(--dusk)", border: "1px dashed color-mix(in oklab, var(--dusk) 25%, transparent)" }
                : { background: "var(--terracotta)", color: "var(--paper)" }
            }
          >
            {done ? "Remettre à faire" : "C'est fait"}
          </button>

          <div className="mt-3 flex flex-wrap gap-2">
            {SECONDARY.map((a) => (
              <button
                key={a.status}
                onClick={() => {
                  setTaskStatus(cat, a.status);
                  if (a.status === "not_concerned") setTimeout(() => navigate({ to: "/practical/tasks" }), 250);
                }}
                className="rounded-full px-3.5 py-2 text-[12.5px] transition-colors"
                style={{
                  border: "1px solid color-mix(in oklab, var(--dusk) 14%, transparent)",
                  background: current === a.status ? "var(--whisper)" : "transparent",
                  color: current === a.status ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 60%, transparent)",
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </section>

        {/* Déléguer */}
        <section className="px-5 pt-9">
          <Link to="/circle" className="craft flex items-center justify-between gap-4 px-5 py-4">
            <span>
              <span className="block font-serif text-[17px] leading-[1.2]">Confier cette étape</span>
              <span className="mt-1 block text-[12.5px] text-dusk/55">Quelqu'un de confiance peut la porter.</span>
            </span>
            <span aria-hidden className="text-dusk/35">→</span>
          </Link>
        </section>
      </div>
    </Shell>
  );
}
