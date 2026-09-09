import type { ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";

/* ────────────────────────────────────────────────────────────────────────
 * Legato — système UI éditorial inspiré des références jointes.
 * Marges généreuses, hiérarchie typographique stricte, schémas SVG sobres.
 * ──────────────────────────────────────────────────────────────────────── */

/** En-tête de page secondaire : flèche retour + titre centré (mono) + slot droit. */
export function PageHeader({
  back,
  title,
  right,
}: {
  back?: string;
  title?: string;
  right?: ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="grid grid-cols-[40px_1fr_40px] items-center px-6 pt-7 pb-5">
      {back ? (
        <Link to={back as "/home"} aria-label="Retour" className="h-10 w-10 -ml-2 grid place-items-center text-dusk/80 hover:text-dusk">
          <span className="text-[18px] leading-none">←</span>
        </Link>
      ) : (
        <button
          type="button"
          aria-label="Retour"
          onClick={() => router.history.back()}
          className="h-10 w-10 -ml-2 grid place-items-center text-dusk/80 hover:text-dusk"
        >
          <span className="text-[18px] leading-none">←</span>
        </button>
      )}
      <p className="mono-label text-center">{title ?? ""}</p>
      <div className="justify-self-end">{right}</div>
    </header>
  );
}

/** Hero éditorial : eyebrow (mono) + grand titre serif + sous-texte. */
export function EditorialHero({
  eyebrow,
  title,
  subtitle,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`px-6 pt-2 pb-8 ${className}`}>
      {eyebrow && <p className="mono-label">{eyebrow}</p>}
      <h1 className="mt-5 ed-page-title text-dusk">{title}</h1>
      {subtitle && <p className="mt-5 body-meta max-w-[34ch]">{subtitle}</p>}
    </section>
  );
}

/** Filet horizontal fin (hairline) avec libellé centré mono. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-6 pt-8 pb-4">
      <p className="mono-label">{children}</p>
      <div className="mt-3 h-px bg-dusk/12" />
    </div>
  );
}

/* ─── Grammaire de mise en page commune (japonisante : filet, air, index) ─── */

/** Titre de section : libellé mono à gauche, filet, compteur discret à droite. */
export function SectionHead({
  label,
  meta,
  className = "",
}: {
  label: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 px-1 ${className}`}>
      <p className="mono-label shrink-0">{label}</p>
      <span aria-hidden className="h-px flex-1" style={{ background: "color-mix(in oklab, var(--dusk) 12%, transparent)" }} />
      {meta != null && <span className="shrink-0 text-[10.5px] tabular-nums tracking-[0.14em] text-dusk/40">{meta}</span>}
    </div>
  );
}

/** Liste : conteneur crème, séparateurs pointillés. */
export function ListBlock({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <ul className={`surf-cream mt-3 rounded-[18px] px-5 ${className}`}>{children}</ul>;
}

/** Contenu d'une ligne de liste : index, titre serif, note, méta ou chevron. */
export function RowInner({
  title,
  note,
  meta,
  index,
}: {
  title: ReactNode;
  note?: ReactNode;
  meta?: ReactNode;
  index?: number;
}) {
  return (
    <>
      {index != null && (
        <span className="mt-[5px] shrink-0 text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/35">
          {String(index).padStart(2, "0")}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-[17.5px] leading-[1.2]">{title}</span>
        {note && <span className="mt-1 block text-[12.5px] leading-[1.45] surf-sub">{note}</span>}
      </span>
      {meta != null ? (
        <span className="shrink-0 self-start pt-[3px] text-[11px] tabular-nums tracking-[0.08em] text-dusk/40">{meta}</span>
      ) : (
        <span aria-hidden className="shrink-0 self-start pt-[3px] text-dusk/30">→</span>
      )}
    </>
  );
}

/** Ligne de liste cliquable (bouton). */
export function Row({
  title,
  note,
  meta,
  index,
  onClick,
  children,
}: {
  title: ReactNode;
  note?: ReactNode;
  meta?: ReactNode;
  index?: number;
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <li className="border-b border-dashed last:border-0" style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}>
      <button type="button" onClick={onClick} className="flex w-full items-start gap-4 py-4 text-left transition-opacity active:opacity-70">
        <RowInner title={title} note={note} meta={meta} index={index} />
      </button>
      {children}
    </li>
  );
}

/** Onglets / filtres sobres : soulignement terracotta, jamais de pastille pleine. */
export function Tabs<T extends string>({
  options,
  value,
  onChange,
  scroll = false,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  scroll?: boolean;
}) {
  return (
    <div className={`flex gap-5 ${scroll ? "overflow-x-auto no-scrollbar pb-1" : ""}`}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className="shrink-0 pb-1.5 text-[12.5px] tracking-[0.05em] transition-colors"
            style={{
              color: on ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 42%, transparent)",
              fontWeight: on ? 600 : 400,
              borderBottom: on ? "1.5px solid var(--terracotta)" : "1.5px solid transparent",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Bouton d'action principal, pleine largeur. */
export function PrimaryAction({
  label,
  hint,
  onClick,
  variant = "solid",
}: {
  label: ReactNode;
  hint?: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "quiet";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[18px] px-5 py-4 text-left transition-opacity active:opacity-80"
      style={
        variant === "solid"
          ? { background: "var(--terracotta)", color: "var(--paper)" }
          : { background: "transparent", color: "var(--dusk)", border: "1px dashed color-mix(in oklab, var(--dusk) 25%, transparent)" }
      }
    >
      {hint && (
        <span className="mono-label block" style={{ color: variant === "solid" ? "color-mix(in oklab, var(--paper) 72%, transparent)" : undefined }}>
          {hint}
        </span>
      )}
      <span className="mt-1 block font-serif text-[19px] leading-[1.15]">{label}</span>
    </button>
  );
}

/** Carte ivoire avec contour fin — le composant par défaut. */
export function IvoryCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Schémas graphiques (SVG inline, sobres) ─── */

/** Anneau de progression style INSPI2 "68%". */
export function RingProgress({
  value,
  label,
  size = 168,
  stroke = 14,
  color = "var(--terracotta)",
  trackColor = "color-mix(in oklab, var(--sky) 55%, white)",
}: {
  value: number; // 0-100
  label?: ReactNode;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {label ?? (
          <span className="font-serif text-[40px] leading-none text-dusk">{pct}%</span>
        )}
      </div>
    </div>
  );
}

/** Demi-cercle / jauge style "64% charge émotionnelle". */
export function MoodGauge({
  value,
  size = 200,
  stroke = 16,
  color = "var(--terracotta)",
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2 + 8;
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;
  const trackPath = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
  const totalLen = Math.PI * r;
  const dash = Math.max(0, Math.min(100, value)) / 100 * totalLen;
  return (
    <div className="relative" style={{ width: size, height: size / 2 + 24 }}>
      <svg width={size} height={size / 2 + 24}>
        <path d={trackPath} fill="none" stroke="color-mix(in oklab, var(--blush) 80%, white)" strokeWidth={stroke} strokeLinecap="round" />
        <path d={trackPath} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${dash} ${totalLen}`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center pt-4 text-center">
        <span className="font-serif text-[44px] leading-none text-dusk">{Math.round(value)}%</span>
      </div>
    </div>
  );
}

