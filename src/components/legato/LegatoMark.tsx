import { Link } from "@tanstack/react-router";
import blackLogo from "@/assets/legato-logo-cropped.png.asset.json";
import whiteLogo from "@/assets/legato-logo-white-cropped.png.asset.json";

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
  const logo = variant === "paper" ? whiteLogo.url : blackLogo.url;
  return (
    <Link
      to={to as "/space"}
      aria-label="Legato — accueil"
      className="inline-flex items-center select-none"
      style={{ color, gap: size * 0.28 }}
    >
      <img src={logo} alt="Legato" className="h-auto object-contain" style={{ width: size * 3.72 }} />
    </Link>
  );
}