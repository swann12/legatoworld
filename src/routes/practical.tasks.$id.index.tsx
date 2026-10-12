import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { StandardLayout, PageTitle, Spec, SectionLabel, PrimaryButton, TextLink } from "@/components/legato/ds";
import { findDemarche, dueLong, useDemarches, type Demarche } from "@/lib/demarches";
import { loadTaskSteps, toggleTaskStep } from "@/lib/task-steps";

export const Route = createFileRoute("/practical/tasks/$id/")({
  head: () => ({
    meta: [
      { title: "Une démarche — Legato" },
      { name: "description", content: "À qui s'adresser, combien de temps, et les étapes dans l'ordre." },
      { property: "og:title", content: "Une démarche — Legato" },
      { property: "og:description", content: "À qui s'adresser, combien de temps, et les étapes dans l'ordre." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TaskDetail,
});

function TaskDetail() {
  const { id } = Route.useParams();
  const [d, setD] = useState<Demarche | undefined>(() => findDemarche(id));
  useEffect(() => setD(findDemarche(id)), [id]);
  const { status, setTaskStatus } = useDemarches();
  const [checked, setChecked] = useState<number[]>([]);
  useEffect(() => setChecked(loadTaskSteps(id)), [id]);

  if (!d) {
    return (
      <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
        <PageTitle space="practical" className="pt-8">Démarche<br /><em>introuvable.</em></PageTitle>
        <TextLink space="practical" to="/practical" className="mt-6 inline-block">Revenir aux démarches</TextLink>
      </StandardLayout>
    );
  }

  const toggle = (i: number) => {
    const next = toggleTaskStep(id, i);
    setChecked(next);
    const all = next.length >= d.steps.length;
    const cur = status(d);
    if (all && cur !== "done") setTaskStatus(d.id, "done");
    if (!all && cur === "done") setTaskStatus(d.id, "todo");
  };
  const n = checked.length;

  const spec = [
    { label: "Auprès de", value: d.who },
    ...(d.howMany ? [{ label: "Combien", value: d.howMany }] : []),
    { label: "Durée", value: `${d.minutes} minutes` },
  ];

  return (
    <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
      <p className="lg-mono pt-8" style={{ color: "var(--sp-accent)" }}>{dueLong(d)}</p>
      <PageTitle space="practical" className="mt-4">{d.title[0]}<br /><em>{d.title[1]}</em></PageTitle>
      <Spec space="practical" className="mt-8" items={spec} />

      <SectionLabel space="practical" accent className="mt-10">{`Les étapes · ${n} sur ${d.steps.length}`}</SectionLabel>
      <ul className="mt-2">
        {d.steps.map((s, i) => {
          const on = checked.includes(i);
          return (
            <li key={s} style={{ borderBottom: i < d.steps.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
              <button type="button" onClick={() => toggle(i)} aria-pressed={on} className="flex w-full items-center gap-4 py-4 text-left">
                <span className="grid size-[26px] shrink-0 place-items-center rounded-full"
                  style={{ background: on ? "var(--sp-fill)" : "transparent", border: on ? "none" : "1.3px solid var(--sp-ink)" }}>
                  {on && <Check className="size-3.5" strokeWidth={2} style={{ color: "var(--lg-cream)" }} />}
                </span>
                <span className="text-[15px]" style={{ textDecoration: on ? "line-through" : undefined, color: on ? "var(--sp-sub)" : "var(--sp-ink)" }}>{s}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex flex-col items-start gap-6">
        {d.online ? (
          <a href={d.online.url} target="_blank" rel="noreferrer"
            className="inline-flex h-12 items-center rounded-full px-7 text-[15px]"
            style={{ background: "var(--lg-blue)", color: "var(--lg-deep)" }}>{d.online.label}</a>
        ) : d.letter ? (
          <PrimaryButton space="practical" to={`/practical/tasks/${d.id}/template`}>Préparer le courrier</PrimaryButton>
        ) : null}
        <TextLink space="practical" to={`/practical/share/${d.id}`}>Confier à un proche</TextLink>
        {d.online && d.letter && (
          <Link to="/practical/tasks/$id/template" params={{ id: d.id }} className="text-[13.5px] underline underline-offset-4" style={{ color: "var(--sp-ink)" }}>
            Préparer le courrier
          </Link>
        )}
      </div>
    </StandardLayout>
  );
}
