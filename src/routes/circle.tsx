import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";

export const Route = createFileRoute("/circle")({
  head: () => ({
    meta: [
      { title: "Confier — Legato" },
      { name: "description", content: "Confier une tâche à une personne de confiance. Vous gardez la décision." },
    ],
  }),
  component: CirclePage,
});

type Status = "pending" | "accepted" | "done";
type Task = {
  id: string;
  what: string;          // ce qu'on confie
  who: string;           // prénom de la personne
  relation: string;      // sœur, ami…
  status: Status;
  createdAt: number;
};

const STATUS_LABEL: Record<Status, string> = {
  pending:  "En attente",
  accepted: "Acceptée",
  done:     "Terminée",
};

const SUGGESTIONS = [
  "Prévenir les proches",
  "Accueillir les fleurs",
  "Faire les courses pour la veillée",
  "Récupérer un document",
  "Coordonner les transports",
];

const KEY = "legato.circle.v2";

function load(): Task[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function persist(list: Task[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

function CirclePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [what, setWhat] = useState("");
  const [who, setWho] = useState("");
  const [relation, setRelation] = useState("");

  useEffect(() => { setTasks(load()); }, []);

  const add = () => {
    if (!what.trim() || !who.trim()) return;
    const next: Task[] = [
      ...tasks,
      { id: `t-${Date.now()}`, what: what.trim(), who: who.trim(), relation: relation.trim(), status: "pending", createdAt: Date.now() },
    ];
    setTasks(next); persist(next);
    setWhat(""); setWho(""); setRelation("");
    setOpen(false);
  };
  const cycle = (id: string) => {
    const order: Status[] = ["pending", "accepted", "done"];
    const next = tasks.map((t) =>
      t.id === id ? { ...t, status: order[(order.indexOf(t.status) + 1) % 3] } : t,
    );
    setTasks(next); persist(next);
  };
  const remove = (id: string) => {
    const next = tasks.filter((t) => t.id !== id);
    setTasks(next); persist(next);
  };

  return (
    <Shell>
      <ScreenHeader
        back={{ to: "/practical", label: "Aide concrète" }}
        eyebrow="Confier"
        title="Vous n'avez pas à tout porter."
        subtitle="Confiez une tâche à une personne de confiance. Vous gardez la décision."
      />

      <Section className="mt-10">
        {tasks.length === 0 ? (
          <p className="text-[14px] leading-[1.6] text-dusk/65 max-w-[34ch]">
            Aucune tâche confiée pour l'instant. Vous pouvez en déposer une quand vous le souhaitez.
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((t) => (
              <div key={t.id} className="surface p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="eyebrow-sm">{STATUS_LABEL[t.status]}</p>
                  <button onClick={() => remove(t.id)} className="eyebrow-sm hover:text-[color:var(--terracotta)]">Retirer</button>
                </div>
                <h3 className="mt-2 font-serif text-[17px] font-light text-dusk leading-snug">{t.what}</h3>
                <p className="mt-1.5 text-[13px] text-dusk/60">
                  Confiée à {t.who}{t.relation ? ` · ${t.relation}` : ""}
                </p>
                <button onClick={() => cycle(t.id)} className="mt-3 eyebrow-sm hover:text-dusk">
                  Marquer comme {t.status === "pending" ? "acceptée" : t.status === "accepted" ? "terminée" : "en attente"} →
                </button>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => setOpen((o) => !o)} className="mt-6 w-full btn-primary py-4">
          {open ? "Annuler" : "Confier une tâche"}
        </button>

        {open && (
          <div className="mt-5 surface p-5 space-y-5">
            <label className="block">
              <span className="eyebrow-sm">Ce que vous confiez</span>
              <input
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder="Prévenir les proches…"
                className="mt-2 w-full bg-transparent border-b border-dusk/15 pb-2 text-[15px] text-dusk outline-none focus:border-dusk/40"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setWhat(s)}
                    className="px-3 py-1.5 rounded-full border border-dusk/15 text-[12px] text-dusk/70 hover:bg-dusk/[0.02] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </label>
            <label className="block">
              <span className="eyebrow-sm">À qui</span>
              <input value={who} onChange={(e) => setWho(e.target.value)} placeholder="Marie"
                className="mt-2 w-full bg-transparent border-b border-dusk/15 pb-2 text-[17px] text-dusk outline-none focus:border-dusk/40" />
            </label>
            <label className="block">
              <span className="eyebrow-sm">Relation (facultatif)</span>
              <input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Ma sœur, un ami…"
                className="mt-2 w-full bg-transparent border-b border-dusk/15 pb-2 text-[15px] text-dusk outline-none focus:border-dusk/40" />
            </label>
            <button onClick={add} disabled={!what.trim() || !who.trim()} className="w-full btn-primary py-3 disabled:opacity-50">
              Déposer la tâche
            </button>
          </div>
        )}
      </Section>

      <Section className="mt-12 mb-10">
        <p className="text-[13px] text-dusk/55 max-w-[34ch] leading-relaxed">
          Legato ne contacte personne à votre place. C'est une mémoire douce de ce que vous avez choisi de confier.
        </p>
      </Section>
    </Shell>
  );
}
