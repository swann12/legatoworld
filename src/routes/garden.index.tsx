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
 * Each "patch" is a soft area of the garden. No abstract labels in the field —
 * the patches are recognisable by their plants, position, and shape.
 * Names are floated below in a small legend / appear on hover.
 */
type Patch = {
  id: string;
  name: { fr: string; en: string };
  count: number;
  family: { kind: ShapeKind; n: number; tint: string; tint2: string }[];
  x: number; y: number; w: number; h: number;
  radius: string;
  ground: string;
};

const PATCHES: Patch[] = [
  {
    id: "voice",
    name: { fr: "Le bosquet des voix", en: "The grove of voices" },
    count: 2,
    family: [
      { kind: "rose",   n: 2, tint: "var(--rose)",   tint2: "var(--peach)" },
      { kind: "leaf",   n: 1, tint: "var(--sage)",   tint2: "var(--mist)" },
    ],
    x: 32, y: 20, w: 42, h: 24,
    radius: "62% 38% 58% 42% / 50% 60% 40% 50%",
    ground: "radial-gradient(ellipse at 35% 30%, color-mix(in oklab, var(--rose) 22%, var(--paper)) 0%, color-mix(in oklab, var(--paper) 92%, var(--clay)) 100%)",
  },
  {
    id: "photo",
    name: { fr: "La clairière de lumière", en: "The clearing of light" },
    count: 5,
    family: [
      { kind: "daisy", n: 2, tint: "var(--peach)", tint2: "var(--rose)" },
      { kind: "grass", n: 1, tint: "var(--sage)", tint2: "var(--mist)" },
    ],
    x: 70, y: 38, w: 36, h: 22,
    radius: "58% 42% 60% 40% / 56% 44% 56% 44%",
    ground: "radial-gradient(ellipse, color-mix(in oklab, var(--peach) 20%, var(--paper)), color-mix(in oklab, var(--paper) 90%, var(--clay)))",
  },
  {
    id: "sentence",
    name: { fr: "Les pierres aux phrases", en: "The stones of words" },
    count: 3,
    family: [
      { kind: "stone",  n: 1, tint: "var(--lavender)", tint2: "var(--mist)" },
      { kind: "pebble", n: 1, tint: "var(--clay)",     tint2: "var(--paper)" },
    ],
    x: 24, y: 54, w: 38, h: 22,
    radius: "50% 50% 60% 40% / 40% 60% 50% 50%",
    ground: "radial-gradient(ellipse, color-mix(in oklab, var(--lavender) 18%, var(--paper)), color-mix(in oklab, var(--paper) 92%, var(--clay)))",
  },
  {
    id: "habit",
    name: { fr: "Le sentier des gestes", en: "The path of gestures" },
    count: 1,
    family: [
      { kind: "fern",  n: 2, tint: "var(--sage)", tint2: "var(--mist)" },
    ],
    x: 68, y: 64, w: 32, h: 20,
    radius: "60% 40% 50% 50% / 60% 40% 60% 40%",
    ground: "radial-gradient(ellipse, color-mix(in oklab, var(--sage) 22%, var(--paper)), color-mix(in oklab, var(--paper) 90%, var(--clay)))",
  },
  {
    id: "object",
    name: { fr: "Le rivage des objets", en: "The shore of objects" },
    count: 2,
    family: [
      { kind: "shell",   n: 1, tint: "var(--clay)",  tint2: "var(--peach)" },
      { kind: "pearl",   n: 1, tint: "var(--paper)", tint2: "var(--clay)" },
    ],
    x: 30, y: 80, w: 34, h: 18,
    radius: "55% 45% 60% 40% / 50% 50% 50% 50%",
    ground: "radial-gradient(ellipse, color-mix(in oklab, var(--mist) 22%, var(--paper)), color-mix(in oklab, var(--paper) 92%, var(--clay)))",
  },
];

