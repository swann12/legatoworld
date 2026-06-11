import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BRANCHES, FEELINGS, useLegato, type Branch, type Feeling } from "@/lib/legato-state";

export const Route = createFileRoute("/onboarding/care")({
  head: () => ({ meta: [{ title: "Bienvenue — Legato" }] }),
  component: OnboardingCare,
});

/* Onboarding de l'espace ÊTRE ACCOMPAGNÉ·E
 * 2 questions maximum, exactement comme spécifié :
 *  1) Qu'est-ce qui vous amène aujourd'hui ?
 *  2) Comment vous sentez-vous aujourd'hui ? (multi-select) */
function OnboardingCare() {
  const navigate = useNavigate();
  const { branch, setBranch, feelings, setFeelings, setCareOnboarded } = useLegato();
  const [step, setStep] = useState<0 | 1>(0);

  const toggleFeeling = (f: Feeling) =>
    setFeelings(feelings.includes(f) ? feelings.filter((x) => x !== f) : [...feelings, f]);

  const finish = () => {
    setCareOnboarded(true);
    navigate({ to: "/home" });
  };

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="px-7 pt-10 flex items-center justify-between">
          <button
            onClick={() => (step === 0 ? navigate({ to: "/space" }) : setStep(0))}
            className="text-[10px] uppercase tracking-[0.24em] text-dusk/50 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← Retour
          </button>
          <Dots count={2} step={step} />
          <span className="w-12" />
        </header>

        <div className="flex-1 px-7 pt-12">
          {step === 0 ? (
            <>
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Question 1 sur 2
              </p>
              <h2 className="mt-3 font-serif text-[32px] leading-[1.06] font-light text-balance">
                Qu'est-ce qui vous amène <span className="italic" style={{ color: "var(--terracotta)" }}>aujourd'hui&nbsp;?</span>
              </h2>
              <ul className="mt-7 space-y-2">
                {BRANCHES.map((b) => (
                  <li key={b.id}>
                    <button
                      onClick={() => setBranch(b.id as Branch)}
                      className={`w-full text-left rounded-[14px] px-5 py-4 border transition-colors ${
                        branch === b.id
                          ? "border-dusk/35 bg-clay"
                          : "border-dusk/12 bg-paper hover:bg-dusk/[0.03]"
                      }`}
                    >
                      <span className="font-serif text-[17px] text-dusk">{b.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Question 2 sur 2
              </p>
              <h2 className="mt-3 font-serif text-[32px] leading-[1.06] font-light text-balance">
                Comment vous sentez-vous <span className="italic" style={{ color: "var(--terracotta)" }}>aujourd'hui&nbsp;?</span>
              </h2>
              <p className="mt-2 text-[12.5px] text-dusk/55">Plusieurs choix possibles.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {FEELINGS.map((f) => {
                  const active = feelings.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggleFeeling(f.id)}
                      className={`rounded-full px-4 py-2 text-[13.5px] border transition-colors ${
                        active
                          ? "bg-dusk text-paper border-dusk"
                          : "border-dusk/20 text-dusk/75 hover:bg-dusk/5"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="px-7 pb-12">
          <button
            onClick={() => (step === 0 ? setStep(1) : finish())}
            className="block w-full rounded-[18px] text-[color:var(--paper)] px-6 py-5 text-center"
            style={{ background: "var(--bordeaux)" }}
          >
            <span className="font-serif text-[20px] italic">
              {step === 0 ? "Continuer" : "Entrer dans l'espace"}
            </span>
          </button>
          {step === 1 && (
            <button
              onClick={finish}
              className="mt-3 w-full text-center text-[11px] uppercase tracking-[0.22em] text-dusk/50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Passer
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function Dots({ count, step }: { count: number; step: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-[2px] w-5 rounded-full ${i <= step ? "bg-dusk/65" : "bg-dusk/15"}`}
        />
      ))}
    </div>
  );
}