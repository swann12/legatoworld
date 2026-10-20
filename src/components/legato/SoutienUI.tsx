import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

/** Ligne de liste qui ouvre une page réutilisée avec ses paramètres (message prêt, site officiel). */
export function SearchRow({ title, subtitle, to, search, last }: {
  title: ReactNode; subtitle?: ReactNode; to: "/partage/message" | "/partage/site-officiel"; search: Record<string, string>; last?: boolean;
}) {
  return (
    <Link to={to} search={search as never} className="flex w-full items-center gap-4 py-[18px] text-left"
      style={{ borderBottom: last ? "none" : "1px solid var(--sp-line)", color: "var(--sp-ink)" }}>
      <span className="min-w-0 flex-1">
        <span className="lg-row-title block">{title}</span>
        {subtitle && <span className="lg-row-sub mt-1 block" style={{ color: "var(--sp-sub)" }}>{subtitle}</span>}
      </span>
      <ChevronRight className="size-4 shrink-0" strokeWidth={1.3} />
    </Link>
  );
}

export function Chip({ on, children, onClick }: { on?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className="mb-2 mr-2 inline-flex h-[38px] items-center rounded-full px-4 text-[14px]"
      style={on ? { background: "var(--lg-deep)", color: "var(--lg-mint)" } : { border: "1px solid var(--sp-line-2)", color: "var(--sp-ink)" }}>
      {children}
    </button>
  );
}

export function Quote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-[10px] px-5 py-[18px]" style={{ background: "var(--sp-block)", color: "var(--sp-block-ink)" }}>
      <p style={{ fontFamily: "var(--lg-serif)", fontSize: 18, lineHeight: 1.45 }}>{children}</p>
    </div>
  );
}
