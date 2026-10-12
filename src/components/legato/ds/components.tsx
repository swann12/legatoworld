import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronRight, ArrowLeft, Mic, Plus } from "lucide-react";
import { spaceClass, type Space } from "./space";

type S = { space?: Space; className?: string };
const ink = { color: "var(--sp-ink)" };
const sub = { color: "var(--sp-sub)" };
const serif = { fontFamily: "var(--lg-serif)" };
const sans = { fontFamily: "var(--lg-sans)" };

/* En-tête 64 px : nom de l'espace ou retour, « Besoin d'aide → » à droite */
export function PageHeader({ space, className = "", title, back, backLabel, help = true, left }: S & {
  title?: string; back?: string; backLabel?: string; help?: boolean; left?: ReactNode;
}) {
  return (
    <header className={`${spaceClass(space)} flex items-center justify-between ${className}`}
      style={{ height: "var(--lg-header-h)", borderBottom: "1px solid var(--sp-line-2)", ...ink }}>
      <div className="flex items-center gap-3">
        {left}
        {back ? (
          <Link to={back} className="flex min-h-11 items-center gap-2 text-[14px]" style={sans}>
            <ArrowLeft className="size-4" strokeWidth={1.4} /> {backLabel ?? "Retour"}
          </Link>
        ) : (
          <span style={{ ...serif, fontSize: 25 }}>{title}</span>
        )}
      </div>
      {help && (
        <Link to="/crisis" className="flex min-h-11 items-center gap-2 text-[14px]" style={sans}>
          Besoin d'aide <ArrowRight className="size-4" strokeWidth={1.4} />
        </Link>
      )}
    </header>
  );
}

/** Titre de page : passer la fin en <em> pour l'italique d'accent. */
export function PageTitle({ space, className = "", children, size = 34 }: S & { children: ReactNode; size?: number }) {
  return (
    <h1 className={`${spaceClass(space)} lg-title lg-ds-title ${className}`} style={{ ...ink, fontSize: size }}>
      {children}
    </h1>
  );
}

export function Lead({ space, className = "", children }: S & { children: ReactNode }) {
  return <p className={`${spaceClass(space)} lg-lead ${className}`} style={sub}>{children}</p>;
}

export function SectionLabel({ space, className = "", children, accent = false }: S & { children: ReactNode; accent?: boolean }) {
  return (
    <p className={`${spaceClass(space)} lg-section ${className}`} style={{ color: accent ? "var(--sp-accent)" : "var(--sp-ink)" }}>
      {children} —
    </p>
  );
}

function RowShell({ to, onClick, children, last }: { to?: string; onClick?: () => void; children: ReactNode; last?: boolean }) {
  const cls = "flex w-full items-center gap-4 py-[18px] text-left";
  const style = { borderBottom: last ? "none" : "1px solid var(--sp-line)" };
  if (to) return <Link to={to} className={cls} style={style}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls} style={style}>{children}</button>;
}

export function Row({ space, className = "", title, subtitle, n, to, onClick, last, icon = "chevron" }: S & {
  title: ReactNode; subtitle?: ReactNode; n?: number; to?: string; onClick?: () => void; last?: boolean;
  icon?: "chevron" | "arrow";
}) {
  const Icon = icon === "arrow" ? ArrowUpRight : ChevronRight;
  return (
    <div className={`${spaceClass(space)} ${className}`} style={ink}>
      <RowShell to={to} onClick={onClick} last={last}>
        {n !== undefined && <span className="w-[30px] shrink-0" style={{ ...serif, fontSize: 22, color: "var(--sp-accent)" }}>{n}</span>}
        <span className="min-w-0 flex-1">
          <span className="lg-row-title block">{title}</span>
          {subtitle && <span className="lg-row-sub mt-1 block" style={sub}>{subtitle}</span>}
        </span>
        <Icon className="size-4 shrink-0" strokeWidth={1.3} />
      </RowShell>
    </div>
  );
}

export function ArrowRow(props: Parameters<typeof Row>[0]) {
  return <Row {...props} icon="arrow" />;
}

export function Tip({ space, className = "", n, children, last }: S & { n: number; children: ReactNode; last?: boolean }) {
  return (
    <div className={`${spaceClass(space)} flex gap-4 py-5 ${className}`}
      style={{ ...ink, borderBottom: last ? "none" : "1px solid var(--sp-line)" }}>
      <span className="w-8 shrink-0" style={{ ...serif, fontSize: 28, lineHeight: 1, color: "var(--sp-accent)" }}>{n}</span>
      <p style={{ ...serif, fontSize: 20, lineHeight: 1.25 }}>{children}</p>
    </div>
  );
}

