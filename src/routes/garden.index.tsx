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
  // Une parcelle habitée + quatre lopins libres à inviter (jardin progressif).
  const beings: Being[] = [
    { id: "main", name: lostName || (lang === "fr" ? "votre être" : "your being"),
      kind: "person", ...BED_POSITIONS[0], blooms: DEFAULT_BLOOMS },
  ];
  const freeBeds = BED_POSITIONS.slice(1);
  const activeBeing = beings.find((b) => b.id === hovered) ?? null;

  return (
    <Shell>
      <div className="relative pb-10 garden-page-bg">
        <div className="relative z-10">
          <header className="px-7 pt-12">
            <Link to="/home" className="eyebrow inline-block mb-6 hover:text-dusk">← Aujourd'hui</Link>
            <p className="eyebrow">
              {t("garden.belong")} · {lostName}
            </p>
            <h1 className="mt-3 font-serif text-[30px] leading-[1.06] font-light text-dusk text-balance">
              {lang === "fr" ? "Un paysage qui se souvient." : "A landscape that remembers."}
            </h1>
            <p className="mt-4 max-w-[32ch] text-[14px] leading-[1.6] text-dusk/65">
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
              {/* Lopins libres — petits germes qui invitent à planter, sans pression. */}
              {freeBeds.map((b, i) => (
                <Link
                  key={`free-${i}`}
                  to="/space"
                  aria-label={lang === "fr" ? "Inviter un autre être" : "Invite another being"}
                  className="absolute flex items-center justify-center rounded-full transition-opacity hover:opacity-100 opacity-60"
                  style={{
                    left: `${b.cx - b.rx / 2}%`,
                    top: `${b.cy - b.ry / 2}%`,
                    width: `${b.rx}%`,
                    height: `${b.ry}%`,
                  }}
                >
                  <span
                    className="size-6 rounded-full border border-dashed border-dusk/40 flex items-center justify-center text-dusk/55 text-[14px] leading-none bg-paper/40 backdrop-blur-[1px]"
                    aria-hidden
                  >
                    +
                  </span>
                </Link>
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

            {/* CTA discret pour planter un nouveau lopin */}
            <div className="px-7 mt-6 text-center">
              <Link to="/space" className="eyebrow hover:text-dusk">
                {lang === "fr"
                  ? `Planter un autre lopin · ${freeBeds.length} libres`
                  : `Plant another patch · ${freeBeds.length} free`}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
