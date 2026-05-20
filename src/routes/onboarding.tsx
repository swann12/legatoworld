import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BRANCHES, MODES, PRACTICAL_BRANCH, useLegato, type Branch, type Mode } from "@/lib/legato-state";
import { Halos } from "@/components/legato/Halos";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Commencer doucement — Legato" },
      { name: "description", content: "Quelques questions tranquilles pour accorder votre espace." },
    ],
  }),
  component: Onboarding,
});

type Step = 0 | 1 | 2 | 3;

function Onboarding() {
  const [step, setStep] = useState<Step>(0);
  const { name, setName, branch, setBranch, mode, setMode } = useLegato();
  const navigate = useNavigate();

  const next = () => {
    if (step === 3) navigate({ to: "/home" });
    else if (step === 1 && branch === "practical") {
      // shortcut into the practical companion
      navigate({ to: "/practical" });
    }
    else setStep(((step + 1) as Step));
  };

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <Halos mode={mode} variant="calm" />

        <div className="relative z-10 flex items-center justify-between px-7 pt-10">
          <button
            onClick={() => (step === 0 ? navigate({ to: "/" }) : setStep(((step - 1) as Step)))}
            className="text-[11px] uppercase tracking-[0.22em] text-dusk/50 hover:text-dusk"
          >
            ← Retour
          </button>
          <Progress step={step} />
        </div>

        <div className="relative z-10 flex flex-1 flex-col px-7 pt-12">
          {step === 0 && <StepWelcome name={name} setName={setName} />}
          {step === 1 && <StepBranch value={branch} onChange={setBranch} />}
          {step === 2 && <StepMode value={mode} onChange={setMode} />}
          {step === 3 && <StepClosing name={name} branch={branch} mode={mode} />}

          <div className="mt-auto pb-14 pt-12">
            <button
              onClick={next}
              className="ceramic organic-radius-3 w-full px-7 py-5 text-center"
            >
              <span className="font-serif text-xl italic text-dusk">
                {step === 3 ? "Entrer" : "Continuer"}
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
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-[2px] w-6 rounded-full transition-all ${
            i <= step ? "bg-dusk/70" : "bg-dusk/15"
          }`}
        />
      ))}
    </div>
  );
}

function StepWelcome({ name, setName }: { name: string; setName: (s: string) => void }) {
  return (
    <div className="space-y-10">
      <h2 className="font-serif text-[2.4rem] leading-[1.05] font-light text-balance">
        Avant tout, <span className="italic">comment vous nommer ?</span>
      </h2>
      <p className="text-[15px] leading-relaxed text-dusk/60 max-w-[34ch]">
        Un prénom, pour vous accueillir.
      </p>
      <div className="ceramic-soft organic-radius-3 px-6 py-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Votre prénom"
          className="w-full bg-transparent font-serif text-2xl italic text-dusk placeholder:text-dusk/30 outline-none"
        />
      </div>
    </div>
  );
}

function StepBranch({ value, onChange }: { value: Branch; onChange: (b: Branch) => void }) {
  return (
    <div className="space-y-8">
      <h2 className="font-serif text-[2.4rem] leading-[1.05] font-light text-balance">
        Qu'est-ce qui vous amène, <span className="italic">en ce moment ?</span>
      </h2>
      <p className="text-[14px] text-dusk/55 max-w-[34ch]">
        Modifiable à tout moment.
      </p>

      <div className="space-y-3">
        {BRANCHES.map((b) => {
          const active = value === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onChange(b.id)}
              className={`w-full organic-radius-3 px-6 py-5 text-left transition-all ${
                active ? "ceramic" : "ceramic-soft opacity-70"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-serif text-xl text-dusk">{b.label}</span>
                <span
                  className={`size-1.5 rounded-full transition-opacity ${
                    active ? "bg-rose breath" : "bg-dusk/0"
                  }`}
                />
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-dusk/55">{b.whisper}</p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-dusk/35">
        <span className="h-px flex-1 bg-dusk/10" />
        ou bien
        <span className="h-px flex-1 bg-dusk/10" />
      </div>

      {/* Practical-loss shortcut — placé à la fin */}
      <button
        onClick={() => onChange(PRACTICAL_BRANCH.id)}
        className={`w-full organic-radius-3 px-6 py-5 text-left transition-all ${
          value === PRACTICAL_BRANCH.id ? "ceramic" : "ceramic-soft opacity-80"
        }`}
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-serif text-xl text-dusk">{PRACTICAL_BRANCH.label}</span>
          <span className="text-[9px] uppercase tracking-[0.22em] text-dusk/50 shrink-0">
            aide concrète
          </span>
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-dusk/60">
          {PRACTICAL_BRANCH.whisper}
        </p>
      </button>
    </div>
  );
}

function StepMode({ value, onChange }: { value: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="space-y-8">
      <h2 className="font-serif text-[2.4rem] leading-[1.05] font-light text-balance">
        Comment vous sentez-vous <span className="italic">aujourd'hui ?</span>
      </h2>
      <p className="text-[14px] text-dusk/55 max-w-[34ch]">
        Choisissez l'ambiance. Tout s'ajustera autour.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {MODES.map((m) => {
          const active = value === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className={`organic-radius-3 p-5 text-left transition-all ${
                active ? "ceramic" : "ceramic-soft opacity-70"
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
                <span className="font-serif text-lg text-dusk">{m.label}</span>
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-dusk/55">{m.whisper}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepClosing({ name, branch, mode }: { name: string; branch: Branch; mode: Mode }) {
  const modeLabel = MODES.find((m) => m.id === mode)?.label.toLowerCase();
  const branchPhrase: Record<Branch, string> = {
    person:    "celle ou celui qui manque",
    animal:    "ce compagnon fidèle",
    fear:      "un proche fragile",
    anxiety:   "ce qui passe en silence",
    practical: "ces premiers jours",
    unknown:   "ce qui n'a pas de nom",
  };
  return (
    <div className="space-y-8">
      <h2 className="font-serif text-[2.6rem] leading-[1.02] font-light text-balance">
        Bienvenue, <span className="italic">{name || "vous"}.</span>
      </h2>
      <div className="space-y-5 text-[15px] leading-relaxed text-dusk/65 max-w-[34ch]">
        <p style={{ textWrap: "pretty" }}>
          Un espace pour <span className="italic">{branchPhrase[branch]}</span>, en <span className="italic">{modeLabel}</span>.
        </p>
        <p style={{ textWrap: "pretty" }}>
          Vous donnez le rythme.
        </p>
      </div>
    </div>
  );
}