export function Block({ space, className = "", label, eyebrow, title, meta, children }: S & {
  label?: string; eyebrow?: string; title?: ReactNode; meta?: ReactNode; children?: ReactNode;
}) {
  return (
    <section className={`${spaceClass(space)} p-6 ${className}`} style={{ background: "var(--sp-block)", color: "var(--sp-block-ink)" }}>
      {eyebrow && <p className="lg-mono mb-3" style={{ color: "var(--sp-block-ink)" }}>{eyebrow}</p>}
      {label && <p className="lg-section mb-3">{label} —</p>}
      {title && <h2 style={{ ...serif, fontSize: 25, lineHeight: 1.15 }} className="lg-ds-title">{title}</h2>}
      {meta && <p className="mt-2 text-[13px]" style={{ ...sans, color: "var(--sp-block-ink)", opacity: 0.75 }}>{meta}</p>}
      {children && <div className="mt-5">{children}</div>}
    </section>
  );
}

type BtnProps = S & { children: ReactNode; to?: string; onClick?: () => void; full?: boolean; type?: "button" | "submit"; disabled?: boolean; plus?: boolean };

export function PrimaryButton({ space, className = "", children, to, onClick, full, type = "button", disabled, plus }: BtnProps) {
  const cls = `${spaceClass(space)} inline-flex items-center justify-center gap-3 px-7 text-[15px] transition-opacity disabled:opacity-40 ${full ? "w-full h-[52px]" : "h-12"} rounded-full ${className}`;
  const style = { ...sans, background: "var(--sp-btn-bg)", color: "var(--sp-btn-fg)" };
  const inner = <>{plus && <Plus className="size-4" strokeWidth={1.4} />}{children}</>;
  if (to) return <Link to={to} className={cls} style={style}>{inner}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls} style={style}>{inner}</button>;
}

export function OutlineButton({ space, className = "", children, to, onClick, type = "button", disabled }: BtnProps) {
  const cls = `${spaceClass(space)} inline-flex h-9 min-h-9 items-center justify-center rounded-full px-5 text-[13.5px] disabled:opacity-40 ${className}`;
  const style = { ...sans, border: "1px solid var(--sp-stroke)", color: "var(--sp-stroke)" };
  if (to) return <Link to={to} className={cls} style={style}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls} style={style}>{children}</button>;
}

export function TextLink({ space, className = "", children, to, onClick }: BtnProps) {
  const cls = `${spaceClass(space)} text-[13.5px] underline underline-offset-4 ${className}`;
  const style = { ...sans, color: "var(--sp-stroke)", textDecorationThickness: 1 };
  if (to) return <Link to={to} className={cls} style={style}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls} style={style}>{children}</button>;
}

