import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Halos } from "@/components/legato/Halos";
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
  cocoon:    { eyebrow: "Aides concrètes", title: "On avance d'un seul pas.",            sub: "Rien à retenir, rien à finir aujourd'hui. Choisissez seulement ce qui semble possible." },
  anchoring: { eyebrow: "Aides concrètes", title: "Tout est là, dans l'ordre.",          sub: "Quatre portes claires. Vous avancez à votre rythme, étape par étape." },
  breath:    { eyebrow: "Aides concrètes", title: "Composer un adieu qui lui ressemble.", sub: "Fleurs, textes, musiques, ambiance. Inspiration douce, jamais imposée." },
  relay:     { eyebrow: "Aides concrètes", title: "D'autres mains peuvent porter avec vous.", sub: "Confier, transmettre, partager. Vous gardez la décision, d'autres soulagent." },
};

type Door = { to: string; eyebrow: string; title: string; body: string; key: "steps" | "ceremony" | "atmosphere" | "share" };
const DOORS: Door[] = [
  { key: "steps",      to: "/practical/steps",      eyebrow: "Démarches",        title: "Premiers jours",            body: "Constat, mairie, employeur. Trois choses, pas plus." },
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

  useEffect(() => { setBudget(loadPractical().budget); }, []);
  const updateBudget = (b: Budget) => { setBudget(b); savePractical({ budget: b }); };

  const gap = profile.density === "tight" ? "space-y-3" : profile.density === "open" ? "space-y-5" : "space-y-4";

  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant={profile.halo === "rich" ? "default" : "calm"} />
        <div className="relative z-10">
          <div className="px-7 pt-10 flex items-center justify-between">
            <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Accueil</Link>
            <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">{h.eyebrow}</span>
          </div>

          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Compagnon d'organisation</p>
            <h1 className="mt-3 font-serif text-[2.1rem] leading-[1.08] font-light text-dusk text-balance">
              {h.title}
            </h1>
            <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-dusk/65">{h.sub}</p>
          </header>

          <div className={`px-5 mt-10 ${gap}`}>
            {doors.map((d, i) => (
              <Link key={d.key} to={d.to} className="paper-card p-6 flex items-baseline gap-4 group">
                <span className="font-serif text-[24px] font-light text-dusk/35 leading-none w-7 shrink-0">
                  0{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{d.eyebrow}</p>
                  <h3 className="mt-1.5 font-serif text-[18px] italic text-dusk leading-snug">{d.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-dusk/65">{d.body}</p>
                </div>
                <span className="text-dusk/40 group-hover:text-dusk transition">→</span>
              </Link>
            ))}
          </div>

          {/* Budget — repliable, pas en premier plan */}
          <div className="px-5 mt-8">
            <button onClick={() => setBudgetOpen((o) => !o)} className="w-full paper-card p-5 text-left">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Budget indicatif</p>
                  <p className="mt-1 font-serif italic text-[15px] text-dusk">
                    {budget ? BUDGET_LABELS[budget].label : "À votre rythme — vous pouvez sauter cette étape"}
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
                      className={`p-3 organic-radius text-left ${budget === k ? "ceramic" : "ceramic-soft opacity-80"}`}
                    >
                      <p className="text-[12px] font-medium text-dusk">{BUDGET_LABELS[k].label}</p>
                      <p className="text-[10px] text-dusk/55 mt-0.5">{BUDGET_LABELS[k].range}</p>
                    </button>
                  ))}
                </div>
              )}
            </button>
          </div>

          {/* Volontés + inspiration */}
          <div className="px-5 mt-6 grid grid-cols-1 gap-3">
            <Link to="/wishes" className="paper-card p-5 flex items-baseline justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Mes volontés</p>
                <p className="mt-1 font-serif italic text-[15px] text-dusk">Écrire ce que je voudrais, pour le jour venu</p>
              </div>
              <span className="text-dusk/40">→</span>
            </Link>
            <Link to="/presence" className="paper-card p-5 flex items-baseline justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Parler en parallèle</p>
                <p className="mt-1 font-serif italic text-[15px] text-dusk">Une présence qui écoute, à tout moment</p>
              </div>
              <span className="text-dusk/40">→</span>
            </Link>
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
