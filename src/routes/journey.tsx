import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import {
  CATEGORY_LABEL, STATUS_LABEL, loadJourney, deadlineChip,
  type JourneyTask, type TaskStatus,
} from "@/lib/journey-store";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Mon parcours — Legato" },
      { name: "description", content: "Toutes vos étapes : à faire, en cours, déléguées, terminées." },
    ],
  }),
  component: JourneyPage,
});

const FILTERS: { id: "all" | TaskStatus; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "todo", label: "À faire" },
  { id: "progress", label: "En cours" },
  { id: "delegated", label: "Délégué" },
  { id: "waiting", label: "En attente" },
  { id: "done", label: "Terminé" },
];

const STATUS_DOT: Record<TaskStatus, string> = {
  todo: "status-dot-todo",
  progress: "status-dot-progress",
  delegated: "status-dot-delegated",
  waiting: "status-dot-waiting",
  done: "status-dot-done",
};

function JourneyPage() {
  const [tasks, setTasks] = useState<JourneyTask[]>([]);
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");

  useEffect(() => {
    setTasks(loadJourney());
    const onChange = () => setTasks(loadJourney());
    window.addEventListener("legato:journey-change", onChange);
    return () => window.removeEventListener("legato:journey-change", onChange);
  }, []);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? tasks.filter((t) => t.status !== "done")
        : tasks.filter((t) => t.status === filter),
    [tasks, filter],
  );
  const done = tasks.filter((t) => t.status === "done");

  return (
    <Shell space="organize">
      <ScreenHeader
        back={{ to: "/plan", label: "Accueil" }}
        title="Mon parcours."
        subtitle="Toutes vos étapes, dans un seul endroit. Vous pouvez filtrer pour ne voir que ce qui vous concerne maintenant."
      />

      <Section className="mt-8">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className="chip-organize"
            >
              {f.label}
            </button>
          ))}
        </div>
      </Section>

      <Section className="mt-8 space-y-2.5">
        {filtered.length === 0 ? (
          <p className="text-[13px] text-dusk/55 italic">Rien à afficher pour ce filtre.</p>
        ) : (
          filtered.map((t) => <TaskRow key={t.id} t={t} />)
        )}
      </Section>

      {filter === "all" && done.length > 0 && (
        <Section className="mt-10">
          <details className="group">
            <summary className="cursor-pointer list-none flex items-baseline justify-between border-t border-dusk/15 pt-4">
              <span className="eyebrow">Historique · {done.length} terminée{done.length > 1 ? "s" : ""}</span>
              <span className="text-dusk/40 text-sm group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="mt-3 space-y-2.5">
              {done.map((t) => <TaskRow key={t.id} t={t} muted />)}
            </div>
          </details>
        </Section>
      )}

      <Section className="mt-12 mb-6 text-center">
        <p className="font-serif italic text-[14px] text-dusk/55">
          « Une seule chose à la fois. »
        </p>
      </Section>
    </Shell>
  );
}

function TaskRow({ t, muted = false }: { t: JourneyTask; muted?: boolean }) {
  const dl = deadlineChip(t.deadline);
  return (
    <Link
      to="/journey/$taskId"
      params={{ taskId: t.id }}
      className={`surface block p-5 flex items-start gap-4 hover:bg-dusk/[0.03] transition-colors ${muted ? "opacity-60" : ""}`}
    >
      <span className={`status-dot ${STATUS_DOT[t.status]} mt-2`} aria-hidden />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <p
            className="text-[10px] uppercase tracking-[0.20em] text-dusk/55 truncate"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {STATUS_LABEL[t.status]} · {CATEGORY_LABEL[t.category]}
          </p>
          {dl && t.status !== "done" && (
            <span
              className={`text-[10px] uppercase tracking-[0.18em] shrink-0 ${
                dl.tone === "alert" ? "text-[color:var(--tomato)]" :
                dl.tone === "warn"  ? "text-[color:var(--oven)]"   :
                "text-dusk/50"
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {dl.text}
            </span>
          )}
        </div>
        <h3 className={`mt-2 text-[16px] leading-snug ${t.status === "done" ? "text-dusk/55 line-through" : "text-dusk"}`}>
          {t.title}
        </h3>
        {t.status === "delegated" && t.delegatedTo && (
          <p className="mt-1.5 text-[12.5px] text-dusk/55">
            Confiée à {t.delegatedTo}
          </p>
        )}
        {t.documentsNeeded.length > 0 && t.status !== "done" && (
          <p className="mt-1.5 text-[12px] text-dusk/55">
            {t.documentsNeeded.length} document{t.documentsNeeded.length > 1 ? "s" : ""} à préparer
          </p>
        )}
      </div>
      <span className="text-dusk/40 shrink-0 mt-1">→</span>
    </Link>
  );
}