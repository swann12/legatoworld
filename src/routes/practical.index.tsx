import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

export const Route = createFileRoute("/practical/")({
  head: () => ({
    meta: [
      { title: "Avancer — Legato" },
      { name: "description", content: "Une priorité à la fois. Nous avons rassemblé ce qui mérite votre attention." },
    ],
  }),
  component: Practical,
});

/* Espace concret — registre éditorial Co-Star.
 * Liste typographique numérotée, méta en mono à droite. Pas d'aplats
 * de couleur, juste l'accent terracotta utilisé comme encre. */

const PRIORITY = {
  title: <>Déclarer le décès <span className="italic">à la mairie</span></>,
  why: "Cette étape débloque presque tout le reste.",
  time: "~ 20 MIN",
  to: "/practical/steps",
};

const TASKS: { num: string; title: React.ReactNode; meta: string; to: string }[] = [
  { num: "01", to: "/practical/steps",     meta: "À FAIRE",   title: <>Prévenir <span className="italic">l'employeur</span></> },
  { num: "02", to: "/practical/ceremony",  meta: "EN COURS",  title: <>Choisir <span className="italic">le lieu</span></> },
  { num: "03", to: "/practical/texts",     meta: "EN COURS",  title: <>Écrire <span className="italic">les mots</span></> },
  { num: "04", to: "/practical/flowers",   meta: "À FAIRE",   title: <>Décider <span className="italic">les fleurs</span></> },
  { num: "05", to: "/practical/share",     meta: "DÉLÉGUÉ",   title: <>Prévenir <span className="italic">les proches</span></> },
  { num: "06", to: "/resources",           meta: "À VOIR",    title: <>Trouver <span className="italic">un notaire</span></> },
];

function Practical() {
  const today = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" })
    .format(new Date()).toUpperCase();

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32 px-7">
        <header className="pt-9 flex items-center justify-between">
          <span className="font-serif text-[20px] leading-none">Legato</span>
          <Link
            to="/space"
            className="text-[11px] uppercase tracking-[0.18em] text-dusk/55 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Espace ↩
          </Link>
        </header>

        <section className="pt-16">
          <p
            className="text-[10px] uppercase tracking-[0.34em] text-dusk/55"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {today} — CONCRET
          </p>
          <h1 className="mt-6 font-serif text-[36px] leading-[1.05] font-light text-balance">
            Une chose à la fois.{" "}
            <span className="italic" style={{ color: "var(--terracotta)" }}>
              Le reste attendra.
            </span>
          </h1>
        </section>

        {/* Priorité du jour — pas de bloc, juste de la typo + un trait */}
        <section className="pt-14">
          <div className="border-l-2 pl-5" style={{ borderColor: "var(--terracotta)" }}>
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--terracotta)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              À faire en premier — {PRIORITY.time}
            </p>
            <h2 className="mt-3 font-serif text-[28px] leading-[1.08] font-light text-balance">
              {PRIORITY.title}
            </h2>
            <p className="mt-3 text-[14px] leading-[1.55] text-dusk/65 max-w-[36ch]">
              {PRIORITY.why}
            </p>
            <div className="mt-5 flex items-baseline gap-6">
              <Link
                to={PRIORITY.to}
                className="text-[12px] uppercase tracking-[0.22em] underline underline-offset-[6px] decoration-[color:var(--terracotta)] decoration-1 hover:text-[color:var(--terracotta)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Commencer →
              </Link>
              <Link
                to="/presence"
                className="text-[12px] uppercase tracking-[0.22em] text-dusk/55 hover:text-dusk"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Déléguer
              </Link>
            </div>
          </div>
        </section>

        {/* Suite éditoriale — liste numérotée */}
        <section className="pt-14">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/45 mb-2"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            La suite
          </p>
          <ol>
            {TASKS.map((t) => (
              <li key={t.num}>
                <Link
                  to={t.to as never}
                  className="group flex items-baseline gap-5 py-4 border-b border-dusk/12"
                >
                  <span
                    className="text-[11px] tracking-[0.22em] text-dusk/40 w-6 shrink-0"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {t.num}
                  </span>
                  <h3 className="flex-1 font-serif text-[22px] leading-snug font-light">
                    {t.title}
                  </h3>
                  <span
                    className="text-[10px] uppercase tracking-[0.22em] text-dusk/45 group-hover:text-[color:var(--terracotta)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {t.meta}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <Link
            to="/parcours"
            className="mt-6 inline-block text-[11px] uppercase tracking-[0.22em] underline underline-offset-[6px] text-dusk/70 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Tout mon parcours →
          </Link>
        </section>
      </div>
    </Shell>
  );
}
