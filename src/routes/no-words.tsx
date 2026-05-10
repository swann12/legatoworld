import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { similarAmbiances } from "@/lib/ambiance.functions";

export const Route = createFileRoute("/no-words")({
  head: () => ({ meta: [{ title: "Sans mots — Legato" }] }),
  component: NoWords,
});

type Motion = "drift" | "ripple" | "pulse" | "rain" | "veil";

type Texture = {
  id: string;
  title: string;
  whisper: string;
  asmr: string;
  motion: Motion;
  palette: [string, string, string];
  generated?: boolean;
};

const BASE: Texture[] = [
  {
    id: "warmth",
    title: "Chaleur lente",
    whisper: "Comme une main posée sur l'épaule.",
    asmr: "Souffle long, près d'un foyer",
    motion: "pulse",
    palette: ["var(--peach)", "var(--rose)", "var(--lavender)"],
  },
  {
    id: "ocean",
    title: "Marée intérieure",
    whisper: "Aller, revenir, à votre rythme.",
    asmr: "Vagues posées sur le sable",
    motion: "ripple",
    palette: ["var(--mist)", "var(--lavender)", "var(--paper)"],
  },
  {
    id: "forest",
    title: "Forêt qui respire",
    whisper: "Le vert se balance, sans bruit.",
    asmr: "Vent doux dans les feuilles",
    motion: "drift",
    palette: ["var(--sage)", "var(--mist)", "var(--dusk)"],
  },
  {
    id: "rain",
    title: "Pluie au carreau",
    whisper: "Tout s'apaise, à l'abri.",
    asmr: "Pluie continue derrière la vitre",
    motion: "rain",
    palette: ["var(--mist)", "var(--dusk)", "var(--mist)"],
  },
  {
    id: "moon",
    title: "Veillée",
    whisper: "Une lumière reste allumée pour vous.",
    asmr: "Silence sous les étoiles",
    motion: "veil",
    palette: ["var(--lavender)", "var(--dusk)", "var(--paper)"],
  },
  {
    id: "candle",
    title: "Bougie qui veille",
    whisper: "Une petite flamme suffit, ce soir.",
    asmr: "Cire qui crépite à voix basse",
    motion: "pulse",
    palette: ["var(--peach)", "var(--rose)", "var(--paper)"],
  },
  {
    id: "tea",
    title: "Thé qui infuse",
    whisper: "L'eau prend la couleur du temps.",
    asmr: "Eau versée dans une tasse",
    motion: "drift",
    palette: ["var(--peach)", "var(--mist)", "var(--sage)"],
  },
  {
    id: "wool",
    title: "Laine épaisse",
    whisper: "Posez tout, juste un instant.",
    asmr: "Aiguilles qui tricotent doucement",
    motion: "veil",
    palette: ["var(--rose)", "var(--peach)", "var(--lavender)"],
  },
  {
    id: "snow",
    title: "Neige qui tombe",
    whisper: "Le monde se feutre autour de vous.",
    asmr: "Pas légers sur la neige fraîche",
    motion: "rain",
    palette: ["var(--paper)", "var(--mist)", "var(--lavender)"],
  },
  {
    id: "wind",
    title: "Voile au vent",
    whisper: "Quelque chose respire, dehors.",
    asmr: "Tissu qui bouge à la fenêtre",
    motion: "drift",
    palette: ["var(--mist)", "var(--paper)", "var(--lavender)"],
  },
];

function bgFromPalette(p: [string, string, string], motion: Motion) {
  if (motion === "pulse")
    return `radial-gradient(circle at 30% 30%, ${p[0]}, ${p[1]} 55%, ${p[2]} 100%)`;
  if (motion === "ripple")
    return `linear-gradient(180deg, ${p[2]}, color-mix(in oklab, ${p[1]} 70%, ${p[0]}))`;
  if (motion === "drift")
    return `radial-gradient(ellipse at 60% 40%, ${p[0]}, color-mix(in oklab, ${p[1]} 60%, ${p[2]} 30%))`;
  if (motion === "rain")
    return `linear-gradient(180deg, color-mix(in oklab, ${p[1]} 70%, ${p[2]}), ${p[0]})`;
  return `radial-gradient(circle at 60% 30%, color-mix(in oklab, ${p[0]} 70%, white), color-mix(in oklab, ${p[1]} 30%, ${p[2]}))`;
}