export function Spec({ space, className = "", items }: S & { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className={`${spaceClass(space)} ${className}`} style={{ ...ink, borderTop: "1px solid var(--sp-line-2)", borderBottom: "1px solid var(--sp-line-2)" }}>
      {items.map((it, i) => (
        <div key={i} className="flex items-baseline gap-3 py-3" style={{ borderTop: i ? "1px solid var(--sp-line)" : "none" }}>
          <dt className="lg-mono w-[112px] shrink-0" style={sub}>{it.label}</dt>
          <dd style={{ ...serif, fontSize: 19 }}>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Columns({ space, className = "", items }: S & { items: { label: string; value: ReactNode }[] }) {
  return (
    <div className={`${spaceClass(space)} grid ${className}`} style={{ ...ink, gridTemplateColumns: `repeat(${items.length}, 1fr)`, borderTop: "1px solid var(--sp-line-2)", borderBottom: "1px solid var(--sp-line-2)" }}>
      {items.map((it, i) => (
        <div key={i} className="px-3 py-4 first:pl-0" style={{ borderLeft: i ? "1px solid var(--sp-line-2)" : "none" }}>
          <p className="lg-mono" style={sub}>{it.label}</p>
          <p className="mt-2" style={{ ...serif, fontSize: 22 }}>{it.value}</p>
        </div>
      ))}
    </div>
  );
}

export function SplitHeader({ space, className = "", title, value, total, children }: S & {
  title: ReactNode; value: ReactNode; total?: ReactNode; children?: ReactNode;
}) {
  return (
    <div className={`${spaceClass(space)} grid grid-cols-[1.4fr_1fr] ${className}`} style={{ ...ink, borderBottom: "1px solid var(--sp-line-2)" }}>
      <div className="py-7 pr-4"><h1 className="lg-title lg-ds-title" style={{ fontSize: 34 }}>{title}</h1></div>
      <div className="py-7 pl-5" style={{ borderLeft: "1px solid var(--sp-line-2)" }}>
        <p style={{ ...serif, fontSize: 56, lineHeight: 1 }}>
          {value}{total !== undefined && <span style={{ ...sub, fontSize: 24 }}>/{total}</span>}
        </p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}

export function Boxed({ space, className = "", children }: S & { children: ReactNode }) {
  return <div className={`${spaceClass(space)} p-5 ${className}`} style={{ ...ink, border: "1px solid var(--sp-stroke)" }}>{children}</div>;
}

export function OptionCard({ space, className = "", label, hint, selected, onClick }: S & {
  label: ReactNode; hint?: ReactNode; selected?: boolean; onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={!!selected}
      className={`${spaceClass(space)} flex w-full items-center gap-4 px-4 py-[15px] text-left ${className}`}
      style={{ ...ink, background: selected ? "var(--sp-select)" : "transparent", border: selected ? "1.5px solid var(--sp-accent)" : "1px solid var(--sp-line-2)" }}>
      <span className="grid size-5 shrink-0 place-items-center rounded-full" style={{ border: `1px solid ${selected ? "var(--sp-accent)" : "var(--sp-line-2)"}` }}>
        {selected && <span className="size-2.5 rounded-full" style={{ background: "var(--sp-accent)" }} />}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px]" style={sans}>{label}</span>
        {hint && <span className="lg-row-sub mt-0.5 block" style={sub}>{hint}</span>}
      </span>
    </button>
  );
}

export function StepBar({ space, className = "", step, total }: S & { step: number; total: number }) {
  return (
    <div className={`${spaceClass(space)} flex gap-1.5 ${className}`} role="progressbar" aria-valuenow={step} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="h-[3px] flex-1" style={{ background: i < step ? "var(--sp-ink)" : "var(--sp-line-2)" }} />
      ))}
    </div>
  );
}

export function QuestionFooter({ space, className = "", cta, onCta, ctaDisabled, link, onLink, linkTo }: S & {
  cta: string; onCta?: () => void; ctaDisabled?: boolean; link?: string; onLink?: () => void; linkTo?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <PrimaryButton space={space} full onClick={onCta} disabled={ctaDisabled}>{cta}</PrimaryButton>
      {link && <TextLink space={space} onClick={onLink} to={linkTo}>{link}</TextLink>}
    </div>
  );
}

export function Field({ space, className = "", label, ...rest }: S & { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`${spaceClass(space)} block ${className}`} style={ink}>
      <span className="lg-mono block" style={sub}>{label}</span>
      <input {...rest} className="mt-2 w-full bg-transparent pb-2 outline-none placeholder:opacity-40"
        style={{ ...serif, fontSize: 21, color: "var(--sp-ink)", borderBottom: "1px solid var(--sp-line-2)" }} />
    </label>
  );
}

export function TextArea({ space, className = "", label, ...rest }: S & { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={`${spaceClass(space)} block ${className}`} style={ink}>
      <span className="lg-mono block" style={sub}>{label}</span>
      <textarea rows={4} {...rest} className="mt-2 w-full resize-none bg-transparent pb-2 outline-none placeholder:opacity-40"
        style={{ ...serif, fontSize: 21, lineHeight: 1.35, color: "var(--sp-ink)", borderBottom: "1px solid var(--sp-line-2)" }} />
    </label>
  );
}

export function MoodBar({ space, className = "", value, onChange }: S & { value: number; onChange: (v: number) => void }) {
  return (
    <div className={`${spaceClass(space)} ${className}`} style={ink}>
      <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Comment vous sentez-vous" className="lg-moodbar w-full" />
      <div className="mt-2 flex justify-between text-[13px]" style={{ ...sans, ...sub }}>
        <span>Très dur</span><span>Plutôt bien</span>
      </div>
    </div>
  );
}

export function ProgressBar({ space, className = "", value, total }: S & { value: number; total: number }) {
  const pct = Math.max(12, Math.min(100, (value / total) * 100));
  return (
    <div className={`${spaceClass(space)} h-14 w-full overflow-hidden rounded-full ${className}`} style={{ background: "var(--sp-select)" }}>
      <div className="flex h-full items-center rounded-full px-5" style={{ width: `${pct}%`, background: "var(--sp-fill)" }}>
        <span style={{ ...serif, fontSize: 22, color: "var(--lg-cream)" }}>{value} / {total}</span>
      </div>
    </div>
  );
}

export function ChatBubble({ space, className = "", from, children }: S & { from: "presence" | "user"; children: ReactNode }) {
  const p = from === "presence";
  return (
    <div className={`${spaceClass(space)} flex ${p ? "justify-start" : "justify-end"} ${className}`}>
      <div className="max-w-[82%] px-4 py-3"
        style={p
          ? { background: "var(--lg-mint-pale)", color: "var(--lg-deep)", ...serif, fontSize: 18, lineHeight: 1.3 }
          : { background: "var(--lg-blue)", color: "var(--lg-deep)", ...sans, fontSize: 14.5, lineHeight: 1.5 }}>
        {p && <p className="lg-mono mb-1" style={{ color: "var(--lg-sub)" }}>Présence · intelligence artificielle</p>}
        {children}
      </div>
    </div>
  );
}

export function ChatInput({ space, className = "", value, onChange, onMic }: S & { value: string; onChange: (v: string) => void; onMic?: () => void }) {
  return (
    <div className={`${spaceClass(space)} flex items-center gap-3 ${className}`} style={ink}>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Écrivez, ou parlez"
        className="flex-1 bg-transparent pb-2 text-[16px] outline-none" style={{ ...sans, color: "var(--sp-ink)", borderBottom: "1px solid var(--sp-line-2)" }} />
      <button type="button" onClick={onMic} aria-label="Parler" className="grid size-11 place-items-center rounded-full" style={{ border: "1px solid var(--sp-stroke)" }}>
        <Mic className="size-4" strokeWidth={1.4} />
      </button>
    </div>
  );
}
