import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ExperienceLayout } from "@/components/legato/ds";
import { activityById, recordDone } from "@/lib/self-care";

export const Route = createFileRoute("/help/corps/soin/$id")({
  head: () => ({
    meta: [
      { title: "Exercice guidé — Legato" },
      { name: "description", content: "Un geste à la fois, guidé pas à pas, à votre rythme." },
      { property: "og:title", content: "Exercice guidé — Legato" },
      { property: "og:description", content: "Un geste à la fois, à votre rythme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Exercice,
});

function Exercice() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const activity = activityById(id);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const from = activity?.from ?? { to: "/help/corps", label: "Le corps" };
  const leave = () => navigate({ to: from.to });

  if (!activity) {
    return (
      <ExperienceLayout back="/help/corps" backLabel="Le corps">
        <p className="lg-title" style={{ fontSize: 28, color: "var(--lg-deep)" }}>Cet exercice n'existe plus.</p>
        <Link to="/help/corps" className="mt-6 underline underline-offset-4" style={{ color: "var(--lg-deep)" }}>Revenir au corps</Link>
      </ExperienceLayout>
    );
  }

  const lines = activity.lines ?? activity.steps.map((s) => ({ a: s.text, b: "", sub: "Prenez le temps qu'il faut." }));
  const total = lines.length;
  const cur = lines[Math.min(step, total - 1)];
  const next = () => {
    if (step + 1 < total) setStep(step + 1);
    else { recordDone(activity.id); setDone(true); }
  };

  return (
    <ExperienceLayout back={from.to} backLabel={from.label} onClose={leave}
      top={
        <div className="flex justify-center gap-[10px]" aria-label={`Étape ${Math.min(step + 1, total)} sur ${total}`}>
          {lines.map((_, i) => (
            <span key={i} className="size-2 rounded-full"
              style={{ background: "var(--lg-deep)", opacity: i <= step || done ? 1 : 0.25 }} />
          ))}
        </div>
      }
      action={
        <div className="flex flex-col items-center gap-5">
          <button type="button" onClick={done ? leave : next}
            className="h-[52px] rounded-full px-[34px] text-[15px]"
            style={{ background: "color-mix(in oklab, var(--lg-cream) 88%, var(--lg-mint))", color: "var(--lg-deep)" }}>
            {done ? "Revenir" : "C'est fait"}
          </button>
          {!done && (
            <button type="button" onClick={leave} className="text-[14px] underline underline-offset-4" style={{ color: "var(--lg-cream)" }}>
              Arrêter
            </button>
          )}
        </div>
      }>
      <div style={{ color: "var(--lg-deep)" }}>
        {done ? (
          <p className="lg-title lg-ds-title" style={{ fontSize: 32 }}><em>{activity.closing}</em></p>
        ) : (
          <>
            <h1 className="lg-title lg-ds-title" style={{ fontSize: 34 }}>
              {cur.a}{cur.b && <><br /><em>{cur.b}</em></>}
            </h1>
            {cur.sub && <p className="mt-5 text-[15px]" style={{ opacity: 0.75 }}>{cur.sub}</p>}
          </>
        )}
      </div>
    </ExperienceLayout>
  );
}
