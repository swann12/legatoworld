import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";

export const Route = createFileRoute("/parcours")({
  head: () => ({
    meta: [
      { title: "Mon parcours — Legato" },
      { name: "description", content: "Suivez vos étapes — à faire, en cours, déléguées, terminées." },
    ],
  }),
  component: Parcours,
});

type Status = "todo" | "doing" | "delegated" | "waiting" | "done";

const FILTERS: { id: Status | "all"; label: string }[] = [
  { id: "all",       label: "Tout" },
  { id: "todo",      label: "À faire" },
  { id: "doing",     label: "En cours" },
  { id: "delegated", label: "Délégué" },
  { id: "waiting",   label: "En attente" },
  { id: "done",      label: "Terminé" },
];

type Task = {
  id: string;
  title: string;
  category: string;
  due: string;
  owner: string;
  status: Status;
};

const TASKS: Task[] = [
  { id: "t1", title: "Déclarer le décès à la mairie",        category: "Démarches",  due: "Dans 2 jours",  owner: "Moi",          status: "todo" },
  { id: "t2", title: "Choisir l'organisation des obsèques",  category: "Cérémonie",  due: "Cette semaine", owner: "Moi",          status: "doing" },
  { id: "t3", title: "Prévenir l'employeur",                 category: "Administratif", due: "Avant lundi", owner: "Moi",          status: "todo" },
  { id: "t4", title: "Réserver le fleuriste",                category: "Cérémonie",  due: "Vendredi",      owner: "Camille",      status: "delegated" },
  { id: "t5", title: "Récupérer l'acte de décès",            category: "Documents",  due: "À réception",   owner: "Mairie",       status: "waiting" },
  { id: "t6", title: "Souscription assurance prévenue",      category: "Administratif", due: "—",          owner: "Moi",          status: "done" },
];

const STATUS_LABEL: Record<Status, string> = {
  todo: "À faire", doing: "En cours", delegated: "Délégué", waiting: "En attente", done: "Terminé",
};
const STATUS_COLOR: Record<Status, string> = {
  todo: "var(--ember)", doing: "var(--azure)", delegated: "var(--sun)", waiting: "var(--dusk)", done: "var(--olive)",
};

function Parcours() {
  const [filter, setFilter] = useState<Status | "all">("all");
  const visible = TASKS.filter((t) => filter === "all" || t.status === filter);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-7 pt-10 flex items-center justify-between">
          <Link
            to="/practical"
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/55 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← Accueil
          </Link>
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Parcours
          </span>
        </header>

        <section className="px-7 pt-14">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Tout est là, en clair
          </p>
          <h1 className="mt-4 font-serif text-[36px] leading-[1.05] font-light text-dusk text-balance">
            Mon <span className="italic">parcours.</span>
          </h1>
          <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.6] text-dusk/65">
            Filtrez par statut. Une étape peut être commencée, déléguée, suivie ou
            reprise — jamais juste cochée.
          </p>
        </section>

        <section className="px-7 pt-8 flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] tracking-wide border transition-colors ${
                  active
                    ? "bg-dusk text-paper border-dusk"
                    : "border-dusk/20 text-dusk/70 hover:bg-dusk/5"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {f.label}
              </button>
            );
          })}
        </section>

        <section className="px-7 pt-6">
          <div className="divide-y divide-dusk/10 border-y border-dusk/12">
            {visible.map((t) => (
              <article key={t.id} className="py-5 flex items-baseline gap-4">
                <span
                  className="size-1.5 rounded-full shrink-0 translate-y-1.5"
                  style={{ background: STATUS_COLOR[t.status] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p
                      className="text-[10px] uppercase tracking-[0.24em] text-dusk/55"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {t.category}
                    </p>
                    <p
                      className="text-[10px] uppercase tracking-[0.2em] text-dusk/50 shrink-0"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {STATUS_LABEL[t.status]}
                    </p>
                  </div>
                  <h3 className="mt-1.5 font-serif text-[19px] italic text-dusk leading-snug">
                    {t.title}
                  </h3>
                  <div className="mt-2 flex items-baseline justify-between text-[12.5px] text-dusk/60">
                    <span>{t.due}</span>
                    <span>{t.owner}</span>
                  </div>
                </div>
                <button
                  className="shrink-0 text-[11px] uppercase tracking-[0.22em] text-dusk/65 hover:text-dusk border border-dusk/15 rounded-full px-3 py-1.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Ouvrir
                </button>
              </article>
            ))}
            {visible.length === 0 && (
              <p className="py-10 text-center text-[13px] italic text-dusk/50">
                Rien dans ce filtre, pour l'instant.
              </p>
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}