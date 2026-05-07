/**
 * Lightweight SVG glyphs for the composition editor — sculptural, organic, never literal.
 * Three families: végétal, minéral, ciel.
 */

export type ShapeKind =
  | "petal" | "rose" | "anemone" | "iris" | "daisy" | "tulip"
  | "leaf" | "branch" | "fern" | "grass" | "moss" | "twig"
  | "tree" | "bonsai"
  | "shell" | "scallop" | "spiral" | "coral" | "coral-fan"
  | "stone" | "pebble" | "seed" | "pearl" | "sand" | "root"
  | "cloud" | "moon" | "sun" | "star" | "mist" | "rain" | "wind";

export const SHAPE_LIBRARY: { kind: ShapeKind; label: string; family: "végétal" | "minéral" | "marin" | "ciel" }[] = [
  // végétal — fleurs
  { kind: "petal",   label: "Pétale",     family: "végétal" },
  { kind: "rose",    label: "Rose",       family: "végétal" },
  { kind: "anemone", label: "Anémone",    family: "végétal" },
  { kind: "iris",    label: "Iris",       family: "végétal" },
  { kind: "daisy",   label: "Marguerite", family: "végétal" },
  { kind: "tulip",   label: "Tulipe",     family: "végétal" },
  // végétal — feuillages
  { kind: "leaf",   label: "Feuille",    family: "végétal" },
  { kind: "branch", label: "Branche",    family: "végétal" },
  { kind: "fern",   label: "Fougère",    family: "végétal" },
  { kind: "grass",  label: "Herbe",      family: "végétal" },
  { kind: "moss",   label: "Mousse",     family: "végétal" },
  { kind: "twig",   label: "Brindille",  family: "végétal" },
  { kind: "tree",   label: "Arbre",      family: "végétal" },
  { kind: "bonsai", label: "Bonsaï",     family: "végétal" },
  // marin
  { kind: "shell",     label: "Coquillage",  family: "marin" },
  { kind: "scallop",   label: "Saint-Jacques", family: "marin" },
  { kind: "spiral",    label: "Nautile",     family: "marin" },
  { kind: "coral",     label: "Corail",      family: "marin" },
  { kind: "coral-fan", label: "Gorgone",     family: "marin" },
  { kind: "pearl",     label: "Perle",       family: "marin" },
  // minéral
  { kind: "stone",  label: "Pierre",     family: "minéral" },
  { kind: "pebble", label: "Galet",      family: "minéral" },
  { kind: "seed",   label: "Graine",     family: "minéral" },
  { kind: "sand",   label: "Sable",      family: "minéral" },
  { kind: "root",   label: "Racine",     family: "minéral" },
  // ciel
  { kind: "cloud", label: "Nuage",  family: "ciel" },
  { kind: "moon",  label: "Lune",   family: "ciel" },
  { kind: "sun",   label: "Soleil", family: "ciel" },
  { kind: "star",  label: "Étoile", family: "ciel" },
  { kind: "mist",  label: "Brume",  family: "ciel" },
  { kind: "rain",  label: "Pluie",  family: "ciel" },
  { kind: "wind",  label: "Vent",   family: "ciel" },
];

export function OrganicShape({
  kind, size = 64, tint = "var(--rose)", tint2 = "var(--peach)", className = "",
}: {
  kind: ShapeKind; size?: number; tint?: string; tint2?: string; className?: string;
}) {
  const id = `g-${kind}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={tint} />
          <stop offset="100%" stopColor={tint2} />
        </radialGradient>
        <linearGradient id={`${id}-l`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={tint} />
          <stop offset="100%" stopColor={tint2} />
        </linearGradient>
      </defs>
      <Shape kind={kind} fill={`url(#${id})`} stroke={tint} lineFill={`url(#${id}-l)`} />
    </svg>
  );
}

