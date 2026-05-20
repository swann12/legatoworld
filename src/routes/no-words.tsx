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

type SoundConfig = {
  oscillator: { type: OscillatorType; frequency: number };
  oscillator2?: { type: OscillatorType; frequency: number; gain: number } | null;
  noise?: { gain: number; filter: { type: BiquadFilterType; frequency: number; Q: number } };
  nature?: {
    gain: number;
    filter: { type: BiquadFilterType; frequency: number; Q: number };
    lfo?: { frequency: number; depth: number };
  };
  filter: { frequency: number; Q: number };
  reverb: { duration: number; decay: number };
  lfo: { frequency: number; depth: number };
  master: number;
};

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
    bg: "radial-gradient(120% 90% at 30% 35%, #FFD9C2 0%, #FBE6D8 40%, #FFF2EA 80%, #FFF7F1 100%)",
    tag: "deuil récent",
    sound: {
      oscillator: { type: "sine", frequency: 55 },
      oscillator2: { type: "sine", frequency: 57.5, gain: 0.35 },
      filter: { frequency: 220, Q: 1.2 },
      reverb: { duration: 4.0, decay: 2.8 },
      lfo: { frequency: 0.06, depth: 60 },
      master: 0.20,
      // Crépitement très lointain — comme des braises sous une couverture
      nature: {
        gain: 0.045,
        filter: { type: "bandpass", frequency: 1800, Q: 2.4 },
        lfo: { frequency: 2.8, depth: 0.035 },
      },
    },
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
    bg: "radial-gradient(110% 100% at 50% 25%, #EAF2F6 0%, #F2ECF6 55%, #F8F4F2 100%)",
    tag: "philosophique",
    sound: {
      oscillator: { type: "sine", frequency: 96 },
      oscillator2: null,
      filter: { frequency: 320, Q: 0.5 },
      reverb: { duration: 8.0, decay: 5.0 },
      lfo: { frequency: 0.04, depth: 90 },
      master: 0.14,
      // Souffle d'air haut, presque inaudible — air frais du matin
      nature: {
        gain: 0.035,
        filter: { type: "highpass", frequency: 3800, Q: 0.6 },
        lfo: { frequency: 0.08, depth: 0.025 },
      },
    },
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
    bg: "radial-gradient(120% 95% at 65% 40%, #DCEACB 0%, #ECF3DC 50%, #F6FBEF 100%)",
    tag: "long terme",
    sound: {
      oscillator: { type: "triangle", frequency: 65 },
      oscillator2: null,
      noise: { gain: 0.06, filter: { type: "bandpass", frequency: 600, Q: 0.8 } },
      filter: { frequency: 260, Q: 1.5 },
      reverb: { duration: 5.0, decay: 3.5 },
      lfo: { frequency: 0.09, depth: 80 },
      master: 0.18,
      // Bruissement de feuillage — vent qui passe doucement
      nature: {
        gain: 0.085,
        filter: { type: "bandpass", frequency: 2400, Q: 1.6 },
        lfo: { frequency: 0.22, depth: 0.06 },
      },
    },
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
    bg: "radial-gradient(110% 100% at 40% 55%, #F8DDE8 0%, #F1E4F0 45%, #ECEAF6 100%)",
    tag: "poétique",
    sound: {
      oscillator: { type: "sine", frequency: 50 },
      oscillator2: { type: "sine", frequency: 100, gain: 0.20 },
      filter: { frequency: 180, Q: 0.6 },
      reverb: { duration: 9.0, decay: 7.0 },
      lfo: { frequency: 0.03, depth: 50 },
      master: 0.16,
      // Souffle lointain enveloppant — comme une respiration dans du coton
      nature: {
        gain: 0.05,
        filter: { type: "bandpass", frequency: 900, Q: 0.7 },
        lfo: { frequency: 0.06, depth: 0.03 },
      },
    },
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
    sound: {
      oscillator: { type: "sine", frequency: 58 },
      oscillator2: { type: "sine", frequency: 87, gain: 0.45 },
      filter: { frequency: 280, Q: 1.8 },
      reverb: { duration: 5.5, decay: 4.0 },
      lfo: { frequency: 0.07, depth: 100 },
      master: 0.22,
    },
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
  master: GainNode;
  private cfg: SoundConfig | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private noiseSrc: AudioBufferSourceNode | null = null;
  private lfo: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private nodes: AudioNode[] = [];

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);
  }

  private buildReverb(duration: number, decay: number): ConvolverNode {
    const c = this.ctx;
    const len = Math.max(1, Math.floor(c.sampleRate * duration));
    const buf = c.createBuffer(2, len, c.sampleRate);
    const decayRate = decay / duration;
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1 / Math.max(decayRate, 0.001));
      }
    }
    const conv = c.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  private teardown() {
    try { this.osc1?.stop(); } catch (e) { void e; }
    try { this.osc2?.stop(); } catch (e) { void e; }
    try { this.noiseSrc?.stop(); } catch (e) { void e; }
    try { this.lfo?.stop(); } catch (e) { void e; }
    for (const n of this.nodes) { try { n.disconnect(); } catch (e) { void e; } }
    this.osc1 = this.osc2 = this.lfo = null;
    this.noiseSrc = null;
    this.filter = null;
    this.nodes = [];
  }

  setSequence(cfg: SoundConfig) {
    this.teardown();
    this.cfg = cfg;
    const c = this.ctx;

    const reverb = this.buildReverb(cfg.reverb.duration, cfg.reverb.decay);
    const reverbGain = c.createGain(); reverbGain.gain.value = 0.6;
    reverb.connect(reverbGain); reverbGain.connect(this.master);

    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cfg.filter.frequency;
    filter.Q.value = cfg.filter.Q;
    filter.connect(reverb);
    filter.connect(this.master);
    this.filter = filter;

    const lfo = c.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = cfg.lfo.frequency;
    const lfoGain = c.createGain();
    lfoGain.gain.value = cfg.lfo.depth;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.lfo = lfo;

    const osc1 = c.createOscillator();
    osc1.type = cfg.oscillator.type;
    osc1.frequency.value = cfg.oscillator.frequency;
    const oscGain1 = c.createGain(); oscGain1.gain.value = 0.7;
    osc1.connect(oscGain1); oscGain1.connect(filter);
    osc1.start();
    this.osc1 = osc1;

    if (cfg.oscillator2) {
      const osc2 = c.createOscillator();
      osc2.type = cfg.oscillator2.type;
      osc2.frequency.value = cfg.oscillator2.frequency;
      const oscGain2 = c.createGain(); oscGain2.gain.value = cfg.oscillator2.gain;
      osc2.connect(oscGain2); oscGain2.connect(filter);
      osc2.start();
      this.osc2 = osc2;
      this.nodes.push(oscGain2);
    }

    if (cfg.noise) {
      const nb = c.createBuffer(1, c.sampleRate * 3, c.sampleRate);
      const nd = nb.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * 0.2;
      const ns = c.createBufferSource();
      ns.buffer = nb; ns.loop = true;
      const nf = c.createBiquadFilter();
      nf.type = cfg.noise.filter.type;
      nf.frequency.value = cfg.noise.filter.frequency;
      nf.Q.value = cfg.noise.filter.Q;
      const ng = c.createGain();
      ng.gain.value = cfg.noise.gain;
      ns.connect(nf); nf.connect(ng); ng.connect(reverb);
      ns.start();
      this.noiseSrc = ns;
      this.nodes.push(nf, ng);
    }

    this.nodes.push(reverb, reverbGain, filter, lfoGain, oscGain1);
  }

  fadeIn(dur = 3.0) {
    if (!this.cfg) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(this.cfg.master, now + dur);
  }

  fadeOut(dur = 2.0) {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + dur);
  }

  onTouch(_x: number, y: number, _pressure: number) {
    if (!this.cfg || !this.filter) return;
    void _x; void _pressure;
    const base = this.cfg.filter.frequency;
    const target = Math.min(base * (1 + (1 - y) * 0.6), base * 1.7);
    const now = this.ctx.currentTime;
    this.filter.frequency.cancelScheduledValues(now);
    this.filter.frequency.linearRampToValueAtTime(target, now + 0.3);
  }

  onTouchEnd() {
    if (!this.cfg || !this.filter) return;
    const now = this.ctx.currentTime;
    this.filter.frequency.linearRampToValueAtTime(this.cfg.filter.frequency, now + 2.0);
  }

  dispose() {
    this.teardown();
    try { this.master.disconnect(); } catch (e) { void e; }
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

