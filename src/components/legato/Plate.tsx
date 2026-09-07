import presence from "@/assets/ill-presence.png";
import demarches from "@/assets/ill-demarches.png";
import corps from "@/assets/ill-corps.png";
import nuit from "@/assets/ill-nuit.png";
import memoire from "@/assets/ill-memoire.png";
import souffle from "@/assets/ill-souffle.png";

export const PLATES = {
  presence: { src: presence, alt: "Planche : main ouverte tenant une jeune pousse" },
  demarches: { src: demarches, alt: "Planche : papiers quadrillés et ombelle séchée" },
  corps: { src: corps, alt: "Planche : colline-corps allongée sous un petit soleil" },
  nuit: { src: nuit, alt: "Planche : nuit bleue, lune pâle, herbes hautes" },
  memoire: { src: memoire, alt: "Planche : spirale de nautile en terracotta" },

  souffle: { src: souffle, alt: "Planche : aigrette de pissenlit et graines emportées" },

} as const;

export type PlateName = keyof typeof PLATES;

/**
 * Planche illustrée — collage botanique posé sur le papier.
 * `caption` : un mot-clé discret, comme une légende d'herbier.
 */
export function Plate({
  name,
  caption,
  ratio = "1 / 1",
  className = "",
  priority = false,
}: {
  name: PlateName;
  caption?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
}) {
  const plate = PLATES[name];
  return (
    <figure className={`relative ${className}`}>
      <div
        className="relative"
        style={{ aspectRatio: ratio, background: "transparent" }}
      >
        <img
          src={plate.src}
          alt={plate.alt}
          width={1024}
          height={1024}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-contain"
        />
      </div>
      {caption && (
        <figcaption
          className="mono-label mt-2.5 block"
          style={{ color: "color-mix(in oklab, var(--dusk) 45%, transparent)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
