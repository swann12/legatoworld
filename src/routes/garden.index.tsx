import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/garden/")({
  head: () => ({
    meta: [
      { title: "Le Jardin — Legato" },
      { name: "description", content: "Une vue de dessus, calme, du jardin intérieur." },
    ],
  }),
  component: Garden,
});

/**
 * Each "bed" is a parterre (a planted plot) seen from above.
 * Position is in % of the canvas. Shape is intentionally soft & irregular.
 */
const BEDS = [
  {
    id: "voice",  name: "Voix",   count: 2,
    color: "var(--rose)",   color2: "var(--peach)",
    x: 28, y: 22, w: 44, h: 30, radius: "62% 38% 58% 42% / 50% 60% 40% 50%",
  },
  {
    id: "photo", name: "Lumière", count: 5,
    color: "var(--peach)", color2: "var(--rose)",
    x: 60, y: 38, w: 36, h: 26, radius: "58% 42% 60% 40% / 56% 44% 56% 44%",
  },
  {
    id: "sentence", name: "Phrases", count: 3,
    color: "var(--lavender)", color2: "var(--mist)",
    x: 22, y: 54, w: 38, h: 24, radius: "50% 50% 60% 40% / 40% 60% 50% 50%",
  },
  {
    id: "habit", name: "Gestes", count: 1,
    color: "var(--sage)", color2: "var(--mist)",
    x: 64, y: 64, w: 32, h: 22, radius: "60% 40% 50% 50% / 60% 40% 60% 40%",
  },
  {
    id: "object", name: "Objets", count: 2,
    color: "var(--clay)", color2: "var(--peach)",
    x: 28, y: 78, w: 30, h: 18, radius: "55% 45% 60% 40% / 50% 50% 50% 50%",
  },
];

function Garden() {
  const { mode, name } = useLegato();

  return (
    <Shell>
      <div className="relative pb-10">
        <Halos mode={mode} variant="calm" />

        <div className="relative z-10">
          {/* Header — single intention, lots of air */}
          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.24em] text-dusk/45">
              Le Jardin de {name}
            </p>
            <h1 className="mt-3 font-serif text-[2.2rem] leading-[1.05] font-light text-dusk text-balance">
              Vu d'en haut, <br />
              <span className="italic">tel qu'il pousse.</span>
            </h1>
            <p className="mt-4 max-w-[30ch] text-[13.5px] leading-relaxed text-dusk/60">
              Touchez un parterre pour entrer. Chaque zone garde une forme de souvenir.
            </p>
          </header>

          {/* The garden, seen from above */}
          <div className="px-5 mt-10">
            <div
              className="relative w-full paper-card overflow-hidden"
              style={{ aspectRatio: "3 / 4", borderRadius: 36 }}
            >
              {/* base ground */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--paper) 92%, white) 0%, color-mix(in oklab, var(--clay) 60%, var(--paper)) 100%)",
                }}
              />
              {/* faint stone path winding through */}
              <svg
                viewBox="0 0 300 400"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M150,8 C 130,80 200,140 170,200 S 100,280 140,360 L 160,400"
                  fill="none"
                  stroke="oklch(0.93 0.018 70)"
                  strokeWidth="22"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <path
                  d="M150,8 C 130,80 200,140 170,200 S 100,280 140,360 L 160,400"
                  fill="none"
                  stroke="oklch(0.99 0.01 70)"
                  strokeWidth="2"
                  strokeDasharray="1 8"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>

              {/* a quiet pond */}
              <div
                className="absolute"
                style={{
                  top: "12%", left: "62%", width: "22%", height: "10%",
                  borderRadius: "60% 40% 55% 45%",
                  background: "radial-gradient(ellipse, oklch(0.93 0.04 230), oklch(0.88 0.05 235))",
                  opacity: 0.7,
                }}
              />

              {/* parterres */}
              {BEDS.map((b) => (
                <Link
                  key={b.id}
                  to="/garden/$zone"
                  params={{ zone: b.id }}
                  className="absolute group"
                  style={{
                    top: `${b.y}%`,
                    left: `${b.x}%`,
                    width: `${b.w}%`,
                    height: `${b.h}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-label={`Parterre ${b.name}, ${b.count} souvenirs`}
                >
                  {/* the bed seen from above */}
                  <div
                    className="absolute inset-0 sway transition-transform duration-700 group-hover:scale-[1.03]"
                    style={{
                      borderRadius: b.radius,
                      background: `radial-gradient(ellipse at 35% 30%, ${b.color} 0%, ${b.color2} 65%, color-mix(in oklab, ${b.color2} 60%, var(--clay)) 100%)`,
                      boxShadow:
                        "inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -10px 22px color-mix(in oklab, var(--dusk) 14%, transparent), 0 14px 30px -16px rgba(60,40,40,0.25)",
                    }}
                  />
                  {/* tiny floating label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-serif text-[15px] italic text-dusk/85 leading-none">
                        {b.name}
                      </p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-dusk/50">
                        {b.count} {b.count > 1 ? "souvenirs" : "souvenir"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              {/* "you are here" */}
              <div
                className="absolute -translate-x-1/2"
                style={{ top: "4%", left: "50%" }}
              >
                <div className="size-2.5 rounded-full bg-dusk/70 breath" />
              </div>
            </div>
          </div>

          {/* Single primary action — plant */}
          <div className="px-7 mt-8">
            <Link
              to="/garden/$zone"
              params={{ zone: "voice" }}
              className="ceramic organic-radius-3 block px-7 py-5 text-center"
            >
              <span className="block font-serif text-xl italic text-dusk">
                Planter une nouvelle trace
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-dusk/50">
                voix · note · photo · vidéo
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}