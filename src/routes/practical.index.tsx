import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";

export const Route = createFileRoute("/practical/")({
  head: () => ({
    meta: [
      { title: "Démarches — Legato" },
      { name: "description", content: "Un plan d'action clair, organisé par temporalité. Vous voyez ce qu'il faut faire, ce qui est en cours, ce qui est délégué." },
    ],
  }),
  component: Practical,
});

type Status = "todo" | "doing" | "done" | "delegate" | "blocked" | "missing";
type Task = { id: string; title: string; meta?: string; status: Status };

const GROUPS: { key: string; label: string; tone: string; tasks: Task[] }[] = [
  {
    key: "now",
    label: "Immédiat",
    tone: "var(--terracotta)",
    tasks: [
      { id: "pf",      title: "Contacter les pompes funèbres",      meta: "Sous 48 h",      status: "todo" },
      { id: "mairie",  title: "Déclarer le décès en mairie",        meta: "Sous 24 h",      status: "doing" },
    ],
  },
  {
    key: "week",
    label: "Cette semaine",
    tone: "var(--sun)",
    tasks: [
      { id: "famille",   title: "Prévenir les proches",                meta: "À votre rythme", status: "doing" },
      { id: "documents", title: "Réunir les documents importants",     meta: "Acte, livret",   status: "missing" },
      { id: "ceremony",  title: "Préparer la cérémonie",               meta: "Lieux, textes",  status: "todo" },
    ],
  },
  {
    key: "month",
    label: "Ce mois-ci",
    tone: "var(--sky)",
    tasks: [
      { id: "notaire", title: "Prendre rendez-vous chez le notaire", meta: "Succession",    status: "todo" },
      { id: "banque",  title: "Prévenir la banque",                  meta: "Comptes",       status: "delegate" },
      { id: "assurances", title: "Informer les assurances",          meta: "Vie, habitation", status: "todo" },
    ],
  },
  {
    key: "later",
    label: "Plus tard",
    tone: "var(--olive)",
    tasks: [
      { id: "logement", title: "Logement & abonnements",  meta: "Sans urgence", status: "todo" },
      { id: "objets",   title: "Objets personnels",       meta: "Quand vous serez prêt·e", status: "todo" },
    ],
  },
];

const STATUS_LABEL: Record<Status, string> = {
  todo: "À faire",
  doing: "En cours",
  done: "Fait",
  delegate: "Délégué",
  blocked: "Bloqué",
  missing: "Doc manquant",
};