/** Cercle de soutien : Vous au centre + satellites colorés. */
export function SupportCircle({
  members,
  centerLabel = "Vous",
  size = 280,
}: {
  members: { initial: string; name: string; color: string }[];
  centerLabel?: string;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const orbit = size / 2 - 28;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        <circle cx={cx} cy={cy} r={orbit} fill="none" stroke="color-mix(in oklab, var(--dusk) 14%, transparent)" strokeDasharray="2 5" />
        <circle cx={cx} cy={cy} r={orbit - 22} fill="none" stroke="color-mix(in oklab, var(--dusk) 9%, transparent)" strokeDasharray="2 5" />
      </svg>
      {/* Centre */}
      <div
        className="absolute grid place-items-center rounded-full text-paper font-serif"
        style={{
          left: cx - 44, top: cy - 44, width: 88, height: 88,
          background: "var(--terracotta)",
          fontSize: 18,
        }}
      >
        {centerLabel}
      </div>
      {members.slice(0, 4).map((m, i) => {
        const angle = (-Math.PI / 2) + (i * (2 * Math.PI)) / Math.max(members.length, 1);
        const x = cx + Math.cos(angle) * orbit;
        const y = cy + Math.sin(angle) * orbit;
        return (
          <div
            key={m.name}
            className="absolute grid place-items-center rounded-full text-dusk font-serif text-[15px]"
            style={{
              left: x - 26, top: y - 26, width: 52, height: 52,
              background: m.color,
            }}
            aria-label={m.name}
          >
            {m.initial}
          </div>
        );
      })}
    </div>
  );
}

/** Petite courbe d'humeur (line chart minimal). */
export function MoodTrend({
  values,
  width = 320,
  height = 110,
  color = "var(--terracotta)",
}: {
  values: number[]; // 0-10
  width?: number;
  height?: number;
  color?: string;
}) {
  if (!values.length) return null;
  const max = 10;
  const stepX = width / (values.length - 1 || 1);
  const points = values.map((v, i) => [i * stepX, height - (v / max) * (height - 8) - 4] as const);
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  return (
    <svg width={width} height={height} className="block w-full">
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={color} />
      ))}
    </svg>
  );
}

/** Barre de progression fine. */
export function LinearProgress({
  value,
  color = "var(--terracotta)",
}: {
  value: number;
  color?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1.5 w-full rounded-full bg-dusk/10 overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}