function Garden() {
  const { mode, lostName, t, lang } = useLegato();

  return (
    <Shell>
      <div className="relative pb-10">
        <Halos mode={mode} variant="calm" />

        <div className="relative z-10">
          {/* Header — clear ownership of the garden */}
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

          {/* The garden, seen from above */}
          <div className="px-5 mt-9">
            <div
              className="relative w-full paper-card overflow-hidden"
              style={{ aspectRatio: "3 / 4", borderRadius: 36 }}
            >
              {/* base ground — soft warm earth */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--paper) 96%, white) 0%, color-mix(in oklab, var(--clay) 30%, var(--paper)) 100%)",
                }}
              />

              {/* raked sand & winding stone path */}
              <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.6" />
                  </filter>
                </defs>
                {/* faint raked-sand contour lines, japonisant */}
                {Array.from({ length: 7 }).map((_, i) => {
                  const off = i * 14;
                  return (
                    <path
                      key={i}
                      d={`M0,${60 + off} C 90,${30 + off} 210,${110 + off} 300,${70 + off}`}
                      fill="none"
                      stroke="oklch(0.92 0.015 70)"
                      strokeWidth="0.6"
                      opacity={0.45 - i * 0.04}
                    />
                  );
                })}
                <path
                  d="M150,8 C 130,90 200,150 175,220 S 95,310 158,395"
                  fill="none" stroke="oklch(0.96 0.012 70)" strokeWidth="22"
                  strokeLinecap="round" opacity="0.85" filter="url(#soft)"
                />
                <path
                  d="M150,8 C 130,90 200,150 175,220 S 95,310 158,395"
                  fill="none" stroke="oklch(0.86 0.02 70)" strokeWidth="0.8"
                  strokeDasharray="1 7" strokeLinecap="round" opacity="0.4"
                />
              </svg>

              {/* a quiet pond */}
              <div
                className="absolute"
                style={{
                  top: "12%", left: "18%", width: "18%", height: "8%",
                  borderRadius: "60% 40% 55% 45%",
                  background: "radial-gradient(ellipse, oklch(0.95 0.025 225), oklch(0.9 0.035 230))",
                  opacity: 0.55,
                  boxShadow: "inset 0 2px 6px rgba(255,255,255,0.55)",
                }}
              />

              {/* patches with real plants drawn in */}
              {PATCHES.map((p) => (
                <Link
                  key={p.id}
                  to="/garden/$zone"
                  params={{ zone: p.id }}
                  className="absolute group"
                  style={{
                    top: `${p.y}%`, left: `${p.x}%`,
                    width: `${p.w}%`, height: `${p.h}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-label={`${p.name[lang]}, ${p.count} ${p.count > 1 ? "souvenirs" : "souvenir"}`}
                >
                  {/* the patch ground */}
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{
                      borderRadius: p.radius,
                      background: p.ground,
                      boxShadow:
                        "inset 0 1px 3px rgba(255,255,255,0.55), inset 0 -8px 18px color-mix(in oklab, var(--dusk) 7%, transparent), 0 10px 24px -18px rgba(60,40,40,0.18)",
                    }}
                  />
                  {/* sparse stipple — japonisant pointillism */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: p.radius }}>
                    {Array.from({ length: 26 }).map((_, i) => {
                      const seed = (p.id.charCodeAt(0) + i) * 7.3;
                      const x = 8 + ((seed * 17) % 84);
                      const y = 10 + ((seed * 11) % 80);
                      const sz = 2 + ((seed * 5) % 4);
                      const tint = i % 3 === 0 ? p.family[0].tint : i % 3 === 1 ? p.family[0].tint2 : "var(--sage)";
                      return (
                        <span
                          key={`d-${p.id}-${i}`}
                          className="absolute rounded-full"
                          style={{
                            top: `${y}%`, left: `${x}%`,
                            width: sz, height: sz,
                            background: tint, opacity: 0.55,
                            transform: "translate(-50%,-50%)",
                          }}
                        />
                      );
                    })}
                  </div>
                  {/* a few accent plants — sparse */}
                  <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: p.radius }}>
                    {p.family.flatMap((f) =>
                      Array.from({ length: f.n }).map((_, i) => {
                        const seed = (p.id.charCodeAt(0) + i + f.n) * 9.7;
                        const x = 25 + ((seed * 13) % 50);
                        const y = 28 + ((seed * 7) % 44);
                        const sz = 18 + ((seed * 3) % 10);
                        const rot = (seed * 11) % 30 - 15;
                        return (
                          <div
                            key={`${p.id}-${f.kind}-${i}`}
                            className="absolute sway"
                            style={{
                              top: `${y}%`, left: `${x}%`,
                              transform: `translate(-50%, -50%) rotate(${rot}deg)`,
                              animationDelay: `${(i % 5) * 0.7}s`,
                              opacity: 0.85,
                            }}
                          >
                            <OrganicShape kind={f.kind} size={sz} tint={f.tint} tint2={f.tint2} />
                          </div>
                        );
                      })
                    )}
                  </div>
                </Link>
              ))}

              {/* stepping stones along the path — japonisant */}
              {[
                { t: 14, l: 48 }, { t: 32, l: 56 }, { t: 50, l: 46 },
                { t: 68, l: 38 }, { t: 84, l: 50 },
              ].map((s, i) => (
                <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: `${s.t}%`, left: `${s.l}%`,
                    width: 14, height: 10,
                    borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
                    background: "color-mix(in oklab, var(--clay) 35%, var(--paper))",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.6), 0 1px 2px rgba(60,40,40,0.18)",
                    opacity: 0.85,
                  }}
                />
              ))}

              {/* "you are here" — small ink mark */}
              <div className="absolute -translate-x-1/2" style={{ top: "4%", left: "50%" }}>
                <div className="size-1.5 rounded-full bg-dusk/60 breath" />
              </div>
            </div>
          </div>

          {/* Legend — small and quiet, gives names without polluting the painting */}
          <div className="px-7 mt-5">
            <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
              {PATCHES.map((p) => (
                <Link
                  key={p.id}
                  to="/garden/$zone"
                  params={{ zone: p.id }}
                  className="flex items-baseline justify-between border-b border-dusk/10 pb-2 group"
                >
                  <span className="font-serif text-[13.5px] italic text-dusk/85 leading-tight">
                    {p.name[lang]}
                  </span>
                  <span className="text-[10px] tabular-nums text-dusk/45 group-hover:text-dusk transition-colors">
                    {p.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Single primary action — plant */}
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
