import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import gardenPainted from "@/assets/garden-painted.jpg";

export const Route = createFileRoute("/garden/")({
  head: () => ({
    meta: [
      { title: "Le Jardin — Legato" },
      { name: "description", content: "Une promenade calme dans un paysage intérieur." },
    ],
  }),
  component: Garden,
});

type Being = {
  id: string;
  name: string;
  /** clickable elliptical hotspot, % of container */
  cx: number; cy: number; rx: number; ry: number;
};

/** Positions calibrated to the painted garden image (5 main beds). */
const BEINGS: Being[] = [
  { id: "elise", name: "Élise", cx: 24, cy: 22, rx: 19, ry: 14 },
  { id: "papa",  name: "Papa",  cx: 74, cy: 22, rx: 19, ry: 14 },
  { id: "leon",  name: "Léon",  cx: 22, cy: 55, rx: 19, ry: 13 },
  { id: "mamie", name: "Mamie", cx: 78, cy: 55, rx: 19, ry: 13 },
  { id: "theo",  name: "Théo",  cx: 50, cy: 80, rx: 22, ry: 13 },
];

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
                aspectRatio: "1 / 1",
                borderRadius: 32,
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.5), 0 28px 60px -28px rgba(60,40,40,0.45)",
                border: "1px solid color-mix(in oklab, var(--dusk) 14%, transparent)",
              }}
            >
              {/* The painted garden image as the actual scene */}
              <img
                src={gardenPainted}
                alt=""
                width={1024}
                height={1024}
                className="absolute inset-0 w-full h-full object-cover select-none"
                draggable={false}
              />

              {/* Subtle warm vignette to anchor the composition */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(60,30,20,0.28) 100%)",
                }}
              />

              {/* Clickable parterres — invisible hotspots, cursor-pointer, soft hover glow */}
              {BEINGS.map((p) => (
                <Link
                  key={p.id}
                  to="/garden/$zone"
                  params={{ zone: p.id }}
                  aria-label={`${lang === "fr" ? "Entrer dans le jardin de" : "Enter the garden of"} ${p.name}`}
                  className="absolute group focus:outline-none cursor-pointer"
                  style={{
                    left: `${p.cx - p.rx}%`,
                    top: `${p.cy - p.ry}%`,
                    width: `${p.rx * 2}%`,
                    height: `${p.ry * 2}%`,
                    borderRadius: "50%",
                    touchAction: "manipulation",
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(255,245,225,0.35), transparent 70%)",
                      mixBlendMode: "soft-light",
                    }}
                  />
                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-70 group-focus:opacity-70 transition-opacity duration-500"
                    style={{
                      boxShadow: "inset 0 0 0 1px rgba(255,250,235,0.55)",
                    }}
                  />
                </Link>
              ))}
            </div>

            <p className="mt-4 px-2 text-center text-[11px] italic text-dusk/45">
              {lang === "fr" ? "touchez un parterre pour entrer" : "tap a flower bed to enter"}
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
