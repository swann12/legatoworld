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

/* ─── Accueil ESPACE ORGANISER ET AVANCER ───
 * Une carte priorité principale (aplat bleu nuit) + résumé compact.
 * Pas de choix initial à faire — l'application a déjà rassemblé. */

const SUMMARY = [
  { label: "À faire",       value: 3, accent: "var(--ember)" },
  { label: "En cours",      value: 2, accent: "var(--terracotta)" },
  { label: "Délégué",       value: 1, accent: "var(--sun)" },
  { label: "Documents",     value: 2, accent: "var(--magenta)" },
  { label: "Prochaine échéance", value: "Vendredi", accent: "var(--dusk)" },
];

function Practical() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-7 pt-9 flex items-center justify-between">
          <span className="font-serif text-[20px] text-dusk leading-none">Legato</span>
          <Link
            to="/space"
            className="text-[12px] tracking-wide text-dusk/65 hover:text-dusk underline underline-offset-4"
          >
            Espace
          </Link>
        </header>

        <section className="px-7 pt-16">
          <p
            className="text-[10px] uppercase tracking-[0.32em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Aujourd'hui
          </p>
          <h1 className="mt-5 font-serif text-[36px] leading-[1.05] text-dusk font-light text-balance">
            Avançons <span className="italic">une étape à la fois.</span>
          </h1>
          <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.55] text-dusk/65">
            Nous avons rassemblé ce qui mérite votre attention aujourd'hui.
          </p>
        </section>

        {/* ─── Priorité du jour — aplat bordeaux profond ─── */}
        <section className="px-5 pt-10">
          <article
            className="rounded-[22px] overflow-hidden text-[color:var(--paper)]"
            style={{ background: "var(--bordeaux)" }}
          >
            <div className="px-7 pt-8 pb-7">
              <div className="flex items-baseline justify-between">
                <p
                  className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--paper)]/65"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Priorité du jour
                </p>
                <span
                  className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--paper)]/70"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ~ 20 min
                </span>
              </div>
              <h2 className="mt-4 font-serif text-[30px] leading-[1.06] font-light text-balance">
                Déclarer le décès <span className="italic">à la mairie.</span>
              </h2>
              <p className="mt-4 text-[14px] leading-[1.55] text-[color:var(--paper)]/75 max-w-[34ch]">
                Cette étape débloque toutes les suivantes.
              </p>

              <div className="mt-7 flex items-center gap-4">
                <Link
                  to="/practical/steps"
                  className="rounded-full px-6 py-3 text-[13px] tracking-wide"
                  style={{ background: "var(--paper)", color: "var(--bordeaux)", fontFamily: "var(--font-mono)" }}
                >
                  COMMENCER  →
                </Link>
                <Link
                  to="/presence"
                  className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--paper)]/75 hover:text-[color:var(--paper)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Déléguer
                </Link>
              </div>
            </div>
          </article>
        </section>

        {/* ─── Résumé compact ─── */}
        <section className="px-7 pt-12">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50 mb-3"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Vue d'ensemble
          </p>
          <div className="divide-y divide-dusk/10 border-t border-dusk/12">
            {SUMMARY.map((s) => (
              <div key={s.label} className="py-4 flex items-baseline justify-between gap-4">
                <span
                  className="text-[12px] tracking-wide text-dusk/70"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {s.label}
                </span>
                <span className="font-serif italic text-[20px] text-dusk">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/parcours"
            className="mt-5 inline-flex items-center gap-2 text-[13px] text-dusk/80 hover:text-dusk underline underline-offset-4"
          >
            Voir tout mon parcours →
          </Link>
        </section>

        {/* ─── Portes secondaires — deux cartes pleine couleur ─── */}
        <section className="px-5 pt-12 space-y-4">
          <SecondaryCard
            to="/practical/ceremony"
            bg="var(--blush)"
            title={<>Préparer<br /><span className="italic">la cérémonie</span></>}
            label="LIEU · MUSIQUES · TEXTES"
          />
          <SecondaryCard
            to="/practical/atmosphere"
            bg="var(--sun)"
            title={<>Composer<br /><span className="italic">une ambiance</span></>}
            label="FLEURS · COULEURS · OBJETS"
          />
          <SecondaryCard
            to="/resources"
            bg="var(--clay)"
            title={<>Services<br /><span className="italic">utiles</span></>}
            label="POMPES FUNÈBRES · NOTAIRES"
          />
        </section>
      </div>
    </Shell>
  );
}

function SecondaryCard({
  to, bg, title, label,
}: { to: string; bg: string; title: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="block rounded-[22px] overflow-hidden"
      style={{ background: bg, color: "var(--dusk)" }}
    >
      <div className="px-7 pt-7 pb-6 min-h-[170px] flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-[26px] leading-[1.06] font-light">{title}</h3>
          <span className="text-[22px] leading-none translate-y-2 opacity-70">→</span>
        </div>
        <p
          className="mt-auto pt-8 text-[10px] tracking-[0.28em] text-dusk/60"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {label}
        </p>
      </div>
    </Link>
  );
}
