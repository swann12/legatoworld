import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { ExperienceLayout } from "@/components/legato/ds";
import { startAmbient, mmss, type Ambient, type AmbientKind } from "@/lib/ambient-sound";

export const Route = createFileRoute("/care/sons")({
  head: () => ({
    meta: [
      { title: "Sons pour s'endormir — Legato" },
      { name: "description", content: "Pluie, mer, forêt : des sons doux pour s'endormir. L'écran s'éteint tout seul à la fin." },
      { property: "og:title", content: "Sons pour s'endormir — Legato" },
      { property: "og:description", content: "Des sons pour s'endormir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Sons,
});

const SONS: { id: AmbientKind; label: string; min: number }[] = [
  { id: "pluie", label: "Pluie sur le toit", min: 45 },
  { id: "mer", label: "La mer, la nuit", min: 30 },
  { id: "foret", label: "Forêt au matin", min: 20 },
];

function Sons() {
  const [sel, setSel] = useState(0);
  const [left, setLeft] = useState(SONS[0].min * 60);
  const [playing, setPlaying] = useState(false);
  const [off, setOff] = useState(false);
  const amb = useRef<Ambient | null>(null);

  useEffect(() => () => amb.current?.stop(), []);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setLeft((s) => {
      if (s <= 1) { amb.current?.stop(); amb.current = null; setPlaying(false); setOff(true); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [playing]);

  const choose = (i: number) => {
    amb.current?.stop();
    amb.current = startAmbient(SONS[i].id);
    setSel(i); setLeft(SONS[i].min * 60); setPlaying(true); setOff(false);
  };
  const toggle = () => {
    if (playing) { amb.current?.pause(); setPlaying(false); return; }
    if (!amb.current || left === 0) { choose(sel); return; }
    amb.current.resume(); setPlaying(true);
  };

  if (off) {
    return (
      <button type="button" onClick={() => setOff(false)} aria-label="Rallumer l'écran" className="fixed inset-0 grid place-items-center text-[13px]"
        style={{ background: "var(--lg-night-2)", color: "color-mix(in oklab, var(--lg-cream) 25%, transparent)" }}>
        Bonne nuit.
      </button>
    );
  }

  return (
    <ExperienceLayout variant="night" back="/care" backLabel="Soutien"
      top={<>
        <h1 className="lg-title lg-ds-title" style={{ fontSize: 34 }}>Des sons<br /><em style={{ color: "var(--lg-mint)" }}>pour s'endormir.</em></h1>
        <p className="mt-4 text-[14.5px]">L'écran s'éteindra tout seul à la fin.</p>
      </>}
      action={
        <ul className="w-full" style={{ color: "var(--lg-deep)" }}>
          {SONS.map((s, i) => (
            <li key={s.id}>
              <button type="button" onClick={() => choose(i)} className="flex w-full items-center justify-between py-4 text-left"
                style={{ borderBottom: "1px solid color-mix(in oklab, var(--lg-deep) 25%, transparent)" }}>
                <span className={i === sel ? "italic" : ""} style={{ fontFamily: "var(--lg-serif)", fontSize: 20 }}>{s.label}</span>
                <span className="lg-mono">{s.min} min</span>
              </button>
            </li>
          ))}
        </ul>
      }>
      <p style={{ fontFamily: "var(--lg-serif)", fontSize: 64, lineHeight: 1 }}>{mmss(left)}</p>
      <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Lecture"} className="mt-7 grid size-[78px] place-items-center rounded-full"
        style={{ background: "var(--lg-cream)", color: "var(--lg-deep)" }}>
        {playing ? <Pause className="size-7" fill="currentColor" strokeWidth={0} /> : <Play className="ml-1 size-7" fill="currentColor" strokeWidth={0} />}
      </button>
    </ExperienceLayout>
  );
}