function Shape({ kind, fill, stroke, lineFill }: { kind: ShapeKind; fill: string; stroke: string; lineFill: string }) {
  switch (kind) {
    case "petal":
      return <path d="M50 8 C 78 24 88 60 64 88 C 50 80 38 70 30 56 C 22 38 30 18 50 8 Z" fill={fill} />;
    case "rose":
      return (
        <g>
          <circle cx="50" cy="50" r="34" fill={fill} opacity="0.55" />
          <circle cx="50" cy="50" r="24" fill={fill} opacity="0.7" />
          <circle cx="50" cy="50" r="14" fill={fill} />
          <circle cx="50" cy="50" r="6" fill={stroke} opacity="0.4" />
        </g>
      );
    case "anemone":
      return (
        <g fill={fill}>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x = 50 + Math.cos(a) * 22;
            const y = 50 + Math.sin(a) * 22;
            return <ellipse key={i} cx={x} cy={y} rx="14" ry="22" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />;
          })}
          <circle cx="50" cy="50" r="10" fill={stroke} opacity="0.55" />
        </g>
      );
    case "iris":
      return (
        <g fill={fill}>
          <path d="M50 14 C 38 30 36 46 50 60 C 64 46 62 30 50 14 Z" />
          <path d="M22 50 C 32 60 44 60 50 54 C 44 38 32 36 22 50 Z" opacity="0.85" />
          <path d="M78 50 C 68 60 56 60 50 54 C 56 38 68 36 78 50 Z" opacity="0.85" />
          <path d="M50 56 C 44 72 44 84 50 90 C 56 84 56 72 50 56 Z" />
        </g>
      );
    case "daisy":
      return (
        <g>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const x = 50 + Math.cos(a) * 24;
            const y = 50 + Math.sin(a) * 24;
            return <ellipse key={i} cx={x} cy={y} rx="6" ry="16" transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} fill={fill} />;
          })}
          <circle cx="50" cy="50" r="9" fill={stroke} opacity="0.65" />
        </g>
      );
    case "tulip":
      return (
        <g>
          <path d="M50 18 C 32 22 28 50 50 60 C 72 50 68 22 50 18 Z" fill={fill} />
          <path d="M50 60 L 50 90" stroke={stroke} strokeWidth="2" fill="none" />
          <path d="M50 78 C 58 74 64 80 64 86" stroke={stroke} strokeWidth="2" fill="none" />
        </g>
      );
    case "leaf":
      return (
        <g>
          <path d="M14 70 C 30 20 70 14 88 32 C 78 70 42 88 14 70 Z" fill={fill} />
          <path d="M22 64 C 40 38 62 28 82 36" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" fill="none" />
        </g>
      );
    case "branch":
      return (
        <g stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M16 84 C 36 70 50 50 70 30" />
          <path d="M44 56 L 32 48" />
          <path d="M56 42 L 70 38" />
          <path d="M64 36 L 60 24" />
        </g>
      );
    case "fern":
      return (
        <g stroke={fill} strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M50 92 C 50 60 50 30 50 10" />
          {Array.from({ length: 7 }).map((_, i) => {
            const y = 18 + i * 11;
            const len = 8 + i * 3;
            return (
              <g key={i}>
                <path d={`M50 ${y} C ${50 - len} ${y - 2} ${50 - len - 4} ${y + 6} ${50 - len - 8} ${y + 10}`} />
                <path d={`M50 ${y} C ${50 + len} ${y - 2} ${50 + len + 4} ${y + 6} ${50 + len + 8} ${y + 10}`} />
              </g>
            );
          })}
        </g>
      );
    case "grass":
      return (
        <g stroke={fill} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M30 90 C 28 70 30 56 22 36" />
          <path d="M50 92 C 50 70 54 50 50 28" />
          <path d="M70 90 C 72 70 70 56 78 36" />
        </g>
      );
    case "moss":
      return (
        <g fill={fill}>
          <circle cx="30" cy="62" r="14" />
          <circle cx="50" cy="58" r="18" />
          <circle cx="68" cy="64" r="13" />
          <circle cx="42" cy="44" r="9" />
          <circle cx="60" cy="46" r="8" />
        </g>
      );
    case "twig":
      return (
        <g stroke={fill} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M14 80 L 86 28" />
          <path d="M40 60 L 30 50" />
          <path d="M58 46 L 66 36" />
        </g>
      );
    case "tree":
      return (
        <g>
          <rect x="46" y="60" width="8" height="30" fill={stroke} opacity="0.7" />
          <circle cx="50" cy="42" r="28" fill={fill} />
          <circle cx="36" cy="50" r="14" fill={fill} opacity="0.85" />
          <circle cx="64" cy="48" r="16" fill={fill} opacity="0.9" />
        </g>
      );
    case "bonsai":
      return (
        <g>
          <path d="M50 88 C 48 70 44 60 38 52 C 32 44 30 36 36 28" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="38" cy="26" rx="20" ry="10" fill={fill} />
          <ellipse cx="58" cy="32" rx="14" ry="7" fill={fill} opacity="0.85" />
          <path d="M30 90 L 70 90" stroke={stroke} strokeWidth="2" />
        </g>
      );
    case "shell":
      return (
        <g>
          <path d="M50 14 C 80 24 90 70 50 90 C 10 70 20 24 50 14 Z" fill={fill} />
          <g stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none">
            <path d="M50 16 C 60 40 60 70 50 88" />
            <path d="M40 18 C 36 40 40 70 48 88" />
            <path d="M60 18 C 64 40 60 70 52 88" />
            <path d="M30 24 C 30 50 40 76 48 88" />
            <path d="M70 24 C 70 50 60 76 52 88" />
          </g>
        </g>
      );
    case "scallop":
      return (
        <g>
          <path d="M14 78 L 50 14 L 86 78 C 70 88 30 88 14 78 Z" fill={fill} />
          <g stroke="rgba(255,255,255,0.55)" strokeWidth="1" fill="none">
            {Array.from({ length: 9 }).map((_, i) => {
              const x = 18 + i * 8;
              return <path key={i} d={`M${x} 78 L 50 18`} />;
            })}
          </g>
        </g>
      );
    case "spiral":
      return (
        <g fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round">
          <path d="M50 50 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0" opacity="0.35" />
          <path d="M50 50 m -22 0 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0" opacity="0.55" />
          <path d="M50 50 m -14 0 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0" opacity="0.8" />
          <circle cx="50" cy="50" r="5" fill={fill} stroke="none" />
        </g>
      );
    case "coral":
      return (
        <g stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M50 90 L 50 60" />
          <path d="M50 70 L 30 50 L 26 30" />
          <path d="M50 70 L 70 50 L 74 30" />
          <path d="M50 60 L 50 30" />
          <path d="M30 50 L 22 42" />
          <path d="M70 50 L 78 42" />
          <path d="M50 30 L 42 18" />
          <path d="M50 30 L 58 18" />
        </g>
      );
    case "coral-fan":
      return (
        <g stroke={fill} strokeWidth="2" fill="none" strokeLinecap="round">
          {Array.from({ length: 9 }).map((_, i) => {
            const a = -Math.PI / 2 + (i - 4) * 0.22;
            const x = 50 + Math.cos(a) * 38;
            const y = 90 + Math.sin(a) * 70;
            return <path key={i} d={`M50 90 Q ${(50 + x) / 2 + (i - 4) * 2} ${(90 + y) / 2} ${x} ${y}`} />;
          })}
        </g>
      );
    case "pearl":
      return (
        <g>
          <circle cx="50" cy="50" r="32" fill={fill} />
          <circle cx="40" cy="38" r="8" fill="rgba(255,255,255,0.5)" />
        </g>
      );
    case "stone":
      return <path d="M22 56 C 24 30 50 18 72 30 C 88 42 84 70 64 80 C 40 90 18 78 22 56 Z" fill={fill} />;
    case "pebble":
      return (
        <g fill={fill}>
          <ellipse cx="36" cy="60" rx="22" ry="14" />
          <ellipse cx="62" cy="50" rx="18" ry="12" opacity="0.85" />
        </g>
      );
    case "seed":
      return <ellipse cx="50" cy="50" rx="18" ry="32" fill={fill} />;
    case "sand":
      return (
        <g fill={fill}>
          {Array.from({ length: 24 }).map((_, i) => (
            <circle key={i} cx={10 + (i * 13) % 80} cy={20 + ((i * 29) % 70)} r={1 + (i % 3)} opacity={0.55 + (i % 4) * 0.1} />
          ))}
        </g>
      );
    case "root":
      return (
        <g stroke={fill} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M50 10 L 50 50" />
          <path d="M50 50 C 40 60 30 70 20 88" />
          <path d="M50 50 C 60 60 70 70 80 88" />
          <path d="M50 50 C 50 70 48 80 46 90" />
          <path d="M30 70 C 24 76 22 82 22 88" />
        </g>
      );
    case "cloud":
      return (
        <g fill={fill}>
          <ellipse cx="38" cy="58" rx="22" ry="14" />
          <ellipse cx="60" cy="52" rx="26" ry="16" />
          <ellipse cx="50" cy="46" rx="18" ry="12" />
        </g>
      );
    case "moon":
      return <path d="M62 18 A 36 36 0 1 0 62 82 A 28 28 0 1 1 62 18 Z" fill={fill} />;
    case "sun":
      return (
        <g>
          <circle cx="50" cy="50" r="20" fill={fill} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x1 = 50 + Math.cos(a) * 28, y1 = 50 + Math.sin(a) * 28;
            const x2 = 50 + Math.cos(a) * 38, y2 = 50 + Math.sin(a) * 38;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={fill} strokeWidth="2.5" strokeLinecap="round" />;
          })}
        </g>
      );
    case "star":
      return <path d="M50 14 L 56 44 L 86 50 L 56 56 L 50 86 L 44 56 L 14 50 L 44 44 Z" fill={fill} />;
    case "mist":
      return (
        <g fill={fill} opacity="0.7">
          <ellipse cx="30" cy="40" rx="22" ry="6" />
          <ellipse cx="60" cy="52" rx="28" ry="6" />
          <ellipse cx="44" cy="64" rx="24" ry="5" />
        </g>
      );
    case "rain":
      return (
        <g stroke={fill} strokeWidth="2.5" strokeLinecap="round">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={20 + i * 8} y1={20 + (i % 2) * 14} x2={16 + i * 8} y2={40 + (i % 2) * 14} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`b${i}`} x1={26 + i * 10} y1={60} x2={22 + i * 10} y2={80} />
          ))}
        </g>
      );
    case "wind":
      return (
        <g stroke={fill} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M14 36 C 40 28 60 32 86 26" />
          <path d="M14 56 C 40 48 60 52 86 46" />
          <path d="M14 76 C 30 72 46 74 60 70" />
        </g>
      );
  }
}
