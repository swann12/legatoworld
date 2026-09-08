/* Une figure sensible qui nous représente : elle s'ouvre ou se replie
   selon le soin qu'on s'est accordé. Jamais de score, jamais de reproche. */

export function SelfFigure({ vitality: v, size = 168 }: { vitality: number; size?: number }) {
  const t = Math.max(0, Math.min(1, v));
  const open = 0.35 + t * 0.65;          // ouverture des branches
  const halo = 0.06 + t * 0.16;          // densité du halo
  const lift = (1 - t) * 10;             // repli vers le bas

  const petal = (angle: number, i: number) => {
    const spread = 46 * open;
    const a = (angle - 90) * (Math.PI / 180);
    const len = 34 + 26 * open + (i % 2 ? 4 : 0);
    const x = 100 + Math.cos(a) * len;
    const y = 108 + lift + Math.sin(a) * len;
    return (
      <path
        key={angle}
        d={`M100 ${108 + lift} Q ${100 + Math.cos(a) * len * 0.5 - spread * 0.2} ${108 + lift + Math.sin(a) * len * 0.5} ${x} ${y}`}
        stroke="var(--terracotta)"
        strokeOpacity={0.28 + t * 0.42}
        strokeWidth={1.4}
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden role="presentation">
      <circle cx="100" cy={104 + lift} r={66} fill="var(--terracotta)" opacity={halo} />
      <circle cx="100" cy={104 + lift} r={44} fill="var(--blush)" opacity={0.35 + t * 0.25} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => petal(a, i))}
      <circle cx="100" cy={108 + lift} r={9 + t * 5} fill="var(--bordeaux)" opacity={0.5 + t * 0.35} />
      <path
        d={`M100 ${117 + lift} C 100 ${140 + lift}, 100 ${150 + lift}, 100 ${168}`}
        stroke="var(--bordeaux)"
        strokeOpacity={0.3 + t * 0.3}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
