import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { OrganicShape, type ShapeKind } from "@/components/legato/OrganicShape";

export const Route = createFileRoute("/garden/")({
  head: () => ({
    meta: [
      { title: "Le Jardin — Legato" },
      { name: "description", content: "Une promenade calme dans un paysage intérieur." },
    ],
  }),
  component: Garden,
});

/**
 * Painted-garden view — a hand-drawn illustrated plan crossed with
 * pointillist density (Kusama) and pictorial flower-field brushwork
 * (Klimt / van Gogh). Each parterre is a being's memorial garden.
 * No names are shown; the whole parcel is the entry, with a hover hint.
 */
type Bloom = { kind: ShapeKind; tint: string; tint2: string; weight: number };
export type Being = {
  id: string;
  name: string;
  kind: "person" | "animal";
  /** SVG path on a 0..300 / 0..400 viewBox */
  d: string;
  /** centroid for the hover label */
  cx: number; cy: number;
  blooms: Bloom[];
  /** density of pointillé dots (60..220) */
  density: number;
  /** richness 0.7..1 — drives opacity & saturation */
  intensity: number;
  /** dominant deep ink for the bed outline */
  ink: string;
};

export const BEINGS: Being[] = [
  {
    id: "elise", name: "Élise", kind: "person",
    d: "M30,32 C 24,90 86,142 110,98 C 142,52 178,28 158,90 C 144,134 86,148 38,128 C 22,118 24,72 30,32 Z",
    cx: 92, cy: 86,
    blooms: [
      { kind: "rose",     tint: "var(--rose)",     tint2: "var(--peach)",   weight: 4 },
      { kind: "anemone",  tint: "var(--peach)",    tint2: "var(--rose)",    weight: 3 },
      { kind: "camellia", tint: "var(--rose)",     tint2: "var(--paper)",   weight: 2 },
      { kind: "daisy",    tint: "var(--paper)",    tint2: "var(--peach)",   weight: 2 },
      { kind: "moss",     tint: "var(--sage)",     tint2: "var(--mist)",    weight: 2 },
    ],
    density: 180, intensity: 1, ink: "oklch(0.42 0.10 22)",
  },
  {
    id: "papa", name: "Papa", kind: "person",
    d: "M180,28 C 256,18 298,72 282,128 C 274,164 222,176 200,148 C 174,118 156,72 180,28 Z",
    cx: 226, cy: 92,
    blooms: [
      { kind: "tulip",    tint: "var(--clay)",     tint2: "var(--peach)",   weight: 3 },
      { kind: "magnolia", tint: "var(--paper)",    tint2: "var(--peach)",   weight: 2 },
      { kind: "iris",     tint: "var(--lavender)", tint2: "var(--mist)",    weight: 2 },
      { kind: "ginkgo",   tint: "var(--peach)",    tint2: "var(--paper)",   weight: 2 },
      { kind: "grass",    tint: "var(--sage)",     tint2: "var(--mist)",    weight: 2 },
    ],
    density: 150, intensity: 0.92, ink: "oklch(0.40 0.08 60)",
  },
  {
    id: "leon", name: "Léon", kind: "animal",
    d: "M22,180 C 64,158 134,164 138,214 C 142,266 78,272 42,250 C 8,232 4,202 22,180 Z",
    cx: 78, cy: 214,
    blooms: [
      { kind: "moss",     tint: "var(--sage)",     tint2: "var(--mist)",    weight: 4 },
      { kind: "fern",     tint: "var(--sage)",     tint2: "var(--mist)",    weight: 3 },
      { kind: "pebble",   tint: "var(--clay)",     tint2: "var(--paper)",   weight: 2 },
      { kind: "daisy",    tint: "var(--paper)",    tint2: "var(--peach)",   weight: 2 },
      { kind: "leaf",     tint: "var(--sage)",     tint2: "var(--mist)",    weight: 2 },
    ],
    density: 170, intensity: 0.96, ink: "oklch(0.34 0.10 145)",
  },
  {
    id: "mamie", name: "Mamie", kind: "person",
    d: "M168,202 C 248,180 296,214 282,266 C 268,308 218,308 184,284 C 152,262 142,222 168,202 Z",
    cx: 222, cy: 246,
    blooms: [
      { kind: "iris",     tint: "var(--lavender)", tint2: "var(--mist)",    weight: 3 },
      { kind: "anemone",  tint: "var(--lavender)", tint2: "var(--rose)",    weight: 3 },
      { kind: "ginkgo",   tint: "var(--peach)",    tint2: "var(--paper)",   weight: 2 },
      { kind: "leaf",     tint: "var(--sage)",     tint2: "var(--mist)",    weight: 2 },
      { kind: "iris",     tint: "var(--lavender)", tint2: "var(--paper)",   weight: 1 },
    ],
    density: 160, intensity: 0.88, ink: "oklch(0.40 0.10 290)",
  },
  {
    id: "theo", name: "Théo", kind: "person",
    d: "M64,308 C 130,284 206,298 238,332 C 268,366 222,398 158,386 C 92,374 50,362 64,308 Z",
    cx: 152, cy: 348,
    blooms: [
      { kind: "shell",    tint: "var(--clay)",     tint2: "var(--peach)",   weight: 3 },
      { kind: "pearl",    tint: "var(--paper)",    tint2: "var(--mist)",    weight: 2 },
      { kind: "spiral",   tint: "var(--peach)",    tint2: "var(--rose)",    weight: 2 },
      { kind: "starfish", tint: "var(--peach)",    tint2: "var(--rose)",    weight: 2 },
      { kind: "coral",    tint: "var(--clay)",     tint2: "var(--rose)",    weight: 2 },
    ],
    density: 170, intensity: 1, ink: "oklch(0.42 0.10 30)",
  },
];

