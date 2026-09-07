/** Représentations schématiques éditoriales.
 *  Grammaire unique : encre bordeaux pour la structure (axes, graduations, index),
 *  terracotta comme seul accent actif, teintes claires de la palette pour les surfaces.
 *  Tout est construit sur une grille : rien n'est disposé « à peu près ». */

const INK = "var(--dusk)";
const ACCENT = "var(--terracotta)";
const rule = (pct: number) => `color-mix(in oklab, var(--dusk) ${pct}%, transparent)`;

/** Cadran gradué : 36 graduations régulières, arc plein sur la part accomplie. */
export function Dial({
  value,
  size = 104,
  caption,
  ticks = 36,
}: {
  /** 0 → 1 */
  value: number;
  size?: number;
  caption?: string;
  ticks?: number;
}) {
  const v = Math.max(0, Math.min(1, value));
  const cx = size / 2;
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <g className="origin-center" transform={`rotate(-90 ${cx} ${cx})`}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={rule(10)} strokeWidth={1} />
          {Array.from({ length: ticks }).map((_, i) => {
            const a = (i / ticks) * Math.PI * 2;
            const on = i / ticks < v;
            const len = i % 9 === 0 ? 7 : 4;
            const x1 = cx + Math.cos(a) * (r + 2);
            const y1 = cx + Math.sin(a) * (r + 2);
            const x2 = cx + Math.cos(a) * (r + 2 + len);
            const y2 = cx + Math.sin(a) * (r + 2 + len);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={on ? ACCENT : rule(18)}
                strokeWidth={i % 9 === 0 ? 1.4 : 1}
              />
            );
          })}
          {v > 0 && (
            <circle
              cx={cx} cy={cx} r={r} fill="none" stroke={ACCENT} strokeWidth={2.5}
              strokeDasharray={`${c * v} ${c}`}
              style={{ transition: "stroke-dasharray 700ms ease" }}
            />
          )}
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-[24px] leading-none" style={{ color: INK }}>
          {Math.round(v * 100)}
        </span>
        {caption && (
          <span className="mt-1 text-[8.5px] uppercase tracking-[0.16em]" style={{ color: rule(50) }}>
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}

export type RulerSegment = { label: string; value: number; tone?: string };

/** Axe mesuré : une règle horizontale graduée, segments proportionnels,
 *  index numérotés dessous. Construction systématique, pas décorative. */
export function Ruler({ segments, unit = "étapes" }: { segments: RulerSegment[]; unit?: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div>
      <div className="flex items-end gap-[2px]" style={{ height: 10 }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="flex-1"
            style={{ height: i % 10 === 0 ? 10 : 5, background: i % 10 === 0 ? rule(28) : rule(14) }}
          />
        ))}
      </div>
      <div className="mt-2 flex overflow-hidden rounded-[3px]" style={{ height: 12 }}>
        {segments.map((s, i) => (
          <div
            key={s.label}
            style={{
              width: `${(s.value / total) * 100}%`,
              background: s.tone ?? [ACCENT, "var(--sage)", "var(--blush)", "var(--clay)"][i % 4],
              borderRight: i < segments.length - 1 ? "1px solid var(--paper)" : undefined,
              transition: "width 600ms ease",
            }}
          />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2">
            <span
              className="inline-block"
              style={{ width: 8, height: 8, borderRadius: 2, background: s.tone ?? [ACCENT, "var(--sage)", "var(--blush)", "var(--clay)"][i % 4] }}
            />
            <span className="text-[11px]" style={{ color: rule(70) }}>{s.label}</span>
            <span className="ml-auto text-[11px] tabular-nums" style={{ color: rule(45) }}>
              {String(s.value).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[9.5px] uppercase tracking-[0.16em]" style={{ color: rule(38) }}>
        {String(total).padStart(2, "0")} {unit}
      </p>
    </div>
  );
}

/** Matrice de points : lignes fixes de 12, remplissage de gauche à droite.
 *  Systématique — jamais un enroulement aléatoire. */
export function DotMatrix({
  total,
  done,
  perRow = 12,
  tone = ACCENT,
}: {
  total: number;
  done: number;
  perRow?: number;
  tone?: string;
}) {
  const rows = Math.max(1, Math.ceil(total / perRow));
  return (
    <div className="inline-flex flex-col gap-[6px]">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-[6px]">
          {Array.from({ length: perRow }).map((_, cIdx) => {
            const i = r * perRow + cIdx;
            if (i >= total) return <span key={cIdx} style={{ width: 6, height: 6 }} />;
            return (
              <span
                key={cIdx}
                style={{
                  width: 6, height: 6, borderRadius: 999,
                  background: i < done ? tone : "transparent",
                  border: i < done ? "none" : `1px solid ${rule(22)}`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Échelle verticale numérotée : chaque palier tient sur la même ligne d'axe. */
export function StepLadder({
  steps,
  activeIndex = 0,
}: {
  steps: { label: string; hint?: string }[];
  activeIndex?: number;
}) {
  return (
    <ol className="relative pl-7">
      <span className="absolute left-[9px] top-1 bottom-1 w-px" style={{ background: rule(14) }} />
      {steps.map((s, i) => {
        const active = i === activeIndex;
        const past = i < activeIndex;
        return (
          <li key={s.label} className="relative py-2.5">
            <span
              className="absolute -left-7 top-3 inline-flex items-center justify-center"
              style={{
                width: 19, height: 19, borderRadius: 999,
                background: active ? ACCENT : past ? rule(16) : "transparent",
                border: active || past ? "none" : `1px solid ${rule(22)}`,
                color: active ? "var(--paper)" : rule(55),
                fontSize: 9,
                letterSpacing: "0.04em",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-serif text-[17px] leading-[1.15]" style={{ color: active ? INK : rule(78) }}>
              {s.label}
            </p>
            {s.hint && <p className="mt-0.5 text-[11.5px]" style={{ color: rule(50) }}>{s.hint}</p>}
          </li>
        );
      })}
    </ol>
  );
}

/** Index typographique : 01 / 06 — repère systématique posé sur les tuiles. */
export function IndexMark({ i, total, tone }: { i: number; total: number; tone?: string }) {
  return (
    <span
      className="text-[9.5px] tabular-nums tracking-[0.16em]"
      style={{ color: tone ?? rule(42) }}
    >
      {String(i).padStart(2, "0")}<span style={{ opacity: 0.5 }}>/{String(total).padStart(2, "0")}</span>
    </span>
  );
}

/** Petits pictogrammes schématiques, dessinés sur la même grille 24×24,
 *  même graisse de trait — cohérents entre eux. */
export function Glyph({ name, size = 26, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {name === "photo" && (<g {...p}><rect x="3" y="5" width="18" height="14" rx="1.5" /><circle cx="9" cy="10" r="1.8" /><path d="M3 16l5-4 4 3 3-2 6 4" /></g>)}
      {name === "voix" && (<g {...p}><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" /></g>)}
      {name === "lettre" && (<g {...p}><rect x="3" y="6" width="18" height="12" rx="1.5" /><path d="M3 7l9 6 9-6" /></g>)}
      {name === "musique" && (<g {...p}><path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></g>)}
      {name === "objet" && (<g {...p}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></g>)}
      {name === "citation" && (<g {...p}><path d="M5 15c0-5 2-7 5-8M14 15c0-5 2-7 5-8" /><path d="M5 15h4v-4H5zM14 15h4v-4h-4z" /></g>)}
      {name === "video" && (<g {...p}><rect x="3" y="6" width="12" height="12" rx="1.5" /><path d="M15 11l6-3v8l-6-3z" /></g>)}
      {name === "texte" && (<g {...p}><path d="M5 6h14M5 10h14M5 14h10M5 18h6" /></g>)}
    </svg>
  );
}
