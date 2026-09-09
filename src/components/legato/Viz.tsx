/** Représentations graphiques — volontairement simples.
 *  Une information par schéma, lisible en une seconde :
 *  une barre, un anneau, une série de points. Rien de plus. */

const ACCENT = "var(--terracotta)";
const rule = (pct: number) => `color-mix(in oklab, var(--dusk) ${pct}%, transparent)`;

/** Barre de progression : intitulé à gauche, compte à droite, une seule couleur. */
export function Progress({
  label,
  done,
  total,
  tone = ACCENT,
}: {
  label?: string;
  done: number;
  total: number;
  tone?: string;
}) {
  const pct = total ? Math.min(1, done / total) : 0;
  return (
    <div>
      {(label || total > 0) && (
        <div className="flex items-baseline justify-between gap-4">
          {label && <span className="text-[13.5px] text-dusk/80">{label}</span>}
          <span className="text-[13px] tabular-nums text-dusk/50">{done} / {total}</span>
        </div>
      )}
      <div className="mt-2 h-[7px] w-full overflow-hidden rounded-full" style={{ background: rule(10) }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct * 100}%`, background: tone, transition: "width 600ms ease" }}
        />
      </div>
    </div>
  );
}

/** Anneau simple : un chiffre, un mot. Aucune graduation. */
export function Dial({
  value,
  size = 92,
  caption,
}: {
  /** 0 → 1 */
  value: number;
  size?: number;
  caption?: string;
}) {
  const v = Math.max(0, Math.min(1, value));
  const cx = size / 2;
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <g transform={`rotate(-90 ${cx} ${cx})`}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={rule(10)} strokeWidth={6} />
          <circle
            cx={cx} cy={cx} r={r} fill="none" stroke={ACCENT} strokeWidth={6} strokeLinecap="round"
            strokeDasharray={`${c * v} ${c}`}
            style={{ transition: "stroke-dasharray 700ms ease" }}
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-[24px] leading-none">{Math.round(v * 100)}%</span>
        {caption && <span className="mt-1 text-[10px] text-dusk/45">{caption}</span>}
      </div>
    </div>
  );
}

export type RulerSegment = { label: string; value: number; tone?: string };

/** Répartition : une barre empilée, puis une légende en lignes calmes. */
export function Ruler({ segments, unit = "étapes" }: { segments: RulerSegment[]; unit?: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const tones = [ACCENT, "var(--sumi)", "var(--olive)", "var(--sage)"];
  return (
    <div>
      <div className="flex overflow-hidden rounded-full" style={{ height: 8 }}>
        {segments.map((s, i) => (
          <div
            key={s.label}
            style={{
              width: `${(s.value / total) * 100}%`,
              background: s.tone ?? tones[i % 4],
              transition: "width 600ms ease",
            }}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2.5">
            <span
              className="inline-block shrink-0"
              style={{ width: 8, height: 8, borderRadius: 999, background: s.tone ?? tones[i % 4] }}
            />
            <span className="min-w-0 truncate text-[13.5px] text-dusk/75">{s.label}</span>
            <span className="ml-auto text-[13px] tabular-nums text-dusk/45">{s.value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11.5px] text-dusk/40">{total} {unit}</p>
    </div>
  );
}

/** Série de points — sept jours, ou un petit compte. Rien à déchiffrer. */
export function DotMatrix({
  total,
  done,
  tone = ACCENT,
}: {
  total: number;
  done: number;
  perRow?: number;
  tone?: string;
}) {
  const n = Math.min(total, 14);
  return (
    <div className="flex flex-wrap gap-[7px]">
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 10, height: 10, borderRadius: 999,
            background: i < done ? tone : rule(12),
          }}
        />
      ))}
    </div>
  );
}

/** Échelle verticale : un trait, des paliers, un seul point actif. */
export function StepLadder({
  steps,
  activeIndex = 0,
}: {
  steps: { label: string; hint?: string }[];
  activeIndex?: number;
}) {
  return (
    <ol className="relative pl-6">
      <span className="absolute left-[5px] top-2 bottom-2 w-px" style={{ background: rule(12) }} />
      {steps.map((s, i) => {
        const active = i === activeIndex;
        const past = i < activeIndex;
        return (
          <li key={s.label} className="relative py-2.5">
            <span
              className="absolute -left-6 top-[9px] inline-block"
              style={{
                width: 11, height: 11, borderRadius: 999,
                background: active ? ACCENT : past ? rule(30) : "var(--paper)",
                border: active || past ? "none" : `1px solid ${rule(20)}`,
              }}
            />
            <p className="font-serif text-[17px] leading-[1.15]" style={{ opacity: active ? 1 : 0.7 }}>
              {s.label}
            </p>
            {s.hint && <p className="mt-0.5 text-[12px] text-dusk/50">{s.hint}</p>}
          </li>
        );
      })}
    </ol>
  );
}

/** Repère discret : 3 / 8. */
export function IndexMark({ i, total, tone }: { i: number; total: number; tone?: string }) {
  return (
    <span className="text-[12px] tabular-nums" style={{ color: tone ?? rule(45) }}>
      {i} / {total}
    </span>
  );
}

/** Trois chiffres alignés — lecture immédiate, cadres pointillés. */
export function StatTrio({ items }: { items: { value: string | number; label: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((it) => (
        <div key={it.label} className="craft px-3 py-4 text-center">
          <p className="font-serif text-[26px] leading-none tabular-nums">{it.value}</p>
          <p className="mt-2 text-[11px] leading-[1.25] text-dusk/50">{it.label}</p>
        </div>
      ))}
    </div>
  );
}

/** Sept jours, sept points. Rien d'autre. */
export function WeekDots({ done }: { done: boolean[] }) {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div className="flex items-end justify-between">
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <span className="text-[10.5px] tracking-[0.08em] text-dusk/40">{d}</span>
          <span
            style={{
              width: 13, height: 13, borderRadius: 999,
              background: done[i] ? ACCENT : rule(10),
            }}
          />
        </div>
      ))}
    </div>
  );
}

/** Courbe minimale — une ligne, un point final. */
export function Trend({ values, height = 64 }: { values: number[]; height?: number }) {
  if (values.length < 2) return null;
  const w = 100, max = Math.max(...values, 1), min = Math.min(...values, 0);
  const span = max - min || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    height - ((v - min) / span) * (height - 10) - 5,
  ]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      <path d={d} fill="none" stroke={ACCENT} strokeWidth={1.6} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r={2.6} fill={ACCENT} />
    </svg>
  );
}

/** Liste de barres — intitulé, compte, proportion. */
export function BarList({ rows }: { rows: { label: string; done: number; total: number }[] }) {
  return (
    <div className="space-y-5">
      {rows.map((r) => <Progress key={r.label} label={r.label} done={r.done} total={r.total} />)}
    </div>
  );
}

/** Ligne réglage — intitulé à gauche, valeur à droite. Lecture immédiate. */
export function SettingRow({
  label,
  value,
  onClick,
  tone,
}: {
  label: string;
  value: string;
  onClick?: () => void;
  tone?: string;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className="flex w-full items-center justify-between rounded-full px-5 py-3 text-left"
      style={{ background: tone ?? "color-mix(in oklab, var(--clay) 70%, var(--whisper))" }}
    >
      <span className="text-[13px] text-dusk/70">{label}</span>
      <span className="text-[13px] tabular-nums text-dusk">{value}</span>
    </Tag>
  );
}

/** Interrupteur — un galet, pas de texte d'état. */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-full px-5 py-3"
      style={{ background: "color-mix(in oklab, var(--clay) 70%, var(--whisper))" }}
    >
      <span className="text-[13px] text-dusk/70">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="relative inline-flex shrink-0 items-center rounded-full transition-colors"
        style={{
          width: 46,
          height: 26,
          background: checked ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 16%, transparent)",
        }}
      >
        <span
          className="absolute rounded-full transition-transform"
          style={{
            width: 20, height: 20, top: 3, left: 3,
            background: "var(--paper)",
            transform: checked ? "translateX(20px)" : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
}

/** Grand chiffre — une valeur, deux repères. */
export function BigStat({
  value,
  unit,
  caption,
  meta,
  tone,
}: {
  value: string | number;
  unit?: string;
  caption: string;
  meta?: { label: string; value: string }[];
  tone?: string;
}) {
  return (
    <div
      className="rounded-[22px] px-6 py-6"
      style={{ background: tone ?? "color-mix(in oklab, var(--sage) 55%, var(--whisper))" }}
    >
      <p className="text-[13px] text-dusk/60">{caption}</p>
      <p className="mt-4 font-serif leading-none tabular-nums" style={{ fontSize: 54 }}>
        {value}
        {unit && <span className="align-super text-[18px]">{unit}</span>}
      </p>
      {meta && meta.length > 0 && (
        <div className="mt-5 flex gap-8">
          {meta.map((m) => (
            <div key={m.label}>
              <p className="text-[11px] text-dusk/45">{m.label}</p>
              <p className="mt-0.5 text-[13px] tabular-nums text-dusk/80">{m.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
