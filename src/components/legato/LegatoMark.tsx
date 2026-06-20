import { Link } from "@tanstack/react-router";
import blackLogo from "@/assets/legato-logo-cropped.png";
import whiteLogo from "@/assets/legato-logo-white-cropped.png";

export function LegatoMark({
  to = "/space",
  variant = "ink",
  size = 34,
}: {
  to?: string;
  variant?: "ink" | "paper" | "olive";
  size?: number;
}) {
  const color = variant === "paper" ? "var(--paper)" : variant === "olive" ? "var(--olive)" : "var(--dusk)";
  const logo = variant === "paper" ? whiteLogo : blackLogo;
  return (
    <Link
      to={to as "/space"}
      aria-label="Legato — accueil"
      className="inline-flex items-center select-none"
      style={{ color, gap: size * 0.28 }}
    >
      <img src={logo} alt="Legato" className="h-auto object-contain" style={{ width: size * 3.72, opacity: variant === "olive" ? 0.58 : 1 }} />
    </Link>
  );
}