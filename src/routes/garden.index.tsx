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
 * Painted flower-bed garden: sandy winding paths, stepping stones,
 * and dense parterres of small blooms. Inspired by hand-drawn garden plans.
 */
type Bloom = { kind: ShapeKind; tint: string; tint2: string; weight: number };
/** A parterre = a single being (person or animal) the user remembers. */
export type Being = {
  id: string;                 // slug used as the route param
  name: string;               // displayed only in the small legend / detail page
  kind: "person" | "animal";
  d: string;                  // SVG path defining the bed shape (viewBox 0..300 / 0..400)
  markX: number; markY: number; // subtle "enter here" ink mark
  blooms: Bloom[];
  density: number;
  intensity: number;          // 0.55..1 — opacity contrast of the bed
};

/**
 * The five parterres of the garden — one per being.
 * IDs become the route slug used by /garden/$zone.
 */
export const BEINGS: Being[] = [
  {
    id: "elise", name: "Élise", kind: "person",
    d: "M40,40 C 30,90 80,140 95,95 C 130,60 170,30 150,82 C 138,122 80,142 42,122 Z",
    markX: 92, markY: 88,
    blooms: [
      { kind: "rose",     tint: "var(--rose)",   tint2: "var(--peach)", weight: 3 },
      { kind: "anemone",  tint: "var(--peach)",  tint2: "var(--rose)",  weight: 2 },
      { kind: "camellia", tint: "var(--rose)",   tint2: "var(--paper)", weight: 2 },
      { kind: "moss",     tint: "var(--sage)",   tint2: "var(--mist)",  weight: 1 },
    ],
    density: 28, intensity: 1,
  },
  {
    id: "papa", name: "Papa", kind: "person",
    d: "M180,40 C 252,28 294,70 282,124 C 278,162 228,172 208,142 C 178,112 158,80 180,40 Z",
    markX: 232, markY: 98,
    blooms: [
      { kind: "tulip",    tint: "var(--clay)",   tint2: "var(--peach)", weight: 3 },
      { kind: "magnolia", tint: "var(--paper)",  tint2: "var(--peach)", weight: 2 },
      { kind: "iris",     tint: "var(--lavender)", tint2: "var(--mist)", weight: 1 },
      { kind: "grass",    tint: "var(--sage)",   tint2: "var(--mist)",  weight: 1 },
    ],
    density: 22, intensity: 0.78,
  },
  {
    id: "leon", name: "Léon", kind: "animal",
    d: "M30,180 C 70,160 132,168 132,212 C 132,262 72,262 40,240 C 10,220 8,200 30,180 Z",
    markX: 78, markY: 214,
    blooms: [
      { kind: "moss",     tint: "var(--sage)",   tint2: "var(--mist)",   weight: 3 },
      { kind: "fern",     tint: "var(--sage)",   tint2: "var(--mist)",   weight: 2 },
      { kind: "pebble",   tint: "var(--clay)",   tint2: "var(--paper)",  weight: 1 },
      { kind: "daisy",    tint: "var(--paper)",  tint2: "var(--peach)",  weight: 1 },
    ],
    density: 24, intensity: 0.92,
  },
  {
    id: "mamie", name: "Mamie", kind: "person",
    d: "M170,200 C 244,180 292,212 280,262 C 268,302 220,302 188,280 C 158,260 148,220 170,200 Z",
    markX: 226, markY: 244,
    blooms: [
      { kind: "iris",     tint: "var(--lavender)", tint2: "var(--mist)",  weight: 3 },
      { kind: "ginkgo",   tint: "var(--peach)",    tint2: "var(--paper)", weight: 1 },
      { kind: "anemone",  tint: "var(--lavender)", tint2: "var(--rose)",  weight: 2 },
      { kind: "leaf",     tint: "var(--sage)",     tint2: "var(--mist)",  weight: 1 },
    ],
    density: 26, intensity: 0.7,
  },
  {
    id: "theo", name: "Théo", kind: "person",
    d: "M70,310 C 132,288 202,300 232,332 C 262,362 220,392 160,382 C 98,372 58,362 70,310 Z",
    markX: 152, markY: 348,
    blooms: [
      { kind: "shell",    tint: "var(--clay)",   tint2: "var(--peach)", weight: 2 },
      { kind: "pearl",    tint: "var(--paper)",  tint2: "var(--mist)",  weight: 2 },
      { kind: "spiral",   tint: "var(--peach)",  tint2: "var(--rose)",  weight: 2 },
      { kind: "starfish", tint: "var(--peach)",  tint2: "var(--rose)",  weight: 1 },
    ],
    density: 26, intensity: 1,
  },
];

/* deterministic pseudo-random */
function rand(seed: number) { return ((Math.sin(seed) + 1) / 2); }

