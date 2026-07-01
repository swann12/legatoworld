import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  EMOTIONS,
  RELATIONS,
  SITUATIONS,
  STAGES_BY_SITUATION,
  useLegato,
  type Emotion,
  type PrimaryNeed,
  type Relation,
  type Situation,
  type Stage,
} from "@/lib/legato-state";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useServerFn } from "@tanstack/react-start";
import { recordEmotion } from "@/lib/emotional.functions";
import { supabase } from "@/integrations/supabase/client";
import { useState, type ReactNode } from "react";

export const Route = createFileRoute("/onboarding/")({
  head: () => ({
    meta: [
      { title: "Commencer — Legato" },
      { name: "description", content: "Un parcours clair et conditionnel pour adapter Legato à votre situation." },
    ],
  }),
  component: Onboarding,
});

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

function Onboarding() {
  const {
    name, setName, setCareOnboarded, setPracticalOnboarded,
    situation, setSituation,
    lovedOneName, setLovedOneName, lovedOther, setLovedOther,
    lovedOneRelation, setLovedOneRelation,
    stage, setStage,
    primaryNeed, setPrimaryNeed,
    currentEmotions, setCurrentEmotions,
    legallyInvolved, setLegallyInvolved,
  } = useLegato();
  const navigate = useNavigate();
  const record = useServerFn(recordEmotion);
  const [step, setStep] = useState<Step>(1);

  const needsPerson = Boolean(situation && ["perdu", "peur", "accompagner"].includes(situation));
  const needsLabel = Boolean(situation && !["questionnement", "volontes"].includes(situation));
  const stageOptions = situation && situation in STAGES_BY_SITUATION ? STAGES_BY_SITUATION[situation] : [];
  const needsEmotion = primaryNeed === "emotional" || primaryNeed === "both";
  const needsLegalQuestion = (lovedOneRelation === "ami" || lovedOneRelation === "collegue" || lovedOneRelation === "autre") && (primaryNeed === "practical" || primaryNeed === "both");

  const finish = async () => {
    setCareOnboarded(true);
    setPracticalOnboarded(true);
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      record({ data: { source: "onboarding", tags: ["accueil", situation ?? "inconnu"], note: `Prénom : ${name}` } }).catch(() => {});
    }
    navigate({ to: "/home" });
  };

  const afterSituation = () => {
    if (!situation) return;
    if (situation === "questionnement" || situation === "volontes") setStep(5);
    else if (situation === "soutenir") setStep(4);
    else setStep(3);
  };

  const afterStage = () => {
    if (situation === "questionnement") {
      setPrimaryNeed("emotional");
      setStep(7);
      return;
    }
    if (situation === "volontes") {
      setPrimaryNeed("practical");
      finish();
      return;
    }
    if (lovedOneRelation === "animal" && situation !== "perdu") {
      setPrimaryNeed("emotional");
      setStep(7);
      return;
    }
    setStep(6);
  };

  const afterNeed = () => {
    if (needsLegalQuestion) {
      setStep(8);
      return;
    }
    if (needsEmotion) setStep(7);
    else finish();
  };

  const afterLegal = () => {
    if (needsEmotion) setStep(7);
    else finish();
  };

  const backFromEmotion = () => {
    if (needsLegalQuestion) setStep(8);
    else if (situation === "questionnement" || (lovedOneRelation === "animal" && situation !== "perdu")) setStep(5);
    else setStep(6);
  };

  const toggleEmotion = (id: Emotion) => {
    setCurrentEmotions(currentEmotions.includes(id) ? currentEmotions.filter((e) => e !== id) : [...currentEmotions, id]);
  };

  if (step === 1) {
    return (
      <Frame onBack={() => navigate({ to: "/start" })} progress="1 / 7">
        <h1 className="mt-[54px] onboarding-title">
          Comment<br /><span className="whitespace-nowrap">souhaitez‑vous que</span><br /><span className="italic">Legato</span> vous appelle&nbsp;?
        </h1>
        <div className="mt-[30px]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Swann"
            autoFocus
            className="onboarding-field w-full rounded-full border bg-transparent px-6 py-3 font-serif text-[18px] italic outline-none transition-colors"
            style={{ borderColor: "color-mix(in oklab, var(--dusk) 12%, transparent)", color: "var(--dusk)" }}
          />
        </div>
        <div className="mt-auto" />
        <BlushBtn disabled={!name.trim()} onClick={() => setStep(2)}>Continuer</BlushBtn>
        <SkipLink onClick={() => setStep(2)}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 2) {
    return (
      <Frame onBack={() => setStep(1)} progress="2 / 7">
        <h1 className="mt-[54px] onboarding-title">
          Pourquoi venez-vous<br />sur <span className="italic">Legato</span> aujourd'hui&nbsp;?
        </h1>
        <div className="mt-[30px] flex flex-col gap-3">
          {SITUATIONS.map((s) => {
            const active = situation === s.id;
            return (
              <OptionPill
                key={s.id}
                active={active}
                onClick={() => { setSituation(s.id); setStage(null); setPrimaryNeed(null); }}
              >
                {s.label}
              </OptionPill>
            );
          })}
        </div>
        <div className="mt-auto" />
        <BlushBtn disabled={!situation} onClick={afterSituation}>Continuer</BlushBtn>
        <SkipLink onClick={afterSituation}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 3) {
    const title = situation === "perdu" ? <>Qui avez-vous<br />perdu&nbsp;?</> : situation === "peur" ? <>De qui avez-vous peur<br />de perdre la présence&nbsp;?</> : <>Qui accompagnez-vous&nbsp;?</>;
    return (
      <Frame onBack={() => setStep(2)} progress="3 / 7">
        <h1 className="mt-[36px] onboarding-title">{title}</h1>
        <div className="mt-[30px] flex flex-col gap-3">
          {RELATIONS.map((r) => (
            <OptionPill key={r.id} active={lovedOneRelation === r.id} onClick={() => setLovedOneRelation(r.id as Relation)}>
              {r.label}
            </OptionPill>
          ))}
        </div>
        {lovedOneRelation === "autre" && (
          <input value={lovedOther} onChange={(e) => setLovedOther(e.target.value)} placeholder="Précisez qui" className="onboarding-field mt-3 w-full rounded-full border bg-transparent px-5 py-3 font-serif text-[18px] italic outline-none" style={{ borderColor: "color-mix(in oklab, var(--dusk) 12%, transparent)", color: "var(--dusk)" }} />
        )}
        <div className="mt-auto" />
        <BlushBtn disabled={needsPerson && !lovedOneRelation} onClick={() => setStep(4)}>Continuer</BlushBtn>
        <SkipLink onClick={() => setStep(4)}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 4) {
    return (
      <Frame onBack={() => (needsPerson ? setStep(3) : setStep(2))} progress="4 / 7">
        <h1 className="mt-[36px] onboarding-title">
          Quel prénom<br />ou quel lien<br />voulez-vous utiliser<br />dans <span className="italic">Legato</span>&nbsp;?
        </h1>
        <div className="mt-[30px]">
          <input value={lovedOneName} onChange={(e) => setLovedOneName(e.target.value)} placeholder={placeholderFor(lovedOneRelation)} className="onboarding-field w-full rounded-full border bg-transparent px-6 py-3 font-serif text-[18px] italic outline-none" style={{ borderColor: "color-mix(in oklab, var(--dusk) 12%, transparent)", color: "var(--dusk)" }} />
        </div>
        <div className="mt-auto" />
        <BlushBtn disabled={false} onClick={() => setStep(5)}>Continuer</BlushBtn>
        <SkipLink onClick={() => setStep(5)}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 5) {
    return (
      <Frame onBack={() => (needsLabel ? setStep(4) : setStep(2))} progress="5 / 7">
        <h1 className="mt-[36px] onboarding-title">{stageQuestion(situation)}</h1>
        <div className="mt-[30px] flex flex-col gap-3">
          {stageOptions.map((s) => (
            <OptionPill key={s.id} active={stage === s.id} onClick={() => setStage(s.id as Stage)}>
              {s.label}
            </OptionPill>
          ))}
        </div>
        <div className="mt-auto" />
        <BlushBtn disabled={!stage} onClick={afterStage}>Continuer</BlushBtn>
        <SkipLink onClick={afterStage}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 6) {
    return (
      <Frame onBack={() => setStep(5)} progress="6 / 7">
        <h1 className="mt-[36px] onboarding-title">De quoi avez-vous besoin<br />en priorité maintenant&nbsp;?</h1>
        <div className="mt-[30px] flex flex-col gap-3">
          {([
            { id: "emotional", label: "Être soutenu·e émotionnellement" },
            { id: "practical", label: "Avancer dans les démarches concrètes" },
            { id: "both", label: "Les deux, mais séparément" },
          ] as { id: PrimaryNeed; label: string }[]).map((o) => (
            <OptionPill key={o.id} active={primaryNeed === o.id} onClick={() => setPrimaryNeed(o.id)}>
              {o.label}
            </OptionPill>
          ))}
        </div>
        <div className="mt-auto" />
        <BlushBtn disabled={!primaryNeed} onClick={afterNeed}>Continuer</BlushBtn>
        <SkipLink onClick={afterNeed}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 8) {
    return (
      <Frame onBack={() => setStep(6)} progress="6 bis / 7">
        <h1 className="mt-[36px] onboarding-title">Êtes-vous responsable légalement, ou aidez-vous la famille pour les démarches&nbsp;?</h1>
        <div className="mt-[30px] flex flex-col gap-3">
          <OptionPill active={legallyInvolved === true} onClick={() => setLegallyInvolved(true)}>Oui, je suis impliqué·e</OptionPill>
          <OptionPill active={legallyInvolved === false} onClick={() => setLegallyInvolved(false)}>Non, pas directement</OptionPill>
        </div>
        <div className="mt-auto" />
        <BlushBtn onClick={afterLegal}>Continuer</BlushBtn>
      </Frame>
    );
  }

  return (
    <Frame onBack={backFromEmotion} progress="7 / 7">
      <h1 className="mt-[36px] onboarding-title">Comment vous sentez-vous maintenant&nbsp;?</h1>
      <div className="mt-[30px] grid grid-cols-3 gap-3">
        {EMOTIONS.map((e) => {
          const active = currentEmotions.includes(e.id);
          return (
            <button
              key={e.id}
              onClick={() => toggleEmotion(e.id)}
              className="rounded-2xl border aspect-square flex items-center justify-center px-2 transition-colors"
              style={{
                background: active ? "var(--terracotta)" : "transparent",
                borderColor: active ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 12%, transparent)",
                color: active ? "var(--paper)" : "var(--dusk)",
              }}
            >
              <span className="text-[12px] text-center leading-tight">{e.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-auto" />
      <BlushBtn onClick={finish}>Continuer</BlushBtn>
      <SkipLink onClick={finish}>Passer</SkipLink>
    </Frame>
  );
}

function Frame({ children, onBack, progress }: { children: ReactNode; onBack: () => void; progress: string }) {
  const [done, total] = progress.split("/").map((s) => parseInt(s.trim(), 10));
  const safeTotal = Number.isFinite(total) && total > 0 ? total : 7;
  const safeDone = Number.isFinite(done) ? done : 1;
  const accent = "var(--terracotta)";
  return (
    <main className="min-h-dvh" style={{ background: "var(--paper)", color: "var(--dusk)" }}>
      <div className="mobile-frame relative flex min-h-dvh flex-col" style={{ background: "var(--paper)" }}>
        <div className="px-[40px] pt-12 flex items-center gap-1.5">
          {Array.from({ length: safeTotal }).map((_, i) => (
            <span
              key={i}
              className="h-[3px] flex-1 rounded-full"
              style={{ background: i < safeDone ? accent : "color-mix(in oklab, var(--dusk) 10%, transparent)" }}
            />
          ))}
        </div>
        <button onClick={onBack} aria-label="Retour" className="sr-only">Retour</button>
        <div className="relative z-10 flex flex-1 flex-col px-[40px] pt-0 pb-12">{children}</div>
      </div>
    </main>
  );
}

function PrimaryBtn({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-8 block w-full rounded-[999px] px-6 py-5 text-center disabled:opacity-40 transition-transform active:scale-[0.99]"
      style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
    >
      <span className="font-serif text-[20px]">{children}</span>
    </button>
  );
}

function BlushBtn({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className="rounded-full text-center disabled:opacity-40 transition-transform active:scale-[0.99]"
        style={{ background: "var(--blush)", color: "var(--dusk)", padding: "13px 44px", minWidth: 240 }}
      >
        <span className="mono-label" style={{ color: "var(--dusk)", letterSpacing: "0.28em", fontSize: 10 }}>{children}</span>
      </button>
    </div>
  );
}

function SkipLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-3 block w-full text-center py-1">
      <span className="mono-label underline underline-offset-4" style={{ color: "var(--dusk)", letterSpacing: "0.28em", fontSize: 10 }}>{children}</span>
    </button>
  );
}

function OptionPill({ children, active, onClick }: { children: ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-full border px-5 py-3 transition-colors flex items-center gap-3"
      style={{
        background: "var(--paper)",
        borderColor: active ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 14%, transparent)",
        color: "var(--dusk)",
      }}
    >
      <span
        className="inline-block rounded-full shrink-0"
        style={{
          width: 10, height: 10,
          background: active ? "var(--terracotta)" : "transparent",
          border: `1px solid ${active ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 25%, transparent)"}`,
        }}
      />
      <span className="text-[12px] leading-[1.25]">{children}</span>
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-8">
      <p className="mono-label text-dusk/65">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ChipGrid<T extends string>({ options, value, onChange }: {
  options: { id: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o, i) => {
        const active = value === o.id;
        const tint = ["var(--sun)", "var(--blush)", "var(--sky)", "color-mix(in oklab, var(--olive) 34%, var(--whisper))", "var(--peach)"][i % 5];
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className="rounded-full border px-4 py-2 text-[13px] transition-colors text-dusk"
            style={{ borderColor: active ? "color-mix(in oklab, var(--dusk) 35%, transparent)" : "color-mix(in oklab, var(--dusk) 14%, transparent)", background: active ? tint : "var(--paper)" }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function placeholderFor(relation: Relation | null) {
  switch (relation) {
    case "animal": return "mon chien Oslo";
    case "ami": return "mon amie Léa";
    case "pere": return "mon père";
    case "mere": return "ma mère";
    case "frere_soeur": return "ma sœur";
    default: return "Marie";
  }
}

function stageQuestion(situation: Situation | null) {
  switch (situation) {
    case "peur": return "Où en est la situation ?";
    case "accompagner": return "Quel est votre rôle aujourd'hui ?";
    case "soutenir": return "Quel type d'aide voulez-vous apporter ?";
    case "questionnement": return "Qu'est-ce qui vous amène ici ?";
    case "volontes": return "Que souhaitez-vous préparer en premier ?";
    default: return "Où en êtes-vous aujourd'hui ?";
  }
}