function NoWords() {
  const { t } = useLegato();
  const [deck, setDeck] = useState<Texture[]>(BASE);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const startX = useRef<number | null>(null);

  const tex = deck[index];
  const next = () => setIndex((i) => (i + 1) % deck.length);
  const prev = () => setIndex((i) => (i - 1 + deck.length) % deck.length);

  const fetchSimilar = useServerFn(similarAmbiances);

  // ----- Ambient audio (procedural, Web Audio) -----
  const audioRef = useRef<AmbientAudio | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    return () => {
      audioRef.current?.stop();
      audioRef.current = null;
      try { ctxRef.current?.close(); } catch {}
      ctxRef.current = null;
    };
  }, []);
  // When ambiance changes while playing, swap the sound design (ctx already unlocked)
  useEffect(() => {
    if (!playing || !ctxRef.current) return;
    audioRef.current?.stop();
    audioRef.current = createAmbientAudio(ctxRef.current, tex.motion);
    audioRef.current?.start();
  }, [tex.motion, tex.id]);

  const togglePlay = () => {
    if (playing) {
      audioRef.current?.stop();
      audioRef.current = null;
      setPlaying(false);
      return;
    }
    // Create AudioContext from inside the user gesture so browsers unlock it.
    if (!ctxRef.current) {
      const Ctx =
        (window.AudioContext as typeof AudioContext | undefined) ||
        ((window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
      if (!Ctx) {
        setAiError("Le son n'est pas disponible sur ce navigateur.");
        return;
      }
      ctxRef.current = new Ctx();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
    audioRef.current = createAmbientAudio(ctx, tex.motion);
    audioRef.current?.start();
    setPlaying(true);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
    startX.current = null;
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") togglePlay();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [deck.length]);

  const onLoveAndExtend = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setAiError(null);
    try {
      const res = await fetchSimilar({
        data: {
          title: tex.title,
          whisper: tex.whisper,
          asmr: tex.asmr,
          motion: tex.motion,
        },
      });
      if (res.error || !res.variations?.length) {
        setAiError(res.error ?? "Aucune variation pour l'instant.");
      } else {
        const newOnes: Texture[] = res.variations.map((v, i) => ({
          id: `ai-${Date.now()}-${i}`,
          title: v.title,
          whisper: v.whisper,
          asmr: v.asmr,
          motion: (["drift", "ripple", "pulse", "rain", "veil"].includes(v.motion)
            ? v.motion
            : tex.motion) as Motion,
          palette: (v.palette.length === 3 ? v.palette : tex.palette) as [string, string, string],
          generated: true,
        }));
        setDeck((d) => {
          const copy = [...d];
          copy.splice(index + 1, 0, ...newOnes);
          return copy;
        });
      }
    } catch {
      setAiError("Le service n'a pas répondu.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Shell hideNav>
      <div
        className="relative min-h-dvh flex flex-col select-none overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* Immersive background — sits inside the page, above Shell's bg-paper */}
        <div
          className="absolute inset-0 transition-[background] duration-[1400ms] ease-out"
          style={{ background: bgFromPalette(tex.palette, tex.motion) }}
        />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <MotionLayer kind={tex.motion} accent={tex.palette[0]} />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 110%, rgba(40,30,40,0.18), transparent 55%)",
          }}
        />
        <div className="relative z-10 flex flex-col flex-1 min-h-dvh">
        {/* Top bar */}
        <div className="px-6 pt-8 flex items-center justify-between">
          <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/60">
            ← {t("nav.home")}
          </Link>
          <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
            {index + 1} / {deck.length}
          </span>
        </div>

        <div className="px-7 pt-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/55">
            {t("nowords.title")}
          </p>
          <h1
            className="mt-2 font-serif text-[1.55rem] leading-[1.18] font-light text-dusk max-w-[22ch]"
            style={{ textWrap: "balance" }}
          >
            Laissez-vous porter, sans rien chercher.
          </h1>
        </div>

        {/* Breathing guide overlay */}
        {breathing && <BreathingGuide onClose={() => setBreathing(false)} />}

        {/* Floating info — translucent, no opaque white panel */}
        <div className="flex-1" />

        <div className="px-7 pb-2">
          <div className="max-w-[34ch]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/55">
              {playing ? "Ambiance en cours" : "En silence"}
              {tex.generated && <span className="ml-2 text-dusk/40">· proposée pour vous</span>}
            </p>
            <h2
              className="mt-2 font-serif italic text-[26px] leading-[1.15] text-dusk"
              style={{ textWrap: "balance", textShadow: "0 1px 18px rgba(255,255,255,0.45)" }}
            >
              {tex.title}
            </h2>
            <p
              className="mt-2 text-[14px] leading-relaxed text-dusk/80"
              style={{ textWrap: "pretty" }}
            >
              {tex.whisper}
            </p>
            <p className="mt-3 text-[12px] text-dusk/60 italic" style={{ textWrap: "pretty" }}>
              Son · {tex.asmr.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <button
            onClick={prev}
            className="size-11 rounded-full flex items-center justify-center text-dusk/75 text-lg backdrop-blur-md"
            style={{ background: "color-mix(in oklab, var(--paper) 32%, transparent)" }}
            aria-label="Ambiance précédente"
          >
            ←
          </button>
          <button
            onClick={togglePlay}
            className="flex-1 px-5 py-3.5 text-center backdrop-blur-md rounded-full"
            style={{
              background: "color-mix(in oklab, var(--paper) 38%, transparent)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <p className="font-serif italic text-dusk text-[15px]">
              {playing ? "Mettre en pause" : "Écouter ce son"}
            </p>
          </button>
          <button
            onClick={next}
            className="size-11 rounded-full flex items-center justify-center text-dusk/75 text-lg backdrop-blur-md"
            style={{ background: "color-mix(in oklab, var(--paper) 32%, transparent)" }}
            aria-label="Ambiance suivante"
          >
            →
          </button>
        </div>

        {/* Secondary actions */}
        <div className="px-6 pb-4 flex items-center gap-3">
          <button
            onClick={() => setBreathing(true)}
            className="flex-1 py-3 rounded-full text-[12.5px] text-dusk/85 backdrop-blur-md"
            style={{ background: "color-mix(in oklab, var(--paper) 28%, transparent)" }}
          >
            Respirer avec moi
          </button>
          <button
            onClick={onLoveAndExtend}
            disabled={loadingMore}
            className="flex-1 py-3 rounded-full text-[12.5px] text-dusk/85 backdrop-blur-md disabled:opacity-60"
            style={{ background: "color-mix(in oklab, var(--paper) 28%, transparent)" }}
          >
            {loadingMore ? "Une voix douce arrive…" : "♡ J'aime — prolonger"}
          </button>
        </div>
        {aiError && (
          <p className="px-7 pb-3 text-[11px] text-dusk/60 italic">{aiError}</p>
        )}

        {/* Dots */}
        <div className="pb-7 pt-1 flex justify-center gap-1.5">
          {deck.map((tx, i) => (
            <span
              key={tx.id}
              className={`h-[3px] rounded-full transition-all ${
                i === index ? "w-6 bg-dusk/70" : "w-2 bg-dusk/25"
              }`}
            />
          ))}
        </div>
        </div>
      </div>
    </Shell>
  );
}

/* ---------- Breathing guide ----------
   Refonte : un seul cercle qui grandit pendant l'inspiration,
   se tient pendant la suspension, se rétracte pendant l'expiration.
   Compte à rebours visible. Fond très sombre, lumière douce. */
function BreathingGuide({ onClose }: { onClose: () => void }) {
  type Phase = "in" | "hold" | "out";
  const PHASES: { id: Phase; label: string; verb: string; seconds: number }[] = [
    { id: "in",   label: "Inspirez",   verb: "Le cercle grandit — laissez l'air entrer par le nez.", seconds: 4 },
    { id: "hold", label: "Suspendez",  verb: "Restez là, sans forcer.", seconds: 4 },
    { id: "out",  label: "Expirez",    verb: "Le cercle se referme — soufflez doucement par la bouche.", seconds: 6 },
  ];
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(PHASES[0].seconds);

  useEffect(() => {
    setCount(PHASES[step].seconds);
    const tick = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          const nextStep = (step + 1) % PHASES.length;
          setStep(nextStep);
          return PHASES[nextStep].seconds;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const phase = PHASES[step];
  // Scale endpoints per phase. The transition uses the FULL phase duration,
  // so the circle visibly travels from one size to the next while you breathe.
  const SCALE = { in: { from: 0.45, to: 1 }, hold: { from: 1, to: 1 }, out: { from: 1, to: 0.45 } } as const;
  const target = SCALE[phase.id].to;
  const duration = phase.seconds * 1000;

  return (
    <div
      className="fixed inset-0 z-30 flex flex-col items-center justify-center px-7"
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, rgba(36,28,40,0.96), rgba(12,10,16,0.99))",
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[11px] uppercase tracking-[0.22em] text-white/55"
      >
        Fermer
      </button>

      <p className="text-[10px] uppercase tracking-[0.28em] text-white/40 mb-10">
        Respiration guidée
      </p>

      <div className="relative size-[280px] flex items-center justify-center">
        {/* Reference circle — the maximum size, kept very faint */}
        <div className="absolute inset-0 rounded-full border border-white/10" />

        {/* Breathing orb — soft warm light, scales with the phase */}
        <div
          key={phase.id + step}
          className="absolute inset-0 rounded-full will-change-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(255,205,170,0.55) 0%, rgba(255,180,150,0.18) 45%, rgba(255,180,150,0.02) 72%, transparent 80%)",
            transform: `scale(${SCALE[phase.id].from})`,
            animation: `legato-breath-phase ${duration}ms cubic-bezier(0.45, 0, 0.55, 1) forwards`,
            // CSS variable fed to the keyframes
            ['--to' as string]: String(target),
            ['--from' as string]: String(SCALE[phase.id].from),
          } as React.CSSProperties}
        />

        {/* Center label — phase + remaining seconds */}
        <div className="relative text-center">
          <p className="font-serif italic text-white/90 text-[22px] leading-none">
            {phase.label}
          </p>
          <p className="mt-3 font-serif text-white/75 text-[52px] font-light leading-none tabular-nums">
            {count}
          </p>
        </div>
      </div>

      <p className="mt-12 text-[13px] text-white/70 max-w-[30ch] text-center leading-relaxed" style={{ textWrap: "balance" }}>
        {phase.verb}
      </p>
      <p className="mt-4 text-[10.5px] uppercase tracking-[0.28em] text-white/30">
        4 · 4 · 6
      </p>

      {/* Inline keyframes — scoped to this view */}
      <style>{`
        @keyframes legato-breath-phase {
          from { transform: scale(var(--from)); }
          to   { transform: scale(var(--to)); }
        }
      `}</style>
    </div>
  );
}

/* ---------- Procedural ambient audio (Web Audio) ---------- */
type AmbientAudio = { start: () => void; stop: () => void };

function createAmbientAudio(ctx: AudioContext, motion: Motion): AmbientAudio | null {
  if (typeof window === "undefined") return null;
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Build noise buffers — brown (warm) and white (sharp)
  const bufferSize = 3 * ctx.sampleRate;
  const brown = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const white = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  {
    const b = brown.getChannelData(0);
    const w = white.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const r = Math.random() * 2 - 1;
      last = (last + 0.02 * r) / 1.02;
      b[i] = last * 3.5;
      w[i] = r;
    }
  }

  const stops: Array<() => void> = [];
  const targetGain = 0.14;

  const playNoise = (
    buf: AudioBuffer,
    type: BiquadFilterType,
    freq: number,
    q: number,
    gain: number,
  ) => {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(f);
    f.connect(g);
    g.connect(master);
    src.start();
    stops.push(() => { try { src.stop(); } catch {} });
    return { f, g };
  };

  // Per-motion sound design — each is unmistakably different.
  if (motion === "pulse") {
    // Warm hearth — very deep brown noise, almost felt rather than heard
    playNoise(brown, "lowpass", 240, 0.3, 0.45);
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 58;
    const subG = ctx.createGain();
    subG.gain.value = 0.025;
    sub.connect(subG); subG.connect(master);
    sub.start();
    stops.push(() => { try { sub.stop(); } catch {} });
    // very slow swell — barely perceptible
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 0.08; lfoG.gain.value = 0.03;
    lfo.connect(lfoG); lfoG.connect(master.gain);
    lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
    // Sparse, soft crackles — like embers in a hearth
    let cancelledP = false;
    const crackle = () => {
      if (cancelledP) return;
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = 1100 + Math.random() * 900;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 1600; f.Q.value = 1.2;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.014, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(f); f.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.12);
      setTimeout(crackle, 1200 + Math.random() * 4200);
    };
    crackle();
    stops.push(() => { cancelledP = true; });
  } else if (motion === "ripple") {
    // Ocean — distant surf with slow back-and-forth swell
    const { f, g } = playNoise(brown, "bandpass", 420, 0.4, 0.55);
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 0.09; lfoG.gain.value = 220;
    lfo.connect(lfoG); lfoG.connect(f.frequency);
    lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
    // Volume swell that mirrors the rings expanding/receding
    const vol = ctx.createOscillator();
    const volG = ctx.createGain();
    vol.frequency.value = 0.07; volG.gain.value = 0.18;
    vol.connect(volG); volG.connect(g.gain);
    vol.start();
    stops.push(() => { try { vol.stop(); } catch {} });
  } else if (motion === "drift") {
    // Forest / wind — soft airy band, slow wobble. Warm, low hiss.
    const { f } = playNoise(brown, "bandpass", 720, 0.6, 0.4);
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 0.1; lfoG.gain.value = 320;
    lfo.connect(lfoG); lfoG.connect(f.frequency);
    lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
    // High whisper layer, very quiet — gives the "leaves" sparkle without harshness
    playNoise(white, "bandpass", 2400, 0.6, 0.05);
  } else if (motion === "rain") {
    // Rain — soft veil of falling water + sparse, muted droplets close-by
    playNoise(white, "bandpass", 1600, 0.4, 0.2);
    playNoise(brown, "lowpass", 520, 0.3, 0.26);
    let cancelled = false;
    const drop = () => {
      if (cancelled) return;
      // Soft round droplet — sine, lower pitch, slow decay → "plic" not "tic"
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = 420 + Math.random() * 380;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.022, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.5);
      setTimeout(drop, 220 + Math.random() * 520);
    };
    drop();
    stops.push(() => { cancelled = true; });
  } else {
    // Veil / snow — quiet warm low-pass + barely audible airy halo
    playNoise(brown, "lowpass", 200, 0.25, 0.28);
    const { f } = playNoise(white, "bandpass", 3200, 0.7, 0.025);
    // Very slow halo movement, almost imperceptible
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 0.05; lfoG.gain.value = 600;
    lfo.connect(lfoG); lfoG.connect(f.frequency);
    lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
  }

  let started = false;
  return {
    start() {
      if (started) return;
      started = true;
      try { ctx.resume(); } catch {}
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(targetGain, now + 2.4);
    },
    stop() {
      try {
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.linearRampToValueAtTime(0, now + 1.2);
        setTimeout(() => {
          stops.forEach((fn) => fn());
          // Do NOT close the context: it is reused across ambiances.
        }, 1300);
      } catch {}
    },
  };
}

