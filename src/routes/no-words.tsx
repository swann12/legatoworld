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

type Tab = "souffles" | "respirer" | "lire" | "regarder";
type BookTag = "deuil récent" | "long terme" | "anticipation" | "pour les enfants" | "philosophique" | "poétique" | "corps";

type ShapeSpec = {
  xR: number; yR: number;
  rBase: number; blur: number;
  c1: string; c2: string;
  opMin: number; opMax: number; pDur: number;
  dxAmp: number; dyAmp: number; dxDur: number; dyDur: number;
};

type SoundConfig = { freq: number; filterBase: number; noiseBase: number; lfoAmp: number };

type Sequence = {
  id: string;
  title: string;
  bg: string;
  tag: BookTag;
  sound: SoundConfig;
  shapes: ShapeSpec[];
};

const BASE: Sequence[] = [
  {
    id: "warmth",
    title: "Chaleur lente",
    bg: "linear-gradient(158deg, #FFE8DC 0%, #FFF4EE 100%)",
    tag: "deuil récent",
    sound: { freq: 55, filterBase: 300, noiseBase: 340, lfoAmp: 100 },
    shapes: [
      { xR:0.52, yR:0.30, rBase:185, blur:75, c1:"rgba(255,200,170,", c2:"rgba(240,150,130,", opMin:0.32, opMax:0.52, pDur:16000, dxAmp:16, dyAmp:12, dxDur:18000, dyDur:14000 },
      { xR:0.20, yR:0.20, rBase:100, blur:65, c1:"rgba(232,155,185,", c2:"rgba(210,120,150,", opMin:0.22, opMax:0.42, pDur:12000, dxAmp:20, dyAmp:16, dxDur:16000, dyDur:20000 },
      { xR:0.72, yR:0.70, rBase:80,  blur:55, c1:"rgba(255,210,170,", c2:"rgba(240,180,120,", opMin:0.35, opMax:0.58, pDur:9000,  dxAmp:22, dyAmp:18, dxDur:11000, dyDur:9000 },
      { xR:0.50, yR:0.55, rBase:260, blur:95, c1:"rgba(248,200,190,", c2:"rgba(240,170,160,", opMin:0.10, opMax:0.20, pDur:22000, dxAmp:8,  dyAmp:6,  dxDur:28000, dyDur:24000 },
    ],
  },
  {
    id: "morning-sky",
    title: "Ciel du matin",
    bg: "linear-gradient(180deg, #EAF0F8 0%, #F4EEF8 100%)",
    tag: "philosophique",
    sound: { freq: 48, filterBase: 260, noiseBase: 290, lfoAmp: 115 },
    shapes: [
      { xR:0.52, yR:0.24, rBase:145, blur:55, c1:"rgba(255,220,210,", c2:"rgba(220,170,210,", opMin:0.40, opMax:0.62, pDur:18000, dxAmp:10, dyAmp:8,  dxDur:22000, dyDur:19000 },
      { xR:0.52, yR:0.24, rBase:275, blur:80, c1:"rgba(220,200,240,", c2:"rgba(200,180,230,", opMin:0.08, opMax:0.18, pDur:18000, dxAmp:10, dyAmp:8,  dxDur:22000, dyDur:19000 },
      { xR:0.25, yR:0.62, rBase:88,  blur:42, c1:"rgba(120,155,210,", c2:"rgba(100,130,195,", opMin:0.20, opMax:0.36, pDur:14000, dxAmp:8,  dyAmp:12, dxDur:13000, dyDur:17000 },
      { xR:0.76, yR:0.44, rBase:150, blur:85, c1:"rgba(200,185,235,", c2:"rgba(180,160,220,", opMin:0.16, opMax:0.30, pDur:11000, dxAmp:14, dyAmp:10, dxDur:15000, dyDur:12000 },
    ],
  },
  {
    id: "leaves",
    title: "Feuilles",
    bg: "linear-gradient(162deg, #EEF4E8 0%, #F8FBF4 100%)",
    tag: "long terme",
    sound: { freq: 65, filterBase: 400, noiseBase: 480, lfoAmp: 130 },
    shapes: [
      { xR:0.50, yR:0.46, rBase:210, blur:90, c1:"rgba(210,230,185,", c2:"rgba(185,215,160,", opMin:0.25, opMax:0.40, pDur:21000, dxAmp:10, dyAmp:8,  dxDur:24000, dyDur:20000 },
      { xR:0.78, yR:0.18, rBase:70,  blur:50, c1:"rgba(195,225,165,", c2:"rgba(170,205,140,", opMin:0.20, opMax:0.38, pDur:13000, dxAmp:16, dyAmp:12, dxDur:14000, dyDur:17000 },
      { xR:0.30, yR:0.65, rBase:140, blur:70, c1:"rgba(192,216,160,", c2:"rgba(208,224,176,", opMin:0.18, opMax:0.36, pDur:26000, dxAmp:14, dyAmp:10, dxDur:22000, dyDur:18000 },
      { xR:0.65, yR:0.40, rBase:110, blur:60, c1:"rgba(168,200,136,", c2:"rgba(188,216,156,", opMin:0.12, opMax:0.24, pDur:19000, dxAmp:18, dyAmp:14, dxDur:20000, dyDur:23000 },
    ],
  },
  {
    id: "rose-mist",
    title: "Brume rose",
    bg: "linear-gradient(148deg, #F8EEF4 0%, #F0ECF8 100%)",
    tag: "poétique",
    sound: { freq: 52, filterBase: 280, noiseBase: 310, lfoAmp: 95 },
    shapes: [
      { xR:0.35, yR:0.30, rBase:170, blur:70, c1:"rgba(232,168,195,", c2:"rgba(215,140,175,", opMin:0.30, opMax:0.50, pDur:15000, dxAmp:18, dyAmp:14, dxDur:17000, dyDur:13000 },
      { xR:0.68, yR:0.55, rBase:130, blur:65, c1:"rgba(180,188,230,", c2:"rgba(160,165,218,", opMin:0.24, opMax:0.42, pDur:19000, dxAmp:14, dyAmp:16, dxDur:21000, dyDur:16000 },
      { xR:0.50, yR:0.50, rBase:280, blur:100,c1:"rgba(240,210,230,", c2:"rgba(225,195,218,", opMin:0.08, opMax:0.16, pDur:25000, dxAmp:6,  dyAmp:5,  dxDur:30000, dyDur:26000 },
      { xR:0.22, yR:0.72, rBase:65,  blur:48, c1:"rgba(248,185,210,", c2:"rgba(235,160,190,", opMin:0.28, opMax:0.50, pDur:10000, dxAmp:20, dyAmp:15, dxDur:12000, dyDur:10000 },
    ],
  },
  {
    id: "evening-gold",
    title: "Or du soir",
    bg: "linear-gradient(158deg, #FFF4E0 0%, #FFF8F0 100%)",
    tag: "philosophique",
    sound: { freq: 62, filterBase: 360, noiseBase: 420, lfoAmp: 120 },
    shapes: [
      { xR:0.50, yR:0.35, rBase:155, blur:60, c1:"rgba(255,215,140,", c2:"rgba(245,175,100,", opMin:0.36, opMax:0.56, pDur:13000, dxAmp:12, dyAmp:10, dxDur:16000, dyDur:13000 },
      { xR:0.28, yR:0.18, rBase:90,  blur:58, c1:"rgba(248,185,130,", c2:"rgba(235,155,100,", opMin:0.28, opMax:0.48, pDur:11000, dxAmp:18, dyAmp:14, dxDur:13000, dyDur:16000 },
      { xR:0.55, yR:0.50, rBase:270, blur:95, c1:"rgba(255,235,185,", c2:"rgba(248,210,160,", opMin:0.10, opMax:0.20, pDur:24000, dxAmp:7,  dyAmp:5,  dxDur:28000, dyDur:22000 },
      { xR:0.18, yR:0.60, rBase:45,  blur:42, c1:"rgba(255,210,120,", c2:"rgba(240,170,80,",  opMin:0.18, opMax:0.36, pDur:8000,  dxAmp:18, dyAmp:14, dxDur:9000,  dyDur:11000 },
      { xR:0.80, yR:0.38, rBase:55,  blur:46, c1:"rgba(255,210,120,", c2:"rgba(240,170,80,",  opMin:0.22, opMax:0.44, pDur:11000, dxAmp:22, dyAmp:18, dxDur:13000, dyDur:10000 },
      { xR:0.42, yR:0.82, rBase:60,  blur:50, c1:"rgba(255,210,120,", c2:"rgba(240,170,80,",  opMin:0.20, opMax:0.40, pDur:14000, dxAmp:26, dyAmp:20, dxDur:15000, dyDur:13000 },
    ],
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

/* ─── Moteur audio : drone continu, jamais de notes discrètes ─── */
class AudioEngine {
  ctx: AudioContext;
  osc1!: OscillatorNode; osc2!: OscillatorNode; osc3!: OscillatorNode;
  noise!: AudioBufferSourceNode;
  filter!: BiquadFilterNode;
  noiseFilter!: BiquadFilterNode;
  lfo!: OscillatorNode; lfoGain!: GainNode;
  reverb!: ConvolverNode; reverbGain!: GainNode;
  master!: GainNode;
  baseFilterFreq = 300;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    const c = ctx;
    this.osc1 = c.createOscillator(); this.osc1.type = "sine"; this.osc1.frequency.value = 55;
    this.osc2 = c.createOscillator(); this.osc2.type = "sine"; this.osc2.frequency.value = 82.5;
    this.osc3 = c.createOscillator(); this.osc3.type = "triangle"; this.osc3.frequency.value = 27.5;

    this.noise = this.createNoise();

    this.filter = c.createBiquadFilter();
    this.filter.type = "lowpass"; this.filter.Q.value = 2.0; this.filter.frequency.value = 300;

    this.noiseFilter = c.createBiquadFilter();
    this.noiseFilter.type = "bandpass"; this.noiseFilter.Q.value = 1.2; this.noiseFilter.frequency.value = 340;

    this.lfo = c.createOscillator(); this.lfo.type = "sine"; this.lfo.frequency.value = 0.07;
    this.lfoGain = c.createGain(); this.lfoGain.gain.value = 100;

    this.reverb = this.createReverb(5.0);
    this.reverbGain = c.createGain(); this.reverbGain.gain.value = 0.55;

    this.master = c.createGain(); this.master.gain.value = 0;

    this.lfo.connect(this.lfoGain); this.lfoGain.connect(this.filter.frequency);

    const oscMix = c.createGain(); oscMix.gain.value = 0.35;
    this.osc1.connect(oscMix); this.osc2.connect(oscMix); this.osc3.connect(oscMix);
    oscMix.connect(this.filter);

    this.noise.connect(this.noiseFilter);
    const noiseMix = c.createGain(); noiseMix.gain.value = 0.10;
    this.noiseFilter.connect(noiseMix);

    this.filter.connect(this.reverb); this.filter.connect(this.master);
    noiseMix.connect(this.reverb); noiseMix.connect(this.master);
    this.reverb.connect(this.reverbGain); this.reverbGain.connect(this.master);

    this.master.connect(c.destination);

    this.osc1.start(); this.osc2.start(); this.osc3.start(); this.lfo.start();
  }

  private createNoise(): AudioBufferSourceNode {
    const c = this.ctx;
    const buf = c.createBuffer(1, c.sampleRate * 4, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.25;
    const s = c.createBufferSource(); s.buffer = buf; s.loop = true; s.start();
    return s;
  }

  private createReverb(duration: number): ConvolverNode {
    const c = this.ctx;
    const len = Math.floor(c.sampleRate * duration);
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
    }
    const conv = c.createConvolver(); conv.buffer = buf; return conv;
  }

  fadeIn(dur = 2.5) {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0.24, now + dur);
  }

  fadeOut(dur = 1.8) {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + dur);
  }

  setSequence(cfg: SoundConfig) {
    const now = this.ctx.currentTime;
    this.baseFilterFreq = cfg.filterBase;
    this.osc1.frequency.linearRampToValueAtTime(cfg.freq, now + 2);
    this.osc2.frequency.linearRampToValueAtTime(cfg.freq * 1.5, now + 2);
    this.osc3.frequency.linearRampToValueAtTime(cfg.freq * 0.5, now + 2);
    this.filter.frequency.linearRampToValueAtTime(cfg.filterBase, now + 2);
    this.noiseFilter.frequency.linearRampToValueAtTime(cfg.noiseBase, now + 2);
    this.lfoGain.gain.linearRampToValueAtTime(cfg.lfoAmp, now + 2);
  }

  onTouch(x: number, y: number, pressure: number) {
    const now = this.ctx.currentTime;
    const ramp = 0.12;
    const targetFreq = this.baseFilterFreq * (1 + (0.5 - y) * 1.6);
    this.filter.frequency.linearRampToValueAtTime(Math.max(60, Math.min(2000, targetFreq)), now + ramp);
    this.filter.Q.linearRampToValueAtTime(1.5 + Math.abs(x - 0.5) * 3.5, now + ramp);
    this.noiseFilter.frequency.linearRampToValueAtTime(180 + pressure * 700, now + ramp);
    this.lfo.frequency.linearRampToValueAtTime(0.04 + (1 - pressure) * 0.05, now + 0.4);
  }

  onTouchEnd() {
    const now = this.ctx.currentTime;
    this.filter.frequency.linearRampToValueAtTime(this.baseFilterFreq, now + 1.8);
    this.filter.Q.linearRampToValueAtTime(2.0, now + 1.5);
    this.lfo.frequency.linearRampToValueAtTime(0.07, now + 2.5);
  }

  dispose() {
    try { this.osc1.stop(); } catch (e) { void e; }
    try { this.osc2.stop(); } catch (e) { void e; }
    try { this.osc3.stop(); } catch (e) { void e; }
    try { this.lfo.stop(); } catch (e) { void e; }
    try { this.noise.stop(); } catch (e) { void e; }
  }
}

