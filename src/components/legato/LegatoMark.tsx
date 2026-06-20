import { Link } from "@tanstack/react-router";

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
      className="inline-flex items-center gap-3 select-none"
      style={{ color }}
    >
      <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <rect x="7" y="2.5" width="20" height="29" rx="10" stroke="currentColor" strokeWidth="1.45" />
        <path d="M17 5.8c-4.2 3.7-5.8 7.5-4.7 11.2.8 2.6 2.8 4.8 4.7 6.5 1.9-1.7 3.9-3.9 4.7-6.5 1.1-3.7-.5-7.5-4.7-11.2Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
        <path d="M9.2 19.5 17 25.8l7.8-6.3" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 25.8c-3.4 2.5-3.4 5.2 0 5.2s3.4-2.7 0-5.2Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
      </svg>
      <span className="font-serif text-[26px] leading-none tracking-[0.18em]" style={{ fontSize: size * 0.72 }}>
        Legato
      </span>
    </Link>
  );
}