/** Petites représentations graphiques éditoriales — jamais de dashboard.
 *  Uniquement des couleurs de la palette officielle. */

export function ProgressRing({
  value,
  size = 92,
  stroke = 7,
  label,
}: {
  /** 0 → 1 */
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const v = Math.max(0, Math.min(1, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
          stroke="color-mix(in oklab, var(--dusk) 12%, transparent)"
        />
        {v > 0 && (
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
            stroke="var(--terracotta)" strokeLinecap="round"
            strokeDasharray={`${c * v} ${c}`}
            style={{ transition: "stroke-dasharray 700ms ease" }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-[21px] leading-none text-dusk">{Math.round(v * 100)}%</span>
        {label && <span className="mt-1 text-[9.5px] uppercase tracking-[0.12em] text-dusk/45">{label}</span>}
      </div>
    </div>
  );
}

export function BarMeter({
  label,
  value,
  total,
  tone = "var(--terracotta)",
}: {
  label: string;
  value: number;
  total: number;
  tone?: string;
}) {
  const pct = total ? Math.max(0, Math.min(1, value / total)) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13px] text-dusk/75">{label}</p>
        <p className="text-[11.5px] tabular-nums text-dusk/50">{value} / {total}</p>
      </div>
      <div
        className="mt-2 h-[6px] rounded-full overflow-hidden"
        style={{ background: "color-mix(in oklab, var(--dusk) 10%, transparent)" }}
      >
        <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: tone, transition: "width 600ms ease" }} />
      </div>
    </div>
  );
}

/** Suite de points : un point par étape, rempli si franchie. */
export function DotTrail({ total, done, tone = "var(--terracotta)" }: { total: number; done: number; tone?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-[5px]">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: 6, height: 6,
            background: i < done ? tone : "color-mix(in oklab, var(--dusk) 15%, transparent)",
          }}
        />
      ))}
    </div>
  );
}