/* deterministic pseudo-random in [0,1) */
function rand(seed: number) { return ((Math.sin(seed) + 1) / 2); }

function bbox(d: string) {
  const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
  let mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
  for (let k = 0; k < nums.length; k += 2) {
    mnx = Math.min(mnx, nums[k]); mxx = Math.max(mxx, nums[k]);
    mny = Math.min(mny, nums[k + 1]); mxy = Math.max(mxy, nums[k + 1]);
  }
  return { mnx, mny, mxx, mxy };
}

/** pictorial brush touches (larger flower/leaf shapes) */
function picturalBlooms(p: Being, count: number) {
  const { mnx, mny, mxx, mxy } = bbox(p.d);
  const w = mxx - mnx, h = mxy - mny;
  const total = p.blooms.reduce((s, b) => s + b.weight, 0);
  const out: { x: number; y: number; size: number; rot: number; bloom: Bloom }[] = [];
  for (let i = 0; i < count; i++) {
    const seed = (p.id.charCodeAt(0) + i) * 11.3;
    const x = mnx + rand(seed) * w;
    const y = mny + rand(seed * 1.7 + 3) * h;
    let r = rand(seed * 2.3) * total, picked = p.blooms[0];
    for (const b of p.blooms) { if ((r -= b.weight) <= 0) { picked = b; break; } }
    const size = 16 + rand(seed * 3.1) * 18;
    const rot = rand(seed * 4.7) * 80 - 40;
    out.push({ x, y, size, rot, bloom: picked });
  }
  return out;
}

/** dense pointillé dots (Kusama-like) */
function stippleDots(p: Being) {
  const { mnx, mny, mxx, mxy } = bbox(p.d);
  const w = mxx - mnx, h = mxy - mny;
  const dots: { x: number; y: number; r: number; tint: string; opacity: number }[] = [];
  for (let i = 0; i < p.density; i++) {
    const seed = (p.id.charCodeAt(0) + i) * 5.3;
    const x = mnx + rand(seed) * w;
    const y = mny + rand(seed * 2.1 + 1) * h;
    const bloom = p.blooms[i % p.blooms.length];
    const r = 0.7 + rand(seed * 3.9) * 1.8;
    dots.push({
      x, y, r,
      tint: i % 3 === 0 ? bloom.tint2 : bloom.tint,
      opacity: 0.55 + rand(seed * 7) * 0.4,
    });
  }
  return dots;
}

