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
  const tones = [ACCENT, "var(--sage)", "var(--blush)", "var(--clay)"];
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
