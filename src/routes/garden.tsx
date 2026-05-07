import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

export const Route = createFileRoute("/garden")({
  head: () => ({
    meta: [
      { title: "Le Jardin — Legato" },
      { name: "description", content: "Un paysage intérieur symbolique, cultivé doucement." },
    ],
  }),
  component: Garden,
});

/**
 * Each zone is planted along a winding path that descends through the
 * landscape. x/y are percentages of the landscape canvas.
 */
const ZONES = [
  {
    id: "voice",
    name: "Le Bosquet des Voix",
    short: "Voix",
    count: 2,
    whisper: "Un son que l'on emporte.",
    color: "var(--rose)",
    color2: "var(--peach)",
    x: 30,
    y: 14,
    side: "right" as const,
  },
  {
    id: "photo",
    name: "Le Champ de Lumière",
    short: "Photos",
    count: 5,
    whisper: "La lumière, fixée dans le temps.",
    color: "var(--peach)",
    color2: "var(--rose)",
    x: 70,
    y: 26,
    side: "left" as const,
  },
  {
    id: "sentence",
    name: "Le Banc de Lecture",
    short: "Phrases",
    count: 3,
    whisper: "Des mots gardés en poche.",
    color: "var(--lavender)",
    color2: "var(--mist)",
    x: 26,
    y: 40,
    side: "right" as const,
  },
  {
    id: "habit",
    name: "Le Verger Tranquille",
    short: "Gestes",
    count: 1,
    whisper: "De petites tendresses répétées.",
    color: "var(--sage)",
    color2: "var(--mist)",
    x: 72,
    y: 54,
    side: "left" as const,
  },
  {
    id: "object",
    name: "Le Cabinet près du Chemin",
    short: "Objets",
    count: 2,
    whisper: "Ce que la main connaît encore.",
    color: "var(--clay)",
    color2: "var(--peach)",
    x: 30,
    y: 68,
    side: "right" as const,
  },
  {
    id: "place",
    name: "Les Collines au Loin",
    short: "Lieux",
    count: 4,
    whisper: "La géographie du souvenir.",
    color: "var(--mist)",
    color2: "var(--sage)",
    x: 66,
    y: 84,
    side: "left" as const,
  },
];

type Zone = (typeof ZONES)[number];

