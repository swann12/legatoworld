/* Ensō — un cercle tracé au pinceau qui se referme à mesure qu'on prend soin de soi.
   Jamais un score, jamais un visage : une trace, calme et japonisante. */

export function SelfFigure({
  vitality: v,
  size = 168,
  ink = "var(--paper)",
  accent = "var(--terracotta)",
}: {
  vitality: number;
  size?: number;
  ink?: string;
  accent?: string;
}) {
  const t = Math.max(0.08, Math.min(1, v));
  const r = 66;
  const c = 2 * Math.PI * r;
  // Le cercle reste toujours ouvert : rien n'est jamais « complet ».
  const drawn = c * (0.18 + t * 0.74);

  return (
    <svg width={size} height={size} viewBox="0 0 180 180" aria-hidden role="presentation">
      {/* trace fantôme, pointillée : ce qui reste à venir */}
      <circle
        cx="90"
        cy="90"
        r={r}
        fill="none"
        stroke={ink}
        strokeOpacity={0.22}
        strokeWidth={1}
        strokeDasharray="2 6"
      />
      {/* la trace vivante */}
      <circle
        cx="90"
        cy="90"
        r={r}
        fill="none"
        stroke={accent}
        strokeOpacity={0.55 + t * 0.4}
        strokeWidth={5 + t * 5}
        strokeLinecap="round"
        strokeDasharray={`${drawn} ${c}`}
        transform="rotate(-104 90 90)"
        style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.22,1,0.36,1)" }}
      />
      {/* trois traits d'appui — le souffle au centre */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={90 - (16 - i * 5)}
          x2={90 + (16 - i * 5)}
          y1={82 + i * 9}
          y2={82 + i * 9}
          stroke={ink}
          strokeOpacity={0.15 + t * 0.35 - i * 0.04}
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
