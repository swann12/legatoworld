import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { useLegato, type Mode } from "@/lib/legato-state";
import { BUDGET_LABELS, loadPractical, savePractical, type Budget } from "@/lib/practical-store";

export const Route = createFileRoute("/practical/")({
  head: () => ({
    meta: [
      { title: "Aides concrètes — Legato" },
      { name: "description", content: "Un compagnon doux pour les démarches, la cérémonie, les fleurs, les textes." },
    ],
  }),
  component: Practical,
});

const HEADERS: Record<Mode, { eyebrow: string; title: string; sub: string }> = {
  cocoon:    { eyebrow: "Avancer concrètement", title: "Une seule chose suffit.",           sub: "Nous vous guidons étape par étape. Rien ne doit être terminé aujourd'hui." },
  anchoring: { eyebrow: "Avancer concrètement", title: "Tout est là, dans l'ordre.",        sub: "Nous vous guidons étape par étape. Rien ne doit être terminé aujourd'hui." },
  breath:    { eyebrow: "Avancer concrètement", title: "Avancer d'un pas, doucement.",      sub: "Nous vous guidons étape par étape. Rien ne doit être terminé aujourd'hui." },
  relay:     { eyebrow: "Avancer concrètement", title: "Vous pouvez partager le poids.",    sub: "Nous vous guidons étape par étape. Rien ne doit être terminé aujourd'hui." },
};

/** « Votre prochaine étape » — une seule action en haut de page. */
const NEXT_STEP = {
  title: "Contacter une entreprise de pompes funèbres",
  why: "Premier rendez-vous pour organiser la mise en bière et la cérémonie.",
  duration: "10 minutes",
  to: "/plan" as const,
};

/** Trois accès principaux, sous la prochaine étape. */
const MAIN_LINKS = [
  { to: "/plan",      eyebrow: "Plan",      title: "Voir mon plan",     body: "Vos étapes, par priorité. À votre rythme." },
  { to: "/resources", eyebrow: "Aide",      title: "Trouver une aide",  body: "Pompes funèbres, notaires, thérapeutes, célébrant·es." },
  { to: "/practical/steps", eyebrow: "Documents", title: "Mes documents", body: "Pièce d'identité, livret de famille, certificat, contrats." },
] as const;

/** Autres portes (préparation cérémonie, ambiance, partage), discrètes. */
const DOORS = [
  { to: "/practical/ceremony",   eyebrow: "Cérémonie",   title: "Préparer la cérémonie",     body: "Lieu, format, intervenants, déroulé." },
  { to: "/practical/atmosphere", eyebrow: "Atmosphère",  title: "Fleurs, textes, musiques",  body: "Composer une ambiance qui lui ressemble." },
  { to: "/circle",               eyebrow: "Proches",     title: "Proches et relais",         body: "Inviter, confier, partager." },
  { to: "/practical/booklet",    eyebrow: "Livret",      title: "Le livret de cérémonie",    body: "Mettre en page, exporter en PDF." },
] as const;

