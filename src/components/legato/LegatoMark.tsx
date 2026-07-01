import { Link } from "@tanstack/react-router";
import blackLogo from "@/assets/legato-logo-cropped.png";
import whiteLogo from "@/assets/legato-logo-white-cropped.png";

export function LegatoMark({
  to = "/space",
  variant = "ink",
  size = 34,
  stacked = false,
}: {
  to?: string;
  variant?: "ink" | "paper" | "olive";
  size?: number;
  stacked?: boolean;
}) {
  const color = variant === "paper" ? "var(--paper)" : variant === "olive" ? "var(--olive)" : "var(--dusk)";
  if (stacked) {
    // Vertical mark: sigil above wordmark. `size` = sigil height in px.
    const sigilH = size;
    const sigilW = sigilH * 0.66;
    const wordSize = Math.round(sigilH * 0.34);
    return (
      <Link
        to={to as "/space"}
        aria-label="Legato — accueil"
        className="inline-flex flex-col items-center select-none"
        style={{ color, gap: Math.round(sigilH * 0.22) }}
      >
        <svg
          viewBox="0 0 100 140"
          width={sigilW}
          height={sigilH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <ellipse cx="50" cy="70" rx="34" ry="54" />
          <path d="M50 32 C 30 50, 30 62, 50 70 C 70 78, 70 90, 50 108" />
          <path d="M50 32 C 70 50, 70 62, 50 70 C 30 78, 30 90, 50 108" />
        </svg>
        <span
          className="font-serif"
          style={{ fontSize: wordSize, letterSpacing: "0.28em", lineHeight: 1, paddingLeft: "0.28em" }}
        >
          Legato
        </span>
      </Link>
    );
  }
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