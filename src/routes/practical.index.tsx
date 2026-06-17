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
        <header className="px-6 pt-8 pb-6">
          <div className="folio">
            <LegatoMark to="/space" size={22} />
            <span>Espace · Démarches</span>
          </div>
        </header>

        {/* HERO */}
        <section className="px-6 pb-9">
          <p className="eyebrow">Plan d'action</p>
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 items-start">
            <span className="index-num leading-none -mt-1">№</span>
            <h1 className="ed-title text-[46px]">
              Avancer
              <br />
              sans se
              <br />
              <span className="italic" style={{ color: "var(--terracotta)" }}>brusquer</span>.
            </h1>
          </div>
          <p className="mt-7 body-meta max-w-[32ch] pl-[3.25rem]">
            {done} étapes terminées sur {total}. Le reste peut attendre — on vous indique l'ordre.
          </p>
        </section>

        {/* PRIORITÉ IMMÉDIATE */}
        <section className="px-5">
          <Link
            to="/parcours/$taskId"
            params={{ taskId: priority.id }}
            className="plate card-tomato px-6 pt-7 pb-6"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="eyebrow-on-dark">Maintenant</span>
              <span className="index-num-sm opacity-80">01</span>
            </div>
            <p className="mt-5 font-serif text-[32px] leading-[0.98] tracking-[-0.01em] max-w-[13ch]">
              {priority.title}.
            </p>
            <p className="mt-3 text-[13px] opacity-85">{priority.meta}</p>
            <div className="plate-caption">
              <span>Commencer →</span>
              <span>ou déléguer</span>
            </div>
          </Link>
        </section>

        {/* GROUPES TEMPORELS */}
        {GROUPS.map((group, gi) => (
          <section key={group.key} className="px-6 pt-10">
            <div className="rule-label">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full" style={{ background: group.tone }} />
                {group.label}
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="index-num-sm text-dusk/60">0{gi + 2}</span>
              <p className="font-serif italic text-[14px] text-dusk/60">{group.tasks.length} étapes</p>
            </div>
            <ol className="mt-3">
              {group.tasks.map((t, ti) => (
                <li key={t.id} className="border-t border-dusk/10 last:border-b">
                  <Link
                    to="/parcours/$taskId"
                    params={{ taskId: t.id }}
                    className="flex items-start justify-between gap-4 py-4 hover:bg-dusk/[0.02]"
                  >
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="font-serif italic text-[13px] text-dusk/45 tabular-nums shrink-0">
                        {String(ti + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="font-serif text-[19px] leading-snug text-dusk">{t.title}</p>
                        {t.meta && <p className="mt-1 text-[11.5px] tracking-[0.1em] uppercase text-dusk/55">{t.meta}</p>}
                      </div>
                    </div>
                    <span className={`chip chip-${t.status} shrink-0 mt-1`}>{STATUS_LABEL[t.status]}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}

        {/* RACCOURCIS */}
        <section className="px-6 pt-12">
          <div className="rule-label mb-5"><span>Raccourcis</span></div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {[
              { to: "/wishes", eyebrow: "Documents", title: "Mes papiers", num: "i" },
              { to: "/appointments", eyebrow: "Agenda", title: "Rendez-vous", num: "ii" },
              { to: "/practical/ceremony", eyebrow: "Préparation", title: "Cérémonie", num: "iii" },
              { to: "/resources", eyebrow: "Annuaire", title: "Professionnels", num: "iv" },
            ].map((s) => (
              <Link key={s.title} to={s.to as "/wishes"} search={s.to === "/resources" ? ({ space: "practical" } as never) : undefined} className="block">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif italic text-[13px] text-dusk/45">{s.num}</span>
                  <p className="eyebrow">{s.eyebrow}</p>
                </div>
                <p className="mt-2 font-serif text-[22px] leading-[1.05] text-dusk">{s.title} <span className="italic text-dusk/40">→</span></p>
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
