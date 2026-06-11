import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PRACTICAL_WHO, useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/onboarding/practical")({
  head: () => ({ meta: [{ title: "Avançons — Legato" }] }),
  component: OnboardingPractical,
});

/* Onboarding de l'espace ORGANISER & AVANCER
 * 3 questions :
 *  1) Qui souhaitez-vous accompagner ?
 *  2) À quelle date le décès a-t-il eu lieu ?
 *  3) Souhaitez-vous être accompagné·e étape par étape ? */
function OnboardingPractical() {
  const navigate = useNavigate();
  const { practicalContext, setPracticalContext, setPracticalOnboarded } = useLegato();
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const finish = () => {
    setPracticalOnboarded(true);
    navigate({ to: "/practical" });
  };

  const canContinue =
    step === 0 ? practicalContext.who !== null
    : step === 1 ? practicalContext.deathDate !== null
    : practicalContext.guided !== null;

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="px-7 pt-10 flex items-center justify-between">
          <button
            onClick={() => (step === 0 ? navigate({ to: "/space" }) : setStep(((step - 1) as 0 | 1)))}
            className="text-[10px] uppercase tracking-[0.24em] text-dusk/50 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← Retour
          </button>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-[2px] w-5 rounded-full ${i <= step ? "bg-dusk/65" : "bg-dusk/15"}`} />
            ))}
          </div>
          <span className="w-12" />
        </header>

        <div className="flex-1 px-7 pt-12 space-y-6">
          {step === 0 && (
            <>
              <p className="text-[10px] uppercase tracking-[0.28em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>Question 1 sur 3</p>
              <h2 className="font-serif text-[32px] leading-[1.06] font-light text-balance">
                Qui souhaitez-vous <span className="italic" style={{ color: "var(--bordeaux)" }}>accompagner&nbsp;?</span>
              </h2>
              <ul className="space-y-2">
                {PRACTICAL_WHO.map((w) => (
                  <li key={w.id}>
                    <button
                      onClick={() => setPracticalContext({ who: w.id })}
                      className={`w-full text-left rounded-[14px] px-5 py-4 border transition-colors ${
                        practicalContext.who === w.id
                          ? "border-dusk/35 bg-clay"
                          : "border-dusk/12 bg-paper hover:bg-dusk/[0.03]"
                      }`}
                    >
                      <span className="font-serif text-[17px] text-dusk">{w.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-[10px] uppercase tracking-[0.28em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>Question 2 sur 3</p>
              <h2 className="font-serif text-[32px] leading-[1.06] font-light text-balance">
                À quelle date <span className="italic" style={{ color: "var(--bordeaux)" }}>le décès a-t-il eu lieu&nbsp;?</span>
              </h2>
              <div className="space-y-3">
                <label className="block rounded-[14px] border border-dusk/15 bg-paper px-5 py-4">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-dusk/50 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Choisir une date</span>
                  <input
                    type="date"
                    value={practicalContext.deathDate && /^\d{4}-\d{2}-\d{2}$/.test(practicalContext.deathDate) ? practicalContext.deathDate : ""}
                    onChange={(e) => setPracticalContext({ deathDate: e.target.value || null })}
                    className="w-full bg-transparent font-serif text-[18px] italic text-dusk outline-none"
                  />
                </label>
                <button
                  onClick={() => setPracticalContext({ deathDate: "unknown" })}
                  className={`w-full text-left rounded-[14px] px-5 py-4 border transition-colors ${
                    practicalContext.deathDate === "unknown" ? "border-dusk/35 bg-clay" : "border-dusk/12 bg-paper hover:bg-dusk/[0.03]"
                  }`}
                >
                  <span className="font-serif text-[16px] text-dusk">Je ne sais pas</span>
                </button>
                <button
                  onClick={() => setPracticalContext({ deathDate: "notyet" })}
                  className={`w-full text-left rounded-[14px] px-5 py-4 border transition-colors ${
                    practicalContext.deathDate === "notyet" ? "border-dusk/35 bg-clay" : "border-dusk/12 bg-paper hover:bg-dusk/[0.03]"
                  }`}
                >
                  <span className="font-serif text-[16px] text-dusk">Cela n'a pas encore eu lieu</span>
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-[10px] uppercase tracking-[0.28em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>Question 3 sur 3</p>
              <h2 className="font-serif text-[32px] leading-[1.06] font-light text-balance">
                Souhaitez-vous être <span className="italic" style={{ color: "var(--bordeaux)" }}>accompagné·e étape par étape&nbsp;?</span>
              </h2>
              <div className="space-y-2">
                {[
                  { v: true,  label: "Oui, guidez-moi", sub: "Une priorité à la fois." },
                  { v: false, label: "Je souhaite voir l'ensemble", sub: "Toutes les étapes d'un coup." },
                ].map((o) => (
                  <button
                    key={String(o.v)}
                    onClick={() => setPracticalContext({ guided: o.v })}
                    className={`w-full text-left rounded-[14px] px-5 py-4 border transition-colors ${
                      practicalContext.guided === o.v ? "border-dusk/35 bg-clay" : "border-dusk/12 bg-paper hover:bg-dusk/[0.03]"
                    }`}
                  >
                    <p className="font-serif text-[17px] text-dusk">{o.label}</p>
                    <p className="mt-0.5 text-[12.5px] text-dusk/55">{o.sub}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-7 pb-12">
          <button
            onClick={() => {
              if (!canContinue) return;
              if (step === 2) finish();
              else setStep(((step + 1) as 1 | 2));
            }}
            disabled={!canContinue}
            className="block w-full rounded-[18px] text-[color:var(--paper)] px-6 py-5 text-center disabled:opacity-40"
            style={{ background: "var(--bordeaux)" }}
          >
            <span className="font-serif text-[20px] italic">
              {step === 2 ? "Voir mon parcours" : "Continuer"}
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}