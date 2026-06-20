import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, CARE_SUBNAV } from "@/components/legato/SubNav";

export const Route = createFileRoute("/care/respirer")({
  head: () => ({ meta: [{ title: "Respirer — Legato" }] }),
  component: CareRespirer,
});

type Rhythm = { id: "court" | "doux" | "nuit"; label: string; in: number; hold: number; out: number; tone: string };

const RHYTHMS: Rhythm[] = [
  { id: "court", label: "1 min", in: 3, hold: 2, out: 5, tone: "var(--sky)" },
  { id: "doux", label: "3 min", in: 4, hold: 4, out: 6, tone: "var(--blush)" },
  { id: "nuit", label: "Nuit", in: 4, hold: 7, out: 8, tone: "var(--bordeaux)" },
];

function CareRespirer() {
  const [rhythm, setRhythm] = useState<Rhythm>(RHYTHMS[0]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [seconds, setSeconds] = useState(rhythm.in);

  const phases = useMemo(() => [
    { id: "in", label: "Inspirez", seconds: rhythm.in, scale: 1 },
    { id: "hold", label: "Gardez", seconds: rhythm.hold, scale: 1 },
    { id: "out", label: "Expirez", seconds: rhythm.out, scale: 0.58 },
  ], [rhythm]);

  useEffect(() => {
    setPhaseIndex(0);
    setSeconds(rhythm.in);
  }, [rhythm]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current > 1) return current - 1;
        const next = (phaseIndex + 1) % phases.length;
        setPhaseIndex(next);
        return phases[next].seconds;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phaseIndex, phases]);

  const phase = phases[phaseIndex];
  const progress = 1 - (seconds - 1) / phase.seconds;

  return (
    <Shell livingBg={false}>
      <main className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <Link to="/care" className="mono-label text-dusk/55">Soutien →</Link>
        </header>
        <SubNav items={CARE_SUBNAV} ariaLabel="Sous-navigation Soutien" />

        <section className="px-6 pt-8">
          <p className="mono-label">Respirer</p>
          <h1 className="mt-4 ed-page-title">
            Revenir au <span className="italic" style={{ color: "var(--terracotta)" }}>souffle</span>.
          </h1>
          <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Un cercle lent, une consigne à la fois. Aucun objectif à atteindre.
          </p>
        </section>

        <section className="px-6 pt-9">
          <div className="relative mx-auto flex aspect-square max-w-[310px] items-center justify-center rounded-full" style={{ background: "var(--whisper)" }}>
            <div className="absolute inset-5 rounded-full border border-dusk/10" />
            <div
              key={`${rhythm.id}-${phase.id}`}
              className="absolute size-[210px] rounded-full transition-transform duration-1000 ease-in-out"
              style={{
                background: `color-mix(in oklab, ${rhythm.tone} 62%, var(--paper))`,
                transform: `scale(${phase.scale})`,
                boxShadow: "0 22px 80px color-mix(in oklab, var(--dusk) 10%, transparent)",
              }}
            />
            <div className="relative text-center">
              <p className="font-serif text-[30px] leading-none">{phase.label}</p>
              <p className="mt-4 text-[40px] font-serif tabular-nums leading-none">{seconds}</p>
              <div className="mx-auto mt-5 h-[3px] w-24 overflow-hidden rounded-full bg-dusk/10">
                <div className="h-full rounded-full" style={{ width: `${Math.max(8, progress * 100)}%`, background: "var(--terracotta)" }} />
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-8">
          <div className="grid grid-cols-3 gap-2 rounded-full border border-dusk/10 bg-[color:var(--whisper)] p-1">
            {RHYTHMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRhythm(item)}
                className="rounded-full px-3 py-2 text-[12px] transition-colors"
                style={{ background: rhythm.id === item.id ? "var(--dusk)" : "transparent", color: rhythm.id === item.id ? "var(--paper)" : "var(--dusk)" }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 pt-8 grid grid-cols-2 gap-3">
          <Link to="/presence" className="rounded-[18px] px-5 py-5 min-h-[112px] flex flex-col justify-between" style={{ background: "var(--sun)" }}>
            <p className="mono-label text-dusk/60">Après</p>
            <p className="font-serif text-[18px] leading-tight">Se confier à Présence</p>
          </Link>
          <Link to="/care/journal" className="rounded-[18px] px-5 py-5 min-h-[112px] flex flex-col justify-between" style={{ background: "var(--blush)" }}>
            <p className="mono-label text-dusk/60">Déposer</p>
            <p className="font-serif text-[18px] leading-tight">Quelques mots seulement</p>
          </Link>
        </section>
      </main>
    </Shell>
  );
}