function Garden() {
  const { mode, lostName, t, lang } = useLegato();

  return (
    <Shell>
      <div className="relative pb-10">
        <Halos mode={mode} variant="calm" />

        <div className="relative z-10">
          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.24em] text-dusk/45">
              {t("garden.belong")} · <span className="not-italic">{lostName}</span>
            </p>
            <h1 className="mt-3 font-serif text-[2.2rem] leading-[1.05] font-light text-dusk text-balance">
              {lang === "fr" ? (
                <>Un paysage <span className="italic">qui se souvient.</span></>
              ) : (
                <>A landscape that <span className="italic">remembers.</span></>
              )}
            </h1>
            <p className="mt-4 max-w-[32ch] text-[13.5px] leading-relaxed text-dusk/60">
              {lang === "fr"
                ? "Chaque parcelle appartient à un être. Touchez-en une pour entrer dans son jardin."
                : "Each plot belongs to a being. Touch one to enter their garden."}
            </p>
          </header>

          {/* The painted garden, viewed from above */}
          <div className="px-5 mt-9">
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "3 / 4",
                borderRadius: 36,
                background:
                  "radial-gradient(ellipse at 50% 20%, oklch(0.94 0.025 80) 0%, oklch(0.86 0.04 60) 60%, oklch(0.74 0.05 50) 100%)",
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.6), 0 24px 60px -28px rgba(60,40,40,0.35)",
                border: "1px solid color-mix(in oklab, var(--dusk) 10%, transparent)",
              }}
            >
              {/* paper grain */}
              <div
                className="absolute inset-0 mix-blend-multiply opacity-[0.18] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(80,50,30,0.22), transparent 40%)," +
                    "radial-gradient(circle at 80% 70%, rgba(60,40,30,0.18), transparent 50%)",
                }}
              />

              <svg
                viewBox="0 0 300 400"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  <linearGradient id="sand" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.93 0.03 70)" />
                    <stop offset="100%" stopColor="oklch(0.86 0.04 60)" />
                  </linearGradient>
                  <linearGradient id="sand-edge" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.06 50)" />
                    <stop offset="100%" stopColor="oklch(0.55 0.05 45)" />
                  </linearGradient>
                  <filter id="feather" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" />
                  </filter>
                  <filter id="grain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
                    <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" />
                  </filter>
                  {BEINGS.map((p) => (
                    <clipPath key={`c-${p.id}`} id={`clip-${p.id}`}>
                      <path d={p.d} />
                    </clipPath>
                  ))}
                </defs>

                {/* meandering sandy paths — wider, with dark edges */}
                <g fill="none" strokeLinecap="round">
                  <path
                    d="M150,-10 C 162,60 110,108 152,170 S 196,260 148,330 C 128,360 152,400 152,420"
                    stroke="url(#sand-edge)" strokeWidth="40" opacity="0.55"
                  />
                  <path
                    d="M150,-10 C 162,60 110,108 152,170 S 196,260 148,330 C 128,360 152,400 152,420"
                    stroke="url(#sand)" strokeWidth="32"
                  />
                  <path
                    d="M-10,210 C 80,222 130,200 184,222 S 264,252 320,232"
                    stroke="url(#sand-edge)" strokeWidth="26" opacity="0.45"
                  />
                  <path
                    d="M-10,210 C 80,222 130,200 184,222 S 264,252 320,232"
                    stroke="url(#sand)" strokeWidth="20"
                  />
                </g>

                {/* path inner ribbon */}
                <g stroke="oklch(0.97 0.012 60)" fill="none" strokeLinecap="round" opacity="0.7">
                  <path d="M150,-10 C 162,60 110,108 152,170 S 196,260 148,330 C 128,360 152,400 152,420" strokeWidth="14" />
                </g>

                {/* path edge stitches */}
                <g stroke="oklch(0.55 0.05 50)" fill="none" strokeWidth="0.8" strokeDasharray="1 5" opacity="0.55">
                  <path d="M150,-10 C 162,60 110,108 152,170 S 196,260 148,330 C 128,360 152,400 152,420" />
                </g>

                {/* parterre soils — darker, two layered washes for depth */}
                {BEINGS.map((p) => (
                  <g key={`g-${p.id}`}>
                    {/* shadow under the bed */}
                    <path
                      d={p.d}
                      fill={`color-mix(in oklab, ${p.ink} 60%, var(--paper))`}
                      opacity="0.18"
                      transform="translate(2 4)"
                      filter="url(#feather)"
                    />
                    {/* deep wash */}
                    <path
                      d={p.d}
                      fill={`color-mix(in oklab, ${p.blooms[0].tint} 92%, ${p.ink})`}
                      opacity={(0.5 + p.intensity * 0.35).toFixed(2)}
                      filter="url(#feather)"
                    />
                    {/* mid wash */}
                    <path
                      d={p.d}
                      fill={`color-mix(in oklab, ${p.blooms[0].tint} 85%, var(--paper))`}
                      opacity={(0.7 + p.intensity * 0.25).toFixed(2)}
                    />
                    {/* hand-drawn ink contour */}
                    <path
                      d={p.d}
                      fill="none"
                      stroke={p.ink}
                      strokeWidth="0.8"
                      strokeDasharray="2 3"
                      opacity="0.55"
                    />
                  </g>
                ))}

                {/* pointillé layer — Kusama-like dense dots, clipped to each bed */}
                {BEINGS.map((p) => (
                  <g key={`stipple-${p.id}`} clipPath={`url(#clip-${p.id})`}>
                    {stippleDots(p).map((d, i) => (
                      <circle
                        key={i}
                        cx={d.x} cy={d.y} r={d.r}
                        fill={d.tint}
                        opacity={d.opacity.toFixed(2)}
                      />
                    ))}
                  </g>
                ))}

                {/* pictorial brush touches — flower/leaf glyphs */}
                {BEINGS.map((p) => (
                  <g
                    key={`blooms-${p.id}`}
                    clipPath={`url(#clip-${p.id})`}
                    opacity={(0.85 + p.intensity * 0.15).toFixed(2)}
                  >
                    {picturalBlooms(p, 14).map((b, i) => (
                      <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.rot}) scale(${b.size / 100})`}>
                        <g transform="translate(-50 -50)">
                          <foreignObject x="0" y="0" width="100" height="100">
                            <OrganicShape kind={b.bloom.kind} size={100} tint={b.bloom.tint} tint2={b.bloom.tint2} />
                          </foreignObject>
                        </g>
                      </g>
                    ))}
                  </g>
                ))}

                {/* a few stepping stones, sparse */}
                {[
                  { cx: 152, cy: 30 }, { cx: 130, cy: 100 }, { cx: 156, cy: 178 },
                  { cx: 184, cy: 248 }, { cx: 144, cy: 322 }, { cx: 152, cy: 388 },
                ].map((s, i) => (
                  <g key={i}>
                    <ellipse cx={s.cx + 1} cy={s.cy + 1.5} rx="9" ry="6.5" fill="rgba(60,40,40,0.18)" />
                    <ellipse cx={s.cx} cy={s.cy} rx="9" ry="6.5" fill="oklch(0.96 0.012 70)" stroke="oklch(0.6 0.04 50)" strokeWidth="0.5" />
                  </g>
                ))}
              </svg>

              {/* "vous êtes ici" — small ink mark at the entrance */}
              <div className="absolute -translate-x-1/2 z-10" style={{ top: "3.5%", left: "50%" }}>
                <div className="size-1.5 rounded-full bg-dusk/55 breath" />
              </div>

              {/* Each parterre — clickable bed-shaped tap target with hover hint */}
              {BEINGS.map((p) => (
                <Link
                  key={p.id}
                  to="/garden/$zone"
                  params={{ zone: p.id }}
                  aria-label={`${lang === "fr" ? "Entrer dans le jardin de" : "Enter the garden of"} ${p.name}`}
                  className="absolute inset-0 group focus:outline-none cursor-pointer"
                  style={{ touchAction: "manipulation" }}
                >
                  <svg
                    viewBox="0 0 300 400"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                  >
                    {/* invisible tap area */}
                    <path d={p.d} fill="transparent" />
                    {/* hover halo — soft inner glow only on hover/focus */}
                    <path
                      d={p.d}
                      fill="white"
                      className="opacity-0 group-hover:opacity-25 group-focus:opacity-25 transition-opacity duration-500"
                      style={{ mixBlendMode: "overlay" as const }}
                    />
                    {/* hover outline — fine ink stroke that brightens */}
                    <path
                      d={p.d}
                      fill="none"
                      stroke={p.ink}
                      strokeWidth="1.4"
                      className="opacity-0 group-hover:opacity-80 group-focus:opacity-80 transition-opacity duration-500"
                    />
                  </svg>

                  {/* discrete italic "entrer ↗" hint that fades in on hover, centered on bed */}
                  <span
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none
                               opacity-0 group-hover:opacity-100 group-focus:opacity-100
                               transition-all duration-500 ease-out
                               translate-y-1 group-hover:translate-y-0"
                    style={{
                      left: `${(p.cx / 300) * 100}%`,
                      top: `${(p.cy / 400) * 100}%`,
                    }}
                  >
                    <span
                      className="font-serif italic text-[12px] tracking-wide px-2.5 py-1 rounded-full"
                      style={{
                        color: "var(--paper)",
                        background: "color-mix(in oklab, var(--ink) 78%, transparent)",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      {lang === "fr" ? "entrer" : "enter"}
                      <span className="ml-1 not-italic">↗</span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            <p className="mt-4 px-2 text-center text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              {lang === "fr"
                ? "touchez une parcelle pour entrer · "
                : "touch a plot to enter · "}
              {BEINGS.length}
            </p>
          </div>

          <div className="px-7 mt-9">
            <Link
              to="/garden/$zone"
              params={{ zone: BEINGS[0].id }}
              className="ceramic organic-radius-3 block px-7 py-5 text-center"
            >
              <span className="block font-serif text-xl italic text-dusk">
                {t("garden.plant")}
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-dusk/50">
                {t("garden.plantSub")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
