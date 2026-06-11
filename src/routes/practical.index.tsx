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
  { label: "En cours",      value: 2, accent: "var(--azure)" },
  { label: "Délégué",       value: 1, accent: "var(--sun)" },
  { label: "Documents",     value: 2, accent: "var(--magenta)" },
  { label: "Prochaine échéance", value: "Vendredi", accent: "var(--dusk)" },
];

function Practical() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-7 pt-10 flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Legato · Organiser
          </span>
          <Link
            to="/space"
            className="text-[10px] uppercase tracking-[0.24em] text-dusk/50 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Changer d'espace
          </Link>
        </header>

        <section className="px-7 pt-14">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Aujourd'hui
          </p>
          <h1 className="mt-4 font-serif text-[36px] leading-[1.05] text-dusk font-light text-balance">
            Avançons <span className="italic">une étape à la fois.</span>
          </h1>
          <p className="mt-5 max-w-[36ch] text-[14.5px] leading-[1.6] text-dusk/60">
            Nous avons rassemblé ce qui mérite votre attention aujourd'hui.
          </p>
        </section>

        {/* ─── Priorité principale — bleu nuit ─── */}
        <section className="px-7 pt-10">
          <article
            className="rounded-[18px] overflow-hidden text-[color:var(--paper)]"
            style={{ background: "var(--navy)" }}
          >
            <div className="px-6 pt-7 pb-6">
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
              <h2 className="mt-3 font-serif text-[26px] leading-[1.12] text-balance">
                Déclarer le décès <span className="italic">à la mairie.</span>
              </h2>
              <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--paper)]/75 max-w-[36ch]">
                C'est l'étape qui débloque toutes les suivantes. Vous pouvez le faire
                en personne ou demander à un proche.
              </p>
              <p
                className="mt-4 text-[10px] uppercase tracking-[0.24em] text-[color:var(--paper)]/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Documents · Pièce d'identité · Certificat de décès
              </p>

              <div className="mt-6 flex items-center gap-3">
                <Link
                  to="/practical/steps"
                  className="rounded-[12px] px-5 py-3 text-[14px] flex-1 text-center"
                  style={{ background: "var(--paper)", color: "var(--navy)" }}
                >
                  <span className="font-serif italic">Commencer</span>
                </Link>
                <button
                  className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--paper)]/80 px-3 py-2"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Déléguer
                </button>
              </div>
              <div className="mt-3 text-center">
                <Link
                  to="/presence"
                  className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--paper)]/65 hover:text-[color:var(--paper)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Poser une question
                </Link>
              </div>
            </div>
          </article>
        </section>

        {/* ─── Résumé compact ─── */}
        <section className="px-7 pt-10">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/55 mb-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Vue d'ensemble
          </p>
          <div className="divide-y divide-dusk/10 border-y border-dusk/12">
            {SUMMARY.map((s) => (
              <div key={s.label} className="py-4 flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: s.accent }}
                  />
                  <span
                    className="text-[11px] uppercase tracking-[0.24em] text-dusk/65"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {s.label}
                  </span>
                </div>
                <span className="font-serif italic text-[19px] text-dusk">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/parcours"
            className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-dusk/65 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Voir tout mon parcours →
          </Link>
        </section>

        {/* ─── Portes secondaires ─── */}
        <section className="px-7 pt-10 space-y-3">
          <Link
            to="/practical/ceremony"
            className="block rounded-[14px] border border-dusk/12 bg-paper p-5 flex items-baseline justify-between"
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.24em] text-dusk/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Cérémonie
              </p>
              <p className="mt-1 font-serif italic text-[17px] text-dusk">
                Préparer le déroulé
              </p>
            </div>
            <span className="text-dusk/45">→</span>
          </Link>
          <Link
            to="/practical/atmosphere"
            className="block rounded-[14px] border border-dusk/12 bg-paper p-5 flex items-baseline justify-between"
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.24em] text-dusk/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Atmosphère
              </p>
              <p className="mt-1 font-serif italic text-[17px] text-dusk">
                Composer une ambiance
              </p>
            </div>
            <span className="text-dusk/45">→</span>
          </Link>
          <Link
            to="/resources"
            className="block rounded-[14px] border border-dusk/12 bg-paper p-5 flex items-baseline justify-between"
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.24em] text-dusk/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Services
              </p>
              <p className="mt-1 font-serif italic text-[17px] text-dusk">
                Pompes funèbres, notaires, fleuristes…
              </p>
            </div>
            <span className="text-dusk/45">→</span>
          </Link>
        </section>
      </div>
    </Shell>
  );
}
