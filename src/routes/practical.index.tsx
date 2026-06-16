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
