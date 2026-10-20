import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { QuestionLayout, OptionCard, QuestionFooter } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";
import { POINT_QUESTIONS, monthKey, useSoutien, type PointAnswer } from "@/lib/soutien";

/** D056 · so-point : le point du mois, trois questions, sans diagnostic. */
export const Route = createFileRoute("/care/point/")({
  head: () => legatoHead("Votre point du mois", "Trois questions, deux minutes, pour voir comment vont vos journées."),
  component: Point,
});

function Point() {
  const navigate = useNavigate();
  const { update } = useSoutien();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PointAnswer[]>([null, null, null]);
  const q = POINT_QUESTIONS[step];

  const next = (a: PointAnswer[]) => {
    if (step < POINT_QUESTIONS.length - 1) { setStep(step + 1); return; }
    const month = monthKey();
    update((p) => ({ ...p, points: [...p.points.filter((e) => e.month !== month), { month, answers: a, at: new Date().toISOString() }] }));
    navigate({ to: "/care/point/resultat" });
  };

  return (
    <QuestionLayout space="support" step={step + 1} total={3}
      footer={<QuestionFooter space="support" cta="Continuer" ctaDisabled={answers[step] === null} onCta={() => next(answers)}
        link="Pas maintenant" onLink={() => { const a = [...answers]; a[step] = null; setAnswers(a); next(a); }} />}>
      <p className="lg-mono" style={{ color: "var(--sp-sub)" }}>Votre point du mois · {step + 1} sur 3</p>
      <h1 className="lg-title lg-ds-title mt-[10px]" style={{ fontSize: 28 }}>{q.title[0]}<br /><em>{q.title[1]}</em></h1>
      <div className="mt-6 space-y-[10px]">
        {q.options.map((o, i) => (
          <OptionCard key={o} space="support" label={o} selected={answers[step] === i}
            onClick={() => { const a = [...answers]; a[step] = i as PointAnswer; setAnswers(a); }} />
        ))}
      </div>
    </QuestionLayout>
  );
}
