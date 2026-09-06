import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato } from "@/lib/legato-state";
import { journeyModules, PRACTICAL_LABELS, type PracticalCategory } from "@/lib/journey-config";
import { TASK_STATUS_LABELS, isHiddenFromActive, isArchived } from "@/lib/task-status";

export const Route = createFileRoute("/practical/tasks")({
  head: () => ({
    meta: [
      { title: "Tâches — Démarches" },
      { name: "description", content: "Toutes vos démarches, filtrables par statut." },
    ],
  }),
  component: TasksList,
});

type View = "active" | "archived" | "all";

function TasksList() {
  const { situation, primaryNeed, stage, lovedOneRelation, legallyInvolved, hydrated, taskStatus } = useLegato();
  const { practical } = journeyModules(situation, primaryNeed, stage, { relation: lovedOneRelation, legallyInvolved });
  const [view, setView] = useState<View>("active");

  const all: PracticalCategory[] = practical.length ? practical : hydrated && situation ? [] : (Object.keys(PRACTICAL_LABELS) as PracticalCategory[]);
  const filtered = all.filter((c) => {
    const st = hydrated ? taskStatus[c] : undefined;
    if (view === "active") return !isHiddenFromActive(st);
    if (view === "archived") return isArchived(st);
    return true;
  });

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <LegatoMark size={22} />
          <Link to="/practical" className="mono-label text-dusk/55">← Aujourd'hui</Link>
        </header>
        <section className="px-6 pt-6">
          <p className="mono-label">Toutes les démarches</p>
          <h1 className="mt-3 font-serif text-[28px] leading-[1.1]">
            <span className="italic" style={{ color: "var(--terracotta)" }}>Une étape</span> à la fois
          </h1>
          <p className="mt-4 text-[13px] leading-[1.55] text-dusk/60 max-w-[34ch]">
            Ici, ce sont les actions concrètes. La page Démarches sert à voir l'ensemble et choisir le bon moment.
          </p>
        </section>

        <section className="px-5 pt-5">
          <div className="flex gap-2">
            {(["active", "archived", "all"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full border px-3.5 py-1.5 text-[12px] transition-colors ${view === v ? "border-dusk/40 bg-[color:var(--whisper)] text-dusk" : "border-dusk/15 bg-paper text-dusk/60"}`}
              >
                {v === "active" ? "Actives" : v === "archived" ? "Archivées" : "Toutes"}
              </button>
            ))}
          </div>
        </section>

        <ul className="mx-5 mt-5 space-y-3">
          {filtered.length === 0 && (
            <li className="rounded-[18px] border border-dusk/10 bg-paper px-5 py-6 text-center text-[13px] text-dusk/55 italic">Rien à montrer ici.</li>
          )}
          {filtered.map((c) => {
            const cfg = PRACTICAL_LABELS[c];
            const st = hydrated ? taskStatus[c] : undefined;
            return (
              <li key={c}>
                <Link
                  to="/practical/tasks/$id"
                  params={{ id: c }}
                  className="flex items-center justify-between gap-3 rounded-[18px] border border-dusk/10 px-5 py-4 transition-transform active:scale-[0.99]"
                  style={{ background: ["var(--whisper)", "var(--sun)", "var(--blush)", "color-mix(in oklab, var(--sky) 40%, var(--paper))"][all.indexOf(c) % 4] }}
                >
                  <div className="min-w-0">
                    <p className="font-serif text-[17px] leading-[1.15]">{cfg.label}</p>
                    <p className="mt-1 text-[11.5px] uppercase tracking-[0.1em] text-dusk/45">{cfg.hint}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-dusk/15 px-2.5 py-1 text-[10.5px] uppercase tracking-[0.08em] text-dusk/65">
                    {st ? TASK_STATUS_LABELS[st] : "À faire"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Shell>
  );
}