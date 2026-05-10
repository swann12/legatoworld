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
    { id: "in", label: "Inspirez", verb: "Par le nez, lentement.", seconds: 4 },
    { id: "hold", label: "Suspendez", verb: "Restez là, sans forcer.", seconds: 4 },
    { id: "out", label: "Expirez", verb: "Par la bouche, longuement.", seconds: 6 },
  ];
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(PHASES[0].seconds);

  useEffect(() => {
    setCount(PHASES[step].seconds);
    const tick = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setStep((s) => (s + 1) % PHASES.length);
          return PHASES[step].seconds;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const phase = PHASES[step];
  // Smooth scale: in → grow to 1, hold → stay 1, out → shrink to 0.5
  const scale = phase.id === "in" ? 1 : phase.id === "hold" ? 1 : 0.5;
  const duration = phase.seconds * 1000;

  return (
    <div
      className="fixed inset-0 z-30 flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(28,22,30,0.92), rgba(15,12,18,0.98))",
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[11px] uppercase tracking-[0.22em] text-white/60"
      >
        Fermer
      </button>

      <div className="relative size-[300px] flex items-center justify-center">
        {/* Outer reference ring — fixed, faint */}
        <div className="absolute inset-0 rounded-full border border-white/10" />
        {/* Breathing orb */}
        <div
          className="absolute rounded-full"
          style={{
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle, rgba(255,210,180,0.35), rgba(255,210,180,0.05) 65%, transparent 75%)",
            transform: `scale(${scale})`,
            transition: `transform ${duration}ms cubic-bezier(0.42, 0, 0.58, 1)`,
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute rounded-full border border-white/30"
          style={{
            width: "75%",
            height: "75%",
            transform: `scale(${scale})`,
            transition: `transform ${duration}ms cubic-bezier(0.42, 0, 0.58, 1)`,
          }}
        />
        <div className="relative text-center">
          <p className="font-serif italic text-white/95 text-[26px] leading-none">
            {phase.label}
          </p>
          <p className="mt-3 font-serif text-white/70 text-[44px] font-light leading-none tabular-nums">
            {count}
          </p>
        </div>
      </div>

      <p className="mt-10 text-[12.5px] text-white/65 max-w-[28ch] text-center" style={{ textWrap: "balance" }}>
        {phase.verb}
      </p>
      <p className="mt-3 text-[10.5px] uppercase tracking-[0.22em] text-white/35">
        4 · 4 · 6
      </p>
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
  const targetGain = 0.22;

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
    // Warm hearth — deep brown noise + slow sub-tone "ember" pulse
    playNoise(brown, "lowpass", 320, 0.4, 0.55);
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 70;
    const subG = ctx.createGain();
    subG.gain.value = 0.04;
    sub.connect(subG); subG.connect(master);
    sub.start();
    stops.push(() => { try { sub.stop(); } catch {} });
    // very slow swell
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 0.12; lfoG.gain.value = 0.05;
    lfo.connect(lfoG); lfoG.connect(master.gain);
    lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
  } else if (motion === "ripple") {
    // Ocean — band-passed brown noise, slow swell back-and-forth
    const { f } = playNoise(brown, "bandpass", 600, 0.6, 0.7);
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 0.16; lfoG.gain.value = 350;
    lfo.connect(lfoG); lfoG.connect(f.frequency);
    lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
  } else if (motion === "drift") {
    // Forest / wind — high-passed white noise, gentle wobble
    const { f } = playNoise(white, "highpass", 1200, 0.7, 0.18);
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 0.22; lfoG.gain.value = 600;
    lfo.connect(lfoG); lfoG.connect(f.frequency);
    lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
  } else if (motion === "rain") {
    // Rain — bright high-pass white noise + sparse droplet transients
    playNoise(white, "highpass", 2000, 0.5, 0.22);
    let cancelled = false;
    const drop = () => {
      if (cancelled) return;
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = 1800 + Math.random() * 1400;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.15);
      setTimeout(drop, 80 + Math.random() * 220);
    };
    drop();
    stops.push(() => { cancelled = true; });
  } else {
    // Veil / snow — very quiet pink-ish low-pass, near silence
    playNoise(brown, "lowpass", 220, 0.3, 0.28);
    const shimmer = ctx.createOscillator();
    shimmer.type = "sine";
    shimmer.frequency.value = 880;
    const sg = ctx.createGain();
    sg.gain.value = 0.012;
    shimmer.connect(sg); sg.connect(master);
    shimmer.start();
    stops.push(() => { try { shimmer.stop(); } catch {} });
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
      master.gain.linearRampToValueAtTime(targetGain, now + 1.6);
    },
    stop() {
      try {
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.linearRampToValueAtTime(0, now + 0.6);
        setTimeout(() => {
          stops.forEach((fn) => fn());
          // Do NOT close the context: it is reused across ambiances.
        }, 700);
      } catch {}
    },
  };
}

/* ---------- Background motion (full screen) ---------- */
function MotionLayer({ kind, accent }: { kind: Motion; accent: string }) {
  if (kind === "pulse") {
    return (
      <>
        <div
          className="absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full breath halo-lg"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 72%)`, animationDuration: "12s", opacity: 0.55 }}
        />
        <div
          className="absolute left-1/2 top-1/2 size-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full breath"
          style={{ background: `radial-gradient(circle, white, transparent 75%)`, animationDuration: "10s", opacity: 0.22 }}
        />
      </>
    );
  }
  if (kind === "ripple") {
    return (
      <>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
            style={{
              width: `${28 + i * 22}vmin`,
              aspectRatio: "1",
              animation: `legato-breath 12s ease-in-out ${i * 2}s infinite`,
            }}
          />
        ))}
      </>
    );
  }
  if (kind === "drift") {
    return (
      <>
        <div className="absolute -top-[15vmin] -left-[15vmin] size-[70vmin] rounded-full halo-lg drift opacity-45"
             style={{ background: `radial-gradient(circle, ${accent}, transparent 75%)`, animationDuration: "26s" }} />
        <div className="absolute -bottom-[15vmin] -right-[10vmin] size-[80vmin] rounded-full halo-lg drift opacity-30"
             style={{ background: `radial-gradient(circle, white, transparent 75%)`, animationDuration: "32s" }} />
      </>
    );
  }
  if (kind === "rain") {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 22 }).map((_, i) => {
          const x = (i * 9.3) % 100;
          const delay = (i % 8) * 0.4;
          return (
            <line
              key={i}
              x1={x}
              y1={-5}
              x2={x - 2}
              y2={20}
              stroke="white"
              strokeWidth="0.3"
              opacity="0.22"
              style={{ animation: `legato-rain 3.2s linear ${delay}s infinite` }}
            />
          );
        })}
      </svg>
    );
  }
  return (
    <>
      <div className="absolute inset-0 mix-blend-soft-light opacity-35"
           style={{ background: `radial-gradient(circle at 30% 80%, ${accent}, transparent 65%)` }} />
      <div className="absolute -top-[10vmin] left-1/2 -translate-x-1/2 size-[60vmin] rounded-full halo-lg breath"
           style={{ background: `radial-gradient(circle, white, transparent 75%)`, opacity: 0.22, animationDuration: "14s" }} />
    </>
  );
}