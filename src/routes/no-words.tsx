import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Shell } from "@/components/legato/Shell";

export const Route = createFileRoute("/no-words")({
  head: () => ({ meta: [{ title: "Sans mots — Legato" }] }),
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } => {
    const t = search.tab;
    if (t === "souffles" || t === "respirer" || t === "lire" || t === "regarder") {
      return { tab: t };
    }
    return {};
  },
  component: NoWords,
});

type Motion = "drift" | "ripple" | "pulse" | "rain" | "veil";
type AudioKind = "warm-low" | "sine-432" | "noise-leaves" | "deep-sine" | "gold-bursts";
type Tab = "souffles" | "respirer" | "lire" | "regarder";
type BookTag = "deuil récent" | "long terme" | "anticipation" | "pour les enfants" | "philosophique" | "poétique" | "corps";

type Texture = {
  id: string;
  title: string;
  whisper: string;
  asmr: string;
  motion: Motion;
  bg: string; // page-level gradient (CSS)
  blob: { from: string; to: string; opacity: number };
  audio: AudioKind;
  tag: BookTag; // sensitivity → for cross-AI with Lire
};

const BASE: Texture[] = [
  {
    id: "warmth",
    title: "Chaleur lente",
    whisper: "Comme une main posée sur l'épaule.",
    asmr: "souffle long, près d'un foyer",
    motion: "pulse",
    bg: "linear-gradient(145deg, #FFE8DC 0%, #FFF4EE 100%)",
    blob: { from: "#F0A890", to: "#F8C8B0", opacity: 0.48 },
    audio: "warm-low",
    tag: "deuil récent",
  },
  {
    id: "morning-sky",
    title: "Ciel du matin",
    whisper: "Tout vient lentement, en douceur.",
    asmr: "tonalité 432 Hz, halos lents",
    motion: "veil",
    bg: "linear-gradient(180deg, #EAF0F8 0%, #F4EEF8 100%)",
    blob: { from: "#A8C0E0", to: "#C8B8E8", opacity: 0.42 },
    audio: "sine-432",
    tag: "philosophique",
  },
  {
    id: "leaves",
    title: "Feuilles",
    whisper: "Le temps se balance, sans bruit.",
    asmr: "souffle filtré dans les feuilles",
    motion: "drift",
    bg: "linear-gradient(162deg, #EEF4E8 0%, #F8FBF4 100%)",
    blob: { from: "#C0D4A8", to: "#D0E0B8", opacity: 0.36 },
    audio: "noise-leaves",
    tag: "long terme",
  },
  {
    id: "rose-mist",
    title: "Brume rose",
    whisper: "Le monde se feutre autour de vous.",
    asmr: "basse profonde, brume légère",
    motion: "veil",
    bg: "linear-gradient(148deg, #F8EEF4 0%, #F0ECF8 100%)",
    blob: { from: "#E8B0C8", to: "#B8C0E8", opacity: 0.42 },
    audio: "deep-sine",
    tag: "poétique",
  },
  {
    id: "evening-gold",
    title: "Or du soir",
    whisper: "Une chaleur qui s'attarde.",
    asmr: "petites bouffées dorées",
    motion: "drift",
    bg: "linear-gradient(158deg, #FFF4E0 0%, #FFF8F0 100%)",
    blob: { from: "#F0C870", to: "#F4C040", opacity: 0.38 },
    audio: "gold-bursts",
    tag: "philosophique",
  },
];

const FAV_KEY = "legato.nowords.favorites";
const READ_KEY = "legato.nowords.read";

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
}
function saveFavorites(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

function NoWords() {
  const search = Route.useSearch();
  const tab: Tab = search.tab ?? "souffles";
  const title =
    tab === "souffles" ? "Souffles" :
    tab === "respirer" ? "Respirer" :
    tab === "lire" ? "Lire" : "Regarder";

  const isSouffles = tab === "souffles";

  return (
    <Shell livingBg={false}>
      <div className="relative min-h-dvh flex flex-col select-none overflow-hidden">
        {/* Header — minimal sur Souffles (fond plein), classique ailleurs */}
        {isSouffles ? (
          <Link
            to="/home"
            aria-label="Retour au Foyer"
            className="absolute top-5 left-5 z-30 size-9 rounded-full backdrop-blur-md flex items-center justify-center text-dusk/70 hover:text-dusk"
            style={{ background: "color-mix(in oklab, white 40%, transparent)" }}
          >
            ←
          </Link>
        ) : (
          <div className="relative z-20 px-5 pt-7 pb-3 flex items-center justify-between gap-2">
            <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/55 hover:text-dusk">
              ← Foyer
            </Link>
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/55">{title}</p>
            <span className="w-12" />
          </div>
        )}

        <div className="relative z-10 flex-1 flex flex-col">
          {tab === "souffles" && <SoufflesView />}
          {tab === "respirer" && <RespirerView />}
          {tab === "lire" && <LireView />}
          {tab === "regarder" && <RegarderView />}
        </div>
      </div>
    </Shell>
  );
}

/* ============================================================
   ESPACE 1 — SOUFFLES
   ============================================================ */
/* 3 silhouettes organiques pour le morphing SMIL (6 points de contrôle).
 * ViewBox 200×200 : la forme respire et change lentement. */
const BLOB_PATHS = [
  "M 100 22 C 152 28 184 64 178 108 C 172 152 132 184 96 178 C 60 172 24 142 30 96 C 36 50 70 18 100 22 Z",
  "M 100 28 C 148 32 178 72 172 112 C 178 158 128 178 92 172 C 56 168 30 132 36 92 C 30 56 66 28 100 28 Z",
  "M 100 18 C 158 30 188 66 180 112 C 176 162 128 188 90 178 C 50 172 20 136 28 94 C 24 44 76 22 100 18 Z",
];

function MorphingBlob({
  from,
  to,
  opacity,
}: {
  from: string;
  to: string;
  opacity: number;
}) {
  const gid = useMemo(() => `bg-${Math.random().toString(36).slice(2, 9)}`, []);
  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ filter: "blur(28px)", opacity }}
      aria-hidden
    >
      <defs>
        <radialGradient id={gid} cx="42%" cy="38%" r="62%">
          <stop offset="0%" stopColor={to} stopOpacity="0.95" />
          <stop offset="60%" stopColor={from} stopOpacity="0.85" />
          <stop offset="100%" stopColor={from} stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <path fill={`url(#${gid})`} d={BLOB_PATHS[0]}>
        <animate
          attributeName="d"
          dur="12s"
          repeatCount="indefinite"
          values={`${BLOB_PATHS[0]};${BLOB_PATHS[1]};${BLOB_PATHS[2]};${BLOB_PATHS[0]}`}
          calcMode="spline"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
        />
      </path>
    </svg>
  );
}