/* ---------- Background motion (full screen) ---------- */
function MotionLayer({ kind, accent }: { kind: Motion; accent: string }) {
  // Shared, dark-friendly keyframes for all ambiances.
  // Visual language: low-contrast, warm-tinted glow on top of accent, slow drifts,
  // soft particles. Nothing strobes or contrasts harshly with a dark room.
  const keyframes = (
    <style>{`
      @keyframes nw-breathe {
        0%, 100% { transform: translate3d(0,0,0) scale(1);   opacity: var(--o, 0.32); }
        50%      { transform: translate3d(0,0,0) scale(1.08); opacity: calc(var(--o, 0.32) * 1.35); }
      }
      @keyframes nw-float {
        0%   { transform: translate3d(var(--fx,0),0,0) scale(1); }
        50%  { transform: translate3d(calc(var(--fx,0) + 6vmin), -4vmin, 0) scale(1.04); }
        100% { transform: translate3d(var(--fx,0),0,0) scale(1); }
      }
      @keyframes nw-rise {
        0%   { transform: translate3d(0, 18vmin, 0) scale(0.8); opacity: 0; }
        15%  { opacity: var(--o, 0.5); }
        85%  { opacity: var(--o, 0.5); }
        100% { transform: translate3d(2vmin, -22vmin, 0) scale(1.1); opacity: 0; }
      }
      @keyframes nw-ring {
        0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
        20%  { opacity: 0.55; }
        100% { transform: translate(-50%, -50%) scale(2.4);  opacity: 0; }
      }
      @keyframes nw-fall {
        0%   { transform: translate3d(var(--dx,0), -12vh, 0); opacity: 0; }
        12%  { opacity: var(--o, 0.7); }
        88%  { opacity: var(--o, 0.7); }
        100% { transform: translate3d(calc(var(--dx,0) + 1vw), 110vh, 0); opacity: 0; }
      }
      @keyframes nw-snow {
        0%   { transform: translate3d(0, -10vh, 0); opacity: 0; }
        15%  { opacity: var(--o, 0.55); }
        85%  { opacity: var(--o, 0.55); }
        100% { transform: translate3d(8vmin, 110vh, 0); opacity: 0; }
      }
      @keyframes nw-hue {
        0%, 100% { opacity: 0.18; }
        50%      { opacity: 0.28; }
      }
    `}</style>
  );

  if (kind === "pulse") {
    // Hearth / candle — warm centered glow that breathes, with rising embers.
    return (
      <>
        {keyframes}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full halo-lg"
          style={{
            width: "88vmin", aspectRatio: "1",
            background: `radial-gradient(circle, ${accent}, transparent 72%)`,
            ['--o' as string]: "0.42",
            animation: "nw-breathe 14s ease-in-out infinite",
          } as React.CSSProperties}
        />
        <div
          className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full halo-lg"
          style={{
            width: "44vmin", aspectRatio: "1",
            background: "radial-gradient(circle, rgba(255,205,170,0.55), transparent 70%)",
            ['--o' as string]: "0.38",
            animation: "nw-breathe 11s ease-in-out infinite",
          } as React.CSSProperties}
        />
        {Array.from({ length: 12 }).map((_, i) => {
          const left = 14 + (i * 73) % 72;
          const delay = (i * 1.7) % 14;
          const size = 4 + (i % 4) * 2;
          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${left}%`, bottom: `${10 + (i % 5) * 6}%`,
                width: `${size}px`, height: `${size}px`,
                background: "radial-gradient(circle, rgba(255,205,170,0.85), rgba(255,170,130,0) 70%)",
                ['--o' as string]: "0.45",
                animation: `nw-rise ${14 + (i % 5) * 3}s ease-in ${delay}s infinite`,
                filter: "blur(0.5px)",
              } as React.CSSProperties}
            />
          );
        })}
      </>
    );
  }

  if (kind === "ripple") {
    // Tide — soft concentric rings expanding from below, like a stone in water.
    return (
      <>
        {keyframes}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 95%, ${accent}, transparent 60%)`,
            animation: "nw-hue 9s ease-in-out infinite",
          }}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 top-[88%] rounded-full border"
            style={{
              width: "20vmin", aspectRatio: "1",
              borderColor: "rgba(255,255,255,0.18)",
              animation: `nw-ring 14s ease-out ${i * 2.8}s infinite`,
            }}
          />
        ))}
      </>
    );
  }

  if (kind === "drift") {
    // Forest / wind / tea — large blurred orbs floating very slowly.
    const orbs = [
      { top: "-12%", left: "-10%", size: "78vmin", color: accent, dur: "44s", o: 0.32, fx: "0" },
      { top: "30%",  left: "62%",  size: "62vmin", color: "rgba(255,210,180,0.45)", dur: "52s", o: 0.26, fx: "-2vmin" },
      { top: "60%",  left: "8%",   size: "70vmin", color: "rgba(190,200,220,0.45)", dur: "60s", o: 0.22, fx: "0" },
    ];
    return (
      <>
        {keyframes}
        {orbs.map((o, i) => (
          <div
            key={i}
            className="absolute rounded-full halo-lg"
            style={{
              top: o.top, left: o.left,
              width: o.size, aspectRatio: "1",
              background: `radial-gradient(circle, ${o.color}, transparent 72%)`,
              opacity: o.o,
              ['--fx' as string]: o.fx,
              animation: `nw-float ${o.dur} ease-in-out infinite`,
            } as React.CSSProperties}
          />
        ))}
      </>
    );
  }

  if (kind === "rain") {
    // Rain — soft slanted droplet streaks, plus mist gathered at the bottom.
    return (
      <>
        {keyframes}
        <div
          className="absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(20,18,28,0.35))",
          }}
        />
        {Array.from({ length: 22 }).map((_, i) => {
          const left = (i * 41) % 100;
          const dx = ((i * 17) % 12) - 6;
          const dur = 4.5 + (i % 6) * 0.6;
          const delay = (i * 0.37) % dur;
          return (
            <span
              key={i}
              className="absolute"
              style={{
                left: `${left}%`, top: 0,
                width: "1px", height: "10vh",
                background: "linear-gradient(180deg, transparent, rgba(220,225,240,0.55))",
                ['--dx' as string]: `${dx}vw`,
                ['--o' as string]: "0.5",
                animation: `nw-fall ${dur}s linear ${delay}s infinite`,
                filter: "blur(0.4px)",
              } as React.CSSProperties}
            />
          );
        })}
      </>
    );
  }

  // veil — moonlit / wool / snow : faint top glow + slow snow.
  return (
    <>
      {keyframes}
      <div
        className="absolute -top-[20vmin] left-1/2 -translate-x-1/2 rounded-full halo-lg"
        style={{
          width: "80vmin", aspectRatio: "1",
          background: `radial-gradient(circle, ${accent}, transparent 70%)`,
          opacity: 0.28,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.18), transparent 60%)",
        }}
      />
      {Array.from({ length: 26 }).map((_, i) => {
        const left = (i * 53) % 100;
        const size = 2 + (i % 4);
        const dur = 18 + (i % 7) * 3;
        const delay = (i * 0.9) % dur;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`, top: 0,
              width: `${size}px`, height: `${size}px`,
              background: "rgba(245,240,255,0.85)",
              ['--o' as string]: "0.55",
              animation: `nw-snow ${dur}s linear ${delay}s infinite`,
              filter: "blur(0.6px)",
            } as React.CSSProperties}
          />
        );
      })}
    </>
  );
}