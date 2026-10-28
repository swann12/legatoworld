import { useSmartBack } from "@/lib/use-smart-back";
import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronRight, ArrowLeft, Mic, Plus, Send } from "lucide-react";
import { spaceClass, type Space } from "./space";
import { LegatoLogo } from "./LegatoLogo";
import { useActiveSpace } from "@/lib/use-active-space";
import { spaceTabLabels } from "@/lib/space-navigation";
import { Button } from "@/components/ui/button";

type S = { space?: Space; className?: string };
const ink = { color: "var(--sp-ink)" };
const sub = { color: "var(--sp-sub)" };
const serif = { fontFamily: "var(--lg-serif)" };
const sans = { fontFamily: "var(--lg-sans)" };

/* En-tête 64 px : nom de l'espace ou retour, « Besoin d'aide → » à droite */
export function PageHeader({ space, className = "", title, back, backLabel, help = true, left }: S & {
  title?: string; back?: string; backLabel?: string; help?: boolean; left?: ReactNode;
}) {
  const smartBack = useSmartBack();
  const { kind } = useActiveSpace();
  const labels = spaceTabLabels(kind);
  const shownTitle = title === "Démarches" ? labels.practical : title === "Mémoire" ? labels.memory : title;
  return (
    <header className={`${spaceClass(space)} flex items-center justify-between ${className}`}
      style={{ height: "var(--lg-header-h)", borderBottom: "1px solid var(--sp-line-2)", ...ink }}>
      <div className="flex items-center gap-3">
        {left}
        {back ? (
          <Link to={back} onClick={smartBack} className="flex min-h-11 items-center gap-2 text-[14px]" style={sans}>
            <ArrowLeft className="size-4" strokeWidth={1.4} /> {backLabel ?? "Retour"}
          </Link>
        ) : (
          title?.toLowerCase() === "legato" ? <LegatoLogo night={space === "night" && kind !== "questions"} /> : <span style={{ ...serif, fontSize: 25 }}>{shownTitle}</span>
        )}
      </div>
      {help && (
        <Link to="/crisis" className="flex min-h-11 items-center gap-[7px] text-[13px]" style={sans}>
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

/** Bouton des pleins écrans Mémoire/Rituels (ajouts-4 §2) : rose à texte bordeaux sur le dégradé. */
export function ExperienceButton({ className = "", children, to, onClick, type = "button", disabled }: {
  className?: string; children: ReactNode; to?: string; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean;
}) {
  const cls = `lg-exp-btn ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls} style={sans}>{children}</button>;
}

/** « En clair » (ajouts-4 §3) : la définition d'un mot technique sous le titre, dans un encadré lin. */
export function EnClair({ space, className = "", children }: S & { children: ReactNode }) {
  return (
    <div className={`${spaceClass(space)} ${className}`} style={{ background: "var(--lg-linen)", padding: "16px 18px" }}>
      <p className="lg-mono">En clair</p>
      <p className="mt-2" style={{ ...serif, fontSize: 19, lineHeight: 1.35, ...ink }}>{children}</p>
    </div>
  );
}

export function Lead({ space, className = "", children }: S & { children: ReactNode }) {
  return <p className={`${spaceClass(space)} lg-lead ${className}`} style={sub}>{children}</p>;
}

export function SectionLabel({ space, className = "", children, accent = false }: S & { children: ReactNode; accent?: boolean }) {
  return (
    <p className={`${spaceClass(space)} lg-section ${className}`} style={{ color: accent ? "var(--sp-accent)" : "var(--sp-ink)" }}>
      {children}<span className="lg-section-dash"> —</span>
    </p>
  );
}

function RowShell({ to, params, onClick, children, last }: { to?: string; params?: Record<string, string>; onClick?: () => void; children: ReactNode; last?: boolean }) {
  const cls = "flex w-full items-center gap-4 py-[18px] text-left";
  const style = { borderBottom: last ? "none" : "1px solid var(--sp-line)" };
  if (to) return <Link to={to} params={params} className={cls} style={style}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls} style={style}>{children}</button>;
}

export function Row({ space, className = "", title, subtitle, n, to, params, onClick, last, status, icon = "chevron" }: S & {
  title: ReactNode; subtitle?: ReactNode; n?: number; to?: string; params?: Record<string, string>; onClick?: () => void; last?: boolean;
  icon?: "chevron" | "arrow";
  status?: ReactNode;
}) {
  const Icon = icon === "arrow" ? ArrowUpRight : ChevronRight;
  return (
    <div className={`${spaceClass(space)} ${className}`} style={ink}>
      <RowShell to={to} params={params} onClick={onClick} last={last}>
        {n !== undefined && <span className="w-[30px] shrink-0" style={{ ...serif, fontSize: 22, color: "var(--sp-accent)" }}>{n}</span>}
        <span className="min-w-0 flex-1">
          <span className="lg-row-title block">{title}</span>
          {subtitle && <span className="lg-row-sub mt-1 block" style={sub}>{subtitle}</span>}
        </span>
        {status ? <span className="lg-row-status shrink-0">{status}</span> : <Icon className="size-4 shrink-0" strokeWidth={1.3} />}
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

type BtnProps = S & { children: ReactNode; to?: string; onClick?: () => void; full?: boolean; type?: "button" | "submit"; disabled?: boolean; plus?: boolean; params?: Record<string, string>; search?: Record<string, string> };

export function PrimaryButton({ space, className = "", children, to, onClick, full, type = "button", disabled, plus , params, search }: BtnProps) {
  const cls = `${spaceClass(space)} inline-flex items-center justify-center gap-3 px-7 text-[15px] transition-opacity disabled:opacity-40 ${full ? "w-full h-[52px]" : "h-12"} rounded-full ${className}`;
  const style = { ...sans, background: "var(--sp-btn-bg)", color: "var(--sp-btn-fg)" };
  const inner = <>{plus && <Plus className="size-4" strokeWidth={1.4} />}{children}</>;
  if (to) return <Link to={to} params={params as never} search={search as never} className={cls} style={style}>{inner}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls} style={style}>{inner}</button>;
}

export function OutlineButton({ space, className = "", children, to, onClick, type = "button", disabled , params, search }: BtnProps) {
  const cls = `${spaceClass(space)} inline-flex h-9 min-h-9 items-center justify-center rounded-full px-5 text-[13.5px] disabled:opacity-40 ${className}`;
  const style = { ...sans, border: "1px solid var(--sp-stroke)", color: "var(--sp-stroke)" };
  if (to) return <Link to={to} params={params as never} search={search as never} className={cls} style={style}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls} style={style}>{children}</button>;
}

export function TextLink({ space, className = "", children, to, onClick , params, search }: BtnProps) {
  const cls = `${spaceClass(space)} text-[13.5px] underline underline-offset-4 ${className}`;
  const style = { ...sans, color: "var(--sp-stroke)", textDecorationThickness: 1 };
  if (to) return <Link to={to} params={params as never} search={search as never} className={cls} style={style}>{children}</Link>;
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

/** Carte de réponse — même apparence en choix unique et choix multiple. */
export function OptionCard({ space, className = "", label, hint, selected, onClick }: S & {
  label: ReactNode; hint?: ReactNode; selected?: boolean; onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={!!selected}
      className={`${spaceClass(space)} flex w-full items-center gap-[14px] px-4 py-[15px] text-left ${className}`}
      style={{ ...ink, background: selected ? "var(--sp-select)" : "transparent", border: selected ? "1.5px solid var(--sp-accent)" : "1px solid var(--sp-line-2)" }}>
      <span className="grid size-5 shrink-0 place-items-center rounded-full" style={{ border: "1.5px solid var(--sp-accent)" }}>
        {selected && <span className="size-2.5 rounded-full" style={{ background: "var(--sp-accent)" }} />}
      </span>
      <span className="flex min-w-0 flex-col gap-[3px]">
        <span className="block" style={{ ...serif, fontSize: 20, lineHeight: 1.15 }}>{label}</span>
        {hint && <span className="block text-[13px]" style={{ ...sans, ...sub }}>{hint}</span>}
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
      <div className="lg-mono mt-2 flex justify-between" style={sub}>
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
        <span style={{ ...serif, fontSize: 22, color: "var(--sp-fill-ink, var(--lg-cream))" }}>{value} / {total}</span>
      </div>
    </div>
  );
}

export function ChatBubble({ space, className = "", from, children }: S & { from: "presence" | "user"; children: ReactNode }) {
  const p = from === "presence";
  return (
    <div className={`${spaceClass(space)} flex ${p ? "justify-start" : "justify-end"} ${className}`}>
      <div className={p ? "lg-presence-reply" : "lg-presence-user"}>
        {children}
      </div>
    </div>
  );
}

export function ChatInput({ space, className = "", value, onChange, onMic, pending, listening }: S & { value: string; onChange: (v: string) => void; onMic?: () => void; pending?: boolean; listening?: boolean }) {
  return (
    <div className={`${spaceClass(space)} lg-presence-input ${className}`}>
      <input aria-label="Écrire à Présence" value={value} maxLength={4000} onChange={(e) => onChange(e.target.value)} placeholder="Écrire à Présence…"
        className="min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
      <Button variant="ghost" size="icon" type="button" onClick={onMic} aria-label="Parler" aria-pressed={listening} title="Parler" className="lg-presence-mic">
        <Mic className="size-4" strokeWidth={1.4} />
      </Button>
      <Button type="submit" size="icon" aria-label="Envoyer" title="Envoyer" disabled={pending || !value.trim()} className="lg-presence-send"><Send className="size-4" strokeWidth={1.4} /></Button>
    </div>
  );
}

/** Interrupteur (§ réglages) : rond menthe à droite = activé. */
export function Toggle({ space, className = "", checked, onChange, label }: S & { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={`${spaceClass(space)} relative h-[30px] w-[48px] shrink-0 rounded-full transition-colors ${className}`}
      style={{ background: checked ? "var(--lg-deep)" : "var(--sp-line)", border: checked ? "none" : "1px solid var(--sp-line-2)" }}>
      <span className="absolute top-1/2 size-[22px] -translate-y-1/2 rounded-full transition-all"
        style={{ left: checked ? 22 : 3, background: checked ? "var(--lg-mint)" : "var(--lg-cream)" }} />
    </button>
  );
}

/** Ligne titre + sous-titre + interrupteur. */
export function ToggleRow({ space, title, subtitle, checked, onChange, last }: S & { title: string; subtitle?: string; checked: boolean; onChange: (v: boolean) => void; last?: boolean }) {
  return (
    <div className={`${spaceClass(space)} flex items-center gap-4 py-[16px]`} style={{ ...ink, borderBottom: last ? "none" : "1px solid var(--sp-line)" }}>
      <span className="min-w-0 flex-1">
        <span className="lg-row-title block">{title}</span>
        {subtitle && <span className="lg-row-sub mt-1 block" style={sub}>{subtitle}</span>}
      </span>
      <Toggle space={space} checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

/** Ligne libellé à gauche, étiquette mono à droite. */
export function TagRow({ space, title, tag, last }: S & { title: ReactNode; tag: string; last?: boolean }) {
  return (
    <div className={`${spaceClass(space)} flex items-center justify-between gap-4 py-[16px]`} style={{ ...ink, borderBottom: last ? "none" : "1px solid var(--sp-line)" }}>
      <span style={{ ...serif, fontSize: 20 }}>{title}</span>
      <span className="lg-mono text-right" style={ink}>{tag}</span>
    </div>
  );
}
