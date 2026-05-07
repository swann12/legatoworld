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
  kind: "person" | "animal";
  /** clickable elliptical hotspot, % of container */
  cx: number; cy: number; rx: number; ry: number;
  /** dominant color tints used by detail pages */
  blooms: { tint: string; tint2: string }[];
};

/** Positions calibrated to the painted garden image (5 main beds). */
export const BEINGS: Being[] = [
  { id: "elise", name: "Élise", kind: "person", cx: 22, cy: 22, rx: 20, ry: 16,
    blooms: [{ tint: "var(--rose)", tint2: "var(--peach)" }, { tint: "var(--peach)", tint2: "var(--rose)" }] },
  { id: "papa",  name: "Papa",  kind: "person", cx: 78, cy: 22, rx: 20, ry: 16,
    blooms: [{ tint: "var(--clay)", tint2: "var(--peach)" }, { tint: "var(--lavender)", tint2: "var(--mist)" }] },
  { id: "leon",  name: "Léon",  kind: "animal", cx: 22, cy: 58, rx: 20, ry: 15,
    blooms: [{ tint: "var(--lavender)", tint2: "var(--mist)" }, { tint: "var(--sage)", tint2: "var(--paper)" }] },
  { id: "mamie", name: "Mamie", kind: "person", cx: 80, cy: 56, rx: 18, ry: 15,
    blooms: [{ tint: "var(--rose)", tint2: "var(--peach)" }, { tint: "var(--peach)", tint2: "var(--paper)" }] },
  { id: "theo",  name: "Théo",  kind: "person", cx: 50, cy: 84, rx: 26, ry: 14,
    blooms: [{ tint: "var(--sage)", tint2: "var(--clay)" }, { tint: "var(--peach)", tint2: "var(--rose)" }] },
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
              style={{ aspectRatio: "1 / 1" }}
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

              {/* Subtle warm vignette + cream paper veil to soften */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(50,28,18,0.22) 100%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(255,248,232,0.18), transparent 70%)",
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
                  {/* warm breath of light on hover — no frame, just luminescence */}
                  <span
                    className="absolute inset-[-10%] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-700"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(255,240,210,0.6), transparent 70%)",
                      mixBlendMode: "soft-light",
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