/**
 * Sample N points roughly inside a rectangle that bounds the SVG path.
 * For a beautifully dense look without complex point-in-polygon code,
 * we let a per-patch <clipPath> handle clipping to the petal shape.
 */
function blooms(p: Being) {
  // crude bounding box from path "M x,y C ... " — extract numbers
  const nums = p.d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    minX = Math.min(minX, nums[i]); maxX = Math.max(maxX, nums[i]);
    minY = Math.min(minY, nums[i + 1]); maxY = Math.max(maxY, nums[i + 1]);
  }
  const w = maxX - minX, h = maxY - minY;
  const total = p.blooms.reduce((s, b) => s + b.weight, 0);
  const out: { x: number; y: number; size: number; rot: number; bloom: Bloom }[] = [];
  let i = 0;
  while (out.length < p.density && i < p.density * 10) {
    const seed = (p.id.charCodeAt(0) + i) * 7.7;
    const x = minX + rand(seed) * w;
    const y = minY + rand(seed * 1.7 + 3) * h;
    // pick a bloom by weight
    let r = rand(seed * 2.3) * total, picked = p.blooms[0];
    for (const b of p.blooms) { if ((r -= b.weight) <= 0) { picked = b; break; } }
    const size = 14 + rand(seed * 3.1) * 12;
    const rot = rand(seed * 4.7) * 60 - 30;
    out.push({ x, y, size, rot, bloom: picked });
    i++;
  }
  return out;
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
              {t("garden.subtitle")}
            </p>
          </header>

          {/* The painted garden, viewed from above — each parterre is a being */}
          <div className="px-5 mt-9">
            <div
              className="relative w-full paper-card overflow-hidden"
              style={{ aspectRatio: "3 / 4", borderRadius: 36 }}
            >
              {/* warm paper ground */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--paper) 98%, white) 0%, color-mix(in oklab, var(--clay) 38%, var(--paper)) 100%)",
                }}
              />

              <svg
                viewBox="0 0 300 400"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  {/* soft sandy path tone */}
                  <linearGradient id="sand" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.95 0.022 60)" />
                    <stop offset="100%" stopColor="oklch(0.92 0.028 55)" />
                  </linearGradient>
                  <filter id="feather" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                  {BEINGS.map((p) => (
                    <clipPath key={`c-${p.id}`} id={`clip-${p.id}`}>
                      <path d={p.d} />
                    </clipPath>
                  ))}
                </defs>

                {/* meandering sandy paths — wide soft strokes */}
                <g stroke="url(#sand)" fill="none" strokeLinecap="round" opacity="0.95">
                  <path d="M150,-10 C 160,60 110,110 150,170 S 200,260 150,330 C 130,360 150,400 150,420" strokeWidth="34" />
                  <path d="M-10,210 C 80,220 130,200 180,220 S 260,250 320,230" strokeWidth="22" opacity="0.7" />
                </g>

                {/* path inner ribbon (subtle) */}
                <g stroke="oklch(0.97 0.012 60)" fill="none" strokeLinecap="round" opacity="0.75">
                  <path d="M150,-10 C 160,60 110,110 150,170 S 200,260 150,330 C 130,360 150,400 150,420" strokeWidth="18" />
                </g>

                {/* path edge stitches */}
                <g stroke="oklch(0.84 0.03 60)" fill="none" strokeWidth="0.6" strokeDasharray="1 5" opacity="0.7">
                  <path d="M150,-10 C 160,60 110,110 150,170 S 200,260 150,330 C 130,360 150,400 150,420" />
                </g>

                {/* parterre soils — soft tinted washes with varied opacity */}
                {BEINGS.map((p) => (
                  <g key={`g-${p.id}`}>
                    <path
                      d={p.d}
                      fill={`color-mix(in oklab, ${p.blooms[0].tint} 42%, var(--paper))`}
                      opacity={(0.4 + p.intensity * 0.35).toFixed(2)}
                      filter="url(#feather)"
                    />
                    <path
                      d={p.d}
                      fill={`color-mix(in oklab, ${p.blooms[0].tint} 22%, var(--paper))`}
                      opacity={(0.55 + p.intensity * 0.35).toFixed(2)}
                    />
                  </g>
                ))}

                {/* stepping stones along the central path */}
                {[
                  { cx: 152, cy: 30 }, { cx: 138, cy: 70 }, { cx: 122, cy: 110 },
                  { cx: 132, cy: 150 }, { cx: 158, cy: 180 }, { cx: 178, cy: 215 },
                  { cx: 188, cy: 252 }, { cx: 168, cy: 285 }, { cx: 150, cy: 318 },
                  { cx: 138, cy: 350 }, { cx: 152, cy: 384 },
                ].map((s, i) => (
                  <g key={i}>
                    <ellipse cx={s.cx + 1} cy={s.cy + 1.5} rx="11" ry="8" fill="rgba(60,40,40,0.12)" />
                    <ellipse cx={s.cx} cy={s.cy} rx="11" ry="8" fill="oklch(0.96 0.012 70)" stroke="oklch(0.86 0.03 60)" strokeWidth="0.6" />
                  </g>
                ))}
              </svg>

              {/* Each parterre — dense painting of blooms + subtle ink mark only */}
              {BEINGS.map((p) => (
                <Link
                  key={p.id}
                  to="/garden/$zone"
                  params={{ zone: p.id }}
                  aria-label={`${lang === "fr" ? "Jardin de" : "Garden of"} ${p.name}`}
                  className="absolute inset-0 group block"
                  style={{ touchAction: "manipulation" }}
                >
                  <svg
                    viewBox="0 0 300 400"
                    className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.01]"
                    preserveAspectRatio="none"
                  >
                    <g clipPath={`url(#clip-${p.id})`}>
                      {/* soft stipple under the bed */}
                      {Array.from({ length: 60 }).map((_, i) => {
                        const seed = (p.id.charCodeAt(0) + i) * 5.3;
                        const nums = p.d.match(/-?\d+(\.\d+)?/g)!.map(Number);
                        let mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
                        for (let k = 0; k < nums.length; k += 2) {
                          mnx = Math.min(mnx, nums[k]); mxx = Math.max(mxx, nums[k]);
                          mny = Math.min(mny, nums[k + 1]); mxy = Math.max(mxy, nums[k + 1]);
                        }
                        const x = mnx + rand(seed) * (mxx - mnx);
                        const y = mny + rand(seed * 2.1 + 1) * (mxy - mny);
                        const tint = i % 2 === 0 ? p.blooms[0].tint : (p.blooms[1]?.tint ?? p.blooms[0].tint2);
                        return <circle key={i} cx={x} cy={y} r={0.8 + (i % 3) * 0.4} fill={tint} opacity={(0.35 + p.intensity * 0.4).toFixed(2)} />;
                      })}
                    </g>
                  </svg>

                  {/* blooms layered on top, also visually clipped by being placed inside a same-aspect SVG container */}
                  <div className="absolute inset-0" style={{ opacity: (0.7 + p.intensity * 0.3).toFixed(2) }}>
                    <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                      <g clipPath={`url(#clip-${p.id})`}>
                        {blooms(p).map((b, i) => (
                          <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.rot}) scale(${b.size / 100})`}>
                            <g transform="translate(-50 -50)">
                              <foreignObject x="0" y="0" width="100" height="100">
                                <OrganicShape kind={b.bloom.kind} size={100} tint={b.bloom.tint} tint2={b.bloom.tint2} />
                              </foreignObject>
                            </g>
                          </g>
                        ))}
                      </g>
                    </svg>
                  </div>

                  {/* Subtle "enter here" ink mark — no text on the plan */}
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: `${(p.markX / 300) * 100}%`, top: `${(p.markY / 400) * 100}%` }}
                  >
                    <div className="relative">
                      <div
                        className="absolute inset-0 rounded-full breath"
                        style={{
                          width: 22, height: 22, transform: "translate(-11px,-11px)",
                          background: "radial-gradient(circle, color-mix(in oklab, var(--paper) 70%, transparent) 0%, transparent 70%)",
                        }}
                      />
                      <div
                        className="rounded-full"
                        style={{
                          width: 5, height: 5,
                          background: "var(--ink)",
                          opacity: 0.55,
                          boxShadow: "0 0 0 3px color-mix(in oklab, var(--paper) 60%, transparent)",
                        }}
                      />
                    </div>
                  </div>
                </Link>
              ))}

              {/* "vous êtes ici" — small ink mark at the entrance */}
              <div className="absolute -translate-x-1/2" style={{ top: "3.5%", left: "50%" }}>
                <div className="size-1.5 rounded-full bg-dusk/55 breath" />
              </div>
            </div>
          </div>

          {/* Quiet legend below — the beings, names only */}
          <div className="px-7 mt-6">
            <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
              {BEINGS.map((p) => (
                <Link
                  key={p.id}
                  to="/garden/$zone"
                  params={{ zone: p.id }}
                  className="border-b border-dusk/10 pb-2 group"
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-serif text-[14px] italic text-dusk/85 leading-tight group-hover:text-dusk transition-colors">
                      {p.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.22em] text-dusk/40">
                      {p.kind === "person"
                        ? (lang === "fr" ? "personne" : "person")
                        : (lang === "fr" ? "animal" : "animal")}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
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
