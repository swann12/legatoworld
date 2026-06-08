import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BRANCHES,
  MODES,
  PRACTICAL_BRANCH,
  LOST_NAME_LABEL,
  useLegato,
  type Branch,
  type Mode,
} from "@/lib/legato-state";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Commencer doucement — Legato" },
      { name: "description", content: "Quelques questions tranquilles pour accorder votre espace." },
    ],
  }),
  component: Onboarding,
});

type Step = 0 | 1 | 2 | 3 | 4;
const TOTAL_STEPS = 5;

function Onboarding() {
  // Si un prénom est déjà connu (auth, retour), on saute l'étape 0.
  const { name, setName, branch, setBranch, mode, setMode, lostName, setLostName } = useLegato();
  const initialStep: Step = name && name.trim().length > 0 ? 1 : 0;
  const [step, setStep] = useState<Step>(initialStep);
  const navigate = useNavigate();

  const next = () => {
    if (step === 4) navigate({ to: "/home" });
    else setStep(((step + 1) as Step));
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
          {step === 0 && <StepWelcome name={name} setName={setName} />}
          {step === 1 && <StepBranch value={branch} onChange={setBranch} />}
          {step === 2 && (
            <StepLostName branch={branch} value={lostName} onChange={setLostName} />
          )}
          {step === 3 && <StepMode value={mode} onChange={setMode} />}
          {step === 4 && <StepClosing name={name} lostName={lostName} branch={branch} mode={mode} />}

          <div className="mt-auto pb-14 pt-12">
            <button
              onClick={next}
              className="block w-full rounded-[18px] text-[color:var(--paper)] px-6 py-5 text-center"
              style={{ background: "var(--bordeaux)" }}
            >
              <span className="font-serif text-[20px] italic">
                {step === 4 ? "Entrer" : step === 2 && !lostName ? "Passer" : "Continuer"}
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

function StepWelcome({ name, setName }: { name: string; setName: (s: string) => void }) {
  return (
    <div className="space-y-8">
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Étape 1 · Prénom
      </p>
      <h2 className="font-serif text-[40px] leading-[1.02] font-light text-balance">
        Avant tout, <span className="italic">comment vous nommer ?</span>
      </h2>
      <p className="text-[14.5px] leading-[1.6] text-dusk/65 max-w-[34ch]">
        Un prénom, pour vous accueillir.
      </p>
      <div className="rounded-[14px] border border-dusk/15 bg-paper px-5 py-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Votre prénom"
          className="w-full bg-transparent font-serif text-[24px] italic text-dusk placeholder:text-dusk/30 outline-none"
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
        Étape 2 · Ce qui vous amène
      </p>
      <h2 className="font-serif text-[36px] leading-[1.04] font-light text-balance">
        Qu'est-ce qui vous amène, <span className="italic">en ce moment ?</span>
      </h2>
      <p className="text-[13.5px] text-dusk/60 max-w-[34ch]">
        Modifiable à tout moment.
      </p>

      <div className="space-y-2.5">
        {[...BRANCHES, PRACTICAL_BRANCH].map((b) => {
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
    </div>
  );
}

function StepLostName({
  branch,
  value,
  onChange,
}: {
  branch: Branch;
  value: string;
  onChange: (s: string) => void;
}) {
  const cfg = LOST_NAME_LABEL[branch];
  const isAbsence = branch === "person" || branch === "animal" || branch === "practical";
  return (
    <div className="space-y-7">
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Étape 3 · {isAbsence ? "Qui manque" : "Ce qui pèse"}
      </p>
      <h2 className="font-serif text-[36px] leading-[1.04] font-light text-balance">
        {isAbsence ? (
          <>Avez-vous envie de <span className="italic">le nommer ?</span></>
        ) : (
          <>Y a-t-il <span className="italic">un mot pour ça ?</span></>
        )}
      </h2>
      <p className="text-[13.5px] text-dusk/60 max-w-[34ch]">
        Vous pouvez passer. Le nom guide juste le ton du jardin et de la présence.
      </p>
      <div className="rounded-[14px] border border-dusk/15 bg-paper px-5 py-4">
        <p
          className="text-[10px] uppercase tracking-[0.24em] text-dusk/45 mb-1.5"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {cfg.fr}
        </p>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={cfg.placeholder}
          className="w-full bg-transparent font-serif text-[22px] italic text-dusk placeholder:text-dusk/30 outline-none"
        />
      </div>
    </div>
  );
}

function StepMode({ value, onChange }: { value: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="space-y-7">
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Étape 4 · Ambiance
      </p>
      <h2 className="font-serif text-[36px] leading-[1.04] font-light text-balance">
        Comment vous sentez-vous <span className="italic">aujourd'hui ?</span>
      </h2>
      <p className="text-[13.5px] text-dusk/60 max-w-[34ch]">
        Choisissez l'ambiance. Tout s'ajustera autour.
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {MODES.map((m) => {
          const active = value === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className={`rounded-[14px] p-4 text-left transition-all border ${
                active
                  ? "border-dusk/30 bg-clay"
                  : "border-dusk/12 bg-paper hover:bg-clay/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${active ? "breath" : ""}`}
                  style={{
                    background:
                      m.id === "cocoon"
                        ? "var(--rose)"
                        : m.id === "anchoring"
                          ? "var(--sage)"
                          : m.id === "breath"
                            ? "var(--mist)"
                            : "var(--lavender)",
                  }}
                />
                <span className="font-serif text-[17px] text-dusk">{m.label}</span>
              </div>
              <p className="mt-2 text-[11.5px] leading-[1.5] text-dusk/60">{m.whisper}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepClosing({
  name,
  lostName,
  branch,
  mode,
}: {
  name: string;
  lostName: string;
  branch: Branch;
  mode: Mode;
}) {
  const modeLabel = MODES.find((m) => m.id === mode)?.label.toLowerCase();
  const branchPhrase: Record<Branch, string> = {
    person:    "celle ou celui qui manque",
    animal:    "ce compagnon fidèle",
    fear:      "un proche fragile",
    anxiety:   "ce qui passe en silence",
    practical: "ces premiers jours",
    unknown:   "ce qui n'a pas de nom",
  };
  const named = lostName?.trim();
  return (
    <div className="space-y-7">
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Tout est prêt
      </p>
      <h2 className="font-serif text-[40px] leading-[1.02] font-light text-balance">
        Bienvenue, <span className="italic">{name || "vous"}.</span>
      </h2>
      <div className="space-y-4 text-[14.5px] leading-[1.6] text-dusk/65 max-w-[34ch]">
        <p style={{ textWrap: "pretty" }}>
          Un espace pour{" "}
          <span className="italic">{named ? named : branchPhrase[branch]}</span>, en{" "}
          <span className="italic">{modeLabel}</span>.
        </p>
        <p style={{ textWrap: "pretty" }}>
          Vous donnez le rythme.
        </p>
      </div>
    </div>
  );
}