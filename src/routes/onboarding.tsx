import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BRANCHES, PRACTICAL_BRANCH, useLegato, type Branch } from "@/lib/legato-state";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Commencer doucement — Legato" },
      { name: "description", content: "Quelques questions tranquilles pour accorder votre espace." },
    ],
  }),
  component: Onboarding,
});

type Step = 0 | 1;

function Onboarding() {
  const [step, setStep] = useState<Step>(0);
  const { name, setName, branch, setBranch } = useLegato();
  const navigate = useNavigate();

  const canContinue = step === 0 ? name.trim().length > 0 : true;

  const next = () => {
    if (!canContinue) return;
    if (step === 0) setStep(1);
    else navigate({ to: "/space" });
  };

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <div className="relative z-10 flex items-center justify-between px-7 pt-10">
          <button
            onClick={() => (step === 0 ? navigate({ to: "/" }) : setStep(((step - 1) as Step)))}
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
          {step === 0 && <StepWelcome name={name} setName={setName} />}
          {step === 1 && <StepBranch value={branch} onChange={setBranch} />}

          <div className="mt-auto pb-14 pt-12">
            <button
              onClick={next}
              disabled={!canContinue}
              className="block w-full rounded-[18px] text-[color:var(--paper)] px-6 py-5 text-center disabled:opacity-40"
              style={{ background: "var(--bordeaux)" }}
            >
              <span className="font-serif text-[20px] italic">
                {step === 1 ? "Entrer" : "Continuer"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="flex gap-1.5">
      {[0, 1].map((i) => (
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

function StepWelcome({ name, setName }: { name: string; setName: (s: string) => void }) {
  return (
    <div className="space-y-8">
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Étape 1 sur 2
      </p>
      <h2 className="font-serif text-[38px] leading-[1.02] font-light text-balance">
        Comment vous <span className="italic">appelez-vous ?</span>
      </h2>
      <div className="rounded-[14px] border border-dusk/15 bg-paper px-5 py-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Votre prénom"
          className="w-full bg-transparent font-serif text-[24px] italic text-dusk placeholder:text-dusk/30 outline-none"
          autoFocus
        />
      </div>
    </div>
  );
}

function StepBranch({ value, onChange }: { value: Branch; onChange: (b: Branch) => void }) {
  return (
    <div className="space-y-7">
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Étape 2 sur 2
      </p>
      <h2 className="font-serif text-[34px] leading-[1.04] font-light text-balance">
        Qu'est-ce qui vous <span className="italic">amène ?</span>
      </h2>
      <p className="text-[12.5px] text-dusk/55">Modifiable à tout moment.</p>

      <div className="space-y-2.5">
        {BRANCHES.map((b) => {
          const active = value === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onChange(b.id)}
              className={`w-full rounded-[14px] px-5 py-4 text-left transition-all border ${
                active
                  ? "border-dusk/30 bg-clay"
                  : "border-dusk/12 bg-paper hover:bg-clay/40"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-serif text-[19px] text-dusk">{b.label}</span>
                <span
                  className={`size-1.5 rounded-full transition-opacity ${
                    active ? "bg-terracotta breath" : "bg-dusk/0"
                  }`}
                />
              </div>
              <p className="mt-1.5 text-[12.5px] leading-[1.5] text-dusk/60">{b.whisper}</p>
            </button>
          );
        })}
      </div>

      {/* Practical-loss shortcut — placé à la fin */}
      <button
        onClick={() => onChange(PRACTICAL_BRANCH.id)}
        className={`w-full rounded-[14px] px-5 py-4 text-left transition-all border ${
          value === PRACTICAL_BRANCH.id
            ? "border-dusk/30 bg-clay"
            : "border-dusk/12 bg-paper hover:bg-clay/40"
        }`}
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-serif text-[19px] text-dusk">{PRACTICAL_BRANCH.label}</span>
          <span
            className="text-[9px] uppercase tracking-[0.24em] text-dusk/50 shrink-0"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            aide concrète
          </span>
        </div>
        <p className="mt-1.5 text-[12.5px] leading-[1.5] text-dusk/60">
          {PRACTICAL_BRANCH.whisper}
        </p>
      </button>
    </div>
  );
}