/* ─── Forme canvas : nuage radial dérivant lentement ─── */
class Shape {
  x: number; y: number;
  rBase: number; blur: number;
  c1: string; c2: string;
  opMin: number; opMax: number; pDur: number;
  dxAmp: number; dyAmp: number; dxDur: number; dyDur: number;
  ph: number;
  cx = 0; cy = 0; r = 0; op = 0;

  constructor(spec: ShapeSpec, W: number, H: number, ph: number) {
    this.x = spec.xR * W; this.y = spec.yR * H;
    this.rBase = spec.rBase; this.blur = spec.blur;
    this.c1 = spec.c1; this.c2 = spec.c2;
    this.opMin = spec.opMin; this.opMax = spec.opMax; this.pDur = spec.pDur;
    this.dxAmp = spec.dxAmp; this.dyAmp = spec.dyAmp;
    this.dxDur = spec.dxDur; this.dyDur = spec.dyDur;
    this.ph = ph;
  }

  update(t: number, touch: { active: boolean; x: number; y: number }, W: number) {
    this.cx = this.x + Math.sin(t / this.dxDur + this.ph) * this.dxAmp;
    this.cy = this.y + Math.cos(t / this.dyDur + this.ph * 1.4) * this.dyAmp;
    this.op = this.opMin + (this.opMax - this.opMin) * (0.5 + 0.5 * Math.sin(t / this.pDur + this.ph));
    this.r = this.rBase * (0.94 + 0.06 * Math.sin(t / (this.pDur * 0.8) + this.ph));
    if (touch.active) {
      const dx = touch.x - this.cx, dy = touch.y - this.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const infl = Math.max(0, 1 - dist / (W * 0.65));
      this.cx += dx * infl * 0.06;
      this.cy += dy * infl * 0.05;
      this.op = Math.min(this.opMax * 1.3, this.op + infl * 0.15);
      this.r *= 1 + infl * 0.18;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.filter = `blur(${this.blur}px)`;
    const g = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.r);
    g.addColorStop(0, this.c1 + `${this.op})`);
    g.addColorStop(0.5, this.c2 + `${this.op * 0.55})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* ─── SouffleScene — canvas plein écran + interaction tactile ─── */
function SouffleScene({
  seq,
  audioRef,
  onFirstInteract,
}: {
  seq: Sequence;
  audioRef: React.MutableRefObject<AudioEngine | null>;
  onFirstInteract: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const touchRef = useRef({ active: false, x: 0, y: 0 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef(0);

  // Resize + DPR
  useEffect(() => {
    const cv = canvasRef.current, el = containerRef.current;
    if (!cv || !el) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = el.clientWidth, h = el.clientHeight;
      sizeRef.current = { w, h };
      cv.width = w * dpr; cv.height = h * dpr;
      cv.style.width = w + "px"; cv.style.height = h + "px";
      const ctx = cv.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Rebuild shapes when sequence or size changes
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;
    let specs = seq.shapes;
    let blurMul = 1;
    if (typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4 && specs.length > 3) {
      const largest = specs.reduce((m, s) => (s.rBase > m.rBase ? s : m), specs[0]);
      specs = specs.filter((s) => s !== largest);
      blurMul = 0.75;
    }
    shapesRef.current = specs.map((s, i) => new Shape({ ...s, blur: s.blur * blurMul }, W, H, i * 1.37));
  }, [seq]);

  // Animation loop + visibility handling
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let running = true;
    const start = performance.now();
    const tick = (now: number) => {
      if (!running) return;
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);
      const t = now - start;
      for (const s of shapesRef.current) {
        s.update(t, touchRef.current, w);
        s.draw(ctx);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafRef.current);
        audioRef.current?.fadeOut(0.4);
      } else {
        running = true;
        rafRef.current = requestAnimationFrame(tick);
        audioRef.current?.fadeIn(1.0);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [seq.id, audioRef]);

  const updateTouch = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect(); if (!rect) return;
    const cx = clientX - rect.left, cy = clientY - rect.top;
    touchRef.current.x = cx; touchRef.current.y = cy;
    const x = cx / rect.width, y = cy / rect.height;
    const pressure = Math.max(0, 1 - Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2) * 1.4);
    audioRef.current?.onTouch(x, y, pressure);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    onFirstInteract();
    touchRef.current.active = true;
    updateTouch(e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!touchRef.current.active) return;
    updateTouch(e.clientX, e.clientY);
  };
  const onPointerUp = () => {
    touchRef.current.active = false;
    audioRef.current?.onTouchEnd();
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

/* ─── SoufflesView ─────────────────────────────────────────────── */
function SoufflesView() {
  const [index, setIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bloom, setBloom] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [fadedOut, setFadedOut] = useState(false);
  const audioRef = useRef<AudioEngine | null>(null);
  const touchStartX = useRef<number | null>(null);
  const seq = BASE[index];

  useEffect(() => { setFavorites(loadFavorites()); }, []);

  // Initialise engine on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctx = window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const eng = new AudioEngine(ctx);
    audioRef.current = eng;
    eng.setSequence(BASE[0].sound);
    if (ctx.state !== "suspended") eng.fadeIn(2.5);
    return () => {
      eng.fadeOut(0.8);
      setTimeout(() => { eng.dispose(); try { ctx.close(); } catch (e) { void e; } }, 900);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resume context on first interaction (iOS)
  const resumeAudio = useCallback(() => {
    const eng = audioRef.current; if (!eng) return;
    if (eng.ctx.state === "suspended") {
      void eng.ctx.resume().then(() => { if (playing) eng.fadeIn(2.0); });
    }
  }, [playing]);

  const changeIndex = (newIdx: number) => {
    if (newIdx === index) return;
    const eng = audioRef.current;
    if (!eng) { setIndex(newIdx); return; }
    eng.fadeOut(0.7);
    setFadedOut(true);
    setTimeout(() => {
      setIndex(newIdx);
      setFadedOut(false);
      eng.setSequence(BASE[newIdx].sound);
      if (playing && eng.ctx.state !== "suspended") eng.fadeIn(2.0);
    }, 500);
  };
  const next = () => changeIndex((index + 1) % BASE.length);
  const prev = () => changeIndex((index - 1 + BASE.length) % BASE.length);

  const togglePlay = () => {
    const eng = audioRef.current; if (!eng) return;
    if (playing) { eng.fadeOut(1.0); setPlaying(false); }
    else {
      if (eng.ctx.state === "suspended") void eng.ctx.resume();
      eng.fadeIn(1.5); setPlaying(true);
    }
  };

  const isFav = favorites.includes(seq.id);
  const onKeep = () => {
    if (isFav) return;
    const nx = [...favorites, seq.id];
    setFavorites(nx); saveFavorites(nx);
    setBloom(true);
    setTimeout(() => setBloom(false), 1800);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    resumeAudio();
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 60) { if (dx < 0) next(); else prev(); }
  };

  return (
    <div
      className="relative flex-1 flex flex-col overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="fixed inset-0 -z-10 transition-[background] duration-[1800ms] ease-out"
        style={{ background: seq.bg }}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${fadedOut ? "opacity-0" : "opacity-100"}`}
      >
        <SouffleScene seq={seq} audioRef={audioRef} onFirstInteract={resumeAudio} />
      </div>

      {/* Pause — coin haut-droit, glassmorphism léger */}
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Reprendre"}
        className="absolute top-5 right-5 z-30 size-9 rounded-full flex items-center justify-center text-dusk/75"
        style={{
          background: "rgba(255,255,255,0.28)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {playing ? (
          <span className="flex gap-[3px]">
            <span className="block w-[3px] h-[12px] bg-current rounded-sm" />
            <span className="block w-[3px] h-[12px] bg-current rounded-sm" />
          </span>
        ) : (
          <span
            className="block"
            style={{
              width: 0, height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderLeft: "9px solid currentColor",
              marginLeft: 2,
            }}
          />
        )}
      </button>

      {/* Titre — discret, en haut, centré */}
      <div className="relative z-10 pt-16 text-center pointer-events-none">
        <h2
          className="font-serif italic text-[22px] leading-none text-dusk/85"
          style={{ textShadow: "0 1px 18px rgba(255,255,255,0.55)" }}
        >
          {seq.title}
        </h2>
      </div>

      <div className="flex-1" />

      {bloom && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
          <BloomFlower />
        </div>
      )}

      {/* Bas — navigation + favori, très discrets */}
      <div className="relative z-10 px-6 pb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="size-11 rounded-full flex items-center justify-center text-lg backdrop-blur-md text-dusk/70"
            style={{ background: "color-mix(in oklab, white 30%, transparent)" }}
            aria-label="Séquence précédente"
          >←</button>
          <button
            onClick={onKeep}
            disabled={isFav}
            className="flex-1 py-3 rounded-full text-[11px] uppercase tracking-[0.22em] backdrop-blur-md text-dusk/70"
            style={{ background: "color-mix(in oklab, white 30%, transparent)" }}
            aria-label={isFav ? "Séquence gardée" : "Garder cette séquence"}
          >
            {isFav ? "♥  gardée" : "♡  garder"}
          </button>
          <button
            onClick={next}
            className="size-11 rounded-full flex items-center justify-center text-lg backdrop-blur-md text-dusk/70"
            style={{ background: "color-mix(in oklab, white 30%, transparent)" }}
            aria-label="Séquence suivante"
          >→</button>
        </div>

        <div className="flex justify-center gap-1.5">
          {BASE.map((s, i) => (
            <span
              key={s.id}
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