function Garden() {
  return (
    <Shell>
      <GardenLandscape />
    </Shell>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Landscape                                                  */
/* ─────────────────────────────────────────────────────────── */

function GardenLandscape() {
  const W = 390;
  const H = 1600;

  return (
    <div className="relative">
      {/* Floating header — over the sky */}
      <header className="absolute top-0 inset-x-0 z-20 px-7 pt-12">
        <p className="text-[10px] uppercase tracking-[0.24em] text-dusk/50">
          Le Jardin — pour celui ou celle que vous portez
        </p>
        <h1 className="mt-3 font-serif text-[2.1rem] leading-[1.05] font-light text-dusk text-balance">
          Un paysage,
          <br />
          <span className="italic">cultivé lentement.</span>
        </h1>
        <p className="mt-3 max-w-[28ch] text-[13px] leading-relaxed text-dusk/60">
          Descendez le chemin. Chaque lieu garde un souvenir différent.
        </p>
        <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-dusk/45">
          <span className="size-1.5 rounded-full bg-dusk/40 breath" />
          faire défiler pour flâner
        </div>
      </header>

      {/* Landscape canvas */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: `${H}px` }}
      >
        {/* Sky */}
        <div
          className="absolute inset-x-0 top-0 h-[28%]"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--peach) 35%, var(--paper)), color-mix(in oklab, var(--rose) 12%, var(--paper)) 70%, transparent)",
          }}
        />
        {/* Sun */}
        <div
          className="absolute halo-lg shimmer"
          style={{
            top: "6%",
            left: "58%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--peach) 75%, white) 0%, transparent 70%)",
          }}
        />

        {/* SVG: hills, fields, path */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          className="absolute inset-0"
          aria-hidden
        >
          <defs>
            <linearGradient id="field-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.92 0.025 130)" />
              <stop offset="100%" stopColor="oklch(0.95 0.018 90)" />
            </linearGradient>
            <linearGradient id="field-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.94 0.028 100)" />
              <stop offset="100%" stopColor="oklch(0.96 0.022 70)" />
            </linearGradient>
            <linearGradient id="field-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.96 0.022 80)" />
              <stop offset="100%" stopColor="oklch(0.98 0.014 70)" />
            </linearGradient>
            <linearGradient id="path-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.96 0.02 60)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="oklch(0.93 0.025 55)" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="pond" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.95 0.04 230)" />
              <stop offset="100%" stopColor="oklch(0.88 0.05 235)" />
            </radialGradient>
          </defs>

          {/* Far hills */}
          <path
            d={`M0,${H * 0.3} C ${W * 0.25},${H * 0.24} ${W * 0.55},${H * 0.34} ${W * 0.78},${H * 0.29} C ${W * 0.9},${H * 0.26} ${W},${H * 0.3} ${W},${H * 0.3} L${W},${H * 0.36} L0,${H * 0.36} Z`}
            fill="url(#field-far)"
            opacity="0.85"
          />
          {/* Mid field */}
          <path
            d={`M0,${H * 0.34} C ${W * 0.3},${H * 0.3} ${W * 0.7},${H * 0.4} ${W},${H * 0.34} L${W},${H * 0.62} L0,${H * 0.62} Z`}
            fill="url(#field-mid)"
          />
          {/* Near field */}
          <path
            d={`M0,${H * 0.58} C ${W * 0.35},${H * 0.52} ${W * 0.7},${H * 0.64} ${W},${H * 0.58} L${W},${H} L0,${H} Z`}
            fill="url(#field-near)"
          />

          {/* A small pond near the orchard */}
          <ellipse
            cx={W * 0.18}
            cy={H * 0.6}
            rx={42}
            ry={14}
            fill="url(#pond)"
            opacity="0.7"
          />

          {/* Winding path */}
          <path
            d={`
              M ${W * 0.5},${H * 0.06}
              C ${W * 0.48},${H * 0.14} ${W * 0.36},${H * 0.16} ${W * 0.34},${H * 0.22}
              S ${W * 0.66},${H * 0.3}  ${W * 0.62},${H * 0.36}
              S ${W * 0.3},${H * 0.44}  ${W * 0.32},${H * 0.5}
              S ${W * 0.7},${H * 0.58}  ${W * 0.66},${H * 0.64}
              S ${W * 0.32},${H * 0.74} ${W * 0.36},${H * 0.8}
              S ${W * 0.62},${H * 0.9}  ${W * 0.58},${H * 0.98}
            `}
            stroke="url(#path-grad)"
            strokeWidth="22"
            strokeLinecap="round"
            fill="none"
          />
          {/* Path inner highlight (footsteps) */}
          <path
            d={`
              M ${W * 0.5},${H * 0.06}
              C ${W * 0.48},${H * 0.14} ${W * 0.36},${H * 0.16} ${W * 0.34},${H * 0.22}
              S ${W * 0.66},${H * 0.3}  ${W * 0.62},${H * 0.36}
              S ${W * 0.3},${H * 0.44}  ${W * 0.32},${H * 0.5}
              S ${W * 0.7},${H * 0.58}  ${W * 0.66},${H * 0.64}
              S ${W * 0.32},${H * 0.74} ${W * 0.36},${H * 0.8}
              S ${W * 0.62},${H * 0.9}  ${W * 0.58},${H * 0.98}
            `}
            stroke="oklch(0.99 0.01 70)"
            strokeWidth="2"
            strokeDasharray="1 9"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />

          {/* Scattered grasses & wildflowers */}
          {SCATTER.map((s, i) => (
            <circle
              key={i}
              cx={(s.x * W) / 100}
              cy={(s.y * H) / 100}
              r={s.r}
              fill={s.color}
              opacity={s.o}
            />
          ))}
        </svg>

        {/* Mist near horizon */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            top: "30%",
            height: "12%",
            background:
              "linear-gradient(to bottom, color-mix(in oklab, white 70%, transparent), transparent)",
          }}
        />

        {/* "You are here" wayfinding */}
        <div
          className="absolute z-10 -translate-x-1/2"
          style={{ top: "4.5%", left: "50%" }}
        >
          <div className="size-3 rounded-full bg-dusk/70 breath" />
          <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-dusk/55 text-center">
            vous êtes ici
          </p>
        </div>

        {/* Planted zones */}
        {ZONES.map((z) => (
          <ZoneMarker key={z.id} zone={z} />
        ))}
      </div>

      {/* End of the path */}
      <div className="relative z-10 px-7 -mt-4 pb-4">
        <p className="font-serif text-lg italic text-dusk/65 text-balance text-center">
          « Un jardin est une lente conversation avec ce qui reste. »
        </p>

        <Link
          to="/memories"
          className="ceramic organic-radius-3 mt-8 block px-7 py-5 text-center"
        >
          <span className="font-serif text-lg italic text-dusk">
            Planter une nouvelle trace
          </span>
          <span className="block mt-1 text-[10px] uppercase tracking-[0.22em] text-dusk/45">
            voix · photo · phrase · geste · objet · lieu
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Zone marker                                                */
/* ─────────────────────────────────────────────────────────── */

