/**
 * SVG glyphs for the composition editor — a richer, more detailed library.
 * Two rendering styles are mixed in the same library:
 *  - "soft"  : tinted fills, gradient washes, watercolour feel
 *  - "inked" : visible pen strokes, fine-line botanical/zoological detail
 * Families: végétal, marin, minéral, ciel, vivant, exotique.
 */

export type ShapeKind =
  // végétal — fleurs
  | "petal" | "rose" | "anemone" | "iris" | "daisy" | "tulip" | "poppy" | "camellia" | "lotus" | "magnolia"
  // végétal — feuillages
  | "leaf" | "branch" | "fern" | "grass" | "moss" | "twig" | "tree" | "bonsai" | "willow" | "ginkgo" | "maple" | "bamboo"
  // marin
  | "shell" | "scallop" | "spiral" | "coral" | "coral-fan" | "pearl" | "kelp" | "urchin" | "jellyfish" | "starfish" | "anglerfish"
  // minéral
  | "stone" | "pebble" | "seed" | "sand" | "root" | "crystal" | "amber"
  // ciel
  | "cloud" | "moon" | "sun" | "star" | "mist" | "rain" | "wind" | "comet" | "halo"
  // vivant — animaux & insectes
  | "bird" | "swallow" | "crane" | "fish" | "koi" | "butterfly" | "moth" | "bee" | "dragonfly" | "deer" | "hare" | "snail" | "feather"
  // exotique
  | "palm" | "monstera" | "orchid" | "bird-of-paradise" | "cactus" | "hummingbird" | "lantern" | "torii";

export const SHAPE_LIBRARY: { kind: ShapeKind; label: string; family: "végétal" | "minéral" | "marin" | "ciel" | "vivant" | "exotique" }[] = [
  // végétal
  { kind: "petal",   label: "Pétale",     family: "végétal" },
  { kind: "rose",    label: "Rose",       family: "végétal" },
  { kind: "anemone", label: "Anémone",    family: "végétal" },
  { kind: "iris",    label: "Iris",       family: "végétal" },
  { kind: "daisy",   label: "Marguerite", family: "végétal" },
  { kind: "tulip",   label: "Tulipe",     family: "végétal" },
  { kind: "poppy",   label: "Coquelicot", family: "végétal" },
  { kind: "camellia",label: "Camélia",    family: "végétal" },
  { kind: "lotus",   label: "Lotus",      family: "végétal" },
  { kind: "magnolia",label: "Magnolia",   family: "végétal" },
  { kind: "leaf",   label: "Feuille",    family: "végétal" },
  { kind: "branch", label: "Branche",    family: "végétal" },
  { kind: "fern",   label: "Fougère",    family: "végétal" },
  { kind: "grass",  label: "Herbe",      family: "végétal" },
  { kind: "moss",   label: "Mousse",     family: "végétal" },
  { kind: "twig",   label: "Brindille",  family: "végétal" },
  { kind: "tree",   label: "Arbre",      family: "végétal" },
  { kind: "bonsai", label: "Bonsaï",     family: "végétal" },
  { kind: "willow", label: "Saule",      family: "végétal" },
  { kind: "ginkgo", label: "Ginkgo",     family: "végétal" },
  { kind: "maple",  label: "Érable",     family: "végétal" },
  { kind: "bamboo", label: "Bambou",     family: "végétal" },
  // marin
  { kind: "shell",     label: "Coquillage",   family: "marin" },
  { kind: "scallop",   label: "Saint-Jacques",family: "marin" },
  { kind: "spiral",    label: "Nautile",      family: "marin" },
  { kind: "coral",     label: "Corail",       family: "marin" },
  { kind: "coral-fan", label: "Gorgone",      family: "marin" },
  { kind: "pearl",     label: "Perle",        family: "marin" },
  { kind: "kelp",      label: "Algue",        family: "marin" },
  { kind: "urchin",    label: "Oursin",       family: "marin" },
  { kind: "jellyfish", label: "Méduse",       family: "marin" },
  { kind: "starfish",  label: "Étoile de mer",family: "marin" },
  { kind: "anglerfish",label: "Poisson rare", family: "marin" },
  // minéral
  { kind: "stone",   label: "Pierre",     family: "minéral" },
  { kind: "pebble",  label: "Galet",      family: "minéral" },
  { kind: "seed",    label: "Graine",     family: "minéral" },
  { kind: "sand",    label: "Sable",      family: "minéral" },
  { kind: "root",    label: "Racine",     family: "minéral" },
  { kind: "crystal", label: "Cristal",    family: "minéral" },
  { kind: "amber",   label: "Ambre",      family: "minéral" },
  // ciel
  { kind: "cloud", label: "Nuage",  family: "ciel" },
  { kind: "moon",  label: "Lune",   family: "ciel" },
  { kind: "sun",   label: "Soleil", family: "ciel" },
  { kind: "star",  label: "Étoile", family: "ciel" },
  { kind: "mist",  label: "Brume",  family: "ciel" },
  { kind: "rain",  label: "Pluie",  family: "ciel" },
  { kind: "wind",  label: "Vent",   family: "ciel" },
  { kind: "comet", label: "Comète", family: "ciel" },
  { kind: "halo",  label: "Halo",   family: "ciel" },
  // vivant
  { kind: "bird",      label: "Oiseau",     family: "vivant" },
  { kind: "swallow",   label: "Hirondelle", family: "vivant" },
  { kind: "crane",     label: "Grue",       family: "vivant" },
  { kind: "fish",      label: "Poisson",    family: "vivant" },
  { kind: "koi",       label: "Carpe koï",  family: "vivant" },
  { kind: "butterfly", label: "Papillon",   family: "vivant" },
  { kind: "moth",      label: "Phalène",    family: "vivant" },
  { kind: "bee",       label: "Abeille",    family: "vivant" },
  { kind: "dragonfly", label: "Libellule",  family: "vivant" },
  { kind: "deer",      label: "Cerf",       family: "vivant" },
  { kind: "hare",      label: "Lièvre",     family: "vivant" },
  { kind: "snail",     label: "Escargot",   family: "vivant" },
  { kind: "feather",   label: "Plume",      family: "vivant" },
  // exotique
  { kind: "palm",            label: "Palmier",        family: "exotique" },
  { kind: "monstera",        label: "Monstera",       family: "exotique" },
  { kind: "orchid",          label: "Orchidée",       family: "exotique" },
  { kind: "bird-of-paradise",label: "Oiseau du paradis", family: "exotique" },
  { kind: "cactus",          label: "Cactus",         family: "exotique" },
  { kind: "hummingbird",     label: "Colibri",        family: "exotique" },
  { kind: "lantern",         label: "Lanterne",       family: "exotique" },
  { kind: "torii",           label: "Torii",          family: "exotique" },
];

