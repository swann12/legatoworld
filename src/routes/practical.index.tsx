import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { useLegato, modeProfile, type Mode } from "@/lib/legato-state";
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
  cocoon:    { eyebrow: "Aides concrètes", title: "On avance d'un seul pas.",                 sub: "Rien à finir aujourd'hui. Seulement ce qui semble possible." },
  anchoring: { eyebrow: "Aides concrètes", title: "Tout est là, dans l'ordre.",               sub: "Quatre portes claires, à votre rythme." },
  breath:    { eyebrow: "Aides concrètes", title: "Composer un adieu qui lui ressemble.",     sub: "Fleurs, textes, musiques, ambiance. Jamais imposés." },
  relay:     { eyebrow: "Aides concrètes", title: "D'autres mains peuvent porter avec vous.", sub: "Confier, partager. Vous gardez la décision." },
};

type Door = { to: string; eyebrow: string; title: string; body: string; key: "steps" | "ceremony" | "atmosphere" | "share" };
const DOORS: Door[] = [
  { key: "steps",      to: "/practical/steps",      eyebrow: "Démarches",        title: "Premiers jours",            body: "Constat, mairie, employeur. Trois pas, pas plus." },
  { key: "ceremony",   to: "/practical/ceremony",   eyebrow: "Cérémonie",        title: "Choisir un déroulé",        body: "Inhumation, crémation, lieu, intervenants." },
  { key: "atmosphere", to: "/practical/atmosphere", eyebrow: "Atmosphère",       title: "Fleurs, textes, musiques",  body: "Composer une ambiance qui lui ressemble." },
  { key: "share",      to: "/practical/share",      eyebrow: "Partage et relais", title: "Transmettre, demander",    body: "Pompes funèbres, proches, officiant." },
];

function reorderForMode(mode: Mode): Door[] {
  const order: Record<Mode, Door["key"][]> = {
    cocoon:    ["steps", "atmosphere", "ceremony", "share"],
    anchoring: ["steps", "ceremony", "atmosphere", "share"],
    breath:    ["atmosphere", "ceremony", "steps", "share"],
    relay:     ["share", "steps", "ceremony", "atmosphere"],
  };
  return order[mode].map((k) => DOORS.find((d) => d.key === k)!);
}

function Practical() {
  const { mode } = useLegato();
  const profile = modeProfile(mode);
  const h = HEADERS[mode];
  const doors = reorderForMode(mode);
  const [budget, setBudget] = useState<Budget>("");
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => { setBudget(loadPractical().budget); }, []);
  const updateBudget = (b: Budget) => { setBudget(b); savePractical({ budget: b }); };

  const gap = profile.density === "tight" ? "space-y-3" : profile.density === "open" ? "space-y-5" : "space-y-4";

  return (
    <Shell hideNav>
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
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Compagnon d'organisation
            </p>
            <h1 className="mt-4 font-serif text-[36px] leading-[1.05] font-light text-dusk text-balance">
              {h.title}
            </h1>
            <p className="mt-6 max-w-[34ch] text-[14.5px] leading-[1.6] text-dusk/65">{h.sub}</p>
          </header>

          <div className={`px-7 mt-10 ${gap}`}>
            {doors.map((d, i) => (
              <Link
                key={d.key}
                to={d.to}
                className="block rounded-[16px] border border-dusk/12 bg-paper p-5 flex items-baseline gap-4 group hover:bg-dusk/[0.02] transition-colors"
              >
                <span
                  className="text-[11px] tracking-[0.18em] text-dusk/45 leading-none w-7 shrink-0"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  0{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[10px] uppercase tracking-[0.26em] text-dusk/50"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
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

                <Link
                  to="/resources"
                  className="block rounded-[16px] border border-dusk/12 bg-paper p-5 flex items-baseline justify-between"
                >
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-[0.26em] text-dusk/50"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Ressources & accompagnement
                    </p>
                    <p className="mt-1 font-serif italic text-[15px] text-dusk">
                      Des personnes de confiance, recommandées par Legato
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
      <ConfideDock step="accueil" />
    </Shell>
  );
}
