/**
 * Lightweight SVG glyphs for the composition editor.
 * Soft, organic, never literal — they read as petal / shell / leaf without illustration overhead.
 */

export type ShapeKind =
  | "petal"
  | "shell"
  | "leaf"
  | "branch"
  | "grass"
  | "moss"
  | "stone"
  | "seed"
  | "pearl"
  | "cloud"
  | "moon"
  | "star"
  | "mist";

export const SHAPE_LIBRARY: { kind: ShapeKind; label: string; family: "végétal" | "minéral" | "ciel" }[] = [
  { kind: "petal",  label: "Pétale",     family: "végétal" },
  { kind: "leaf",   label: "Feuille",    family: "végétal" },
  { kind: "branch", label: "Branche",    family: "végétal" },
  { kind: "grass",  label: "Herbe",      family: "végétal" },
  { kind: "moss",   label: "Mousse",     family: "végétal" },
  { kind: "shell",  label: "Coquillage", family: "minéral" },
  { kind: "stone",  label: "Pierre",     family: "minéral" },
  { kind: "seed",   label: "Graine",     family: "minéral" },
  { kind: "pearl",  label: "Perle",      family: "minéral" },
  { kind: "cloud",  label: "Nuage",      family: "ciel" },
  { kind: "moon",   label: "Lune",       family: "ciel" },
  { kind: "star",   label: "Étoile",     family: "ciel" },
  { kind: "mist",   label: "Brume",      family: "ciel" },
];

export function OrganicShape({
  kind,
  size = 64,
  tint = "var(--rose)",
  tint2 = "var(--peach)",
  className = "",
}: {
  kind: ShapeKind;
  size?: number;
  tint?: string;
  tint2?: string;
  className?: string;
}) {
  const id = `g-${kind}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={tint} />
          <stop offset="100%" stopColor={tint2} />
        </radialGradient>
      </defs>
      <Path kind={kind} fill={`url(#${id})`} />
    </svg>
  );
}

function Path({ kind, fill }: { kind: ShapeKind; fill: string }) {
  switch (kind) {
    case "petal":
      return <path d="M50 8 C 78 24 88 60 64 88 C 50 80 38 70 30 56 C 22 38 30 18 50 8 Z" fill={fill} />;
    case "leaf":
      return (
        <g>
          <path d="M14 70 C 30 20 70 14 88 32 C 78 70 42 88 14 70 Z" fill={fill} />
          <path d="M22 64 C 40 38 62 28 82 36" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none" />
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
    case "stone":
      return <path d="M22 56 C 24 30 50 18 72 30 C 88 42 84 70 64 80 C 40 90 18 78 22 56 Z" fill={fill} />;
    case "seed":
      return <ellipse cx="50" cy="50" rx="18" ry="32" fill={fill} />;
    case "pearl":
      return (
        <g>
          <circle cx="50" cy="50" r="32" fill={fill} />
          <circle cx="40" cy="38" r="8" fill="rgba(255,255,255,0.45)" />
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
    case "star":
      return (
        <path
          d="M50 14 L 56 44 L 86 50 L 56 56 L 50 86 L 44 56 L 14 50 L 44 44 Z"
          fill={fill}
        />
      );
    case "mist":
      return (
        <g fill={fill} opacity="0.7">
          <ellipse cx="30" cy="40" rx="22" ry="6" />
          <ellipse cx="60" cy="52" rx="28" ry="6" />
          <ellipse cx="44" cy="64" rx="24" ry="5" />
        </g>
      );
  }
}