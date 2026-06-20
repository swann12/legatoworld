import { Link } from "@tanstack/react-router";
import blackLogo from "@/assets/legato-logo-cropped.png";

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
  return (
    <Link
      to={to as "/space"}
      aria-label="Legato — accueil"
      className="inline-flex items-center select-none"
      style={{ color, gap: size * 0.28 }}
    >
      <span
        aria-hidden="true"
        className="block"
        style={{
          width: size * 3.72,
          height: size,
          backgroundColor: color,
          WebkitMaskImage: `url(${blackLogo.url})`,
          maskImage: `url(${blackLogo.url})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </Link>
  );
}