/** Shapes drawn primarily in line/ink style — they reveal pen detail. */
const INKED: Set<ShapeKind> = new Set<ShapeKind>([
  "branch","fern","grass","twig","root","coral","coral-fan","kelp","crane","swallow","bird",
  "dragonfly","bee","butterfly","moth","feather","willow","bamboo","ginkgo","maple","monstera",
  "orchid","bird-of-paradise","hummingbird","lantern","torii","wind","rain","comet","halo",
  "spiral","urchin","jellyfish","anglerfish","snail","hare","deer","koi","fish","starfish","cactus","palm",
]);

export function OrganicShape({
  kind, size = 64, tint = "var(--rose)", tint2 = "var(--peach)", className = "",
}: {
  kind: ShapeKind; size?: number; tint?: string; tint2?: string; className?: string;
}) {
  const id = `g-${kind}-${Math.random().toString(36).slice(2, 7)}`;
  const inked = INKED.has(kind);
  // Each species has its OWN realistic palette so a parterre never looks
  // monochromatic. The parent tint is preserved as a subtle wash for cohesion.
  const native = NATIVE_PALETTE[kind];
  const a = native?.[0] ?? tint;
  const b = native?.[1] ?? tint2;
  const c = native?.[2] ?? tint2;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <defs>
        {/* Realistic, multi-stop fill that gives each element its own life. */}
        <radialGradient id={id} cx="32%" cy="28%" r="85%">
          <stop offset="0%" stopColor={a} stopOpacity="1" />
          <stop offset="55%" stopColor={b} stopOpacity="0.95" />
          <stop offset="100%" stopColor={c} stopOpacity="1" />
        </radialGradient>
        <linearGradient id={`${id}-l`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
        {/* watercolour wash behind inked elements — uses the species color */}
        <radialGradient id={`${id}-w`} cx="50%" cy="55%" r="65%">
          <stop offset="0%" stopColor={a} stopOpacity="0.28" />
          <stop offset="100%" stopColor={a} stopOpacity="0" />
        </radialGradient>
        {/* parent-tint overlay for cohesion with the parterre */}
        <radialGradient id={`${id}-t`} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor={tint} stopOpacity="0.0" />
          <stop offset="100%" stopColor={tint} stopOpacity="0.18" />
        </radialGradient>
      </defs>
      {inked && <circle cx="50" cy="55" r="46" fill={`url(#${id}-w)`} />}
      <Shape kind={kind} fill={`url(#${id})`} stroke={b} stroke2={c} lineFill={`url(#${id}-l)`} />
      <circle cx="50" cy="50" r="50" fill={`url(#${id}-t)`} />
    </svg>
  );
}

/**
 * Realistic native palette per species [highlight, body, shadow/accent].
 * Tones are kept gentle (oklch with limited chroma) to stay in the project's
 * watercolour register, but each kind has its OWN dominant hue.
 */
