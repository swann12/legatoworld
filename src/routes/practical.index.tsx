import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { SpaceHeader } from "@/components/legato/SpaceHeader";

export const Route = createFileRoute("/practical/")({
  head: () => ({
    meta: [
      { title: "Organiser & avancer — Legato" },
      { name: "description", content: "Une priorité à la fois. Nous avons rassemblé ce qui mérite votre attention aujourd'hui." },
    ],
  }),
  component: Practical,
});

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
  { label: "Délégué",    count: 2, color: "var(--sun)" },
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

        <section className="px-7 pt-12">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Accueil
          </p>
          <h1 className="mt-4 font-serif text-[34px] leading-[1.05] font-light text-balance">
            Une étape <span className="italic" style={{ color: "var(--terracotta)" }}>à la fois.</span>
          </h1>
        </section>

        {/* ZONE 1 — Priorité du jour */}
        <section className="px-5 pt-8">
          <div
            className="rounded-[22px] px-6 py-7"
            style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.26em] opacity-70"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Priorité du jour
            </p>
            <h2 className="mt-3 font-serif text-[24px] leading-[1.15] font-light">
              Contacter les <span className="italic">pompes funèbres.</span>
            </h2>
            <p className="mt-2.5 text-[13px] leading-[1.55] opacity-80">
              À traiter dans les 48 h.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/parcours/$taskId"
                params={{ taskId: "pf" }}
                className="rounded-full bg-paper text-dusk px-4 py-2 text-[12px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Commencer
              </Link>
              <button
                className="rounded-full border border-paper/40 px-4 py-2 text-[12px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Déléguer
              </button>
            </div>
          </div>
        </section>

        {/* ZONE 2 — À faire ensuite */}
        <section className="px-7 pt-10">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            À faire ensuite
          </p>
          <ol className="mt-4 divide-y divide-dusk/10 border-y border-dusk/12">
            {NEXT_TASKS.map((t) => (
              <li key={t.id}>
                <Link
                  to="/parcours/$taskId"
                  params={{ taskId: t.id }}
                  className="flex items-baseline justify-between gap-4 py-4 group"
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
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Mon avancement
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {PROGRESS.map((p) => (
              <Link
                key={p.label}
                to="/parcours"
                className="rounded-[14px] border border-dusk/10 px-3 py-4 text-center hover:bg-dusk/[0.03]"
              >
                <span
                  className="inline-block size-1.5 rounded-full"
                  style={{ background: p.color }}
                />
                <p className="mt-2 font-serif text-[22px] leading-none text-dusk">{p.count}</p>
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
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Raccourcis utiles
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {SHORTCUTS.map((s) => (
              <Link
                key={s.label}
                to={s.to as "/resources"}
                search={s.search as { space: "practical" }}
                className="rounded-[14px] border border-dusk/12 px-4 py-3.5 font-serif italic text-[15px] text-dusk hover:bg-dusk/[0.03]"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
