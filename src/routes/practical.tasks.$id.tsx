import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato, type TaskStatus } from "@/lib/legato-state";
import { PRACTICAL_LABELS, PRACTICAL_BUCKETS, BUCKET_LABELS, type PracticalCategory } from "@/lib/journey-config";
import { TASK_STATUS_LABELS } from "@/lib/task-status";
import { taskGuide } from "@/lib/task-guides";

export const Route = createFileRoute("/practical/tasks/$id")({
  component: TaskDetail,
});

/** Statuts secondaires — l'action principale reste « Marquer fait ». */
const SECONDARY: { status: TaskStatus; label: string }[] = [
  { status: "doing", label: "En cours" },
  { status: "delegated", label: "Confié à quelqu'un" },
  { status: "missing_doc", label: "Il me manque un document" },
  { status: "snoozed", label: "Plus tard" },
  { status: "not_concerned", label: "Pas concerné·e" },
];

function TaskDetail() {
  const { id } = Route.useParams();
  const cat = id as PracticalCategory;
  const cfg = PRACTICAL_LABELS[cat];
  const { taskStatus, setTaskStatus, hydrated } = useLegato();
  const navigate = useNavigate();

  if (!cfg) {
    return (
      <Shell livingBg={false}>
        <div className="min-h-dvh bg-paper text-dusk p-6">
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

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-36">
        <header className="px-6 pt-7 flex items-center justify-between">
          <Link to="/practical/tasks" className="mono-label text-dusk/55">← Démarches</Link>
          <LegatoMark size={22} />
        </header>

        {/* Intention */}
        <section className="px-6 pt-8">
          <p className="mono-label" style={{ color: BUCKET_LABELS[bucket].tone }}>
            {BUCKET_LABELS[bucket].label}
          </p>
          <h1 className="mt-3 font-serif text-[30px] leading-[1.08]">{cfg.label}</h1>
          <p className="mt-3 max-w-[34ch] text-[13.5px] leading-[1.6] text-dusk/65">{guide.why}</p>
        </section>

        {/* L'essentiel : à qui, quand */}
        <section className="px-5 pt-7">
          <div className="craft grid grid-cols-2 divide-x divide-dashed" style={{ borderColor: "color-mix(in oklab, var(--dusk) 22%, transparent)" }}>
            <div className="px-5 py-4">
              <p className="mono-label">À qui</p>
              <p className="mt-1.5 font-serif text-[16px] leading-[1.2]">{guide.who}</p>
            </div>
            <div className="px-5 py-4" style={{ borderColor: "color-mix(in oklab, var(--dusk) 22%, transparent)" }}>
              <p className="mono-label">Quand</p>
              <p className="mt-1.5 font-serif text-[16px] leading-[1.2]">{guide.when}</p>
            </div>
          </div>
        </section>

        {/* Les étapes */}
        <section className="px-5 pt-8">
          <p className="mono-label px-1">Ce qu'il y a à faire</p>
          <ol className="surf-cream mt-3 rounded-[18px] px-5 py-2">
            {guide.steps.map((s, i) => (
              <li
                key={s}
                className="flex gap-4 border-b border-dashed py-4 last:border-0"
                style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
              >
                <span className="mt-[3px] shrink-0 text-[11px] tabular-nums tracking-[0.1em] surf-sub">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] leading-[1.5]">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Ce qu'il faut avoir */}
        {guide.docs.length > 0 && (
          <section className="px-5 pt-6">
            <p className="mono-label px-1">À avoir sous la main</p>
            <ul className="craft mt-3 px-5 py-4 space-y-2">
              {guide.docs.map((d) => (
                <li key={d} className="flex items-baseline gap-3 text-[13.5px]">
                  <span aria-hidden className="h-px w-3 shrink-0 translate-y-[-3px]" style={{ background: "var(--terracotta)" }} />
                  {d}
                </li>
              ))}
            </ul>
            <Link to="/practical/vault" className="mono-label mt-3 inline-block px-1" style={{ color: "var(--terracotta)" }}>
              Ouvrir le coffre →
            </Link>
          </section>
        )}

        {/* Où en suis-je */}
        <section className="px-5 pt-9">
          <p className="mono-label px-1">Où j'en suis</p>
          <p className="mt-2 px-1 font-serif text-[18px]">{current ? TASK_STATUS_LABELS[current] : "À faire"}</p>

          <button
            onClick={() => {
              setTaskStatus(cat, done ? "todo" : "done");
              if (!done) setTimeout(() => navigate({ to: "/practical/tasks" }), 250);
            }}
            className="mt-4 w-full rounded-[16px] px-5 py-4 text-[14px] tracking-[0.03em] transition-opacity active:opacity-80"
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
                  border: "1px solid color-mix(in oklab, var(--dusk) 15%, transparent)",
                  background: current === a.status ? "var(--whisper)" : "transparent",
                  color: current === a.status ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 62%, transparent)",
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </section>

        {/* Déléguer */}
        <section className="px-5 pt-8">
          <Link to="/circle" className="craft flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="font-serif text-[17px] leading-[1.2]">Confier cette étape</p>
              <p className="mt-1 text-[12.5px] text-dusk/55">Quelqu'un de confiance peut la porter à votre place.</p>
            </div>
            <span className="text-dusk/35">→</span>
          </Link>
        </section>
      </div>
    </Shell>
  );
}