const NATIVE_PALETTE: Partial<Record<ShapeKind, [string, string, string]>> = {
  // — fleurs
  rose:     ["oklch(0.86 0.12 18)",  "oklch(0.72 0.16 20)",  "oklch(0.55 0.14 22)"],
  anemone:  ["oklch(0.92 0.05 320)", "oklch(0.78 0.12 340)", "oklch(0.42 0.10 320)"],
  iris:     ["oklch(0.86 0.08 290)", "oklch(0.62 0.14 295)", "oklch(0.45 0.13 290)"],
  daisy:    ["oklch(0.98 0.02 90)",  "oklch(0.94 0.04 90)",  "oklch(0.78 0.16 80)"],
  tulip:    ["oklch(0.82 0.16 35)",  "oklch(0.66 0.20 30)",  "oklch(0.40 0.10 25)"],
  poppy:    ["oklch(0.78 0.20 28)",  "oklch(0.58 0.22 25)",  "oklch(0.32 0.10 25)"],
  camellia: ["oklch(0.92 0.06 10)",  "oklch(0.78 0.12 12)",  "oklch(0.55 0.14 15)"],
  lotus:    ["oklch(0.96 0.03 350)", "oklch(0.86 0.08 350)", "oklch(0.62 0.10 350)"],
  magnolia: ["oklch(0.98 0.02 60)",  "oklch(0.92 0.05 50)",  "oklch(0.72 0.10 30)"],
  petal:    ["oklch(0.88 0.10 20)",  "oklch(0.72 0.14 20)",  "oklch(0.50 0.12 20)"],
  // — feuillages
  leaf:     ["oklch(0.78 0.13 145)", "oklch(0.58 0.13 145)", "oklch(0.38 0.10 145)"],
  branch:   ["oklch(0.55 0.05 60)",  "oklch(0.42 0.06 50)",  "oklch(0.30 0.06 40)"],
  fern:     ["oklch(0.62 0.12 150)", "oklch(0.48 0.12 150)", "oklch(0.32 0.10 150)"],
  grass:    ["oklch(0.72 0.13 135)", "oklch(0.55 0.13 140)", "oklch(0.38 0.10 140)"],
  moss:     ["oklch(0.68 0.10 145)", "oklch(0.52 0.10 150)", "oklch(0.38 0.08 150)"],
  twig:     ["oklch(0.55 0.06 55)",  "oklch(0.40 0.06 45)",  "oklch(0.28 0.05 40)"],
  tree:     ["oklch(0.65 0.12 145)", "oklch(0.48 0.12 150)", "oklch(0.32 0.08 150)"],
  bonsai:   ["oklch(0.62 0.10 140)", "oklch(0.45 0.06 60)",  "oklch(0.30 0.06 50)"],
  willow:   ["oklch(0.78 0.10 135)", "oklch(0.62 0.10 140)", "oklch(0.45 0.08 145)"],
  ginkgo:   ["oklch(0.92 0.13 95)",  "oklch(0.82 0.16 90)",  "oklch(0.55 0.14 85)"],
  maple:    ["oklch(0.78 0.18 40)",  "oklch(0.62 0.20 30)",  "oklch(0.42 0.12 25)"],
  bamboo:   ["oklch(0.72 0.11 130)", "oklch(0.55 0.12 135)", "oklch(0.38 0.08 135)"],
  // — marin
  shell:    ["oklch(0.94 0.04 60)",  "oklch(0.82 0.07 50)",  "oklch(0.62 0.08 40)"],
  scallop:  ["oklch(0.92 0.06 40)",  "oklch(0.80 0.09 35)",  "oklch(0.60 0.09 30)"],
  spiral:   ["oklch(0.90 0.06 70)",  "oklch(0.76 0.08 60)",  "oklch(0.55 0.08 50)"],
  coral:    ["oklch(0.82 0.14 25)",  "oklch(0.66 0.16 22)",  "oklch(0.45 0.12 20)"],
  "coral-fan":["oklch(0.86 0.10 12)","oklch(0.70 0.14 10)",  "oklch(0.48 0.12 8)"],
  pearl:    ["oklch(0.98 0.01 280)", "oklch(0.92 0.03 270)", "oklch(0.78 0.05 260)"],
  kelp:     ["oklch(0.55 0.10 155)", "oklch(0.40 0.10 155)", "oklch(0.28 0.08 150)"],
  urchin:   ["oklch(0.50 0.10 320)", "oklch(0.38 0.10 320)", "oklch(0.22 0.06 310)"],
  jellyfish:["oklch(0.92 0.05 320)", "oklch(0.80 0.08 310)", "oklch(0.62 0.10 300)"],
  starfish: ["oklch(0.82 0.14 50)",  "oklch(0.68 0.16 45)",  "oklch(0.48 0.12 40)"],
  anglerfish:["oklch(0.45 0.04 230)","oklch(0.32 0.06 240)", "oklch(0.20 0.04 240)"],
  // — minéral
  stone:    ["oklch(0.78 0.02 80)",  "oklch(0.62 0.03 70)",  "oklch(0.42 0.03 60)"],
  pebble:   ["oklch(0.82 0.02 90)",  "oklch(0.68 0.03 80)",  "oklch(0.48 0.03 70)"],
  seed:     ["oklch(0.65 0.06 60)",  "oklch(0.48 0.06 50)",  "oklch(0.30 0.05 40)"],
  sand:     ["oklch(0.92 0.03 80)",  "oklch(0.82 0.05 70)",  "oklch(0.65 0.06 60)"],
  root:     ["oklch(0.50 0.05 50)",  "oklch(0.36 0.05 40)",  "oklch(0.22 0.04 35)"],
  crystal:  ["oklch(0.92 0.06 220)", "oklch(0.78 0.10 215)", "oklch(0.55 0.12 220)"],
  amber:    ["oklch(0.86 0.13 70)",  "oklch(0.70 0.16 60)",  "oklch(0.48 0.13 55)"],
  // — ciel
  cloud:    ["oklch(0.98 0.01 240)", "oklch(0.92 0.02 240)", "oklch(0.80 0.03 240)"],
  moon:     ["oklch(0.96 0.02 90)",  "oklch(0.86 0.04 80)",  "oklch(0.70 0.05 70)"],
  sun:      ["oklch(0.96 0.10 90)",  "oklch(0.86 0.16 80)",  "oklch(0.68 0.18 70)"],
  star:     ["oklch(0.98 0.02 90)",  "oklch(0.88 0.10 90)",  "oklch(0.72 0.14 85)"],
  mist:     ["oklch(0.92 0.02 240)", "oklch(0.82 0.03 240)", "oklch(0.68 0.04 240)"],
  rain:     ["oklch(0.78 0.05 230)", "oklch(0.62 0.08 230)", "oklch(0.45 0.08 230)"],
  wind:     ["oklch(0.86 0.02 200)", "oklch(0.72 0.04 210)", "oklch(0.55 0.05 220)"],
  comet:    ["oklch(0.92 0.05 250)", "oklch(0.72 0.10 260)", "oklch(0.45 0.12 270)"],
  halo:     ["oklch(0.96 0.04 90)",  "oklch(0.86 0.08 80)",  "oklch(0.65 0.10 70)"],
  // — vivant
  bird:     ["oklch(0.55 0.06 250)", "oklch(0.40 0.08 250)", "oklch(0.25 0.06 250)"],
  swallow:  ["oklch(0.45 0.05 260)", "oklch(0.30 0.06 260)", "oklch(0.18 0.04 260)"],
  crane:    ["oklch(0.96 0.02 90)",  "oklch(0.85 0.04 80)",  "oklch(0.32 0.10 25)"],
  fish:     ["oklch(0.78 0.08 220)", "oklch(0.58 0.12 220)", "oklch(0.38 0.10 220)"],
  koi:      ["oklch(0.96 0.02 60)",  "oklch(0.78 0.18 35)",  "oklch(0.45 0.14 25)"],
  butterfly:["oklch(0.86 0.13 30)",  "oklch(0.62 0.18 285)", "oklch(0.32 0.10 280)"],
  moth:     ["oklch(0.78 0.06 60)",  "oklch(0.55 0.07 50)",  "oklch(0.32 0.06 40)"],
  bee:      ["oklch(0.92 0.16 90)",  "oklch(0.65 0.16 80)",  "oklch(0.20 0.04 60)"],
  dragonfly:["oklch(0.82 0.10 180)", "oklch(0.62 0.14 195)", "oklch(0.38 0.12 200)"],
  deer:     ["oklch(0.72 0.08 60)",  "oklch(0.55 0.09 55)",  "oklch(0.35 0.07 45)"],
  hare:     ["oklch(0.80 0.04 70)",  "oklch(0.62 0.05 65)",  "oklch(0.42 0.05 55)"],
  snail:    ["oklch(0.82 0.06 60)",  "oklch(0.62 0.08 55)",  "oklch(0.42 0.08 45)"],
  feather:  ["oklch(0.92 0.04 80)",  "oklch(0.75 0.06 70)",  "oklch(0.50 0.06 60)"],
  // — exotique
  palm:     ["oklch(0.65 0.13 145)", "oklch(0.50 0.13 145)", "oklch(0.32 0.10 145)"],
  monstera: ["oklch(0.62 0.14 150)", "oklch(0.45 0.13 150)", "oklch(0.28 0.10 150)"],
  orchid:   ["oklch(0.92 0.05 320)", "oklch(0.75 0.13 325)", "oklch(0.48 0.13 320)"],
  "bird-of-paradise":["oklch(0.86 0.16 60)","oklch(0.65 0.20 40)","oklch(0.42 0.18 30)"],
  cactus:   ["oklch(0.72 0.10 145)", "oklch(0.55 0.11 145)", "oklch(0.38 0.09 145)"],
  hummingbird:["oklch(0.78 0.14 170)","oklch(0.55 0.16 175)","oklch(0.32 0.12 175)"],
  lantern:  ["oklch(0.86 0.13 35)",  "oklch(0.68 0.16 30)",  "oklch(0.42 0.12 25)"],
  torii:    ["oklch(0.62 0.18 28)",  "oklch(0.48 0.18 25)",  "oklch(0.30 0.10 25)"],
};