function BloomFlower() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className="animate-bloom"
      style={{ filter: "drop-shadow(0 4px 16px rgba(255,180,180,0.35))" }}
    >
      <style>{`
        @keyframes legato-bloom {
          0%   { transform: scale(0.2); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-bloom { animation: legato-bloom 1.8s ease-out forwards; transform-origin: center; }
      `}</style>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="60"
          cy="38"
          rx="9"
          ry="20"
          fill="rgba(255,200,200,0.78)"
          transform={`rotate(${deg} 60 60)`}
        />
      ))}
      <circle cx="60" cy="60" r="6" fill="rgba(255,225,180,0.92)" />
    </svg>
  );
}

/* ─── Audio engines ───────────────────────────────────────────────── */
type AmbientHandle = { stop: () => void };

function startSeqAudio(ctx: AudioContext, kind: AudioKind): AmbientHandle {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  const now = ctx.currentTime;
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.85, now + 2.4);
  const stops: Array<() => void> = [];

  const makeNoise = (color: "white" | "brown") => {
    const size = 3 * ctx.sampleRate;
    const buf = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < size; i++) {
      const r = Math.random() * 2 - 1;
      if (color === "brown") {
        last = (last + 0.02 * r) / 1.02;
        data[i] = last * 3.5;
      } else data[i] = r;
    }
    return buf;
  };

  if (kind === "warm-low") {
    const src = ctx.createBufferSource();
    src.buffer = makeNoise("brown");
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 200;
    const g = ctx.createGain();
    g.gain.value = 0.034;
    src.connect(f).connect(g).connect(master);
    src.start();
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 80;
    const og = ctx.createGain();
    og.gain.value = 0.028;
    osc.connect(og).connect(master);
    osc.start();
    stops.push(() => {
      try { src.stop(); } catch (e) { void e; }
      try { osc.stop(); } catch (e) { void e; }
    });
  } else if (kind === "sine-432") {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 432;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.018, now + 2);
    osc.connect(g).connect(master);
    osc.start();
    stops.push(() => { try { osc.stop(); } catch (e) { void e; } });
  } else if (kind === "noise-leaves") {
    const src = ctx.createBufferSource();
    src.buffer = makeNoise("white");
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 800;
    f.Q.value = 2;
    const g = ctx.createGain();
    g.gain.value = 0.022;
    src.connect(f).connect(g).connect(master);
    src.start();
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 280;
    lfo.connect(lfoG).connect(f.frequency);
    lfo.start();
    stops.push(() => {
      try { src.stop(); } catch (e) { void e; }
      try { lfo.stop(); } catch (e) { void e; }
    });
  } else if (kind === "deep-sine") {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 60;
    const g = ctx.createGain();
    g.gain.value = 0.012;
    osc.connect(g).connect(master);
    osc.start();
    const pad = ctx.createOscillator();
    pad.type = "sine";
    pad.frequency.value = 180;
    const pg = ctx.createGain();
    pg.gain.value = 0.008;
    pad.connect(pg).connect(master);
    pad.start();
    stops.push(() => {
      try { osc.stop(); } catch (e) { void e; }
      try { pad.stop(); } catch (e) { void e; }
    });
  } else {
    // gold-bursts
    let cancelled = false;
    const burst = () => {
      if (cancelled) return;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 380 + Math.random() * 220;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.018, t + 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 900;
      osc.connect(f).connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 1.7);
      setTimeout(burst, 800 + Math.random() * 1400);
    };
    burst();
    stops.push(() => { cancelled = true; });
  }

  return {
    stop() {
      try {
        const t = ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.linearRampToValueAtTime(0, t + 1.0);
        setTimeout(() => stops.forEach((fn) => fn()), 1100);
      } catch (e) { void e; }
    },
  };
}

function playTactileNote(ctx: AudioContext, freq: number) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;
  const g = ctx.createGain();
  const t = ctx.currentTime;
  g.gain.setValueAtTime(0.05, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  osc.connect(g).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.3);
}

