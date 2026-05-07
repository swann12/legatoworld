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
      { kind: "rose",   n: 4, tint: "var(--rose)",   tint2: "var(--peach)" },
      { kind: "leaf",   n: 3, tint: "var(--sage)",   tint2: "var(--mist)" },
    ],
    x: 30, y: 22, w: 46, h: 28,
    radius: "62% 38% 58% 42% / 50% 60% 40% 50%",
    ground: "radial-gradient(ellipse at 35% 30%, color-mix(in oklab, var(--rose) 40%, var(--paper)) 0%, color-mix(in oklab, var(--clay) 70%, var(--paper)) 100%)",
  },
  {
    id: "photo",
    name: { fr: "La clairière de lumière", en: "The clearing of light" },
    count: 5,
    family: [
      { kind: "daisy", n: 5, tint: "var(--peach)", tint2: "var(--rose)" },
      { kind: "grass", n: 2, tint: "var(--sage)", tint2: "var(--mist)" },
    ],
    x: 64, y: 40, w: 38, h: 26,
    radius: "58% 42% 60% 40% / 56% 44% 56% 44%",
    ground: "radial-gradient(ellipse, color-mix(in oklab, var(--peach) 35%, var(--paper)), color-mix(in oklab, var(--clay) 70%, var(--paper)))",
  },
  {
    id: "sentence",
    name: { fr: "Les pierres aux phrases", en: "The stones of words" },
    count: 3,
    family: [
      { kind: "stone",  n: 2, tint: "var(--lavender)", tint2: "var(--mist)" },
      { kind: "pebble", n: 2, tint: "var(--clay)",     tint2: "var(--paper)" },
      { kind: "moss",   n: 1, tint: "var(--sage)",     tint2: "var(--mist)" },
    ],
    x: 22, y: 56, w: 40, h: 24,
    radius: "50% 50% 60% 40% / 40% 60% 50% 50%",
    ground: "radial-gradient(ellipse, color-mix(in oklab, var(--lavender) 30%, var(--paper)), color-mix(in oklab, var(--clay) 60%, var(--paper)))",
  },
  {
    id: "habit",
    name: { fr: "Le sentier des gestes", en: "The path of gestures" },
    count: 1,
    family: [
      { kind: "fern",  n: 3, tint: "var(--sage)", tint2: "var(--mist)" },
      { kind: "moss",  n: 2, tint: "var(--sage)", tint2: "var(--mist)" },
    ],
    x: 64, y: 66, w: 34, h: 22,
    radius: "60% 40% 50% 50% / 60% 40% 60% 40%",
    ground: "radial-gradient(ellipse, color-mix(in oklab, var(--sage) 35%, var(--paper)), color-mix(in oklab, var(--clay) 60%, var(--paper)))",
  },
  {
    id: "object",
    name: { fr: "Le rivage des objets", en: "The shore of objects" },
    count: 2,
    family: [
      { kind: "shell",   n: 2, tint: "var(--clay)",  tint2: "var(--peach)" },
      { kind: "spiral",  n: 1, tint: "var(--peach)", tint2: "var(--rose)" },
      { kind: "pearl",   n: 2, tint: "var(--paper)", tint2: "var(--clay)" },
    ],
    x: 30, y: 80, w: 32, h: 18,
    radius: "55% 45% 60% 40% / 50% 50% 50% 50%",
    ground: "radial-gradient(ellipse, color-mix(in oklab, var(--mist) 30%, var(--paper)), color-mix(in oklab, var(--clay) 60%, var(--paper)))",
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
                    "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--paper) 92%, white) 0%, color-mix(in oklab, var(--clay) 60%, var(--paper)) 100%)",
                }}
              />

              {/* organic, winding stone path */}
              <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.2" />
                  </filter>
                </defs>
                <path
                  d="M150,4 C 110,80 220,140 180,210 S 80,300 160,398"
                  fill="none" stroke="oklch(0.94 0.018 70)" strokeWidth="26"
                  strokeLinecap="round" opacity="0.75" filter="url(#soft)"
                />
                <path
                  d="M150,4 C 110,80 220,140 180,210 S 80,300 160,398"
                  fill="none" stroke="oklch(0.99 0.01 70)" strokeWidth="2"
                  strokeDasharray="1 9" strokeLinecap="round" opacity="0.55"
                />
              </svg>

              {/* a quiet pond */}
              <div
                className="absolute"
                style={{
                  top: "10%", left: "70%", width: "22%", height: "9%",
                  borderRadius: "60% 40% 55% 45%",
                  background: "radial-gradient(ellipse, oklch(0.93 0.04 230), oklch(0.88 0.05 235))",
                  opacity: 0.7,
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
                        "inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -10px 22px color-mix(in oklab, var(--dusk) 12%, transparent), 0 14px 30px -16px rgba(60,40,40,0.25)",
                    }}
                  />
                  {/* plants scattered */}
                  <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: p.radius }}>
                    {p.family.flatMap((f) =>
                      Array.from({ length: f.n }).map((_, i) => {
                        const seed = (p.id.charCodeAt(0) + i + f.n) * 9.7;
                        const x = 15 + ((seed * 13) % 70);
                        const y = 20 + ((seed * 7) % 60);
                        const sz = 24 + ((seed * 3) % 18);
                        const rot = (seed * 11) % 60 - 30;
                        return (
                          <div
                            key={`${p.id}-${f.kind}-${i}`}
                            className="absolute sway"
                            style={{
                              top: `${y}%`, left: `${x}%`,
                              transform: `translate(-50%, -50%) rotate(${rot}deg)`,
                              animationDelay: `${(i % 5) * 0.7}s`,
                            }}
                          >
                            <OrganicShape kind={f.kind} size={sz} tint={f.tint} tint2={f.tint2} />
                          </div>
                        );
                      })
                    )}
                  </div>
                  {/* count pip — bottom right */}
                  <div className="absolute bottom-1 right-2 size-5 rounded-full bg-paper/90 flex items-center justify-center text-[10px] font-medium text-dusk/70 shadow-sm">
                    {p.count}
                  </div>
                </Link>
              ))}

              {/* "you are here" */}
              <div className="absolute -translate-x-1/2" style={{ top: "3%", left: "50%" }}>
                <div className="size-2.5 rounded-full bg-dusk/70 breath" />
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
