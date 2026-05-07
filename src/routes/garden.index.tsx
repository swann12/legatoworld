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
type Patch = {
  id: string;
  name: { fr: string; en: string };
  d: string;          // SVG path that defines the bed shape (in 0..300 / 0..400 viewBox)
  labelX: number; labelY: number;
  blooms: Bloom[];    // mix of species in this bed
  density: number;    // number of blooms drawn
};

const PATCHES: Patch[] = [
  {
    id: "voice",
    name: { fr: "Le bosquet des voix", en: "The grove of voices" },
    d: "M40,40 C 30,90 80,140 90,90 C 130,60 170,30 150,80 C 140,120 80,140 40,120 Z",
    labelX: 92, labelY: 80,
    blooms: [
      { kind: "rose",     tint: "var(--rose)",   tint2: "var(--peach)", weight: 3 },
      { kind: "anemone",  tint: "var(--peach)",  tint2: "var(--rose)",  weight: 2 },
      { kind: "camellia", tint: "var(--rose)",   tint2: "var(--paper)", weight: 2 },
      { kind: "moss",     tint: "var(--sage)",   tint2: "var(--mist)",  weight: 1 },
    ],
    density: 26,
  },
  {
    id: "photo",
    name: { fr: "La clairière de lumière", en: "The clearing of light" },
    d: "M180,40 C 250,30 290,70 280,120 C 280,160 230,170 210,140 C 180,110 160,80 180,40 Z",
    labelX: 230, labelY: 95,
    blooms: [
      { kind: "daisy",    tint: "var(--peach)",   tint2: "var(--paper)", weight: 3 },
      { kind: "tulip",    tint: "var(--peach)",   tint2: "var(--rose)",  weight: 2 },
      { kind: "magnolia", tint: "var(--paper)",   tint2: "var(--peach)", weight: 2 },
      { kind: "grass",    tint: "var(--sage)",    tint2: "var(--mist)",  weight: 1 },
    ],
    density: 24,
  },
  {
    id: "sentence",
    name: { fr: "Les pierres aux phrases", en: "The stones of words" },
    d: "M30,180 C 70,160 130,170 130,210 C 130,260 70,260 40,240 C 10,220 10,200 30,180 Z",
    labelX: 75, labelY: 215,
    blooms: [
      { kind: "iris",     tint: "var(--lavender)", tint2: "var(--mist)",  weight: 3 },
      { kind: "stone",    tint: "var(--clay)",     tint2: "var(--paper)", weight: 1 },
      { kind: "pebble",   tint: "var(--mist)",     tint2: "var(--paper)", weight: 1 },
      { kind: "moss",     tint: "var(--sage)",     tint2: "var(--mist)",  weight: 2 },
    ],
    density: 22,
  },
  {
    id: "habit",
    name: { fr: "Le sentier des gestes", en: "The path of gestures" },
    d: "M170,200 C 240,180 290,210 280,260 C 270,300 220,300 190,280 C 160,260 150,220 170,200 Z",
    labelX: 225, labelY: 245,
    blooms: [
      { kind: "fern",     tint: "var(--sage)",  tint2: "var(--mist)", weight: 3 },
      { kind: "ginkgo",   tint: "var(--peach)", tint2: "var(--paper)", weight: 1 },
      { kind: "leaf",     tint: "var(--sage)",  tint2: "var(--mist)", weight: 2 },
      { kind: "grass",    tint: "var(--sage)",  tint2: "var(--mist)", weight: 1 },
    ],
    density: 22,
  },
  {
    id: "object",
    name: { fr: "Le rivage des objets", en: "The shore of objects" },
    d: "M70,310 C 130,290 200,300 230,330 C 260,360 220,390 160,380 C 100,370 60,360 70,310 Z",
    labelX: 150, labelY: 350,
    blooms: [
      { kind: "shell",    tint: "var(--clay)",  tint2: "var(--peach)", weight: 2 },
      { kind: "pearl",    tint: "var(--paper)", tint2: "var(--mist)",  weight: 2 },
      { kind: "spiral",   tint: "var(--peach)", tint2: "var(--rose)",  weight: 1 },
      { kind: "starfish", tint: "var(--peach)", tint2: "var(--rose)",  weight: 1 },
    ],
    density: 24,
  },
];

/* deterministic pseudo-random */
function rand(seed: number) { return ((Math.sin(seed) + 1) / 2); }

/**
 * Sample N points roughly inside a rectangle that bounds the SVG path.
 * For a beautifully dense look without complex point-in-polygon code,
 * we let a per-patch <clipPath> handle clipping to the petal shape.
 */
function blooms(p: Patch) {
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

          {/* The painted garden, viewed from above */}
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
                    "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--paper) 96%, white) 0%, color-mix(in oklab, var(--clay) 28%, var(--paper)) 100%)",
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
                  {PATCHES.map((p) => (
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

                {/* parterre soils — soft tinted washes under each bed */}
                {PATCHES.map((p) => (
                  <g key={`g-${p.id}`}>
                    {/* diffuse halo extending beyond the bed */}
                    <path
                      d={p.d}
                      fill={`color-mix(in oklab, ${p.blooms[0].tint} 28%, var(--paper))`}
                      opacity="0.55"
                      filter="url(#feather)"
                    />
                    <path
                      d={p.d}
                      fill={`color-mix(in oklab, ${p.blooms[0].tint} 14%, var(--paper))`}
                      opacity="0.7"
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

              {/* Each parterre — clipped dense painting of blooms, then a label & a tap area */}
              {PATCHES.map((p) => (
                <Link
                  key={p.id}
                  to="/garden/$zone"
                  params={{ zone: p.id }}
                  aria-label={p.name[lang]}
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
                        return <circle key={i} cx={x} cy={y} r={0.8 + (i % 3) * 0.4} fill={tint} opacity="0.45" />;
                      })}
                    </g>
                  </svg>

                  {/* blooms layered on top, also visually clipped by being placed inside a same-aspect SVG container */}
                  <div className="absolute inset-0">
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

                  {/* italic name floating above the bed (no numbers) */}
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: `${(p.labelX / 300) * 100}%`, top: `${(p.labelY / 400) * 100}%` }}
                  >
                    <span
                      className="font-serif italic text-[12px] leading-tight text-dusk/85 px-2 py-0.5 rounded-full"
                      style={{ background: "color-mix(in oklab, var(--paper) 80%, transparent)" }}
                    >
                      {p.name[lang]}
                    </span>
                  </div>
                </Link>
              ))}

              {/* "vous êtes ici" — small ink mark at the entrance */}
              <div className="absolute -translate-x-1/2" style={{ top: "3.5%", left: "50%" }}>
                <div className="size-1.5 rounded-full bg-dusk/55 breath" />
              </div>
            </div>
          </div>

          {/* Quiet legend below — names only, no counts, no numbers */}
          <div className="px-7 mt-6">
            <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
              {PATCHES.map((p) => (
                <Link
                  key={p.id}
                  to="/garden/$zone"
                  params={{ zone: p.id }}
                  className="border-b border-dusk/10 pb-2 group"
                >
                  <span className="font-serif text-[13.5px] italic text-dusk/85 leading-tight group-hover:text-dusk transition-colors">
                    {p.name[lang]}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="px-7 mt-9">
            <Link
              to="/garden/$zone"
              params={{ zone: "voice" }}
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
