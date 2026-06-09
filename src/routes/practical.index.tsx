import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { SpaceSwitcher } from "@/components/legato/SpaceSwitcher";
import { useLegato, CONCRETE_PRIORITIES, type Mode } from "@/lib/legato-state";
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

/** Titre éditorial commun, sans variation gratuite (brief §6 : moins de tailles). */
const HEADER = {
  title: "Une seule chose suffit.",
  sub: "Nous vous guidons étape par étape. Rien ne doit être terminé aujourd'hui.",
};

/** Trois accès principaux, sous la prochaine étape. */
const MAIN_LINKS = [
  { to: "/plan",      eyebrow: "Plan",      title: "Voir mon plan",     body: "Vos étapes, par priorité. À votre rythme." },
  { to: "/resources", eyebrow: "Aide",      title: "Trouver une aide",  body: "Pompes funèbres, notaires, thérapeutes, célébrant·es." },
  { to: "/documents", eyebrow: "Documents", title: "Mes documents", body: "Pièce d'identité, livret de famille, certificat, contrats." },
] as const;

/** Autres portes (préparation cérémonie, ambiance, partage), discrètes. */
const DOORS = [
  { to: "/practical/ceremony",   eyebrow: "Cérémonie",   title: "Préparer la cérémonie",     body: "Lieu, format, intervenants, déroulé." },
  { to: "/practical/atmosphere", eyebrow: "Atmosphère",  title: "Fleurs, textes, musiques",  body: "Composer une ambiance qui lui ressemble." },
  { to: "/circle",               eyebrow: "Proches",     title: "Proches et relais",         body: "Inviter, confier, partager." },
  { to: "/practical/booklet",    eyebrow: "Livret",      title: "Le livret de cérémonie",    body: "Mettre en page, exporter en PDF." },
] as const;

function Practical() {
  const { space, setSpace, concretePriority } = useLegato();
  // Atterrir ici fixe l'espace concret.
  useEffect(() => {
    if (space !== "concrete") setSpace("concrete");
  }, [space, setSpace]);
  const h = HEADER;
  const priority = CONCRETE_PRIORITIES.find((p) => p.id === concretePriority) ?? CONCRETE_PRIORITIES[0];
  const NEXT_STEP = { ...priority.next, to: "/plan" as const };
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
            <Link to="/home" className="eyebrow hover:text-dusk">← Aujourd'hui</Link>
            <SpaceSwitcher />
          </div>

          <header className="px-7 pt-12">
            <p className="eyebrow">Mon plan · {priority.label}</p>
            <h1 className="mt-4 font-serif text-[30px] leading-[1.06] font-light text-dusk text-balance">
              {h.title}
            </h1>
            <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.6] text-dusk/65">{h.sub}</p>
          </header>

          {/* Votre prochaine étape — surface feature unique */}
          <div className="px-7 mt-10">
            <p className="eyebrow">Votre prochaine étape</p>
            <div className="mt-3 surface-feature p-6">
              <p className="eyebrow text-[color:var(--paper)]/65">
                Durée estimée · {NEXT_STEP.duration}
              </p>
              <h2 className="mt-2 font-serif text-[22px] leading-snug font-light">{NEXT_STEP.title}</h2>
              <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--paper)]/80">{NEXT_STEP.why}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link
                  to={NEXT_STEP.to}
                  className="rounded-full bg-[color:var(--paper)] text-dusk px-5 py-2.5 label-mono"
                >
                  Voir cette étape
                </Link>
                <button className="rounded-full border border-[color:var(--paper)]/40 text-[color:var(--paper)] px-4 py-2 label-mono">
                  Reporter
                </button>
                <Link
                  to="/circle"
                  className="rounded-full border border-[color:var(--paper)]/40 text-[color:var(--paper)] px-4 py-2 label-mono"
                >
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
                className="surface block p-5 flex items-baseline gap-4 group hover:bg-dusk/[0.02] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="eyebrow">{d.eyebrow}</p>
                  <h3 className="mt-2 font-serif text-[19px] font-light text-dusk leading-snug">{d.title}</h3>
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
              <p className="eyebrow">Pour aller plus loin</p>
              <span className="text-dusk/40 text-sm">{moreOpen ? "−" : "+"}</span>
            </button>

            {moreOpen && (
              <div className="mt-5 space-y-3">
                {DOORS.map((d) => (
                  <Link
                    key={d.to}
                    to={d.to}
                    className="surface block p-5 flex items-baseline gap-4 group hover:bg-dusk/[0.02] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="eyebrow">{d.eyebrow}</p>
                      <h3 className="mt-2 font-serif text-[17px] font-light text-dusk leading-snug">{d.title}</h3>
                      <p className="mt-2 text-[13px] leading-[1.55] text-dusk/65">{d.body}</p>
                    </div>
                    <span className="text-dusk/40 group-hover:text-dusk transition">→</span>
                  </Link>
                ))}
                <button
                  onClick={() => setBudgetOpen((o) => !o)}
                  className="w-full surface p-5 text-left hover:bg-dusk/[0.02] transition-colors"
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="eyebrow">Budget indicatif</p>
                      <p className="mt-2 text-[14px] text-dusk">
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
                          className={`p-3 rounded-[12px] border text-left transition-colors ${
                            budget === k
                              ? "border-dusk/40 bg-dusk/[0.04]"
                              : "border-dusk/12 bg-paper hover:bg-dusk/[0.02]"
                          }`}
                        >
                          <p className="text-[12px] font-medium text-dusk">{BUDGET_LABELS[k].label}</p>
                          <p className="text-[10px] text-dusk/55 mt-0.5">{BUDGET_LABELS[k].range}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </button>

                <Link to="/wishes" className="surface block p-5 flex items-baseline justify-between">
                  <div>
                    <p className="eyebrow">Mes volontés</p>
                    <p className="mt-2 text-[14px] text-dusk">
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