function Practical() {
  const { mode } = useLegato();
  const h = HEADERS[mode];
  const [budget, setBudget] = useState<Budget>("");
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => { setBudget(loadPractical().budget); }, []);
  const updateBudget = (b: Budget) => { setBudget(b); savePractical({ budget: b }); };

  return (
    <Shell>
      <div className="relative">
        <div className="relative z-10">
          <div className="px-7 pt-10 flex items-center justify-between">
            <Link
              to="/home"
              className="text-[10px] uppercase tracking-[0.3em] text-dusk/55 hover:text-dusk"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ← Accueil
            </Link>
            <span
              className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {h.eyebrow}
            </span>
          </div>

          <header className="px-7 pt-14">
            <h1 className="font-serif text-[36px] leading-[1.05] font-light text-dusk text-balance">
              {h.title}
            </h1>
            <p className="mt-6 max-w-[34ch] text-[14.5px] leading-[1.6] text-dusk/65">{h.sub}</p>
          </header>

          {/* Votre prochaine étape */}
          <div className="px-7 mt-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-dusk/55" style={{ fontFamily: "var(--font-mono)" }}>
              Votre prochaine étape
            </p>
            <div className="mt-3 rounded-[20px] p-6 text-[color:var(--paper)]" style={{ background: "var(--bordeaux)" }}>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--paper)]/65" style={{ fontFamily: "var(--font-mono)" }}>
                Durée estimée · {NEXT_STEP.duration}
              </p>
              <h2 className="mt-2 font-serif italic text-[22px] leading-snug">{NEXT_STEP.title}</h2>
              <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--paper)]/80">{NEXT_STEP.why}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link to={NEXT_STEP.to} className="rounded-full bg-[color:var(--paper)] text-dusk px-5 py-2.5 text-[12px] tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                  Voir cette étape
                </Link>
                <button className="rounded-full border border-[color:var(--paper)]/40 text-[color:var(--paper)] px-4 py-2 text-[11px] tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                  Reporter
                </button>
                <Link to="/circle" className="rounded-full border border-[color:var(--paper)]/40 text-[color:var(--paper)] px-4 py-2 text-[11px] tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                  Confier
                </Link>
              </div>
            </div>
          </div>

          {/* Trois accès principaux */}
          <div className="px-7 mt-8 space-y-3">
            {MAIN_LINKS.map((d) => (
              <Link
                key={d.to}
                to={d.to}
                className="block rounded-[16px] border border-dusk/12 bg-paper p-5 flex items-baseline gap-4 group hover:bg-dusk/[0.02] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
                    {d.eyebrow}
                  </p>
                  <h3 className="mt-1.5 font-serif text-[19px] italic text-dusk leading-snug">{d.title}</h3>
                  <p className="mt-2 text-[13px] leading-[1.55] text-dusk/65">{d.body}</p>
                </div>
                <span className="text-dusk/40 group-hover:text-dusk transition">→</span>
              </Link>
            ))}
          </div>

          {/* « Pour aller plus loin » — replié par défaut, ne dispute pas la hiérarchie */}
          <div className="px-7 mt-10">
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className="w-full border-t border-dusk/15 pt-5 flex items-baseline justify-between text-left"
            >
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-dusk/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Pour aller plus loin
              </p>
              <span className="text-dusk/40 text-sm">{moreOpen ? "−" : "+"}</span>
            </button>

            {moreOpen && (
              <div className="mt-5 space-y-3">
                {DOORS.map((d) => (
                  <Link
                    key={d.to}
                    to={d.to}
                    className="block rounded-[16px] border border-dusk/12 bg-paper p-5 flex items-baseline gap-4 group hover:bg-dusk/[0.02] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.26em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>{d.eyebrow}</p>
                      <h3 className="mt-1.5 font-serif text-[17px] italic text-dusk leading-snug">{d.title}</h3>
                      <p className="mt-2 text-[13px] leading-[1.55] text-dusk/65">{d.body}</p>
                    </div>
                    <span className="text-dusk/40 group-hover:text-dusk transition">→</span>
                  </Link>
                ))}
                <button
                  onClick={() => setBudgetOpen((o) => !o)}
                  className="w-full rounded-[16px] border border-dusk/12 bg-paper p-5 text-left hover:bg-dusk/[0.02] transition-colors"
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.26em] text-dusk/50"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Budget indicatif
                      </p>
                      <p className="mt-1 font-serif italic text-[15px] text-dusk">
                        {budget ? BUDGET_LABELS[budget].label : "À votre rythme — facultatif"}
                      </p>
                    </div>
                    <span className="text-dusk/40">{budgetOpen ? "−" : "+"}</span>
                  </div>
                  {budgetOpen && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {(Object.keys(BUDGET_LABELS) as (keyof typeof BUDGET_LABELS)[]).map((k) => (
                        <button
                          key={k}
                          onClick={(e) => { e.stopPropagation(); updateBudget(k); }}
                          className={`p-3 rounded-[12px] border text-left ${
                            budget === k
                              ? "border-dusk/30 bg-clay"
                              : "border-dusk/12 bg-paper"
                          }`}
                        >
                          <p className="text-[12px] font-medium text-dusk">{BUDGET_LABELS[k].label}</p>
                          <p className="text-[10px] text-dusk/55 mt-0.5">{BUDGET_LABELS[k].range}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </button>

                <Link
                  to="/wishes"
                  className="block rounded-[16px] border border-dusk/12 bg-paper p-5 flex items-baseline justify-between"
                >
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-[0.26em] text-dusk/50"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Mes volontés
                    </p>
                    <p className="mt-1 font-serif italic text-[15px] text-dusk">
                      Écrire ce que je voudrais, pour le jour venu
                    </p>
                  </div>
                  <span className="text-dusk/40">→</span>
                </Link>
              </div>
            )}
          </div>

          <div className="px-7 mt-10 mb-6 text-center">
            <p className="font-serif italic text-[14px] text-dusk/55 max-w-[28ch] mx-auto text-balance">
              « Ralentir n'est pas perdre du temps. C'est en gagner pour soi. »
            </p>
          </div>
        </div>
      </div>
      </Shell>
  );
}
