import { Link, useLocation } from "@tanstack/react-router";
import { LegatoLogo } from "./ds/LegatoLogo";
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
  return (
    <Link
      to={home as "/care"}
      aria-label="Legato — accueil"
      className="inline-flex items-center select-none"
      style={{ color }}
    >
      <LegatoLogo night={variant === "paper"} />
    </Link>
  );
}
