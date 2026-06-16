import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";

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
const STATUS_CHIP: Record<Status, string> = {
  todo: "chip-todo", doing: "chip-doing", waiting: "chip-blocked", delegated: "chip-delegate", done: "chip-done",
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
  const totalTasks = CATEGORIES.reduce((a, c) => a + c.tasks.length, 0);
  const doneTasks  = CATEGORIES.reduce((a, c) => a + c.tasks.filter(t => t.status === "done").length, 0);
  const pct = Math.round((doneTasks / totalTasks) * 100);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-9 pb-6 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <span className="eyebrow">Mon parcours</span>
        </header>

        <section className="px-6 pb-8">
          <p className="eyebrow">Avancement</p>
          <h1 className="mt-5 display-xl">
            {doneTasks}<span className="text-dusk/40">/{totalTasks}</span> <span className="italic" style={{ color: "var(--terracotta)" }}>étapes</span>.
          </h1>
          <p className="mt-5 body-meta max-w-[34ch]">
            Voir où vous en êtes — par chapitre, par échéance, par statut.
          </p>
          <div className="mt-5 h-1.5 w-full rounded-full bg-dusk/10 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--olive)" }} />
          </div>
        </section>

        <section className="px-5 grid grid-cols-2 gap-3">
          <div className="card-butter px-5 py-4">
            <p className="eyebrow">Chapitre en cours</p>
            <p className="h-section mt-2">Cérémonie</p>
          </div>
          <div className="card-sardine px-5 py-4">
            <p className="eyebrow">Ensuite</p>
            <p className="h-section mt-2">Succession & après</p>
          </div>
        </section>

        <section className="px-6 pt-8 flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", ...FILTERS] as const).map((f) => {
            const active = filter === f;
            const label = f === "all" ? "Tout" : f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors ${
                  active ? "bg-dusk text-paper border-dusk" : "border-dusk/15 text-dusk/65 hover:bg-dusk/5"
                }`}
              >
                {label}
              </button>
            );
          })}
        </section>

        <section className="px-6 pt-7 space-y-3">
          {CATEGORIES.map((cat, idx) => {
            const tasks = cat.tasks.filter((t) => filter === "all" || t.filter === filter);
            if (tasks.length === 0) return null;
            const open = openCat[cat.name];
            const done = cat.tasks.filter(t => t.status === "done").length;
            const tints = ["var(--blush)", "var(--sun)", "var(--sky)", "var(--olive)"];
            return (
              <div key={cat.name} className="card-plain overflow-hidden">
                <button
                  onClick={() => setOpenCat({ ...openCat, [cat.name]: !open })}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  style={{ background: open ? "transparent" : `color-mix(in oklab, ${tints[idx % 4]} 24%, var(--paper))` }}
                >
                  <div className="flex items-center gap-3 text-left">
                    <span
                      className="size-7 rounded-full flex items-center justify-center text-[11px] font-medium text-dusk"
                      style={{ background: tints[idx % 4] }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-serif text-[22px] text-dusk leading-tight">{cat.name}</p>
                      <p className="eyebrow mt-0.5">{done}/{cat.tasks.length} · {tasks.length} visible{tasks.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <span className="text-dusk/55 text-[18px]">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <ul className="divide-y divide-dusk/8 border-t border-dusk/8">
                    {tasks.map((t) => (
                      <li key={t.id}>
                        <Link
                          to="/parcours/$taskId"
                          params={{ taskId: t.id }}
                          className="flex items-start justify-between gap-3 px-5 py-4 group hover:bg-dusk/[0.02]"
                        >
                          <div className="min-w-0">
                            <p className="font-serif text-[18px] text-dusk leading-snug">{t.title}</p>
                            <p className="mt-1 text-[12px] text-dusk/55">{t.due}</p>
                          </div>
                          <span className={`chip ${STATUS_CHIP[t.status]} shrink-0 mt-1`}>{STATUS_LABEL[t.status]}</span>
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