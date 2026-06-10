import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BRANCHES, TODAY_STATES, CONCRETE_PRIORITIES, useLegato,
  type Branch, type Space, type TodayState, type ConcretePriority,
} from "@/lib/legato-state";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Commencer doucement — Legato" },
      { name: "description", content: "Quelques questions tranquilles pour vous accueillir." },
    ],
  }),
  component: Onboarding,
});

/** 0 Prénom · 1 Bifurcation · 2 Situation · 3 État du jour (psy uniquement). */
type Step = 0 | 1 | 2 | 3;

function Onboarding() {
  const {
    name, setName,
    branch, setBranch,
    space, setSpace,
    todayState, setTodayState,
    concretePriority, setConcretePriority,
    setMode,
  } = useLegato();
  const initialStep: Step = name && name.trim().length > 0 ? 1 : 0;
  const [step, setStep] = useState<Step>(initialStep);
  const [localSpace, setLocalSpace] = useState<Space>(space);
  const [localToday, setLocalToday] = useState<TodayState>(todayState);
  const [localPriority, setLocalPriority] = useState<ConcretePriority>(concretePriority);
  const navigate = useNavigate();

  // 4 étapes pour les deux espaces : prénom · bifurcation · situation/priorité · état/finalisation.
  const total = 4;

  const canContinue =
    (step === 0 && !!name.trim()) ||
    (step === 1 && (localSpace === "psy" || localSpace === "concrete")) ||
    (step === 2 && (localSpace === "concrete" ? !!localPriority : !!branch)) ||
    (step === 3 && !!localToday);

  const finish = () => {
    setSpace(localSpace);
    if (localSpace === "psy") {
      setTodayState(localToday);
      const chosen = TODAY_STATES.find((t) => t.id === localToday);
      if (chosen) setMode(chosen.mode);
      navigate({ to: "/accompany" });
    } else {
      setConcretePriority(localPriority);
      navigate({ to: "/practical" });
    }
  };

  const goNext = () => {
    if (step === 2 && localSpace === "concrete") { finish(); return; } // concret : 3 vraies étapes
    if (step === 3) { finish(); return; }
    setStep(((step + 1) as Step));
  };

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <div className="relative z-10 flex items-center justify-between px-7 pt-10">
          <button
            onClick={() => (step === initialStep ? navigate({ to: "/" }) : setStep(((step - 1) as Step)))}
            className="text-[10px] uppercase tracking-[0.24em] text-dusk/50 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← Retour
          </button>
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Legato
          </p>
          <Progress step={step} total={total} />
        </div>

        <div className="relative z-10 flex flex-1 flex-col px-7 pt-14">
          {step === 0 && <StepName name={name} setName={setName} />}
          {step === 1 && <StepSpace value={localSpace} onChange={setLocalSpace} />}
          {step === 2 && localSpace === "concrete" && (
            <StepPriority value={localPriority} onChange={setLocalPriority} />
          )}
          {step === 2 && localSpace !== "concrete" && (
            <StepBranch value={branch} onChange={setBranch} space={localSpace} />
          )}
          {step === 3 && localSpace === "psy" && (
            <StepToday value={localToday} onChange={setLocalToday} />
          )}

          <div className="mt-auto pb-14 pt-12">
            <button
              onClick={goNext}
              disabled={!canContinue}
              className="block w-full rounded-[18px] text-[color:var(--paper)] px-6 py-5 text-center disabled:opacity-40"
              style={{ background: "var(--bordeaux)" }}
            >
              <span className="font-serif text-[20px] italic">
                {(step === 2 && localSpace === "concrete") || step === 3 ? "Entrer" : "Continuer"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => i).map((i) => (
        <span
          key={i}
          className={`h-[2px] w-5 rounded-full transition-all ${
            i <= step ? "bg-dusk/65" : "bg-dusk/15"
          }`}
        />
      ))}
    </div>
  );
}

function StepName({ name, setName }: { name: string; setName: (s: string) => void }) {
  return (
    <div className="space-y-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
        Étape 1 · Prénom
      </p>
      <h2 className="font-serif text-[40px] leading-[1.02] font-light text-balance">
        Comment souhaitez-vous <span className="italic">être appelé·e ?</span>
      </h2>
      <p className="text-[14.5px] leading-[1.6] text-dusk/65 max-w-[34ch]">
        Un prénom suffit pour vous accueillir.
      </p>
      <div className="rounded-[14px] border border-dusk/15 bg-paper px-5 py-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Swann"
          className="w-full bg-transparent font-serif text-[24px] italic text-dusk placeholder:text-dusk/30 outline-none"
        />
      </div>
    </div>
  );
}