/* ─── SouffleScene — la pièce centrale ─────────────────────────── */
function SouffleScene({
  tex,
  ctxRef,
  onTouchPlay,
  gyroOn,
  micOn,
}: {
  tex: Texture;
  ctxRef: React.MutableRefObject<AudioContext | null>;
  onTouchPlay: () => void;
  gyroOn: boolean;
  micOn: boolean;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [gyro, setGyro] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const dragging = useRef(false);

  // Gyroscope (passive, no permission requested here — opt-in via button below)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: DeviceOrientationEvent) => {
      setGyro({
        x: Math.max(-18, Math.min(18, (e.gamma ?? 0) * 0.3)),
        y: Math.max(-14, Math.min(14, (e.beta ?? 0) * 0.18)),
      });
    };
    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    onTouchPlay();
    const rect = sceneRef.current?.getBoundingClientRect();
    if (rect && ctxRef.current) {
      const yRatio = (e.clientY - rect.top) / Math.max(rect.height, 1);
      const freq = 260 + Math.max(0, Math.min(1, yRatio)) * 360;
      playTactileNote(ctxRef.current, freq);
    }
    handleMove(e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    handleMove(e.clientX, e.clientY);
  };
  const release = () => {
    dragging.current = false;
    setOffset({ x: 0, y: 0 });
  };
  const handleMove = (cx: number, cy: number) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (cx - rect.left - rect.width / 2) * 0.18;
    const y = (cy - rect.top - rect.height / 2) * 0.18;
    setOffset({
      x: Math.max(-46, Math.min(46, x)),
      y: Math.max(-46, Math.min(46, y)),
    });
  };

  // Mic souffle → temporary scale bump (driven by parent toggle)
  useEffect(() => {
    if (!micOn) return;
    let stream: MediaStream | null = null;
    let raf = 0;
    let cancelled = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) { stream?.getTracks().forEach((t) => t.stop()); return; }
        const ctx = ctxRef.current ?? new AudioContext();
        ctxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const detect = () => {
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          if (sum / data.length > 22) {
            setScale(1.18);
            setTimeout(() => setScale(1), 700);
          }
          raf = requestAnimationFrame(detect);
        };
        detect();
      } catch { /* permission denied */ }
    })();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [micOn, ctxRef]);

  return (
    <div
      ref={sceneRef}
      className="absolute inset-0 touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
    >
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: "min(82vw, 420px)",
          height: "min(82vw, 420px)",
          transform: `translate(-50%, -50%) translate(${offset.x + (gyroOn ? gyro.x : 0)}px, ${offset.y + (gyroOn ? gyro.y : 0)}px) scale(${scale})`,
          transition: dragging.current
            ? "transform 80ms linear"
            : "transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <MorphingBlob from={tex.blob.from} to={tex.blob.to} opacity={tex.blob.opacity} />
      </div>
    </div>
  );
}

