import { Link, useLocation } from "@tanstack/react-router";
import blackLogo from "@/assets/legato-logo-cropped.png";
import whiteLogo from "@/assets/legato-logo-white-cropped.png";
import stackedBlackLogo from "@/assets/legato-logo-stacked.png";
import stackedWhiteLogo from "@/assets/legato-logo-white-stacked.png";

/**
 * Le logo renvoie toujours à l'accueil de l'univers en cours
 * (Soutien ou Démarches). Jamais vers une page secondaire.
 */
export function LegatoMark({
  to,
  variant = "ink",
  size = 34,
  stacked = false,
}: {
  to?: string;
  variant?: "ink" | "paper" | "olive";
  size?: number;
  stacked?: boolean;
}) {
  const { pathname } = useLocation();
  const home = to && to !== "/space" ? to : pathname.startsWith("/practical") ? "/practical" : "/care";
  const color = variant === "paper" ? "var(--paper)" : variant === "olive" ? "var(--olive)" : "var(--dusk)";
  if (stacked) {
    const logo = variant === "paper" ? stackedWhiteLogo : stackedBlackLogo;
    return (
      <Link
        to={home as "/care"}
        aria-label="Legato — accueil"
        className="inline-flex items-center justify-center select-none"
        style={{ color }}
      >
        <img src={logo} alt="Legato" className="h-auto object-contain" style={{ width: size, opacity: variant === "olive" ? 0.58 : 1 }} />
      </Link>
    );
  }
  const logo = variant === "paper" ? whiteLogo : blackLogo;
  return (
    <Link
      to={home as "/care"}
      aria-label="Legato — accueil"
      className="inline-flex items-center select-none"
      style={{ color, gap: size * 0.28 }}
    >
      <img src={logo} alt="Legato" className="h-auto object-contain" style={{ width: size * 3.72, opacity: variant === "olive" ? 0.58 : 1 }} />
    </Link>
  );
}
