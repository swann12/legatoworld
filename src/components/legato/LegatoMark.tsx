import { Link } from "@tanstack/react-router";

/**
 * Wordmark Legato — image (PNG) plutôt que texte.
 * Couleur "ink" (sombre) par défaut, "paper" pour fonds foncés.
 */
export function LegatoMark({
  to = "/space",
  variant = "ink",
  size = 22,
}: {
  to?: string;
  variant?: "ink" | "paper";
  size?: number;
}) {
  const src = variant === "paper" ? "/legato-logo-blanc.png" : "/legato-logo-noir.png";
  return (
    <Link to={to as "/space"} aria-label="Legato — accueil" className="inline-flex items-center">
      <img
        src={src}
        alt="Legato"
        style={{ height: size, width: "auto" }}
        className="select-none"
        draggable={false}
      />
    </Link>
  );
}