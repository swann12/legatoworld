import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, ArrowLeft, X } from "lucide-react";
import { StandardLayout, PageTitle, Lead } from "@/components/legato/ds";
import { startAmbient, type Ambient, type AmbientKind } from "@/lib/ambient-sound";

type Mood = "matin" | "nuit" | "foret";

const MOODS: { id: Mood; label: string; sub: string; min: number; grad: string; sound: AmbientKind; dark: boolean }[] = [
  { id: "matin", label: "Matin", sub: "Bleu et vert pâle · 10 min", min: 10, grad: "var(--lg-grad-soutien)", sound: "matin", dark: false },
  { id: "nuit", label: "Nuit", sub: "Vert profond et bleu · 20 min", min: 20, grad: "var(--lg-grad-nuit)", sound: "nuit", dark: true },
  { id: "foret", label: "Forêt", sub: "Bruit de feuilles · 15 min", min: 15, grad: "var(--lg-grad-foret)", sound: "foret", dark: false },
];

export const Route = createFileRoute("/no-words")({
  validateSearch: (s: Record<string, unknown>): { play?: Mood } =>
    s.play === "matin" || s.play === "nuit" || s.play === "foret" ? { play: s.play } : {},
  head: () => ({
    meta: [
      { title: "Se poser — Legato" },
      { name: "description", content: "Se poser, sans lire ni parler : des couleurs qui changent lentement et un son très doux." },
      { property: "og:title", content: "Se poser — Legato" },
      { property: "og:description", content: "Pour les moments où tout est trop." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SePoser,
});

function SePoser() {
  const { play } = Route.useSearch();
  const mood = MOODS.find((m) => m.id === play);
  if (mood) return <Lecture key={mood.id} mood={mood} />;

  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" className="mt-12">Se poser,<br /><em>sans lire ni parler.</em></PageTitle>
      <Lead space="support" className="mt-4">Des couleurs qui changent lentement et un son très doux, pour les moments où tout est trop.</Lead>
      <ul className="mt-8">
        {MOODS.map((m, i) => (
          <li key={m.id}>
            <Link to="/no-words" search={{ play: m.id }} className="flex items-center gap-5 py-4"
              style={{ borderBottom: i === MOODS.length - 1 ? "none" : "1px solid var(--sp-line)", color: "var(--sp-ink)" }}>
              <span className="size-[58px] shrink-0 rounded-full" style={{ background: m.grad }} />
              <span className="min-w-0 flex-1">
                <span className="lg-row-title block">{m.label}</span>
                <span className="lg-row-sub mt-1 block" style={{ color: "var(--sp-sub)" }}>{m.sub}</span>
              </span>
              <span aria-hidden className="text-[18px]">›</span>
            </Link>
          </li>
        ))}
      </ul>
    </StandardLayout>
  );
}

function Lecture({ mood }: { mood: (typeof MOODS)[number] }) {
  const navigate = useNavigate();
  const [left, setLeft] = useState(mood.min * 60);
  const [playing, setPlaying] = useState(true);
  const amb = useRef<Ambient | null>(null);

  useEffect(() => {
    amb.current = startAmbient(mood.sound);
    return () => amb.current?.stop();
  }, [mood.sound]);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setLeft((s) => {
      if (s <= 1) { amb.current?.stop(); setPlaying(false); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [playing]);

  const toggle = () => {
    if (playing) { amb.current?.pause(); setPlaying(false); }
    else if (left > 0) { amb.current?.resume(); setPlaying(true); }
  };
  const back = () => navigate({ to: "/no-words", search: {} });
  const top = mood.dark ? "var(--lg-cream)" : "var(--lg-deep)";
  const mins = Math.ceil(left / 60);

  return (
    <div className="relative min-h-dvh overflow-hidden" style={{ fontFamily: "var(--lg-sans)" }}>
      <div aria-hidden className="lg-drift absolute inset-x-0 -top-[50%] h-[200%]" style={{ background: mood.grad, animationPlayState: playing ? "running" : "paused" }} />
      <div className="relative mx-auto flex min-h-dvh max-w-[430px] flex-col pb-12" style={{ paddingInline: "var(--lg-margin)" }}>
        <div className="flex items-center justify-between text-[14px]" style={{ height: "var(--lg-header-h)", color: top }}>
          <button type="button" onClick={back} className="flex min-h-11 items-center gap-2"><ArrowLeft className="size-4" strokeWidth={1.4} /> Se poser</button>
          <button type="button" onClick={back} className="flex min-h-11 items-center gap-2">Fermer <X className="size-4" strokeWidth={1.4} /></button>
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-center text-center" style={{ color: mood.dark ? "var(--lg-deep)" : "var(--lg-cream)" }}>
          <p className="italic" style={{ fontFamily: "var(--lg-serif)", fontSize: 30 }}>{mood.label}</p>
          <p className="lg-mono mt-3" style={{ color: "inherit", opacity: 0.85 }}>
            {left === 0 ? "Terminé" : `${mins} min restante${mins > 1 ? "s" : ""}`}
          </p>
          <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Reprendre"} className="mt-6 grid size-[54px] place-items-center rounded-full"
            style={{ background: "color-mix(in oklab, var(--lg-cream) 55%, transparent)", color: "var(--lg-deep)" }}>
            {playing ? <Pause className="size-5" fill="currentColor" strokeWidth={0} /> : <Play className="ml-0.5 size-5" fill="currentColor" strokeWidth={0} />}
          </button>
        </div>
      </div>
    </div>
  );
}