/* ─── SoufflesView ─────────────────────────────────────────────── */
function SoufflesView() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bloom, setBloom] = useState(false);
  const [gyroOn, setGyroOn] = useState(false);
  const [micOn, setMicOn] = useState(false);

  // Hydrate favorites after mount to avoid SSR mismatch
  useEffect(() => { setFavorites(loadFavorites()); }, []);

  const tex = BASE[index];
  const next = () => setIndex((i) => (i + 1) % BASE.length);
  const prev = () => setIndex((i) => (i - 1 + BASE.length) % BASE.length);

  const ctxRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<AmbientHandle | null>(null);

  useEffect(() => () => {
    audioRef.current?.stop();
    try { ctxRef.current?.close(); } catch (e) { void e; }
  }, []);

  useEffect(() => {
    if (!playing || !ctxRef.current) return;
    audioRef.current?.stop();
    audioRef.current = startSeqAudio(ctxRef.current, tex.audio);
    return () => { audioRef.current?.stop(); audioRef.current = null; };
  }, [tex.audio, tex.id, playing]);

  const ensureCtx = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const Ctx = (typeof window !== "undefined" ? window.AudioContext : undefined) ||
      ((typeof window !== "undefined" ? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext : undefined));
    if (!Ctx) return null;
    ctxRef.current = new Ctx();
    return ctxRef.current;
  }, []);

  const togglePlay = () => {
    if (playing) {
      audioRef.current?.stop();
      audioRef.current = null;
      setPlaying(false);
      return;
    }
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    audioRef.current = startSeqAudio(ctx, tex.audio);
    setPlaying(true);
  };

  // Called by SouffleScene on first touch — resumes ctx and auto-starts ambient if needed
  const onTouchPlay = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
  }, [ensureCtx]);

  const isFav = favorites.includes(tex.id);
  const onKeep = () => {
    if (isFav) return;
    const nextFavs = [...favorites, tex.id];
    setFavorites(nextFavs);
    saveFavorites(nextFavs);
    setBloom(true);
    setTimeout(() => setBloom(false), 1800);
  };

  const toggleGyro = async () => {
    type DOEPerm = typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    const DOE = (typeof window !== "undefined" ? window.DeviceOrientationEvent : undefined) as DOEPerm | undefined;
    if (!gyroOn && DOE && typeof DOE.requestPermission === "function") {
      try {
        const perm = await DOE.requestPermission();
        if (perm !== "granted") return;
      } catch { return; }
    }
    setGyroOn((v) => !v);
  };

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      <div
        className="fixed inset-0 -z-10 transition-[background] duration-[2000ms] ease-out"
        style={{ background: tex.bg }}
      />
      <SouffleScene
        tex={tex}
        ctxRef={ctxRef}
        onTouchPlay={onTouchPlay}
        gyroOn={gyroOn}
        micOn={micOn}
      />

      {/* Titre — discret, en haut, centré */}
      <div className="relative z-10 pt-16 text-center pointer-events-none">
        <h2
          className="font-serif italic text-[22px] leading-none text-dusk/85"
          style={{ textShadow: "0 1px 18px rgba(255,255,255,0.55)" }}
        >
          {tex.title}
        </h2>
      </div>

      <div className="flex-1" />

      {bloom && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
          <BloomFlower />
        </div>
      )}

      {/* Contrôles — bas de page, discrets */}
      <div className="relative z-10 px-6 pb-6 flex flex-col gap-3">
        {/* Capteurs : pastilles discrètes, alignées */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => void toggleGyro()}
            className={`text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full backdrop-blur-md ${gyroOn ? "text-dusk" : "text-dusk/55"}`}
            style={{ background: "color-mix(in oklab, white 38%, transparent)" }}
            aria-pressed={gyroOn}
          >
            Mouvement
          </button>
          <button
            onClick={() => setMicOn((v) => !v)}
            className={`text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full backdrop-blur-md ${micOn ? "text-dusk" : "text-dusk/55"}`}
            style={{ background: "color-mix(in oklab, white 38%, transparent)" }}
            aria-pressed={micOn}
          >
            Souffler
          </button>
          <button
            onClick={onKeep}
            disabled={isFav}
            className={`text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full backdrop-blur-md ${isFav ? "text-dusk/80" : "text-dusk/55"}`}
            style={{ background: "color-mix(in oklab, white 38%, transparent)" }}
            aria-label={isFav ? "Séquence gardée" : "Garder cette séquence"}
          >
            {isFav ? "♥" : "♡"}
          </button>
        </div>

        {/* Navigation + play */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="size-11 rounded-full flex items-center justify-center text-lg backdrop-blur-md text-dusk/75"
            style={{ background: "color-mix(in oklab, var(--paper) 32%, transparent)" }}
            aria-label="Séquence précédente"
          >←</button>
          <button
            onClick={togglePlay}
            className="flex-1 px-5 py-3.5 text-center backdrop-blur-md rounded-full"
            style={{
              background: "color-mix(in oklab, var(--paper) 38%, transparent)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <p className="font-serif italic text-[15px] text-dusk">
              {playing ? "Pause" : "Écouter"}
            </p>
          </button>
          <button
            onClick={next}
            className="size-11 rounded-full flex items-center justify-center text-lg backdrop-blur-md text-dusk/75"
            style={{ background: "color-mix(in oklab, var(--paper) 32%, transparent)" }}
            aria-label="Séquence suivante"
          >→</button>
        </div>

        {/* Indicateurs de séquence */}
        <div className="flex justify-center gap-1.5">
          {BASE.map((tx, i) => (
            <span
              key={tx.id}
              className={`h-[5px] rounded-full transition-all ${
                i === index ? "w-5 bg-dusk/70" : "w-[5px] bg-dusk/25"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ESPACE 2 — RESPIRER
   ============================================================ */
type Rhythm = { id: "doux"|"profond"|"simple"; label: string; in: number; hold: number; out: number };
const RHYTHMS: Rhythm[] = [
  { id: "doux",    label: "Doux",    in: 4, hold: 4, out: 6 },
  { id: "profond", label: "Profond", in: 4, hold: 7, out: 8 },
  { id: "simple",  label: "Simple",  in: 3, hold: 3, out: 3 },
];

function RespirerView() {
  const [rhythm, setRhythm] = useState<Rhythm>(RHYTHMS[0]);
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(rhythm.in);

  type PhaseInfo = { id: "in"|"hold"|"out"; label: string; seconds: number };
  const phases: PhaseInfo[] = useMemo(() => ([
    { id: "in",   label: "Inspirez...",      seconds: rhythm.in },
    { id: "hold", label: "Tenez doucement.", seconds: rhythm.hold },
    { id: "out",  label: "Laissez aller...", seconds: rhythm.out },
  ]), [rhythm]);

  useEffect(() => {
    setCount(phases[step].seconds);
    const tick = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          const ns = (step + 1) % phases.length;
          setStep(ns);
          return phases[ns].seconds;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [step, phases]);

  // Reset when rhythm changes
  useEffect(() => { setStep(0); setCount(phases[0].seconds); }, [rhythm.id]);

  const phase = phases[step];
  const SCALE = phase.id === "in" ? { from: 0.57, to: 1 } : phase.id === "out" ? { from: 1, to: 0.57 } : { from: 1, to: 1 };
  const duration = phase.seconds * 1000;

  // Letter-by-letter for in/out
  const letters = phase.label.split("");

  return (
    <div className="relative flex-1 flex flex-col items-center" style={{ background: "#1A1F2E" }}>
      {/* Rhythm pills */}
      <div className="pt-2 pb-6 flex items-center gap-2">
        {RHYTHMS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRhythm(r)}
            className={`px-3.5 py-1.5 rounded-full text-[10.5px] uppercase tracking-[0.18em] transition-colors ${
              r.id === rhythm.id ? "bg-paper text-dusk" : "text-paper/55 border border-paper/15"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Close X — top-right of inner area */}
      <button
        onClick={() => setClosing(true)}
        className="absolute top-2 right-6 size-9 rounded-full flex items-center justify-center text-paper/65 text-xl"
        aria-label="Fermer"
      >
        ✕
      </button>

      {/* Breathing circle */}
      <div className="relative size-[280px] flex items-center justify-center mt-6">
        <div className="absolute inset-0 rounded-full"
             style={{ border: "1px dashed rgba(200,216,232,0.18)", margin: "60px" }} />
        <div
          key={`${rhythm.id}-${step}`}
          className="absolute rounded-full will-change-transform"
          style={{
            width: 280, height: 280,
            background: "rgba(200,216,232,0.4)",
            transform: `scale(${SCALE.from})`,
            animation: `legato-resp ${duration}ms cubic-bezier(0.45,0,0.55,1) forwards`,
            ['--from' as string]: String(SCALE.from),
            ['--to' as string]: String(SCALE.to),
          } as React.CSSProperties}
        />
        <div className="relative text-center">
          <p className="font-serif italic text-paper/90 text-[20px] leading-none flex justify-center">
            {phase.id === "hold"
              ? <span>{phase.label}</span>
              : letters.map((ch, i) => (
                  <span key={i} className="opacity-0 letter-in" style={{
                    animationDelay: `${(i * (duration * 0.6)) / Math.max(letters.length, 1) / 1000}s`
                  }}>{ch === " " ? "\u00A0" : ch}</span>
                ))}
          </p>
          <p className="mt-4 text-[10.5px] tracking-[0.3em] tabular-nums" style={{ color: "#8090A8" }}>
            {Array.from({ length: phase.seconds }).map((_, i) => (
              <span key={i} className={i < (phase.seconds - count + 1) ? "text-paper/85" : "text-paper/25"}>
                {i + 1}{i < phase.seconds - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>

      <p className="mt-12 text-[12px] font-light text-center" style={{ color: "#8090A8" }}>
        Inspirez {rhythm.in} · Tenez {rhythm.hold} · Expirez {rhythm.out}
      </p>

      {closing && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(26,31,46,0.92)" }}
             onAnimationEnd={() => {}}>
          <p className="font-serif italic text-paper/90 text-[22px] animate-fade-in">Bien. Prenez votre temps.</p>
        </div>
      )}
      {closing && <CloseAfter onDone={() => { setClosing(false); }} />}

      <style>{`
        @keyframes legato-resp {
          from { transform: scale(var(--from)); }
          to   { transform: scale(var(--to)); }
        }
        @keyframes letter-in {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .letter-in { animation: letter-in 0.35s ease-out forwards; }
      `}</style>
    </div>
  );
}

function CloseAfter({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);
  return null;
}

/* ============================================================
   ESPACE 3 — LIRE
   ============================================================ */
type Book = {
  title: string;
  author: string;
  tags: BookTag[];
  why: string;
  url: string;
};

const BOOKS: Book[] = [
  { title: "Vivre le deuil au jour le jour", author: "Christophe Fauré", tags: ["deuil récent"],
    why: "La référence française. Pas un manuel — une présence.",
    url: "https://www.google.com/search?q=Vivre+le+deuil+au+jour+le+jour+Christophe+Faur%C3%A9" },
  { title: "La Mort est une question de vie", author: "Boris Cyrulnik", tags: ["philosophique"],
    why: "Comment la perte peut, lentement, devenir une force.",
    url: "https://www.google.com/search?q=La+Mort+est+une+question+de+vie+Boris+Cyrulnik" },
  { title: "Une année magique", author: "Joan Didion", tags: ["deuil récent","poétique"],
    why: "Le plus honnête des livres sur la perte d'un conjoint.",
    url: "https://www.google.com/search?q=L%27ann%C3%A9e+de+la+pens%C3%A9e+magique+Joan+Didion" },
  { title: "Les Traversées du deuil", author: "Martine Spiesser", tags: ["deuil récent"],
    why: "Écrit par une thérapeute française spécialisée.",
    url: "https://www.google.com/search?q=Les+Travers%C3%A9es+du+deuil+Martine+Spiesser" },
  { title: "Le Deuil, c'est la vie", author: "David Kessler", tags: ["long terme"],
    why: "Par l'élève de Kübler-Ross. Sur la recherche de sens.",
    url: "https://www.google.com/search?q=Le+Deuil+c%27est+la+vie+David+Kessler" },
  { title: "Tout ce que je sais de toi", author: "Eric Chacour", tags: ["poétique","anticipation"],
    why: "Un roman sur l'absence et ce qu'on garde.",
    url: "https://www.google.com/search?q=Tout+ce+que+je+sais+de+toi+Eric+Chacour" },
  { title: "La Consolation", author: "Sébastien Japrisot", tags: ["poétique"],
    why: "Pour les jours où on veut juste être porté par les mots.",
    url: "https://www.google.com/search?q=La+Consolation+Japrisot" },
  { title: "Quand le corps dit non", author: "Gabor Maté", tags: ["long terme","corps"],
    why: "Le deuil qui reste dans le corps, et comment l'écouter.",
    url: "https://www.google.com/search?q=Quand+le+corps+dit+non+Gabor+Mat%C3%A9" },
  { title: "Le Chagrin", author: "Lionel Duroy", tags: ["deuil récent","poétique"],
    why: "Un récit intime. Pour ne pas se sentir seul dans la douleur.",
    url: "https://www.google.com/search?q=Le+Chagrin+Lionel+Duroy" },
  { title: "Consolations", author: "Michael Ignatieff", tags: ["philosophique"],
    why: "Pour approcher la mort sans qu'elle pèse trop.",
    url: "https://www.google.com/search?q=Consolations+Michael+Ignatieff" },
];

function LireView() {
  const favorites = loadFavorites();
  // Compute tag affinity from favorited sequences
  const affinity = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    favorites.forEach((id) => {
      const t = BASE.find((b) => b.id === id)?.tag;
      if (t) counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [favorites.join(",")]);

  const sorted = useMemo(() => {
    return [...BOOKS].sort((a, b) => {
      const sa = a.tags.reduce((acc, t) => acc + (affinity[t] || 0), 0);
      const sb = b.tags.reduce((acc, t) => acc + (affinity[t] || 0), 0);
      return sb - sa;
    });
  }, [affinity]);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#F5EFE6" }}>
      <div className="px-7 pt-4 pb-6">
        <h2 className="font-serif text-[24px] leading-[1.2] text-dusk" style={{ textWrap: "balance" }}>
          Des mots qui accompagnent.
        </h2>
        <p className="mt-2 text-[13px] font-light" style={{ color: "#6B6560", textWrap: "pretty" }}>
          Pas pour tout expliquer. Pour être moins seul·e.
        </p>
      </div>
      <ul className="px-5 pb-12 space-y-3">
        {sorted.map((b) => (
          <li key={b.title} className="rounded-2xl bg-paper/85 backdrop-blur px-5 py-4 border border-dusk/8">
            <h3 className="font-serif text-[18px] text-dusk leading-snug">{b.title}</h3>
            <p className="text-[13px] font-light mt-0.5" style={{ color: "#6B6560" }}>{b.author}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-dusk/85 italic" style={{ textWrap: "pretty" }}>
              {b.why}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {b.tags.map((t) => (
                <span key={t} className="text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                      style={{ background: "#EDE3D2", color: "#7A6F5E" }}>
                  {t}
                </span>
              ))}
            </div>
            <a href={b.url} target="_blank" rel="noreferrer"
               className="inline-block mt-3 text-[12px] uppercase tracking-[0.2em] text-dusk/75">
              Trouver ce livre →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   AUDIO ENGINE & MOTION (preserved from previous version)
   ============================================================ */
/* ============================================================
   ESPACE 4 — REGARDER
   ============================================================ */
type Work = {
  title: string;
  author: string;
  format: string;        // "court-métrage 28min", "musique 10min", "peinture"…
  context: string;       // phrase de contexte
  tags: string[];
  url: string;
  bg: string;            // CSS gradient
  textOnDark?: boolean;
};

const WORKS: Work[] = [
  { title: "La Jetée", author: "Chris Marker", format: "Court-métrage · 28 min",
    context: "Un homme remonte le temps pour retrouver une image.",
    tags: ["mémoire", "passage"], textOnDark: true,
    bg: "linear-gradient(160deg, #2C2830 0%, #48384C 100%)",
    url: "https://www.google.com/search?q=La+Jet%C3%A9e+Chris+Marker" },
  { title: "Paperman", author: "Disney · John Kahrs", format: "Court-métrage · 6 min",
    context: "Une rencontre, un vent, des avions de papier.",
    tags: ["présence", "légèreté"],
    bg: "linear-gradient(160deg, #D8DDE8 0%, #E8E0D8 100%)",
    url: "https://www.google.com/search?q=Paperman+Disney+short" },
  { title: "Spiegel im Spiegel", author: "Arvo Pärt", format: "Musique · 10 min",
    context: "Le silence entre les notes, plus grand que les notes.",
    tags: ["silence", "souffle"],
    bg: "linear-gradient(160deg, #F0EEF4 0%, #E8EAF0 100%)",
    url: "https://www.google.com/search?q=Spiegel+im+Spiegel+Arvo+P%C3%A4rt" },
  { title: "The Blue Room", author: "Yves Klein", format: "Peinture",
    context: "Le bleu comme un endroit où poser le regard.",
    tags: ["silence", "couleur"],
    bg: "linear-gradient(160deg, #A8B8D8 0%, #C0C8E0 100%)",
    url: "https://www.google.com/search?q=Yves+Klein+IKB" },
  { title: "Scène des plumes", author: "Forrest Gump · Zemeckis", format: "Extrait · 3 min",
    context: "Une plume qui descend, sans rien expliquer.",
    tags: ["légèreté", "passage"],
    bg: "linear-gradient(160deg, #E8F0E8 0%, #F0F4EC 100%)",
    url: "https://www.google.com/search?q=Forrest+Gump+feather+scene" },
  { title: "Nocturne en si bémol mineur", author: "Frédéric Chopin", format: "Musique · 6 min",
    context: "Une nuit qui veille sur vous.",
    tags: ["nuit", "présence"], textOnDark: true,
    bg: "linear-gradient(160deg, #2A2835 0%, #3C3848 100%)",
    url: "https://www.google.com/search?q=Chopin+Nocturne+B+flat+minor+op+9+no+1" },
  { title: "The Tree of Life", author: "Terrence Malick", format: "Extrait nature · 5 min",
    context: "La lumière qui traverse les arbres, comme une réponse.",
    tags: ["passage", "lumière"],
    bg: "linear-gradient(160deg, #D8E8D0 0%, #E8F0E0 100%)",
    url: "https://www.google.com/search?q=Tree+of+Life+Malick+creation+sequence" },
  { title: "Maman (Spider)", author: "Louise Bourgeois", format: "Installation",
    context: "Une protection immense, et fragile.",
    tags: ["mémoire", "protection"],
    bg: "linear-gradient(160deg, #C8C0B8 0%, #D8D0C8 100%)",
    url: "https://www.google.com/search?q=Louise+Bourgeois+Maman+spider" },
  { title: "In the Mood for Love", author: "Wong Kar-Wai", format: "Extrait · 4 min",
    context: "Ce qui se dit dans les silences entre deux personnes.",
    tags: ["absence", "présence"], textOnDark: true,
    bg: "linear-gradient(160deg, #4A2830 0%, #6A3840 100%)",
    url: "https://www.google.com/search?q=In+the+Mood+for+Love+Wong+Kar-Wai" },
  { title: "Grief is the Thing with Feathers", author: "Max Porter", format: "Extrait littéraire",
    context: "Un corbeau s'invite chez ceux qui pleurent.",
    tags: ["présence", "nuit"], textOnDark: true,
    bg: "linear-gradient(160deg, #2C3040 0%, #404858 100%)",
    url: "https://www.google.com/search?q=Grief+is+the+Thing+with+Feathers+Max+Porter" },
];

function RegarderView() {
  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#FAF7F4" }}>
      <div className="px-7 pt-4 pb-6">
        <h2 className="font-serif text-[24px] leading-[1.2] text-dusk" style={{ textWrap: "balance" }}>
          Ce que les autres ont fait de leur chagrin.
        </h2>
        <p className="mt-2 text-[13px] font-light" style={{ color: "#6B6560", textWrap: "pretty" }}>
          Des œuvres qui accompagnent. Pour ne pas être seul·e.
        </p>
      </div>
      <ul className="px-5 pb-12 space-y-3">
        {WORKS.map((w) => {
          const dark = w.textOnDark;
          const title = dark ? "text-paper" : "text-dusk";
          const sub = dark ? "text-paper/70" : "";
          return (
            <li key={w.title}
                className="rounded-2xl px-5 py-5 border overflow-hidden"
                style={{
                  background: w.bg,
                  borderColor: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.05)",
                }}>
              <p className={`text-[10px] uppercase tracking-[0.22em] ${dark ? "text-paper/60" : "text-dusk/50"}`}>
                {w.format}
              </p>
              <h3 className={`mt-1.5 font-serif text-[19px] leading-snug ${title}`} style={{ textWrap: "balance" }}>
                {w.title}
              </h3>
              <p className={`text-[12.5px] font-light mt-0.5 ${sub}`} style={dark ? undefined : { color: "#6B6560" }}>
                {w.author}
              </p>
              <p className={`mt-3 text-[13.5px] leading-relaxed italic ${dark ? "text-paper/85" : "text-dusk/85"}`}
                 style={{ textWrap: "pretty" }}>
                {w.context}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {w.tags.map((t) => (
                  <span key={t}
                        className="text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                        style={{
                          background: dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.55)",
                          color: dark ? "rgba(255,255,255,0.85)" : "#7A6F5E",
                        }}>
                    {t}
                  </span>
                ))}
              </div>
              <a href={w.url} target="_blank" rel="noreferrer"
                 className={`inline-block mt-4 text-[12px] uppercase tracking-[0.2em] ${dark ? "text-paper/90" : "text-dusk/80"}`}>
                Voir cette œuvre →
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type AmbientAudio = { start: () => void; stop: () => void };

function createAmbientAudio(ctx: AudioContext, motion: Motion): AmbientAudio | null {
  if (typeof window === "undefined") return null;
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
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
  const playNoise = (buf: AudioBuffer, type: BiquadFilterType, freq: number, q: number, gain: number) => {
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = gain;
    src.connect(f); f.connect(g); g.connect(master);
    src.start();
    stops.push(() => { try { src.stop(); } catch {} });
    return { f, g };
  };
  if (motion === "pulse") {
    playNoise(brown, "lowpass", 240, 0.3, 0.45);
    const sub = ctx.createOscillator(); sub.type = "sine"; sub.frequency.value = 58;
    const subG = ctx.createGain(); subG.gain.value = 0.025;
    sub.connect(subG); subG.connect(master); sub.start();
    stops.push(() => { try { sub.stop(); } catch {} });
    const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
    lfo.frequency.value = 0.08; lfoG.gain.value = 0.03;
    lfo.connect(lfoG); lfoG.connect(master.gain); lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
    let cancelledP = false;
    const crackle = () => {
      if (cancelledP) return;
      const o = ctx.createOscillator(); o.type = "triangle";
      o.frequency.value = 1100 + Math.random() * 900;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1600; f.Q.value = 1.2;
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
    const { f, g } = playNoise(brown, "bandpass", 420, 0.4, 0.55);
    const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
    lfo.frequency.value = 0.09; lfoG.gain.value = 220;
    lfo.connect(lfoG); lfoG.connect(f.frequency); lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
    const vol = ctx.createOscillator(); const volG = ctx.createGain();
    vol.frequency.value = 0.07; volG.gain.value = 0.18;
    vol.connect(volG); volG.connect(g.gain); vol.start();
    stops.push(() => { try { vol.stop(); } catch {} });
  } else if (motion === "drift") {
    const { f } = playNoise(brown, "bandpass", 720, 0.6, 0.4);
    const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
    lfo.frequency.value = 0.1; lfoG.gain.value = 320;
    lfo.connect(lfoG); lfoG.connect(f.frequency); lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
    playNoise(white, "bandpass", 2400, 0.6, 0.05);
  } else if (motion === "rain") {
    playNoise(white, "bandpass", 1600, 0.4, 0.2);
    playNoise(brown, "lowpass", 520, 0.3, 0.26);
    let cancelled = false;
    const drop = () => {
      if (cancelled) return;
      const o = ctx.createOscillator(); o.type = "sine";
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
    playNoise(brown, "lowpass", 200, 0.25, 0.28);
    const { f } = playNoise(white, "bandpass", 3200, 0.7, 0.025);
    const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
    lfo.frequency.value = 0.05; lfoG.gain.value = 600;
    lfo.connect(lfoG); lfoG.connect(f.frequency); lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
  }
  let started = false;
  return {
    start() {
      if (started) return; started = true;
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
        setTimeout(() => { stops.forEach((fn) => fn()); }, 1300);
      } catch {}
    },
  };
}

function MotionLayer({ kind }: { kind: Motion }) {
  const keyframes = (
    <style>{`
      @keyframes nw-breathe {
        0%, 100% { transform: scale(1); opacity: 0.3; }
        50%      { transform: scale(1.08); opacity: 0.55; }
      }
      @keyframes nw-rise {
        0%   { transform: translate3d(0, 18vmin, 0) scale(0.8); opacity: 0; }
        15%  { opacity: 0.5; } 85% { opacity: 0.5; }
        100% { transform: translate3d(2vmin, -22vmin, 0) scale(1.1); opacity: 0; }
      }
      @keyframes nw-ring {
        0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
        20%  { opacity: 0.45; }
        100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
      }
      @keyframes nw-fall {
        0%   { transform: translate3d(var(--dx,0), -12vh, 0); opacity: 0; }
        12%  { opacity: 0.55; } 88% { opacity: 0.55; }
        100% { transform: translate3d(calc(var(--dx,0) + 1vw), 110vh, 0); opacity: 0; }
      }
      @keyframes nw-snow {
        0%   { transform: translate3d(0, -10vh, 0); opacity: 0; }
        15%  { opacity: 0.55; } 85% { opacity: 0.55; }
        100% { transform: translate3d(8vmin, 110vh, 0); opacity: 0; }
      }
      @keyframes nw-leaf {
        0%   { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 0; }
        10%  { opacity: 0.65; } 90% { opacity: 0.55; }
        100% { transform: translate3d(12vmin, 110vh, 0) rotate(540deg); opacity: 0; }
      }
      @keyframes nw-float {
        0% { transform: translate3d(0,0,0); }
        50% { transform: translate3d(6vmin, -4vmin, 0); }
        100% { transform: translate3d(0,0,0); }
      }
    `}</style>
  );

  if (kind === "pulse") {
    return (
      <>
        {keyframes}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
             style={{ width: "70vmin", height: "70vmin",
               background: "radial-gradient(circle, rgba(220,140,90,0.55), transparent 70%)",
               animation: "nw-breathe 8s ease-in-out infinite", filter: "blur(8px)" }} />
        {Array.from({ length: 10 }).map((_, i) => {
          const left = 18 + (i * 71) % 64;
          const delay = (i * 1.7) % 14;
          const size = 4 + (i % 4) * 2;
          return (
            <span key={i} className="absolute rounded-full"
                  style={{ left: `${left}%`, bottom: `${10 + (i % 5) * 6}%`,
                    width: `${size}px`, height: `${size}px`,
                    background: "radial-gradient(circle, rgba(255,205,170,0.85), transparent 70%)",
                    animation: `nw-rise ${14 + (i % 5) * 3}s ease-in ${delay}s infinite`,
                    filter: "blur(0.5px)" }} />
          );
        })}
      </>
    );
  }
  if (kind === "ripple") {
    return (
      <>
        {keyframes}
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="absolute left-1/2 top-[55%] rounded-full border"
               style={{ width: "20vmin", height: "20vmin",
                 borderColor: "rgba(70,90,120,0.18)",
                 animation: `nw-ring 14s ease-out ${i * 2.8}s infinite` }} />
        ))}
      </>
    );
  }
  if (kind === "drift") {
    // Falling leaves OR soft particles
    return (
      <>
        {keyframes}
        {Array.from({ length: 12 }).map((_, i) => {
          const left = (i * 41) % 100;
          const dur = 14 + (i % 5) * 3;
          const delay = (i * 1.3) % dur;
          const size = 8 + (i % 4) * 3;
          return (
            <span key={i} className="absolute"
                  style={{ left: `${left}%`, top: 0,
                    width: `${size}px`, height: `${size * 1.6}px`,
                    background: "radial-gradient(ellipse at 50% 40%, rgba(200,150,90,0.7), rgba(180,110,60,0.2) 80%)",
                    borderRadius: "60% 40% 60% 40%",
                    animation: `nw-leaf ${dur}s linear ${delay}s infinite`,
                    filter: "blur(0.4px)" }} />
          );
        })}
      </>
    );
  }
  if (kind === "rain") {
    return (
      <>
        {keyframes}
        {Array.from({ length: 22 }).map((_, i) => {
          const left = (i * 41) % 100;
          const dx = ((i * 17) % 12) - 6;
          const dur = 4.5 + (i % 6) * 0.6;
          const delay = (i * 0.37) % dur;
          return (
            <span key={i} className="absolute"
                  style={{ left: `${left}%`, top: 0,
                    width: "1px", height: "10vh",
                    background: "linear-gradient(180deg, transparent, rgba(120,140,170,0.55))",
                    ['--dx' as string]: `${dx}vw`,
                    animation: `nw-fall ${dur}s linear ${delay}s infinite`,
                    filter: "blur(0.4px)" } as React.CSSProperties} />
          );
        })}
      </>
    );
  }
  // veil — snow / stars
  return (
    <>
      {keyframes}
      {Array.from({ length: 26 }).map((_, i) => {
        const left = (i * 53) % 100;
        const size = 2 + (i % 4);
        const dur = 18 + (i % 7) * 3;
        const delay = (i * 0.9) % dur;
        return (
          <span key={i} className="absolute rounded-full"
                style={{ left: `${left}%`, top: 0,
                  width: `${size}px`, height: `${size}px`,
                  background: "rgba(245,240,255,0.85)",
                  animation: `nw-snow ${dur}s linear ${delay}s infinite`,
                  filter: "blur(0.6px)" }} />
        );
      })}
    </>
  );
}
