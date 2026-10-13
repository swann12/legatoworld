import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { StandardLayout, SectionLabel } from "@/components/legato/ds";

export function RitualsLayout({ back = "/care/rituels", backLabel = "Rituels", children }: { back?: string; backLabel?: string; children: ReactNode }) {
  return <StandardLayout space="memory" back={back} backLabel={backLabel} activeTab="/care/garden">{children}</StandardLayout>;
}

/** Ligne avec une durée (ou une période) à droite, en petites capitales. */
export function TimedRow({ title, sub, right, to, params, search, onClick, last }: { title: ReactNode; sub?: ReactNode; right?: string; to?: string; params?: Record<string, string>; search?: Record<string, string>; onClick?: () => void; last?: boolean }) {
  const inner = <>
    <span className="min-w-0 flex-1"><span className="lg-row-title block">{title}</span>{sub && <span className="lg-row-sub mt-1 block">{sub}</span>}</span>
    {right ? <span className="lg-mono shrink-0" style={{ color: "var(--sp-accent)" }}>{right}</span> : <ChevronRight className="size-4 shrink-0" strokeWidth={1.3} />}
  </>;
  const cls = "flex w-full items-center gap-4 py-4 text-left";
  const style = { borderBottom: last ? "none" : "1px solid var(--sp-line)" };
  if (to) return <Link to={to} params={params as never} search={search as never} className={cls} style={style}>{inner}</Link>;
  return <button type="button" onClick={onClick} className={cls} style={style}>{inner}</button>;
}

export function NumberedSteps({ title, items, className = "mt-8" }: { title: string; items: string[]; className?: string }) {
  return <div className={className}>
    <SectionLabel accent>{title}</SectionLabel>
    {items.map((t, i) => (
      <div key={t} className="flex gap-4 py-4" style={{ borderBottom: i < items.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
        <span className="lg-title" style={{ fontSize: 24, lineHeight: 1, color: "var(--sp-accent)" }}>{i + 1}</span><p className="text-[15px]">{t}</p>
      </div>
    ))}
  </div>;
}

export function DateBadge({ day, month }: { day: string; month: string }) {
  return <span className="w-11 shrink-0 text-center"><span className="lg-title block" style={{ fontSize: 26, lineHeight: 1 }}>{day}</span><span className="lg-mono mt-1 block">{month}</span></span>;
}