/** Étape 2 — Bifurcation explicite (principe non négociable du brief). */
function StepSpace({ value, onChange }: { value: Space; onChange: (s: Space) => void }) {
  // Deux options visuellement cohérentes : même paper, même rayon, même typo.
  // L'état sélectionné est explicite : bordure bordeaux 2px + wash teinté + dot plein.
  const OPTIONS: { id: Exclude<Space, null>; title: string; body: string }[] = [
    {
      id: "psy",
      title: "Accompagnement psychologique",
      body: "Traverser, ressentir.",
    },
    {
      id: "concrete",
      title: "Aide concrète",
      body: "Organiser, avancer.",
    },
  ];
  return (
    <div className="space-y-7">
      <p className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
        Étape 2 · Choisir un espace
      </p>
      <h2 className="font-serif text-[30px] leading-[1.06] font-light text-balance">
        Aujourd'hui, vous cherchez <span className="italic">plutôt…</span>
      </h2>
      <p className="text-[13.5px] text-dusk/60 max-w-[34ch]">
        Vous pourrez changer à tout moment.
      </p>
      <div className="space-y-3">
        {OPTIONS.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              aria-pressed={active}
              className="block w-full rounded-[16px] px-6 py-5 text-left transition-all"
              style={{
                background: active ? "var(--bordeaux-wash)" : "var(--paper)",
                border: active
                  ? "2px solid var(--bordeaux-soft)"
                  : "2px solid color-mix(in oklab, var(--dusk) 10%, transparent)",
                color: "var(--dusk)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  className="font-serif text-[19px] leading-tight font-light"
                  style={{ color: active ? "var(--bordeaux)" : "var(--dusk)" }}
                >
                  {o.title}
                </p>
                <span
                  aria-hidden
                  className="shrink-0 size-4 rounded-full border-2 flex items-center justify-center transition-colors"
                  style={{
                    borderColor: active ? "var(--bordeaux-soft)" : "color-mix(in oklab, var(--dusk) 25%, transparent)",
                    background: active ? "var(--bordeaux-soft)" : "transparent",
                  }}
                >
                  {active && <span className="size-1.5 rounded-full bg-[color:var(--paper)]" />}
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-[1.45] text-dusk/60">{o.body}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepBranch({
  value,
  onChange,
  space,
}: {
  value: Branch;
  onChange: (b: Branch) => void;
  space: Space;
}) {
  // Filtrage selon l'espace.
  // - Aide concrète : on garde les démarches, le décès d'un proche et la préparation des volontés.
  // - Psy : on retire « préparer mes volontés » (relève du concret, brief point 14).
  const list = space === "concrete"
    ? BRANCHES.filter((b) => b.id === "person" || b.id === "practical" || b.id === "wishes")
    : BRANCHES.filter((b) => b.id !== "wishes");
  return (
    <div className="space-y-7">
      <p className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
        Étape 3 · Qui est concerné·e ?
      </p>
      <h2 className="font-serif text-[36px] leading-[1.04] font-light text-balance">
        Qu'est-ce qui vous amène <span className="italic">en ce moment ?</span>
      </h2>
      <p className="text-[13.5px] text-dusk/60 max-w-[34ch]">
        Vous pourrez modifier votre réponse à tout moment.
      </p>
      <div className="space-y-2.5">
        {list.map((b) => {
          const active = value === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onChange(b.id)}
              className={`w-full rounded-[14px] px-5 py-4 text-left transition-all border ${
                active ? "border-dusk/30 bg-clay" : "border-dusk/12 bg-paper hover:bg-clay/40"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-serif text-[19px] text-dusk">{b.label}</span>
                <span className={`size-1.5 rounded-full transition-opacity ${active ? "bg-terracotta breath" : "bg-dusk/0"}`} />
              </div>
              <p className="mt-1.5 text-[12.5px] leading-[1.5] text-dusk/60">{b.whisper}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepToday({ value, onChange }: { value: TodayState; onChange: (s: TodayState) => void }) {
  return (
    <div className="space-y-7">
      <p className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
        Étape 4 · Comment vous sentez-vous ?
      </p>
      <h2 className="font-serif text-[36px] leading-[1.04] font-light text-balance">
        Aujourd'hui, plutôt <span className="italic">comment ?</span>
      </h2>
      <p className="text-[13.5px] text-dusk/60 max-w-[34ch]">
        Cela nous aide à adapter le ton, l'ordre des cartes et l'intensité.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {TODAY_STATES.map((tst) => {
          const active = value === tst.id;
          return (
            <button
              key={tst.id}
              onClick={() => onChange(tst.id)}
              className={`rounded-[12px] px-4 py-3 text-left transition-all border ${
                active ? "border-dusk/30 bg-clay" : "border-dusk/12 bg-paper hover:bg-clay/40"
              }`}
            >
              <span className="font-serif text-[16px] text-dusk">{tst.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepPriority({
  value, onChange,
}: { value: ConcretePriority; onChange: (p: ConcretePriority) => void }) {
  return (
    <div className="space-y-7">
      <p className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
        Étape 3 · Par où commencer
      </p>
      <h2 className="font-serif text-[34px] leading-[1.05] font-light text-balance">
        Par où souhaitez-vous <span className="italic">être guidé·e ?</span>
      </h2>
      <p className="text-[13.5px] text-dusk/60 max-w-[34ch]">
        Nous organiserons les étapes pour vous, dans l'ordre et avec les délais qui comptent.
      </p>
      <div className="space-y-2.5">
        {CONCRETE_PRIORITIES.map((p) => {
          const active = value === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`w-full rounded-[14px] px-5 py-4 text-left transition-all border ${
                active ? "border-dusk/30 bg-clay" : "border-dusk/12 bg-paper hover:bg-clay/40"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-serif text-[18px] text-dusk">{p.label}</span>
                <span className={`size-1.5 rounded-full transition-opacity ${active ? "bg-terracotta breath" : "bg-dusk/0"}`} />
              </div>
              <p className="mt-1.5 text-[12.5px] leading-[1.5] text-dusk/60">{p.whisper}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Conservé pour compat éventuelle, non utilisé par le nouvel onboarding.
function _StepToday_legacy({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  return (
    <div className="space-y-7">
      <div className="space-y-2.5">
        {TODAY_STATES.map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`w-full rounded-[14px] px-5 py-4 text-left transition-all border ${
                active ? "border-dusk/30 bg-clay" : "border-dusk/12 bg-paper hover:bg-clay/40"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-serif text-[18px] text-dusk">{t.label}</span>
                <span className={`size-1.5 rounded-full transition-opacity ${active ? "bg-terracotta breath" : "bg-dusk/0"}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function _StepNeed_unused({
  name,
  onChoose,
}: {
  name: string;
  onChoose: (where: "accompany" | "practical" | "home") => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <p className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
        Étape 4 · Besoin principal
      </p>
      <h2 className="mt-4 font-serif text-[36px] leading-[1.04] font-light text-balance">
        De quoi avez-vous besoin, <span className="italic">{name || "vous"}, maintenant ?</span>
      </h2>

      <div className="mt-8 space-y-3">
        <button
          onClick={() => onChoose("accompany")}
          className="block w-full rounded-[18px] text-[color:var(--paper)] px-6 py-6 text-left"
          style={{ background: "var(--bordeaux)" }}
        >
          <p className="font-serif italic text-[22px]">Être accompagné·e</p>
          <p className="mt-2 text-[13.5px] leading-[1.5] text-[color:var(--paper)]/75">
            Pour parler, respirer, écrire ou simplement vous poser.
          </p>
        </button>

        <button
          onClick={() => onChoose("practical")}
          className="block w-full rounded-[18px] px-6 py-6 text-left"
          style={{ background: "var(--sage)" }}
        >
          <p className="font-serif italic text-[22px] text-dusk">Avancer concrètement</p>
          <p className="mt-2 text-[13.5px] leading-[1.5] text-dusk/70">
            Pour être guidé·e dans les démarches et l'organisation.
          </p>
        </button>
      </div>

      <button
        onClick={() => onChoose("home")}
        className="mt-6 text-center text-[12px] tracking-[0.18em] text-dusk/55 hover:text-dusk uppercase py-3"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Je préfère découvrir tranquillement
      </button>
    </div>
  );
}