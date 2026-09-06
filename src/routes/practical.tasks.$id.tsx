import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato, type TaskStatus } from "@/lib/legato-state";
import { PRACTICAL_LABELS, PRACTICAL_BUCKETS, BUCKET_LABELS, type PracticalCategory } from "@/lib/journey-config";
import { TASK_STATUS_LABELS } from "@/lib/task-status";

export const Route = createFileRoute("/practical/tasks/$id")({
  component: TaskDetail,
});

const ACTIONS: { status: TaskStatus; label: string; tone?: string }[] = [
  { status: "done",          label: "Marquer fait" },
  { status: "doing",         label: "En cours" },
  { status: "delegated",     label: "Déléguer" },
  { status: "blocked",       label: "Bloqué" },
  { status: "missing_doc",   label: "Doc manquant" },
  { status: "snoozed",       label: "Reporter" },
  { status: "not_concerned", label: "Non concerné" },
  { status: "todo",          label: "Remettre à faire" },
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
          <p className="font-serif text-[20px]">Tâche introuvable.</p>
          <Link to="/practical/tasks" className="mono-label mt-4 inline-block">← Toutes les tâches</Link>
        </div>
      </Shell>
    );
  }

  const current = hydrated ? taskStatus[cat] : undefined;
  const bucket = PRACTICAL_BUCKETS[cat];

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <LegatoMark size={22} />
          <Link to="/practical/tasks" className="mono-label text-dusk/55">← Tâches</Link>
        </header>

        <section className="px-6 pt-6">
          <p className="mono-label" style={{ color: BUCKET_LABELS[bucket].tone }}>{BUCKET_LABELS[bucket].label}</p>
          <h1 className="mt-3 font-serif text-[30px] leading-[1.08]">
            {cfg.label}
          </h1>
          <p className="mt-3 text-[13.5px] text-dusk/65 leading-[1.6]">{cfg.hint}</p>
        </section>

        <section className="px-5 pt-7">
          <div className="rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4">
            <p className="mono-label">Statut actuel</p>
            <p className="mt-2 font-serif text-[18px]">{current ? TASK_STATUS_LABELS[current] : "À faire"}</p>
          </div>
        </section>

        <section className="px-5 pt-5">
          <p className="mono-label px-1">Actions</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.status}
                onClick={() => {
                  setTaskStatus(cat, a.status);
                  if (a.status === "done" || a.status === "not_concerned") {
                    setTimeout(() => navigate({ to: "/practical/tasks" }), 200);
                  }
                }}
                className={`rounded-[14px] border px-4 py-3 text-[13px] text-left transition-colors ${current === a.status ? "border-dusk/40 bg-[color:var(--sun)]" : "border-dusk/15 bg-paper hover:border-dusk/30"}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 pt-7">
          <div className="rounded-[18px] border border-dusk/12 bg-paper px-5 py-4">
            <p className="mono-label">Documents nécessaires</p>
            <p className="mt-2 text-[13px] text-dusk/65">Acte de décès, pièce d'identité, justificatif de lien. Tout au même endroit dans le coffre.</p>
            <Link to="/practical/vault" className="mono-label mt-3 inline-block" style={{ color: "var(--terracotta)" }}>
              Ouvrir le coffre →
            </Link>
          </div>
        </section>

        <section className="px-5 pt-4">
          <div className="rounded-[18px] border border-dusk/12 bg-paper px-5 py-4">
            <p className="mono-label">Confier à un proche</p>
            <p className="mt-2 text-[13px] text-dusk/65">Vous n'êtes pas obligé·e de tout porter. Quelqu'un de confiance peut prendre cette étape.</p>
            <Link to="/circle" className="mono-label mt-3 inline-block" style={{ color: "var(--terracotta)" }}>
              Voir mon cercle →
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}