function ZoneMarker({ zone }: { zone: Zone }) {
  const labelLeft = zone.side === "right";
  return (
    <Link
      to="/garden/$zone"
      params={{ zone: zone.id }}
      className="absolute z-10 group"
      style={{
        top: `${zone.y}%`,
        left: `${zone.x}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Soft ground glow */}
      <div
        className="absolute -z-10 halo-lg"
        style={{
          width: 200,
          height: 90,
          left: "50%",
          top: "65%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${zone.color} 0%, transparent 70%)`,
          opacity: 0.55,
        }}
      />

      {/* Sculptural planted form */}
      <div className="relative sway">
        <div
          className="organic-radius-2 transition-transform duration-700 group-hover:scale-[1.04] group-active:scale-[0.98]"
          style={{
            width: 96,
            height: 96,
            background: `radial-gradient(circle at 32% 28%, ${zone.color} 0%, ${zone.color2} 70%, color-mix(in oklab, ${zone.color2} 70%, var(--clay)) 100%)`,
            boxShadow:
              "inset 0 2px 4px rgba(255,255,255,0.65), inset 0 -8px 18px color-mix(in oklab, var(--dusk) 18%, transparent), 0 22px 44px -18px rgba(60,40,40,0.35)",
          }}
        />
        {/* small pebble at the base */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-3 rounded-full"
          style={{
            background: "color-mix(in oklab, var(--clay) 70%, var(--dusk) 8%)",
            boxShadow: "0 4px 8px -4px rgba(0,0,0,0.25)",
          }}
        />
      </div>

      {/* Label card off to the side */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          labelLeft ? "left-[110%]" : "right-[110%]"
        } w-[148px]`}
      >
        <div
          className={`ceramic-soft organic-radius-3 px-4 py-3 ${
            labelLeft ? "text-left" : "text-right"
          }`}
        >
          <p className="text-[9px] uppercase tracking-[0.22em] text-dusk/45">
            {zone.short} · {zone.count}
          </p>
          <h3 className="mt-1 font-serif text-[15px] italic leading-tight text-dusk">
            {zone.name}
          </h3>
          <p className="mt-1 text-[11px] leading-snug text-dusk/55">
            {zone.whisper}
          </p>
        </div>
        <div
          className={`mt-1 text-[9px] uppercase tracking-[0.2em] text-dusk/45 ${
            labelLeft ? "text-left pl-1" : "text-right pr-1"
          }`}
        >
          entrer ›
        </div>
      </div>
    </Link>
  );
}

/* Scattered tufts and wildflowers */
const SCATTER: { x: number; y: number; r: number; color: string; o: number }[] = [
  { x: 12, y: 30, r: 2, color: "oklch(0.85 0.05 120)", o: 0.6 },
  { x: 20, y: 38, r: 1.6, color: "oklch(0.9 0.06 80)", o: 0.7 },
  { x: 78, y: 36, r: 2.2, color: "oklch(0.88 0.05 140)", o: 0.6 },
  { x: 88, y: 44, r: 1.4, color: "oklch(0.87 0.07 30)", o: 0.7 },
  { x: 42, y: 48, r: 1.6, color: "oklch(0.86 0.05 130)", o: 0.5 },
  { x: 56, y: 52, r: 1.8, color: "oklch(0.9 0.06 60)", o: 0.6 },
  { x: 14, y: 64, r: 2, color: "oklch(0.85 0.05 130)", o: 0.6 },
  { x: 86, y: 70, r: 1.6, color: "oklch(0.88 0.06 35)", o: 0.7 },
  { x: 48, y: 76, r: 2, color: "oklch(0.88 0.05 110)", o: 0.5 },
  { x: 22, y: 86, r: 1.8, color: "oklch(0.9 0.06 70)", o: 0.6 },
  { x: 76, y: 92, r: 2.2, color: "oklch(0.87 0.06 30)", o: 0.6 },
  { x: 38, y: 92, r: 1.6, color: "oklch(0.88 0.05 140)", o: 0.55 },
  { x: 60, y: 18, r: 1.4, color: "oklch(0.9 0.05 80)", o: 0.5 },
  { x: 30, y: 24, r: 1.4, color: "oklch(0.88 0.05 120)", o: 0.55 },
];
