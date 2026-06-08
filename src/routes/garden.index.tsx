import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import gardenPainted from "@/assets/garden-painted-v4.png";

export const Route = createFileRoute("/garden/")({
  head: () => ({
    meta: [
      { title: "Le Jardin — Legato" },
      { name: "description", content: "Une promenade calme dans un paysage intérieur." },
    ],
  }),
  component: Garden,
});

export type Being = {
  id: string;
  name: string;
  kind: "person" | "animal";
  /** clickable elliptical hotspot, % of container */
  cx: number; cy: number; rx: number; ry: number;
  /** dominant color tints used by detail pages */
  blooms: { tint: string; tint2: string }[];
};

/** 5 parcelles peintes — pour l'instant seule la première est habitée par
 *  l'être choisi à l'onboarding ; les autres restent à inviter. */
const BED_POSITIONS = [
  { cx: 16, cy: 23, rx: 16, ry: 18 },
  { cx: 82, cy: 22, rx: 16, ry: 18 },
  { cx: 16, cy: 75, rx: 16, ry: 18 },
  { cx: 82, cy: 47, rx: 16, ry: 16 },
  { cx: 50, cy: 82, rx: 18, ry: 14 },
];
const DEFAULT_BLOOMS = [
  { tint: "var(--rose)",     tint2: "var(--peach)" },
  { tint: "var(--peach)",    tint2: "var(--rose)"  },
];

/** Compatibility: detail page imports BEINGS; we expose a single seeded bed. */
export const BEINGS: Being[] = [
  { id: "main", name: "—", kind: "person", ...BED_POSITIONS[0], blooms: DEFAULT_BLOOMS },
];

function Garden() {
  const { lostName, t, lang } = useLegato();
  const [hovered, setHovered] = useState<string | null>(null);
  // Une seule parcelle habitée pour l'instant — celle de l'être choisi à l'onboarding.
  const beings: Being[] = [
    { id: "main", name: lostName || (lang === "fr" ? "votre être" : "your being"),
      kind: "person", ...BED_POSITIONS[0], blooms: DEFAULT_BLOOMS },
  ];
  const activeBeing = beings.find((b) => b.id === hovered) ?? null;

  return (
    <Shell>
      <div className="relative pb-10 garden-page-bg">
        <div className="relative z-10">
          <header className="px-7 pt-12">
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {t("garden.belong")} · <span className="not-italic">{lostName}</span>
            </p>
            <h1 className="mt-4 font-serif text-[40px] leading-[1.02] font-light text-dusk text-balance">
              {lang === "fr" ? (
                <>Un paysage <span className="italic">qui se souvient.</span></>
              ) : (
                <>A landscape that <span className="italic">remembers.</span></>
              )}
            </h1>
            <p className="mt-6 max-w-[32ch] text-[14.5px] leading-[1.6] text-dusk/65">
              {lang === "fr"
                ? "Une peinture vivante. Effleurez une floraison pour entrer dans le jardin de l'être qui l'habite."
                : "A living painting. Brush a bloom to enter the garden of the being who dwells there."}
            </p>
          </header>

          {/* The painted garden, viewed from above */}
          <div className="px-0 mt-6">
            <div
              className="relative w-full garden-canvas"
              style={{ aspectRatio: "3 / 4" }}
            >
              {/* The painted garden image — dissolved into the paper, no rigid frame */}
              <img
                src={gardenPainted}
                alt=""
                width={942}
                height={1256}
                className="absolute inset-0 w-full h-full object-cover select-none garden-dissolve"
                draggable={false}
              />

              {/* Hotspots — local lift on hover, gentle dim on the others */}
              {beings.map((p) => (
                <Link
                  key={p.id}
                  to="/garden/$zone"
                  params={{ zone: p.id }}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered((h: string | null) => (h === p.id ? null : h))}
                  onFocus={() => setHovered(p.id)}
                  onBlur={() => setHovered((h: string | null) => (h === p.id ? null : h))}
                  aria-label={`${lang === "fr" ? "Entrer dans le jardin de" : "Enter the garden of"} ${p.name}`}
                  className={`absolute group focus:outline-none cursor-pointer garden-tile-hover ${
                    hovered === p.id ? "is-hot" : hovered ? "is-faded" : ""
                  }`}
                  style={{
                    left: `${p.cx - p.rx}%`,
                    top: `${p.cy - p.ry}%`,
                    width: `${p.rx * 2}%`,
                    height: `${p.ry * 2}%`,
                    borderRadius: "50%",
                    touchAction: "manipulation",
                  }}
                />
              ))}
            </div>

            {/* Discreet, subtle indication of which being a bloom belongs to */}
            <div className="mt-4 h-6 px-2 text-center">
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

            {/* CTA discret pour les autres parcelles, à venir */}
            <div className="px-7 mt-6 text-center">
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-dusk/45"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {lang === "fr" ? "Inviter un autre être — bientôt" : "Invite another being — soon"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
