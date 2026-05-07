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
  { id: "elise", name: "Élise", kind: "person", cx: 20, cy: 20, rx: 18, ry: 16,
    blooms: [{ tint: "var(--rose)", tint2: "var(--peach)" }, { tint: "var(--peach)", tint2: "var(--rose)" }] },
  { id: "papa",  name: "Papa",  kind: "person", cx: 78, cy: 20, rx: 20, ry: 16,
    blooms: [{ tint: "var(--clay)", tint2: "var(--peach)" }, { tint: "var(--lavender)", tint2: "var(--mist)" }] },
  { id: "leon",  name: "Léon",  kind: "animal", cx: 18, cy: 58, rx: 18, ry: 16,
    blooms: [{ tint: "var(--lavender)", tint2: "var(--mist)" }, { tint: "var(--sage)", tint2: "var(--paper)" }] },
  { id: "mamie", name: "Mamie", kind: "person", cx: 80, cy: 60, rx: 18, ry: 16,
    blooms: [{ tint: "var(--rose)", tint2: "var(--peach)" }, { tint: "var(--peach)", tint2: "var(--paper)" }] },
  { id: "theo",  name: "Théo",  kind: "person", cx: 50, cy: 84, rx: 22, ry: 12,
    blooms: [{ tint: "var(--sage)", tint2: "var(--clay)" }, { tint: "var(--peach)", tint2: "var(--rose)" }] },
];

function Garden() {
  const { mode, lostName, t, lang } = useLegato();
  const [hovered, setHovered] = useState<string | null>(null);
  const activeBeing = BEINGS.find((b) => b.id === hovered) ?? null;

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
                ? "Une peinture vivante. Effleurez une floraison pour entrer dans le jardin de l'être qui l'habite."
                : "A living painting. Brush a bloom to enter the garden of the being who dwells there."}
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

              {/* Soft cream veil — softens edges so nothing feels framed */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(255,248,232,0.55) 100%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(255,248,232,0.22), transparent 75%)",
                }}
              />

              {/* Invisible hotspots — only a soft inner luminescence on hover, never a frame */}
              {BEINGS.map((p) => (
                <Link
                  key={p.id}
                  to="/garden/$zone"
                  params={{ zone: p.id }}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered((h) => (h === p.id ? null : h))}
                  onFocus={() => setHovered(p.id)}
                  onBlur={() => setHovered((h) => (h === p.id ? null : h))}
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
                    className="absolute inset-[-30%] rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-1000"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(255,242,215,0.55), transparent 72%)",
                      mixBlendMode: "soft-light",
                      filter: "blur(8px)",
                    }}
                  />
                </Link>
              ))}
            </div>

            {/* Discreet, subtle indication of which being a bloom belongs to */}
            <div className="mt-5 h-6 px-2 text-center">
              <p
                key={activeBeing?.id ?? "idle"}
                className="text-[11px] italic text-dusk/55 transition-opacity duration-500"
                style={{ opacity: activeBeing ? 1 : 0.5 }}
              >
                {activeBeing
                  ? lang === "fr"
                    ? `ce jardin appartient à ${activeBeing.name}`
                    : `this garden belongs to ${activeBeing.name}`
                  : lang === "fr"
                    ? "effleurez une floraison"
                    : "brush a bloom"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