function Practical() {
  const allTasks = GROUPS.flatMap((g) => g.tasks);
  const done = allTasks.filter((t) => t.status === "done").length;
  const total = allTasks.length;
  const priority = GROUPS[0].tasks[0];

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-9 pb-6 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <span className="eyebrow">Plan d'action</span>
        </header>

        {/* HERO */}
        <section className="px-6 pb-9">
          <p className="eyebrow">Démarches</p>
          <h1 className="mt-5 display-xl">
            Avancer sans se <span className="italic" style={{ color: "var(--terracotta)" }}>brusquer</span>.
          </h1>
          <p className="mt-5 body-meta max-w-[34ch]">
            {done} étapes terminées sur {total}. Le reste peut attendre — on vous indique l'ordre.
          </p>
        </section>

        {/* PRIORITÉ IMMÉDIATE */}
        <section className="px-5">
          <Link
            to="/parcours/$taskId"
            params={{ taskId: priority.id }}
            className="block card-tomato px-6 py-7"
          >
            <span className="eyebrow-on-dark">Maintenant</span>
            <p className="mt-4 font-serif text-[30px] leading-[0.98] max-w-[14ch]">
              {priority.title}.
            </p>
            <p className="mt-3 text-[13px] opacity-85">{priority.meta}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="btn-dark" style={{ background: "color-mix(in oklab, var(--ink) 70%, var(--bordeaux))" }}>
                Commencer →
              </span>
              <span className="btn-ghost" style={{ borderColor: "color-mix(in oklab, var(--paper) 50%, transparent)", color: "var(--paper)" }}>
                Déléguer
              </span>
            </div>
          </Link>
        </section>

        {/* GROUPES TEMPORELS */}
        {GROUPS.map((group) => (
          <section key={group.key} className="px-6 pt-9">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full" style={{ background: group.tone }} />
              <p className="eyebrow">{group.label}</p>
            </div>
            <ol className="mt-4 card-plain divide-y divide-dusk/10">
              {group.tasks.map((t) => (
                <li key={t.id}>
                  <Link
                    to="/parcours/$taskId"
                    params={{ taskId: t.id }}
                    className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-dusk/[0.02]"
                  >
                    <div className="min-w-0">
                      <p className="font-serif text-[18px] leading-snug text-dusk">{t.title}</p>
                      {t.meta && <p className="mt-1 text-[12px] text-dusk/55">{t.meta}</p>}
                    </div>
                    <span className={`chip chip-${t.status} shrink-0 mt-1`}>{STATUS_LABEL[t.status]}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}

        {/* RACCOURCIS */}
        <section className="px-6 pt-10">
          <p className="eyebrow">Raccourcis</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link to="/wishes" className="card-plain px-5 py-5">
              <p className="eyebrow">Documents</p>
              <p className="h-section mt-2">Mes papiers</p>
            </Link>
            <Link to="/appointments" className="card-plain px-5 py-5">
              <p className="eyebrow">Agenda</p>
              <p className="h-section mt-2">Rendez-vous</p>
            </Link>
            <Link to="/practical/ceremony" className="card-plain px-5 py-5">
              <p className="eyebrow">Préparation</p>
              <p className="h-section mt-2">Cérémonie</p>
            </Link>
            <Link to="/resources" search={{ space: "practical" } as never} className="card-plain px-5 py-5">
              <p className="eyebrow">Annuaire</p>
              <p className="h-section mt-2">Professionnels</p>
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}

/* ─── Accueil ORGANISER & AVANCER ───
 * Quatre zones bien séparées : priorité du jour, à faire ensuite,
 * avancement, raccourcis. Aucun élément émotionnel (jardin, présence,
 * respiration, souvenirs).
 */

const NEXT_TASKS = [
  { id: "mairie",    title: "Déclarer le décès en mairie",      due: "Dans 24h" },
  { id: "famille",   title: "Prévenir les proches",             due: "Cette semaine" },
  { id: "documents", title: "Réunir les documents importants",  due: "Cette semaine" },
];

const PROGRESS = [
  { label: "À faire",    count: 7, color: "var(--ember)" },
  { label: "En cours",   count: 3, color: "var(--terracotta)" },
  { label: "Délégué",    count: 2, color: "var(--mist)" },
  { label: "Terminé",    count: 4, color: "var(--olive)" },
];

const SHORTCUTS: { to: string; search?: Record<string, string>; label: string }[] = [
  { to: "/parcours",           label: "Mon parcours" },
  { to: "/wishes",             label: "Mes documents" },
  { to: "/appointments",       label: "Mes rendez-vous" },
  { to: "/dates",              label: "Dates sensibles" },
  { to: "/resources",          search: { space: "practical" }, label: "Professionnels" },
  { to: "/practical/ceremony", label: "Cérémonie" },
  { to: "/wishes",             label: "Budget" },
];

function Practical() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <SpaceHeader space="organize" />

        <section className="px-7 pt-12 pb-7 editorial-hero">
          <p className="editorial-kicker">
            Accueil
          </p>
          <h1 className="mt-4 max-w-[8ch] editorial-display">
            Avancer sans se <span className="italic" style={{ color: "var(--terracotta)" }}>brusquer.</span>
          </h1>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="editorial-stat-card px-4 py-4" style={{ background: "color-mix(in oklab, var(--mist) 35%, white)" }}>
              <p className="editorial-kicker">Cap</p>
              <p className="mt-2 font-serif text-[24px] leading-[0.98]">Une priorité claire.</p>
            </div>
            <div className="editorial-stat-card px-4 py-4" style={{ background: "color-mix(in oklab, var(--sun) 56%, white)" }}>
              <p className="editorial-kicker">Méthode</p>
              <p className="mt-2 text-[13px] leading-relaxed text-dusk/70">Puis les repères, puis les raccourcis utiles.</p>
            </div>
          </div>
        </section>

        {/* ZONE 1 — Priorité du jour */}
        <section className="px-5 pt-7">
          <div
            className="rounded-[16px] px-6 py-7 border border-dusk/10 editorial-tint-card"
            style={{ background: "color-mix(in oklab, var(--sun) 84%, white)", color: "var(--dusk)" }}
          >
            <p className="editorial-kicker">
              Maintenant
            </p>
            <h2 className="mt-3 max-w-[9ch] font-serif text-[36px] leading-[0.95] font-normal">
              Contacter les <span className="italic">pompes funèbres.</span>
            </h2>
            <p className="mt-3 text-[13px] leading-[1.55] opacity-80 max-w-[23ch]">
              À traiter dans les 48 h.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <div className="rounded-[14px] px-4 py-3 bg-paper/70 border border-dusk/8">
                <p className="editorial-kicker">Fenêtre</p>
                <p className="mt-2 font-serif text-[19px]">48 h</p>
              </div>
              <div className="rounded-[14px] px-4 py-3 bg-paper/70 border border-dusk/8">
                <p className="editorial-kicker">Énergie</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-dusk/65">On peut le lancer pas à pas.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
               <Link
                to="/parcours/$taskId"
                params={{ taskId: "pf" }}
                 className="rounded-full bg-bordeaux text-paper px-4 py-2 text-[12px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Commencer
              </Link>
              <button
                className="rounded-full border border-dusk/18 px-4 py-2 text-[12px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Déléguer
              </button>
            </div>
          </div>
        </section>

        {/* ZONE 2 — À faire ensuite */}
        <section className="px-7 pt-10">
          <p className="editorial-kicker">
            À faire ensuite
          </p>
          <ol className="mt-4 editorial-list">
            {NEXT_TASKS.map((t) => (
              <li key={t.id}>
                <Link
                  to="/parcours/$taskId"
                  params={{ taskId: t.id }}
                 className="flex items-baseline justify-between gap-4 px-5 py-4 group border-b last:border-b-0 border-dusk/8 hover:bg-dusk/[0.02]"
                >
                  <span className="font-serif text-[18px] leading-snug text-dusk">{t.title}</span>
                  <span
                    className="text-[10.5px] uppercase tracking-[0.2em] text-dusk/55 shrink-0"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {t.due}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* ZONE 3 — Mon avancement */}
        <section className="px-7 pt-10">
          <p className="editorial-kicker">
            Mon avancement
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {PROGRESS.map((p) => (
              <Link
                key={p.label}
                to="/parcours"
                className="rounded-[16px] border border-dusk/10 px-4 py-4 text-left hover:bg-dusk/[0.03] editorial-tint-card"
                style={{ background: `color-mix(in oklab, ${p.color} 14%, white)` }}
              >
                <span
                  className="inline-block size-1.5 rounded-full"
                  style={{ background: p.color }}
                />
                <p className="mt-3 font-serif text-[28px] leading-none text-dusk">{p.count}</p>
                <p
                  className="mt-1.5 text-[9.5px] uppercase tracking-[0.18em] text-dusk/55"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {p.label}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ZONE 4 — Raccourcis utiles */}
        <section className="px-7 pt-10">
          <p className="editorial-kicker">
            Raccourcis utiles
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {SHORTCUTS.map((s) => (
              <Link
                key={s.label}
                to={s.to as "/resources"}
                search={s.search as { space: "practical" }}
                className="rounded-[16px] border border-dusk/12 px-4 py-4 flex items-center justify-between hover:bg-dusk/[0.03] editorial-tint-card"
                style={{ background: "color-mix(in oklab, var(--paper) 86%, white)" }}
              >
                <span className="font-serif text-[18px] leading-tight text-dusk max-w-[10ch]">{s.label}</span>
                <span className="text-dusk/35">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
