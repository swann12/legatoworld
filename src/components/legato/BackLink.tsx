import { Link } from "@tanstack/react-router";

export function BackLink({ to, label = "Retour" }: { to: string; label?: string }) {
  return (
    <Link
      to={to}
      className="eyebrow hover:text-dusk inline-flex items-center gap-1.5 min-h-11 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dusk/40 rounded"
      aria-label={label}
    >
      <span aria-hidden>←</span> {label}
    </Link>
  );
}