import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BRANCHES, useLegato, type Branch, type Mode } from "@/lib/legato-state";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Commencer doucement — Legato" },
      { name: "description", content: "Quelques questions tranquilles pour vous accueillir." },
    ],
  }),
  component: Onboarding,
});

type Step = 0 | 1 | 2 | 3;
const TOTAL_STEPS = 4;

/** Six réponses simples pour l'état du jour, mappées vers les modes existants. */
const TODAY_STATES: { id: string; label: string; mode: Mode }[] = [
  { id: "calm",        label: "J'ai besoin de calme",    mode: "cocoon"    },
  { id: "overwhelmed", label: "Je me sens submergé·e",   mode: "cocoon"    },
  { id: "anchor",      label: "J'ai besoin de repères",  mode: "anchoring" },
  { id: "breathe",     label: "J'ai besoin de souffler", mode: "breath"    },
  { id: "help",        label: "J'ai besoin d'aide",      mode: "relay"     },
  { id: "later",       label: "Je ne sais pas encore",   mode: "cocoon"    },
];

function Onboarding() {
  const { name, setName, branch, setBranch, setMode } = useLegato();
  const initialStep: Step = name && name.trim().length > 0 ? 1 : 0;
  const [step, setStep] = useState<Step>(initialStep);
  const [todayId, setTodayId] = useState<string>("calm");
  const navigate = useNavigate();

  const goNext = () => { if (step < 3) setStep(((step + 1) as Step)); };

  const finish = (where: "accompany" | "practical" | "home") => {
    const chosen = TODAY_STATES.find((t) => t.id === todayId);
    if (chosen) setMode(chosen.mode);
    navigate({ to: where === "accompany" ? "/accompany" : where === "practical" ? "/practical" : "/home" });
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
          <Progress step={step} />
        </div>

        <div className="relative z-10 flex flex-1 flex-col px-7 pt-14">
          {step === 0 && <StepName name={name} setName={setName} />}
          {step === 1 && <StepBranch value={branch} onChange={setBranch} />}
          {step === 2 && <StepToday value={todayId} onChange={setTodayId} />}
          {step === 3 && <StepNeed name={name} onChoose={finish} />}

          {step < 3 && (
            <div className="mt-auto pb-14 pt-12">
              <button
                onClick={goNext}
                disabled={step === 0 && !name.trim()}
                className="block w-full rounded-[18px] text-[color:var(--paper)] px-6 py-5 text-center disabled:opacity-50"
                style={{ background: "var(--bordeaux)" }}
              >
                <span className="font-serif text-[20px] italic">Continuer</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i).map((i) => (
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

function StepBranch({ value, onChange }: { value: Branch; onChange: (b: Branch) => void }) {
  return (
    <div className="space-y-7">
      <p className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
        Étape 2 · Situation
      </p>
      <h2 className="font-serif text-[36px] leading-[1.04] font-light text-balance">
        Qu'est-ce qui vous amène <span className="italic">en ce moment ?</span>
      </h2>
      <p className="text-[13.5px] text-dusk/60 max-w-[34ch]">
        Vous pourrez modifier votre réponse à tout moment.
      </p>
      <div className="space-y-2.5">
        {BRANCHES.map((b) => {
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

function StepToday({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  return (
    <div className="space-y-7">
      <p className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
        Étape 3 · État du jour
      </p>
      <h2 className="font-serif text-[36px] leading-[1.04] font-light text-balance">
        Comment vous sentez-vous <span className="italic">aujourd'hui ?</span>
      </h2>
      <p className="text-[13.5px] text-dusk/60 max-w-[34ch]">
        Choisissez ce qui vous ressemble le plus. Vous pourrez changer d'avis à tout moment.
      </p>
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

function StepNeed({
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