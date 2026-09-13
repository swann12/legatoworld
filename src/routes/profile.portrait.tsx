import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { ChipSelect, QuestionBlock } from "@/components/legato/ChipSelect";
import { PORTRAIT_OPTIONS, usePortrait, portraitSentence } from "@/lib/portrait-store";
import { useLovedName } from "@/lib/loved-name";

export const Route = createFileRoute("/profile/portrait")({
  validateSearch: (s: Record<string, unknown>): { from?: string } =>
    typeof s.from === "string" ? { from: s.from } : {},
  head: () => ({
    meta: [
      { title: "Son portrait — Legato" },
      { name: "description", content: "Quelques choix qui disent qui elle était. Ce portrait guide ensuite Présence, les rituels, la cérémonie et le jardin." },
      { property: "og:title", content: "Son portrait — Legato" },
      { property: "og:description", content: "Quelques choix qui disent qui elle était, pour un accompagnement plus juste." },
    ],
  }),
  component: PortraitPage,
});

const STEPS = ["traits", "loves", "places", "music", "colors", "free"] as const;
type Step = (typeof STEPS)[number];

const QUESTIONS: Record<Exclude<Step, "free">, { label: string; question: string; hint: string; group: keyof typeof PORTRAIT_OPTIONS }> = {
  traits: { label: "Elle, lui", question: "Comment était cette personne ?", hint: "Choisissez jusqu'à quatre mots.", group: "traits" },
  loves:  { label: "Ce qui lui ressemblait", question: "Qu'est-ce qui lui ressemblait le plus ?", hint: "Ce qu'elle aimait faire, ce qui la rendait vivante.", group: "loves" },
  places: { label: "Ses endroits", question: "Où était-elle vraiment elle-même ?", hint: "Un ou deux lieux suffisent.", group: "places" },
  music:  { label: "Son écoute", question: "Quelle musique lui allait ?", hint: "Utile pour la cérémonie et les rituels.", group: "music" },
  colors: { label: "Ses couleurs", question: "Quelles couleurs lui vont ?", hint: "Elles guideront les fleurs et le jardin.", group: "colors" },
};

function PortraitPage() {
  const { portrait, update, hydrated } = usePortrait();
  const lovedName = useLovedName();
  const [i, setI] = useState(0);
  const step: Step = STEPS[i];
  const last = i === STEPS.length - 1;

  const valueOf = (g: keyof typeof PORTRAIT_OPTIONS) => portrait[g] as string[];

  return (
    <Shell livingBg={false}>
      <div className="wash-mauve min-h-dvh text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <Link to="/profile" aria-label="Retour" className="text-dusk/60 text-lg leading-none">←</Link>
          <div className="flex gap-1.5">
            {STEPS.map((s, k) => (
              <span
                key={s}
                className="h-[1.5px] w-6 rounded-full"
                style={{ background: k <= i ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 14%, transparent)" }}
              />
            ))}
          </div>
        </header>

        <section className="px-6 pt-9">
          <p className="mono-label">Son portrait</p>
          <h1 className="mt-4 ed-page-title">
            {lovedName ? <>Qui était <span className="italic" style={{ color: "var(--terracotta)" }}>{lovedName}</span>&nbsp;?</> : <>Qui <span className="italic" style={{ color: "var(--terracotta)" }}>était-elle</span>&nbsp;?</>}
          </h1>
          <p className="mt-4 text-[13px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Rien d'obligatoire. Ce que vous choisissez rend Présence, les rituels, la cérémonie et le jardin plus justes.
          </p>
        </section>

        {step !== "free" ? (
          <QuestionBlock
            label={QUESTIONS[step].label}
            question={QUESTIONS[step].question}
            hint={QUESTIONS[step].hint}
          >
            <ChipSelect
              options={[...PORTRAIT_OPTIONS[QUESTIONS[step].group]]}
              value={valueOf(QUESTIONS[step].group)}
              onChange={(next) => update({ [QUESTIONS[step].group]: next } as never)}
              multiple
              max={4}
            />
          </QuestionBlock>
        ) : (
          <QuestionBlock
            label="Si vous voulez"
            question="Quelque chose à ajouter, avec vos mots ?"
            hint="Facultatif. Une phrase, une anecdote, un détail que personne d'autre ne connaît."
          >
            <textarea
              value={portrait.freeText}
              onChange={(e) => update({ freeText: e.target.value })}
              rows={5}
              placeholder="Écrivez seulement si ça vient."
              className="w-full rounded-[16px] border border-dusk/15 bg-paper px-4 py-3 text-[14px] leading-[1.6] outline-none focus:border-dusk/35 placeholder:text-dusk/30"
            />
          </QuestionBlock>
        )}

        {hydrated && portraitSentence(portrait, lovedName) && (
          <section className="px-5 pt-9">
            <div className="rounded-[20px] px-5 py-5" style={{ background: "var(--whisper)" }}>
              <p className="mono-label text-dusk/55">Ce que Legato retient</p>
              <p className="mt-2 font-serif text-[17px] leading-[1.35]">{portraitSentence(portrait, lovedName)}</p>
            </div>
          </section>
        )}

        <section className="px-5 pt-8 flex gap-3">
          {i > 0 && (
            <button
              type="button"
              onClick={() => setI(i - 1)}
              className="rounded-full border border-dusk/15 px-5 py-3 text-[13px] text-dusk/70"
            >
              Retour
            </button>
          )}
          {!last ? (
            <button
              type="button"
              onClick={() => setI(i + 1)}
              className="flex-1 rounded-full py-3.5 text-[14px] font-medium"
              style={{ background: "var(--dusk)", color: "var(--paper)" }}
            >
              Continuer
            </button>
          ) : (
            <Link
              to="/profile"
              className="flex-1 rounded-full py-3.5 text-center text-[14px] font-medium"
              style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
            >
              Enregistrer le portrait
            </Link>
          )}
        </section>
      </div>
    </Shell>
  );
}
