import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { SpaceHeader } from "@/components/legato/SpaceHeader";

export const Route = createFileRoute("/parcours")({
  head: () => ({
    meta: [
      { title: "Mon parcours — Legato" },
      { name: "description", content: "Toutes vos étapes, par catégorie. Filtrez par échéance ou statut." },
    ],
  }),
  component: Parcours,
});

type Status = "todo" | "doing" | "waiting" | "delegated" | "done";
const STATUS_LABEL: Record<Status, string> = {
  todo: "À faire", doing: "En cours", waiting: "En attente", delegated: "Délégué", done: "Terminé",
};
const STATUS_COLOR: Record<Status, string> = {
  todo: "var(--ember)", doing: "var(--terracotta)", waiting: "var(--mist)", delegated: "var(--sun)", done: "var(--olive)",
};

const FILTERS = ["Aujourd'hui", "Cette semaine", "Plus tard", "Terminé"] as const;
type Filter = typeof FILTERS[number];

type Task = { id: string; title: string; status: Status; due: string; filter: Filter };

const CATEGORIES: { name: string; tasks: Task[] }[] = [
  {
    name: "Démarches immédiates",
    tasks: [
      { id: "mairie", title: "Déclarer le décès en mairie", status: "todo", due: "Dans 24h", filter: "Aujourd'hui" },
      { id: "pf",     title: "Contacter les pompes funèbres", status: "doing", due: "48h", filter: "Aujourd'hui" },
    ],
  },
  {
    name: "Cérémonie",
    tasks: [
      { id: "lieu",    title: "Choisir le lieu",        status: "doing",     due: "Cette semaine", filter: "Cette semaine" },
      { id: "fleurs",  title: "Réserver le fleuriste", status: "delegated", due: "Vendredi",      filter: "Cette semaine" },
      { id: "textes",  title: "Écrire les mots",        status: "todo",     due: "Avant samedi",  filter: "Cette semaine" },
    ],
  },
  {
    name: "Documents & administratif",
    tasks: [
      { id: "employeur", title: "Prévenir l'employeur", status: "todo", due: "Avant lundi", filter: "Cette semaine" },
      { id: "acte",      title: "Récupérer l'acte de décès", status: "waiting", due: "À réception", filter: "Plus tard" },
    ],
  },
  {
    name: "Succession & après",
    tasks: [
      { id: "notaire",  title: "Prendre rendez-vous avec un notaire", status: "todo", due: "Ce mois-ci", filter: "Plus tard" },
      { id: "banque",   title: "Prévenir la banque",                  status: "done", due: "—",          filter: "Terminé" },
    ],
  },
];

function Parcours() {
  const [filter, setFilter] = useState<Filter | "all">("all");
  const [openCat, setOpenCat] = useState<Record<string, boolean>>(
    Object.fromEntries(CATEGORIES.map((c, i) => [c.name, i < 2])),
  );

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <SpaceHeader space="organize" />

        <section className="px-7 pt-14">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Mon parcours
          </p>
          <h1 className="mt-4 font-serif text-[36px] leading-[1.05] font-light text-balance">
            Tout est là, <span className="italic" style={{ color: "var(--terracotta)" }}>en clair.</span>
          </h1>
        </section>

        <section className="px-7 pt-7 flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", ...FILTERS] as const).map((f) => {
            const active = filter === f;
            const label = f === "all" ? "Tout" : f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] border transition-colors ${
                  active ? "bg-dusk text-paper border-dusk" : "border-dusk/20 text-dusk/70 hover:bg-dusk/5"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {label}
              </button>
            );
          })}
        </section>

        <section className="px-7 pt-6 space-y-2">
          {CATEGORIES.map((cat) => {
            const tasks = cat.tasks.filter((t) => filter === "all" || t.filter === filter);
            if (tasks.length === 0) return null;
            const open = openCat[cat.name];
            return (
              <div key={cat.name} className="border-b border-dusk/12">
                <button
                  onClick={() => setOpenCat({ ...openCat, [cat.name]: !open })}
                  className="w-full flex items-baseline justify-between py-3"
                >
                  <span className="font-serif text-[18px] italic text-dusk">{cat.name}</span>
                  <span
                    className="text-[10px] uppercase tracking-[0.22em] text-dusk/55"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {tasks.length} · {open ? "—" : "+"}
                  </span>
                </button>
                {open && (
                  <ul className="pb-3 space-y-1">
                    {tasks.map((t) => (
                      <li key={t.id}>
                        <Link
                          to="/parcours/$taskId"
                          params={{ taskId: t.id }}
                          className="flex items-start gap-3 py-2.5 group"
                        >
                          <span
                            className="mt-2 size-1.5 rounded-full shrink-0"
                            style={{ background: STATUS_COLOR[t.status] }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-[16.5px] text-dusk leading-snug">{t.title}</p>
                            <p
                              className="mt-1 text-[10.5px] uppercase tracking-[0.18em] text-dusk/55"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {STATUS_LABEL[t.status]} · {t.due}
                            </p>
                          </div>
                          <span className="text-dusk/35 group-hover:text-dusk mt-1">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </Shell>
  );
}