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

        <section className="px-7 pt-12 editorial-frame pb-7">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Mon parcours
          </p>
          <h1 className="mt-3 max-w-[8ch] font-serif text-[42px] leading-[0.97] font-normal text-balance">
            Voir où vous en êtes, <span className="italic" style={{ color: "var(--terracotta)" }}>vraiment.</span>
          </h1>
          <p className="mt-5 text-[13.5px] leading-relaxed text-dusk/60 max-w-[32ch]">
            Une lecture plus nette du chemin: chapitres, état, prochaine action.
          </p>

          <div className="mt-6 editorial-panel p-5">
            <div className="flex items-end justify-between gap-4">
              <p className="font-serif text-[28px] leading-none text-dusk">
                {CATEGORIES.reduce((acc, c) => acc + c.tasks.filter(t => t.status === "done").length, 0)}
                <span className="text-dusk/40"> / {CATEGORIES.reduce((acc, c) => acc + c.tasks.length, 0)}</span>
              </p>
              <span
                className="text-[10px] uppercase tracking-[0.22em] text-dusk/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                tâches terminées
              </span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-dusk/10 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${
                    (CATEGORIES.reduce((a, c) => a + c.tasks.filter(t => t.status === "done").length, 0) /
                      CATEGORIES.reduce((a, c) => a + c.tasks.length, 0)) * 100
                  }%`,
                  background: "var(--olive)",
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-[16px] px-4 py-3" style={{ background: "color-mix(in oklab, var(--mist) 35%, var(--paper))" }}>
                <p className="text-[10px] uppercase tracking-[0.18em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>Chapitre en cours</p>
                <p className="mt-2 font-serif text-[19px] leading-tight">Cérémonie</p>
              </div>
              <div className="rounded-[16px] px-4 py-3" style={{ background: "color-mix(in oklab, var(--sun) 45%, var(--paper))" }}>
                <p className="text-[10px] uppercase tracking-[0.18em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>Ensuite</p>
                <p className="mt-2 font-serif text-[19px] leading-tight">Succession & après</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-7 pt-6 flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", ...FILTERS] as const).map((f) => {
            const active = filter === f;
            const label = f === "all" ? "Tout" : f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 editorial-chip px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  active ? "bg-dusk text-paper border-dusk" : "border-dusk/20 text-dusk/70 hover:bg-dusk/5"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {label}
              </button>
            );
          })}
        </section>

        <section className="px-7 pt-7 space-y-3">
          {CATEGORIES.map((cat, idx) => {
            const tasks = cat.tasks.filter((t) => filter === "all" || t.filter === filter);
            if (tasks.length === 0) return null;
            const open = openCat[cat.name];
            const done = cat.tasks.filter(t => t.status === "done").length;
            const tints = ["var(--blush)", "var(--sage)", "var(--mist)", "var(--sun)"];
            return (
              <div key={cat.name} className="rounded-[20px] border border-dusk/10 overflow-hidden bg-paper">
                <button
                  onClick={() => setOpenCat({ ...openCat, [cat.name]: !open })}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  style={{ background: open ? "transparent" : `color-mix(in oklab, ${tints[idx % 4]} 35%, var(--paper))` }}
                >
                  <div className="flex items-center gap-3 text-left">
                    <span
                      className="size-7 rounded-full flex items-center justify-center text-[11px] font-medium text-dusk"
                      style={{ background: tints[idx % 4], fontFamily: "var(--font-mono)" }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-serif text-[22px] text-dusk leading-tight">{cat.name}</p>
                      <p
                        className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-dusk/55"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {done}/{cat.tasks.length} · {tasks.length} visible{tasks.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-dusk/55 text-[18px]">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <ul className="px-2 pb-2 space-y-0.5 border-t border-dusk/8">
                    {tasks.map((t) => (
                      <li key={t.id}>
                        <Link
                          to="/parcours/$taskId"
                          params={{ taskId: t.id }}
                          className="flex items-start gap-3 py-3 px-3 rounded-[12px] group hover:bg-dusk/[0.03]"
                        >
                          <span
                            className="mt-2 size-1.5 rounded-full shrink-0"
                            style={{ background: STATUS_COLOR[t.status] }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-[18px] text-dusk leading-snug">{t.title}</p>
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