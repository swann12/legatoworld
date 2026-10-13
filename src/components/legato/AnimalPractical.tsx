import { useEffect, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { StandardLayout, SplitHeader, Row, PageTitle, Spec } from "@/components/legato/ds";
import { useActiveSpace } from "@/lib/use-active-space";
import { useLegato } from "@/lib/legato-state";
import { ANIMAL_TASKS, animalTaskDone } from "@/lib/animal-demarches";
import { loadTaskSteps, toggleTaskStep } from "@/lib/task-steps";

const serif = { fontFamily: "var(--lg-serif)", fontWeight: 400 } as const;

export function SectionTitle({ children, accent = true, className = "" }: { children: string; accent?: boolean; className?: string }) {
  return <p className={className} style={{ ...serif, fontSize: 17, fontStyle: "italic", color: accent ? "var(--sp-accent)" : "var(--sp-ink)", margin: "0 0 2px" }}>{children} —</p>;
}

export function useAnimal() {
  const { space } = useActiveSpace();
  const { taskStatus, setTaskStatus, hydrated } = useLegato();
  const done = (id: string) => animalTaskDone(id, hydrated ? taskStatus[id] : undefined, space?.animalBodyState);
  return { name: space?.name || "lui", done, setTaskStatus };
}

/** B032 · Démarches d'un espace animal */
export function AnimalPractical() {
  const { name, done } = useAnimal();
  const count = ANIMAL_TASKS.filter((t) => done(t.id)).length;
  const corps = ANIMAL_TASKS.filter((t) => t.section === "corps");
  const papiers = ANIMAL_TASKS.filter((t) => t.section === "papiers");
  const row = (t: typeof ANIMAL_TASKS[number], n: number, last: boolean) => (
    <Row key={t.id} space="practical" n={n} title={done(t.id) ? <s style={{ color: "var(--sp-sub)" }}>{t.title}</s> : t.title} subtitle={t.sub(name)} to={t.to} last={last} />
  );
  return (
    <StandardLayout space="practical" title="Démarches" activeTab="/practical">
      <SplitHeader space="practical" title={<>Ce qu'il reste<br /><em>à faire.</em></>} value={count} total={ANIMAL_TASKS.length}>
        <span className="lg-mono" style={{ color: "var(--sp-sub)" }}>Rien d'urgent</span>
      </SplitHeader>
      <SectionTitle className="mt-[34px]">Pour son corps</SectionTitle>
      {corps.map((t, i) => row(t, i + 1, i === corps.length - 1))}
      <SectionTitle accent={false} className="mt-10">Les papiers</SectionTitle>
      {papiers.map((t, i) => row(t, i + 2, i === papiers.length - 1))}
    </StandardLayout>
  );
}

/** Mise en page commune des fiches (B034–B039). */
export function AnimalSheet({ back, backLabel, eyebrow, title, children }: { back: string; backLabel: string; eyebrow?: string; title: ReactNode; children: ReactNode }) {
  return (
    <StandardLayout space="practical" back={back} backLabel={backLabel} activeTab="/practical">
      {eyebrow && <p className="lg-mono pt-[30px]" style={{ color: "var(--sp-accent)" }}>{eyebrow}</p>}
      <PageTitle className={eyebrow ? "mt-4" : "pt-[30px]"}>{title}</PageTitle>
      {children}
    </StandardLayout>
  );
}
export { Spec };

/** Étapes à cocher, gardées sur le téléphone ; tout coché → la démarche est faite. */
export function Steps({ id, steps, label, taskId, fill = "var(--lg-coral)" }: { id: string; steps: string[]; label?: (n: number) => string; taskId?: string; fill?: string }) {
  const { setTaskStatus } = useAnimal();
  const [checked, setChecked] = useState<number[]>([]);
  useEffect(() => setChecked(loadTaskSteps(id)), [id]);
  const toggle = (i: number) => {
    const next = toggleTaskStep(id, i); setChecked(next);
    if (taskId) setTaskStatus(taskId, next.length >= steps.length ? "done" : "todo");
  };
  return <>
    <SectionTitle className="mt-10">{label ? label(checked.length) : "Les étapes"}</SectionTitle>
    <ul>
      {steps.map((s, i) => {
        const on = checked.includes(i);
        return (
          <li key={s} style={{ borderBottom: i < steps.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
            <button type="button" onClick={() => toggle(i)} aria-pressed={on} className="flex w-full items-center gap-4 py-4 text-left">
              <span className="grid size-[26px] shrink-0 place-items-center rounded-full" style={{ background: on ? fill : "transparent", border: on ? "none" : "1.3px solid var(--sp-ink)" }}>
                {on && <Check className="size-3.5" strokeWidth={2} style={{ color: "var(--sp-bg)" }} />}
              </span>
              <span className="text-[15px]" style={{ textDecoration: on ? "line-through" : undefined, color: on ? "var(--sp-sub)" : "var(--sp-ink)" }}>{s}</span>
            </button>
          </li>
        );
      })}
    </ul>
  </>;
}