function Shape({
  kind, fill, stroke, stroke2, lineFill,
}: { kind: ShapeKind; fill: string; stroke: string; stroke2: string; lineFill: string }) {
  switch (kind) {
    /* ────── végétal — fleurs ────── */
    case "petal":
      return <path d="M50 8 C 78 24 88 60 64 88 C 50 80 38 70 30 56 C 22 38 30 18 50 8 Z" fill={fill} />;
    case "rose":
      return (
        <g>
          <circle cx="50" cy="50" r="34" fill={fill} opacity="0.55" />
          <circle cx="50" cy="50" r="24" fill={fill} opacity="0.7" />
          <circle cx="50" cy="50" r="14" fill={fill} />
          <path d="M50 36 C 56 42 56 52 50 60 C 44 52 44 42 50 36 Z" fill={stroke} opacity="0.55" />
          <circle cx="50" cy="50" r="3" fill={stroke2} />
        </g>
      );
    case "anemone":
      return (
        <g fill={fill}>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const x = 50 + Math.cos(a) * 22;
            const y = 50 + Math.sin(a) * 22;
            return <ellipse key={i} cx={x} cy={y} rx="12" ry="20" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />;
          })}
          <circle cx="50" cy="50" r="9" fill={stroke} opacity="0.7" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <circle key={`d${i}`} cx={50 + Math.cos(a) * 6} cy={50 + Math.sin(a) * 6} r="1" fill={stroke2} />;
          })}
        </g>
      );
    case "iris":
      return (
        <g fill={fill}>
          <path d="M50 14 C 38 30 36 46 50 60 C 64 46 62 30 50 14 Z" />
          <path d="M22 50 C 32 60 44 60 50 54 C 44 38 32 36 22 50 Z" opacity="0.85" />
          <path d="M78 50 C 68 60 56 60 50 54 C 56 38 68 36 78 50 Z" opacity="0.85" />
          <path d="M50 56 C 44 72 44 84 50 90 C 56 84 56 72 50 56 Z" />
          <path d="M50 30 L 50 54" stroke={stroke2} strokeWidth="1" />
        </g>
      );
    case "daisy":
      return (
        <g>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x = 50 + Math.cos(a) * 24;
            const y = 50 + Math.sin(a) * 24;
            return <ellipse key={i} cx={x} cy={y} rx="6" ry="16" transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} fill={fill} />;
          })}
          <circle cx="50" cy="50" r="9" fill={stroke} opacity="0.75" />
          <circle cx="50" cy="50" r="3" fill={stroke2} />
        </g>
      );
    case "tulip":
      return (
        <g>
          <path d="M50 18 C 32 22 28 50 50 60 C 72 50 68 22 50 18 Z" fill={fill} />
          <path d="M50 22 C 46 38 46 52 50 58" stroke={stroke2} strokeWidth="1" fill="none" />
          <path d="M50 60 L 50 90" stroke={stroke} strokeWidth="2" fill="none" />
          <path d="M50 78 C 58 74 64 80 64 86" stroke={stroke} strokeWidth="2" fill="none" />
        </g>
      );
    case "poppy":
      return (
        <g>
          <path d="M50 18 C 22 22 18 56 50 64 C 82 56 78 22 50 18 Z" fill={fill} />
          <path d="M30 36 C 40 50 60 50 70 36" stroke={stroke2} strokeWidth="1" fill="none" />
          <circle cx="50" cy="44" r="6" fill={stroke} />
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="50" y1="44" x2={50 + Math.cos((i / 12) * 6.28) * 9} y2={44 + Math.sin((i / 12) * 6.28) * 9} stroke={stroke2} strokeWidth="0.7" />
          ))}
        </g>
      );
    case "camellia":
      return (
        <g>
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return <ellipse key={i} cx={50 + Math.cos(a) * 14} cy={50 + Math.sin(a) * 14} rx="14" ry="10"
              transform={`rotate(${(a * 180) / Math.PI} ${50 + Math.cos(a) * 14} ${50 + Math.sin(a) * 14})`}
              fill={fill} opacity="0.85" />;
          })}
          {Array.from({ length: 5 }).map((_, i) => {
            const a = (i / 5) * Math.PI * 2 + 0.4;
            return <ellipse key={`b${i}`} cx={50 + Math.cos(a) * 8} cy={50 + Math.sin(a) * 8} rx="9" ry="7"
              transform={`rotate(${(a * 180) / Math.PI} ${50 + Math.cos(a) * 8} ${50 + Math.sin(a) * 8})`}
              fill={fill} />;
          })}
          <circle cx="50" cy="50" r="4" fill={stroke2} />
        </g>
      );
    case "lotus":
      return (
        <g>
          {[-30,-15,0,15,30].map((rot, i) => (
            <path key={i} d="M50 86 C 36 64 40 32 50 18 C 60 32 64 64 50 86 Z" fill={fill} opacity={0.6 + i * 0.08} transform={`rotate(${rot} 50 86)`} />
          ))}
          <path d="M14 86 L 86 86" stroke={stroke2} strokeWidth="1" />
        </g>
      );
    case "magnolia":
      return (
        <g>
          {Array.from({ length: 7 }).map((_, i) => {
            const a = (i / 7) * Math.PI * 2;
            return <ellipse key={i} cx={50 + Math.cos(a) * 18} cy={50 + Math.sin(a) * 18} rx="10" ry="22"
              transform={`rotate(${(a * 180) / Math.PI + 90} ${50 + Math.cos(a) * 18} ${50 + Math.sin(a) * 18})`}
              fill={fill} opacity="0.9" />;
          })}
          <circle cx="50" cy="50" r="7" fill={stroke} />
        </g>
      );
    /* ────── végétal — feuillages ────── */
    case "leaf":
      return (
        <g>
          <path d="M14 70 C 30 20 70 14 88 32 C 78 70 42 88 14 70 Z" fill={fill} />
          <path d="M22 64 C 40 38 62 28 82 36" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" fill="none" />
          <path d="M30 60 L 42 50 M 36 66 L 50 56 M 44 70 L 60 60 M 52 72 L 70 62" stroke={stroke2} strokeWidth="0.6" />
        </g>
      );
    case "branch":
      return (
        <g stroke={fill} strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M12 86 C 36 72 52 50 74 24" />
          <path d="M44 56 L 30 46" /><path d="M58 42 L 70 38" /><path d="M64 36 L 60 22" />
          <circle cx="74" cy="24" r="3" fill={stroke} />
          <circle cx="60" cy="22" r="2" fill={stroke} />
        </g>
      );
    case "fern":
      return (
        <g stroke={fill} strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M50 92 C 50 60 50 30 50 8" />
          {Array.from({ length: 9 }).map((_, i) => {
            const y = 14 + i * 9;
            const len = 6 + i * 3;
            return (
              <g key={i}>
                <path d={`M50 ${y} C ${50 - len} ${y - 1} ${50 - len - 4} ${y + 5} ${50 - len - 9} ${y + 9}`} />
                <path d={`M50 ${y} C ${50 + len} ${y - 1} ${50 + len + 4} ${y + 5} ${50 + len + 9} ${y + 9}`} />
              </g>
            );
          })}
        </g>
      );
    case "grass":
      return (
        <g stroke={fill} strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M28 92 C 26 70 28 56 20 32" />
          <path d="M40 92 C 40 70 44 50 38 26" />
          <path d="M52 92 C 52 68 56 48 52 22" />
          <path d="M64 92 C 66 70 64 56 72 32" />
          <path d="M76 92 C 78 72 76 56 84 40" />
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
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={20 + (i * 11) % 60} cy={40 + ((i * 17) % 30)} r="1.5" fill={stroke2} opacity="0.7" />
          ))}
        </g>
      );
    case "twig":
      return (
        <g stroke={fill} strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M14 80 L 86 28" />
          <path d="M40 60 L 30 50" /><path d="M58 46 L 66 36" />
          <path d="M50 52 L 54 42" />
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
    case "willow":
      return (
        <g stroke={fill} strokeWidth="1.4" fill="none" strokeLinecap="round">
          <path d="M50 10 L 50 30" />
          {Array.from({ length: 14 }).map((_, i) => {
            const x = 18 + i * 5;
            const dy = 20 + ((i * 7) % 12);
            return <path key={i} d={`M${x} 30 C ${x - 2} ${50} ${x + 2} ${70} ${x} ${72 + dy}`} />;
          })}
        </g>
      );
    case "ginkgo":
      return (
        <g>
          <path d="M50 88 L 50 64" stroke={stroke} strokeWidth="1.2" />
          <path d="M50 64 C 18 56 18 24 50 12 C 82 24 82 56 50 64 Z" fill={fill} />
          {Array.from({ length: 7 }).map((_, i) => {
            const a = -1.2 + i * 0.4;
            return <line key={i} x1="50" y1="64" x2={50 + Math.cos(a) * 28} y2={64 + Math.sin(a) * 28} stroke={stroke2} strokeWidth="0.6" />;
          })}
        </g>
      );
    case "maple":
      return (
        <g fill={fill}>
          <path d="M50 14 L 56 32 L 72 22 L 64 40 L 86 42 L 68 52 L 80 70 L 60 60 L 56 84 L 50 68 L 44 84 L 40 60 L 20 70 L 32 52 L 14 42 L 36 40 L 28 22 L 44 32 Z" />
          <path d="M50 68 L 50 90" stroke={stroke} strokeWidth="1.4" />
        </g>
      );
    case "bamboo":
      return (
        <g stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M40 92 L 40 12" /><path d="M62 92 L 62 12" />
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1="36" y1={20 + i * 16} x2="44" y2={20 + i * 16} strokeWidth="1.5" stroke={stroke2} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`b${i}`} x1="58" y1={28 + i * 16} x2="66" y2={28 + i * 16} strokeWidth="1.5" stroke={stroke2} />
          ))}
          <path d="M40 30 C 28 26 22 18 16 14" />
          <path d="M62 46 C 74 42 80 34 86 30" />
        </g>
      );
    /* ────── marin ────── */
    case "shell":
      return (
        <g>
          <path d="M50 14 C 80 24 90 70 50 90 C 10 70 20 24 50 14 Z" fill={fill} />
          <g stroke="rgba(255,255,255,0.55)" strokeWidth="1" fill="none">
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
            {Array.from({ length: 11 }).map((_, i) => {
              const x = 16 + i * 6.8;
              return <path key={i} d={`M${x} 78 L 50 18`} />;
            })}
          </g>
        </g>
      );
    case "spiral":
      return (
        <g fill="none" stroke={fill} strokeWidth="2.2" strokeLinecap="round">
          <path d="M50 50 m -32 0 a 32 32 0 1 0 64 0 a 32 32 0 1 0 -64 0" opacity="0.3" />
          <path d="M50 50 m -24 0 a 24 24 0 1 0 48 0 a 24 24 0 1 0 -48 0" opacity="0.45" />
          <path d="M50 50 m -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0" opacity="0.65" />
          <path d="M50 50 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0" />
          <circle cx="50" cy="50" r="3" fill={fill} stroke="none" />
        </g>
      );
    case "coral":
      return (
        <g stroke={fill} strokeWidth="2.4" fill="none" strokeLinecap="round">
          <path d="M50 90 L 50 60" />
          <path d="M50 70 L 30 50 L 26 30" />
          <path d="M50 70 L 70 50 L 74 30" />
          <path d="M50 60 L 50 30" />
          <path d="M30 50 L 22 42" /><path d="M70 50 L 78 42" />
          <path d="M50 30 L 42 18" /><path d="M50 30 L 58 18" />
          {[26,42,58,74].map((x,i) => <circle key={i} cx={x} cy={i % 2 ? 18 : 30} r="2.2" fill={fill} />)}
        </g>
      );
    case "coral-fan":
      return (
        <g stroke={fill} strokeWidth="1.6" fill="none" strokeLinecap="round">
          {Array.from({ length: 13 }).map((_, i) => {
            const a = -Math.PI / 2 + (i - 6) * 0.18;
            const x = 50 + Math.cos(a) * 40;
            const y = 90 + Math.sin(a) * 70;
            return <path key={i} d={`M50 90 Q ${(50 + x) / 2 + (i - 6) * 2} ${(90 + y) / 2} ${x} ${y}`} />;
          })}
        </g>
      );
    case "pearl":
      return (
        <g>
          <circle cx="50" cy="50" r="32" fill={fill} />
          <circle cx="40" cy="38" r="8" fill="rgba(255,255,255,0.55)" />
          <circle cx="62" cy="60" r="3" fill="rgba(255,255,255,0.4)" />
        </g>
      );
    case "kelp":
      return (
        <g stroke={fill} strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M30 92 C 22 70 38 50 26 28 C 22 18 30 12 36 10" />
          <path d="M52 92 C 60 68 44 48 56 26 C 60 16 52 10 46 10" />
          <path d="M72 92 C 64 68 80 50 70 26" />
          {[20,38,56,72].map((y,i) => <ellipse key={i} cx={i % 2 ? 56 : 30} cy={y} rx="6" ry="3" fill={fill} opacity="0.55" />)}
        </g>
      );
    case "urchin":
      return (
        <g>
          <circle cx="50" cy="50" r="14" fill={fill} />
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return <line key={i} x1={50 + Math.cos(a) * 14} y1={50 + Math.sin(a) * 14} x2={50 + Math.cos(a) * 36} y2={50 + Math.sin(a) * 36} stroke={fill} strokeWidth="1.4" strokeLinecap="round" />;
          })}
        </g>
      );
    case "jellyfish":
      return (
        <g>
          <path d="M22 46 C 22 26 78 26 78 46 C 78 56 70 60 70 56 C 60 60 54 56 50 60 C 46 56 40 60 30 56 C 30 60 22 56 22 46 Z" fill={fill} opacity="0.8" />
          {Array.from({ length: 6 }).map((_, i) => {
            const x = 28 + i * 8;
            return <path key={i} d={`M${x} 56 C ${x + 2} 70 ${x - 2} 80 ${x + 1} 92`} stroke={stroke} strokeWidth="1.2" fill="none" strokeLinecap="round" />;
          })}
        </g>
      );
    case "starfish":
      return (
        <g fill={fill}>
          <path d="M50 8 L 60 38 L 92 40 L 66 58 L 76 90 L 50 70 L 24 90 L 34 58 L 8 40 L 40 38 Z" />
          {Array.from({ length: 30 }).map((_, i) => (
            <circle key={i} cx={20 + (i * 13) % 60} cy={20 + ((i * 17) % 60)} r="1" fill={stroke2} opacity="0.5" />
          ))}
        </g>
      );
    case "anglerfish":
      return (
        <g>
          <path d="M14 56 C 22 32 56 28 78 50 C 80 52 84 50 86 48 L 82 56 L 86 64 C 84 62 80 60 78 62 C 56 84 22 80 14 56 Z" fill={fill} />
          <circle cx="62" cy="50" r="3" fill={stroke} />
          <circle cx="62" cy="50" r="1" fill={stroke2} />
          <path d="M30 60 L 36 56 L 36 64 Z" fill={stroke} />
          <path d="M40 56 L 46 56 M 50 58 L 56 58" stroke={stroke} strokeWidth="1" />
          <path d="M62 32 C 62 22 66 16 74 14" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <circle cx="74" cy="14" r="2.5" fill={stroke2} />
        </g>
      );
    /* ────── minéral ────── */
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
          {Array.from({ length: 28 }).map((_, i) => (
            <circle key={i} cx={10 + (i * 13) % 80} cy={20 + ((i * 29) % 70)} r={1 + (i % 3)} opacity={0.55 + (i % 4) * 0.1} />
          ))}
        </g>
      );
    case "root":
      return (
        <g stroke={fill} strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M50 10 L 50 50" />
          <path d="M50 50 C 40 60 30 70 20 88" />
          <path d="M50 50 C 60 60 70 70 80 88" />
          <path d="M50 50 C 50 70 48 80 46 90" />
          <path d="M30 70 C 24 76 22 82 22 88" />
          <path d="M70 70 C 76 76 78 82 78 88" />
        </g>
      );
    case "crystal":
      return (
        <g>
          <path d="M50 8 L 70 30 L 60 86 L 40 86 L 30 30 Z" fill={fill} />
          <path d="M50 8 L 50 86 M 30 30 L 70 30" stroke={stroke2} strokeWidth="0.8" />
          <path d="M40 30 L 50 8 L 60 30 Z" fill={stroke2} opacity="0.4" />
        </g>
      );
    case "amber":
      return (
        <g>
          <path d="M22 50 C 22 26 78 24 78 52 C 78 78 22 78 22 50 Z" fill={fill} />
          <path d="M40 40 L 44 56 L 48 44 L 52 58 L 56 46 L 60 60" stroke={stroke} strokeWidth="0.8" fill="none" />
          <ellipse cx="50" cy="44" rx="4" ry="6" fill={stroke2} opacity="0.7" />
        </g>
      );
    /* ────── ciel ────── */
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
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={fill} strokeWidth="2.4" strokeLinecap="round" />;
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
        <g stroke={fill} strokeWidth="2" strokeLinecap="round">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={18 + i * 8} y1={20 + (i % 2) * 14} x2={14 + i * 8} y2={40 + (i % 2) * 14} />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`b${i}`} x1={24 + i * 9} y1={60} x2={20 + i * 9} y2={80} />
          ))}
        </g>
      );
    case "wind":
      return (
        <g stroke={fill} strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M14 36 C 40 28 60 32 86 26" />
          <path d="M14 56 C 40 48 60 52 86 46" />
          <path d="M14 76 C 30 72 46 74 60 70" />
        </g>
      );
    case "comet":
      return (
        <g>
          <circle cx="74" cy="28" r="8" fill={fill} />
          <path d="M74 28 C 50 38 30 56 14 86" stroke={fill} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M70 32 C 50 42 32 60 18 84" stroke={stroke2} strokeWidth="1" fill="none" opacity="0.6" />
        </g>
      );
    case "halo":
      return (
        <g fill="none" stroke={fill}>
          <circle cx="50" cy="50" r="36" strokeWidth="0.8" opacity="0.4" />
          <circle cx="50" cy="50" r="28" strokeWidth="0.8" opacity="0.55" />
          <circle cx="50" cy="50" r="20" strokeWidth="1.2" />
          <circle cx="50" cy="50" r="6" fill={fill} />
        </g>
      );
    /* ────── vivant ────── */
    case "bird":
      return (
        <g stroke={fill} strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M14 50 C 30 30 42 30 50 50 C 58 30 70 30 86 50" />
        </g>
      );
    case "swallow":
      return (
        <g fill={fill}>
          <path d="M50 32 C 32 38 18 50 12 60 C 28 56 42 52 50 50 C 58 52 72 56 88 60 C 82 50 68 38 50 32 Z" />
          <path d="M50 50 L 44 70 L 50 64 L 56 70 Z" />
        </g>
      );
    case "crane":
      return (
        <g stroke={fill} strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M50 86 C 50 70 56 60 66 56 C 78 52 84 42 84 30" />
          <circle cx="84" cy="28" r="3" fill={fill} />
          <path d="M86 30 L 92 26" />
          <path d="M40 78 L 30 92 M 56 78 L 50 92" />
          <path d="M40 76 C 24 70 14 56 14 44" />
        </g>
      );
    case "fish":
      return (
        <g fill={fill}>
          <path d="M14 50 C 28 30 64 30 80 50 C 64 70 28 70 14 50 Z" />
          <path d="M80 50 L 92 38 L 88 50 L 92 62 Z" />
          <circle cx="68" cy="46" r="2.5" fill={stroke2} />
          <path d="M30 50 C 40 46 56 46 70 50" stroke={stroke2} strokeWidth="0.8" fill="none" />
        </g>
      );
    case "koi":
      return (
        <g>
          <path d="M14 52 C 28 30 64 30 80 50 C 64 70 28 72 14 52 Z" fill={fill} />
          <path d="M80 50 L 94 38 L 90 52 L 94 64 Z" fill={fill} />
          <ellipse cx="46" cy="44" rx="9" ry="6" fill={stroke} opacity="0.7" />
          <ellipse cx="62" cy="56" rx="6" ry="4" fill={stroke} opacity="0.7" />
          <circle cx="70" cy="44" r="2.5" fill="#222" />
          <path d="M30 38 C 40 44 56 44 70 40" stroke={stroke2} strokeWidth="0.6" fill="none" />
        </g>
      );
    case "butterfly":
      return (
        <g fill={fill}>
          <path d="M50 50 C 30 30 14 32 14 50 C 14 64 28 70 50 56 Z" />
          <path d="M50 50 C 70 30 86 32 86 50 C 86 64 72 70 50 56 Z" />
          <path d="M50 56 C 36 64 26 78 30 90 C 38 84 46 76 50 66 Z" />
          <path d="M50 56 C 64 64 74 78 70 90 C 62 84 54 76 50 66 Z" />
          <ellipse cx="50" cy="54" rx="2" ry="14" fill={stroke} />
          <circle cx="30" cy="44" r="3" fill={stroke2} />
          <circle cx="70" cy="44" r="3" fill={stroke2} />
        </g>
      );
    case "moth":
      return (
        <g fill={fill}>
          <path d="M50 50 C 30 36 12 44 12 56 C 12 66 28 70 50 60 Z" opacity="0.85" />
          <path d="M50 50 C 70 36 88 44 88 56 C 88 66 72 70 50 60 Z" opacity="0.85" />
          <ellipse cx="50" cy="56" rx="2" ry="16" fill={stroke} />
          <path d="M50 38 L 46 28 M 50 38 L 54 28" stroke={stroke} strokeWidth="1.2" />
        </g>
      );
    case "bee":
      return (
        <g>
          <ellipse cx="50" cy="56" rx="24" ry="14" fill={fill} />
          <path d="M40 44 L 40 68 M 50 42 L 50 70 M 60 44 L 60 68" stroke={stroke2} strokeWidth="2" />
          <ellipse cx="38" cy="46" rx="14" ry="6" fill="rgba(255,255,255,0.7)" transform="rotate(-20 38 46)" />
          <ellipse cx="62" cy="46" rx="14" ry="6" fill="rgba(255,255,255,0.7)" transform="rotate(20 62 46)" />
          <circle cx="74" cy="56" r="3" fill={stroke} />
          <line x1="76" y1="54" x2="84" y2="48" stroke={stroke} strokeWidth="1" />
        </g>
      );
    case "dragonfly":
      return (
        <g>
          <ellipse cx="50" cy="50" rx="2" ry="34" fill={stroke} />
          <ellipse cx="32" cy="40" rx="20" ry="6" fill={fill} opacity="0.75" />
          <ellipse cx="68" cy="40" rx="20" ry="6" fill={fill} opacity="0.75" />
          <ellipse cx="34" cy="56" rx="16" ry="5" fill={fill} opacity="0.6" />
          <ellipse cx="66" cy="56" rx="16" ry="5" fill={fill} opacity="0.6" />
          <circle cx="50" cy="20" r="4" fill={stroke} />
        </g>
      );
    case "deer":
      return (
        <g stroke={fill} strokeWidth="1.8" fill="none" strokeLinecap="round">
          <path d="M28 70 L 28 86 M 38 72 L 38 88 M 56 72 L 56 88 M 66 70 L 66 86" />
          <path d="M22 70 C 30 56 60 56 68 68 L 76 60 L 80 50 L 84 56 L 80 64" fill={fill} stroke="none" opacity="0.85" />
          <path d="M82 50 L 78 38 M 86 52 L 90 40" stroke={stroke} strokeWidth="1.2" />
          <circle cx="84" cy="54" r="1.4" fill={stroke} />
        </g>
      );
    case "hare":
      return (
        <g fill={fill}>
          <ellipse cx="50" cy="68" rx="26" ry="16" />
          <circle cx="74" cy="58" r="10" />
          <ellipse cx="70" cy="42" rx="3" ry="12" transform="rotate(-15 70 42)" />
          <ellipse cx="80" cy="42" rx="3" ry="12" transform="rotate(10 80 42)" />
          <circle cx="78" cy="56" r="1.2" fill={stroke} />
          <circle cx="30" cy="76" r="3" fill={fill} />
        </g>
      );
    case "snail":
      return (
        <g>
          <path d="M14 76 C 14 60 38 56 60 60 C 76 64 86 76 86 80 L 14 80 Z" fill={fill} />
          <g fill="none" stroke={fill} strokeWidth="2.2">
            <path d="M50 50 m -22 0 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0" opacity="0.4" />
            <path d="M50 50 m -14 0 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0" opacity="0.7" />
            <circle cx="50" cy="50" r="6" fill={fill} />
          </g>
          <path d="M16 76 C 12 66 8 58 6 50" stroke={stroke} strokeWidth="1.4" fill="none" />
          <circle cx="6" cy="50" r="1.5" fill={stroke} />
        </g>
      );
    case "feather":
      return (
        <g>
          <path d="M50 8 C 38 30 32 56 38 84 C 44 80 56 80 62 84 C 68 56 62 30 50 8 Z" fill={fill} />
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1="50" y1={20 + i * 6} x2={50 + (i % 2 ? 12 : -12)} y2={26 + i * 6} stroke={stroke2} strokeWidth="0.6" />
          ))}
          <path d="M50 84 L 50 96" stroke={stroke} strokeWidth="1.2" />
        </g>
      );
    /* ────── exotique ────── */
    case "palm":
      return (
        <g>
          <path d="M50 92 C 52 70 50 50 48 30" stroke={stroke} strokeWidth="2.4" fill="none" />
          {Array.from({ length: 7 }).map((_, i) => {
            const a = -Math.PI / 2 + (i - 3) * 0.5;
            const x = 50 + Math.cos(a) * 36;
            const y = 30 + Math.sin(a) * 30;
            return <path key={i} d={`M50 30 Q ${(50 + x) / 2 + (i - 3) * 4} ${(30 + y) / 2 - 6} ${x} ${y}`} stroke={fill} strokeWidth="2" fill="none" strokeLinecap="round" />;
          })}
        </g>
      );
    case "monstera":
      return (
        <g>
          <path d="M14 70 C 18 28 60 14 88 30 C 84 70 50 90 14 70 Z" fill={fill} />
          {/* fenestrations */}
          <path d="M30 56 L 50 50 L 44 64 Z" fill="rgba(255,255,255,0.85)" />
          <path d="M58 44 L 74 40 L 70 54 Z" fill="rgba(255,255,255,0.85)" />
          <path d="M40 70 L 56 66 L 50 78 Z" fill="rgba(255,255,255,0.85)" />
          <path d="M22 60 C 40 48 64 38 84 36" stroke={stroke2} strokeWidth="0.8" fill="none" />
        </g>
      );
    case "orchid":
      return (
        <g>
          <path d="M50 14 C 30 24 28 46 50 50 C 72 46 70 24 50 14 Z" fill={fill} />
          <path d="M22 50 C 30 70 46 70 50 56 C 44 40 30 38 22 50 Z" fill={fill} opacity="0.85" />
          <path d="M78 50 C 70 70 54 70 50 56 C 56 40 70 38 78 50 Z" fill={fill} opacity="0.85" />
          <path d="M50 56 C 42 72 42 84 50 92 C 58 84 58 72 50 56 Z" fill={fill} />
          <path d="M50 56 C 48 64 52 64 50 70" stroke={stroke} strokeWidth="1.4" />
          <circle cx="50" cy="48" r="3" fill={stroke2} />
        </g>
      );
    case "bird-of-paradise":
      return (
        <g>
          <path d="M14 86 L 30 60" stroke={stroke} strokeWidth="2.4" fill="none" />
          <path d="M30 60 C 28 50 32 42 40 38 L 36 30 L 44 32 L 42 24 L 50 28 L 50 18 L 58 26 L 64 18 L 64 30 L 74 26 L 70 36" fill={fill} />
          <path d="M30 60 L 80 56" stroke={stroke} strokeWidth="2" fill="none" />
        </g>
      );
    case "cactus":
      return (
        <g>
          <path d="M40 90 L 40 36 C 40 28 60 28 60 36 L 60 90 Z" fill={fill} />
          <path d="M40 60 L 28 60 C 22 60 22 50 28 50 L 40 50 Z" fill={fill} />
          <path d="M60 50 L 72 50 C 78 50 78 40 72 40 L 60 40 Z" fill={fill} />
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={42 + (i % 3) * 8} y1={40 + (i * 4)} x2={44 + (i % 3) * 8} y2={42 + (i * 4)} stroke={stroke2} strokeWidth="0.8" />
          ))}
          <ellipse cx="50" cy="30" rx="6" ry="4" fill={stroke} />
        </g>
      );
    case "hummingbird":
      return (
        <g>
          <path d="M30 50 C 38 38 60 38 70 46 L 84 42 L 80 50 L 86 56 L 70 54 C 60 62 38 62 30 50 Z" fill={fill} />
          <path d="M14 56 L 30 50 L 26 62 Z" fill={fill} opacity="0.85" />
          <circle cx="78" cy="48" r="1.6" fill={stroke} />
          <path d="M84 50 L 96 48" stroke={stroke} strokeWidth="1.2" />
        </g>
      );
    case "lantern":
      return (
        <g>
          <path d="M50 8 L 50 16" stroke={stroke} strokeWidth="1.5" />
          <rect x="34" y="16" width="32" height="4" fill={stroke} />
          <path d="M30 22 C 30 50 30 70 30 78 C 30 84 70 84 70 78 C 70 70 70 50 70 22 Z" fill={fill} />
          <rect x="30" y="40" width="40" height="4" fill={stroke2} opacity="0.6" />
          <rect x="30" y="58" width="40" height="4" fill={stroke2} opacity="0.6" />
          <rect x="34" y="84" width="32" height="4" fill={stroke} />
          <path d="M50 92 L 50 98" stroke={stroke} strokeWidth="1.2" />
        </g>
      );
    case "torii":
      return (
        <g stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M14 28 C 30 22 70 22 86 28" />
          <path d="M18 38 L 82 38" />
          <path d="M30 38 L 30 90" />
          <path d="M70 38 L 70 90" />
          <path d="M30 56 L 70 56" />
        </g>
      );
  }
}
