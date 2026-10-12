import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";
import { SelfFigure } from "@/components/legato/SelfFigure";
import { activityById, recordDone, loadSelfCare, vitality } from "@/lib/self-care";

export const Route = createFileRoute("/help/corps/soin/$id")({
  head: () => ({
    meta: [
      { title: "Un temps de soin — Legato" },
      { name: "description", content: "Une pratique courte et guidée : respiration, repos, relâchement du corps." },
      { property: "og:title", content: "Un temps de soin — Legato" },
      { property: "og:description", content: "Une pratique courte et guidée, à votre rythme." },
    ],
  }),
  component: Soin,
});

function Soin() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const activity = activityById(id);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [left, setLeft] = useState(0);
  const [done, setDone] = useState(false);
  const [v, setV] = useState(0.3);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setV(vitality(loadSelfCare())); }, [done]);

  useEffect(() => {
    if (!started || done || !activity) return;
    setLeft(activity.steps[step].seconds);
    timer.current = setInterval(() => {
      setLeft((l) => {
        if (l > 1) return l - 1;
        clearInterval(timer.current!);
        if (step + 1 < activity.steps.length) setStep((s) => s + 1);
        else { recordDone(activity.id); setDone(true); }
        return 0;
      });
    }, 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [started, step, done, activity]);

  if (!activity) {
    return (
      <Shell livingBg={false}>
        <div className="wash-butter min-h-dvh text-dusk p-6">
          <PageHeader title="SOIN" back="/help/corps" />
          <p className="mt-10 font-serif text-[20px]">Cette pratique n'existe pas ou plus.</p>
          <Link to="/help/corps" className="mt-6 inline-block mono-label">Revenir au corps →</Link>
        </div>
      </Shell>
    );
  }

  const current = activity.steps[Math.min(step, activity.steps.length - 1)];

  return (
    <Shell livingBg={false}>
      <div className="wash-butter min-h-dvh text-dusk pb-32">
        <PageHeader title="UN TEMPS DE SOIN" back="/help/corps" />

        <section className="px-6 pt-4">
          <p className="mono-label">{activity.kind} · {activity.minutes} min</p>
          <h1 className="mt-4 ed-page-title text-[28px]">{activity.title}</h1>
          {!started && <p className="mt-5 body-meta max-w-[34ch]">{activity.intro}</p>}
        </section>

        {!started && !done && (
          <section className="px-5 pt-8">
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="w-full rounded-full px-6 py-4 font-serif text-[17px]"
              style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
            >
              Commencer
            </button>
            <p className="mt-3 text-center text-[11.5px] text-dusk/45">Vous pouvez arrêter à tout moment.</p>
          </section>
        )}

        {started && !done && (
          <>
            <section className="px-6 pt-8 flex justify-center">
              <div
                className="rounded-full transition-all duration-1000"
                style={{
                  width: 168, height: 168,
                  background: "var(--blush)",
                  transform: `scale(${0.86 + (1 - left / Math.max(current.seconds, 1)) * 0.14})`,
                  opacity: 0.7,
                }}
              />
            </section>
            <section className="px-7 pt-8 text-center">
              <p className="font-serif text-[21px] leading-[1.4] max-w-[26ch] mx-auto">{current.text}</p>
              <p className="mt-5 mono-label text-dusk/45">{left}s · étape {step + 1}/{activity.steps.length}</p>
            </section>
            <div className="px-6 pt-9 flex items-center justify-between">
              <button type="button" onClick={() => navigate({ to: "/help/corps" })} className="mono-label text-dusk/45">
                Arrêter
              </button>
              <button
                type="button"
                onClick={() => {
                  if (timer.current) clearInterval(timer.current);
                  if (step + 1 < activity.steps.length) setStep((s) => s + 1);
                  else { recordDone(activity.id); setDone(true); }
                }}
                className="mono-label"
                style={{ color: "var(--terracotta)" }}
              >
                Passer à la suite →
              </button>
            </div>
          </>
        )}

        {done && (
          <>
            <section className="px-6 pt-6 flex justify-center">
              <SelfFigure vitality={v} />
            </section>
            <section className="px-7 pt-4 text-center">
              <p className="font-serif text-[20px] leading-[1.45] max-w-[28ch] mx-auto">{activity.closing}</p>
            </section>
            <section className="px-5 pt-9 space-y-3">
              <Link to="/help/corps" className="block rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4">
                <p className="font-serif text-[17px]">Revenir au corps →</p>
              </Link>
              <Link to="/care" className="block rounded-[18px] border border-dusk/10 bg-paper px-5 py-4">
                <p className="font-serif text-[17px]">Retour au soutien →</p>
              </Link>
            </section>
          </>
        )}
      </div>
    </Shell>
  );
}
