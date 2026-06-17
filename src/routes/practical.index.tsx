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
  const progress = Math.round((done / total) * 100);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-8 pb-6">
          <div className="folio">
            <LegatoMark to="/space" size={22} />
            <span>Espace · Démarches</span>
          </div>
        </header>

        <section className="px-6 pb-9">
          <p className="eyebrow">Plan d'action</p>
          <div className="mt-5 max-w-[20rem]">
            <h1 className="ed-title text-[47px]">
              Avancer sans se
              <br />
              <span className="italic" style={{ color: "var(--terracotta)" }}>brusquer</span>.
            </h1>
          </div>
          <p className="mt-6 body-meta max-w-[32ch]">
            {done} étapes terminées sur {total}. Le reste peut attendre — on vous indique l'ordre.
          </p>
        </section>

        <section className="px-5 grid grid-cols-2 gap-3">
          <Link
            to="/parcours/$taskId"
            params={{ taskId: priority.id }}
            className="plate card-butter px-5 pt-5 pb-4 min-h-[208px] flex flex-col"
          >
            <span className="eyebrow">À faire aujourd'hui</span>
            <p className="mt-4 max-w-[10ch] font-serif text-[31px] leading-[0.98] tracking-[-0.01em]">
              {priority.title}.
            </p>
            <p className="mt-3 text-[12px] text-dusk/70">{priority.meta}</p>
            <div className="mt-auto plate-caption text-dusk">
              <span>Priorité</span>
              <span>Ouvrir →</span>
            </div>
          </Link>

          <div className="plate card-plain px-5 pt-5 pb-4 min-h-[208px] flex flex-col">
            <span className="eyebrow">Votre progression</span>
            <p className="mt-4 font-serif text-[60px] leading-[0.9] tracking-[-0.03em]" style={{ color: "var(--terracotta)" }}>
              {progress}%
            </p>
            <div className="mt-4 h-1.5 w-full rounded-full" style={{ background: "color-mix(in oklab, var(--dusk) 10%, transparent)" }}>
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "var(--terracotta)" }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="font-serif text-[22px] leading-none">{done}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-dusk/55">Terminées</p>
              </div>
              <div>
                <p className="font-serif text-[22px] leading-none">{total - done}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-dusk/55">En cours</p>
              </div>
              <div>
                <p className="font-serif text-[22px] leading-none">4</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-dusk/55">Sections</p>
              </div>
            </div>
          </div>
        </section>

        {GROUPS.map((group) => (
          <section key={group.key} className="px-6 pt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full" style={{ background: group.tone }} />
                <p className="eyebrow">{group.label}</p>
              </div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-dusk/45">{group.tasks.length} étapes</p>
            </div>
            <ol className="mt-4 overflow-hidden rounded-[18px] border border-dusk/10 bg-paper">
              {group.tasks.map((t) => (
                <li key={t.id} className="border-t border-dusk/10 first:border-t-0">
                  <Link
                    to="/parcours/$taskId"
                    params={{ taskId: t.id }}
                    className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-dusk/[0.02]"
                  >
                    <div className="min-w-0">
                      <p className="font-serif text-[20px] leading-[1.08] text-dusk">{t.title}</p>
                      {t.meta && <p className="mt-1.5 text-[11px] uppercase tracking-[0.12em] text-dusk/50">{t.meta}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`chip chip-${t.status}`}>{STATUS_LABEL[t.status]}</span>
                      <span className="font-serif text-[18px] text-dusk/45">→</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <section className="px-6 pt-12">
          <div className="rule-label mb-5"><span>Raccourcis</span></div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { to: "/wishes", eyebrow: "Documents", title: "Mes papiers", tone: "card-sardine" },
              { to: "/appointments", eyebrow: "Agenda", title: "Rendez-vous", tone: "card-blush" },
              { to: "/practical/ceremony", eyebrow: "Préparation", title: "Cérémonie", tone: "card-butter" },
              { to: "/resources", eyebrow: "Annuaire", title: "Professionnels", tone: "card-plain" },
            ].map((s) => (
              <Link key={s.title} to={s.to as "/wishes"} search={s.to === "/resources" ? ({ space: "practical" } as never) : undefined} className={`plate ${s.tone} px-5 py-4`}>
                <p className="eyebrow">{s.eyebrow}</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <p className="font-serif text-[25px] leading-[1.02] text-dusk">{s.title}</p>
                  <span className="font-serif text-[18px] text-dusk/50">→</span>
                </div>
              </Link>
            ))}
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
