import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import {
  CATEGORY_LABEL, STATUS_LABEL, loadJourney, updateTask, deadlineChip,
  type JourneyTask, type TaskStatus,
} from "@/lib/journey-store";

export const Route = createFileRoute("/journey/$taskId")({
  head: () => ({
    meta: [{ title: "Étape — Legato" }],
  }),
  component: TaskDetail,
});

const STATUSES: TaskStatus[] = ["todo", "progress", "delegated", "waiting", "done"];

function TaskDetail() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<JourneyTask | null>(null);
  const [docDone, setDocDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = loadJourney().find((x) => x.id === taskId) ?? null;
    setTask(t);
  }, [taskId]);

  if (!task) {
    return (
      <Shell space="organize">
        <ScreenHeader
          back={{ to: "/journey", label: "Parcours" }}
          title="Étape introuvable."
        />
        <Section className="mt-6">
          <Link to="/journey" className="btn-primary inline-block">Retour au parcours</Link>
        </Section>
      </Shell>
    );
  }

  const setStatus = (s: TaskStatus) => {
    updateTask(task.id, { status: s });
    setTask({ ...task, status: s });
  };

  const dl = deadlineChip(task.deadline);

  return (
    <Shell space="organize">
      <ScreenHeader
        back={{ to: "/journey", label: "Parcours" }}
        eyebrow={CATEGORY_LABEL[task.category]}
        title={task.title}
      />

      {/* 02 — Pourquoi */}
      <Section className="mt-8">
        <p
          className="text-[10px] uppercase tracking-[0.22em] text-dusk/55"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          02 — Pourquoi
        </p>
        <p className="mt-3 text-[14.5px] leading-[1.6] text-dusk/75 max-w-[44ch]">
          {task.why}
        </p>
      </Section>

      {/* 03 — Quand */}
      {dl && (
        <Section className="mt-8">
          <p
            className="text-[10px] uppercase tracking-[0.22em] text-dusk/55"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            03 — Quand
          </p>
          <div
            className="mt-3 rounded-[10px] px-5 py-4 flex items-baseline justify-between"
            style={{
              background: "color-mix(in oklab, var(--sardine) 18%, var(--paper))",
              border: "1px solid color-mix(in oklab, var(--sardine) 45%, transparent)",
            }}
          >
            <span className="text-[14px] text-dusk">{task.deadline}</span>
            <span
              className={`text-[11px] uppercase tracking-[0.18em] ${
                dl.tone === "alert" ? "text-[color:var(--tomato)]" : "text-dusk/70"
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {dl.text}
            </span>
          </div>
        </Section>
      )}

      {/* 04 — Préparer */}
      {task.documentsNeeded.length > 0 && (
        <Section className="mt-8">
          <p
            className="text-[10px] uppercase tracking-[0.22em] text-dusk/55"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            04 — Ce qu'il faut préparer
          </p>
          <ul className="mt-3 space-y-2">
            {task.documentsNeeded.map((d) => {
              const checked = !!docDone[d];
              return (
                <li key={d}>
                  <button
                    onClick={() => setDocDone((p) => ({ ...p, [d]: !p[d] }))}
                    className="w-full flex items-center gap-3 surface px-4 py-3 text-left hover:bg-dusk/[0.03] transition-colors"
                  >
                    <span
                      className={`size-4 rounded-[4px] border transition-colors ${
                        checked ? "bg-dusk border-dusk" : "border-dusk/30"
                      }`}
                    />
                    <span className={`text-[14px] ${checked ? "text-dusk/55 line-through" : "text-dusk"}`}>
                      {d}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* 05 — Avancer */}
      <Section className="mt-8">
        <p
          className="text-[10px] uppercase tracking-[0.22em] text-dusk/55"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          05 — Comment avancer
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { label: "Téléphoner", to: "/resources" as const },
            { label: "Écrire un e-mail", to: "/resources" as const },
            { label: "Trouver un pro", to: "/resources" as const },
            { label: "Déléguer", to: "/circle" as const },
            { label: "Préparer un message", to: "/presence" as const },
            { label: "Ajouter un rendez-vous", to: "/dates" as const },
          ].map((a) => (
            <Link key={a.label} to={a.to} className="chip-organize text-center">
              {a.label}
            </Link>
          ))}
        </div>
      </Section>

      {/* 06 — Suivi */}
      <Section className="mt-8">
        <p
          className="text-[10px] uppercase tracking-[0.22em] text-dusk/55"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          06 — Suivi
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              aria-pressed={task.status === s}
              className="chip-organize"
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        {task.status === "delegated" && task.delegatedTo && (
          <p className="mt-3 text-[13px] text-dusk/65">
            Confiée à <span className="text-dusk">{task.delegatedTo}</span>
            {task.delegatedAt && (
              <> · depuis le {task.delegatedAt.slice(8, 10)}/{task.delegatedAt.slice(5, 7)}</>
            )}
          </p>
        )}
      </Section>

      {/* CTA collant */}
      <Section className="mt-10 mb-10">
        <button
          onClick={() => {
            setStatus(task.status === "done" ? "todo" : "done");
            if (task.status !== "done") navigate({ to: "/journey" });
          }}
          className="btn-organize-primary w-full"
        >
          {task.status === "done" ? "Reprendre cette étape" : "Marquer comme terminée"}
        </button>
      </Section>
    </Shell>
  );
}