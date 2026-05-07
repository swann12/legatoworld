import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import gardenPainted from "@/assets/garden-painted.jpg";

/* ────────── Fragments — chaque "élément" est un morceau peint extrait
   directement de la peinture-jardin. Continuité esthétique parfaite. ────────── */
type Family = "fleurs" | "feuillages" | "ciel" | "marin" | "minéral";
type Fragment = {
  id: string;
  label: string;
  family: Family;
  /** Position (en %) de la zone à découper dans gardenPainted */
  cx: number; cy: number;
  /** Taille de la zone (en % de l'image) — petite = focus, grande = nuage */
  zoom: number;
  /** Forme du masque organique */
  mask: "petal" | "round" | "drift" | "spire" | "wing" | "shell";
};

const FRAGMENTS: Fragment[] = [
  // fleurs — extraits des concentrations florales
  { id: "rose-poudree",   label: "Rose poudrée",    family: "fleurs",     cx: 28, cy: 78, zoom: 14, mask: "round" },
  { id: "anemone",        label: "Anémone",         family: "fleurs",     cx: 45, cy: 52, zoom: 12, mask: "petal" },
  { id: "iris",           label: "Iris",            family: "fleurs",     cx: 68, cy: 45, zoom: 14, mask: "spire" },
  { id: "marguerite",     label: "Marguerite",      family: "fleurs",     cx: 38, cy: 38, zoom: 11, mask: "round" },
  { id: "pavot",          label: "Pavot",           family: "fleurs",     cx: 82, cy: 22, zoom: 13, mask: "round" },
  { id: "tulipe",         label: "Tulipe",          family: "fleurs",     cx: 18, cy: 25, zoom: 12, mask: "petal" },
  { id: "cosmos",         label: "Cosmos",          family: "fleurs",     cx: 55, cy: 78, zoom: 13, mask: "round" },
  { id: "petale-isole",   label: "Pétale",          family: "fleurs",     cx: 72, cy: 68, zoom: 8,  mask: "petal" },
  { id: "grappe",         label: "Grappe florale",  family: "fleurs",     cx: 50, cy: 22, zoom: 18, mask: "drift" },
  { id: "floraison-diffuse", label: "Floraison diffuse", family: "fleurs", cx: 22, cy: 55, zoom: 22, mask: "drift" },
  // feuillages
  { id: "fougere",        label: "Fougère",         family: "feuillages", cx: 12, cy: 35, zoom: 16, mask: "spire" },
  { id: "mousse",         label: "Mousse",          family: "feuillages", cx: 8,  cy: 18, zoom: 14, mask: "drift" },
  { id: "herbes",         label: "Herbes hautes",   family: "feuillages", cx: 88, cy: 60, zoom: 14, mask: "spire" },
  { id: "branchage",      label: "Branchage",       family: "feuillages", cx: 60, cy: 35, zoom: 16, mask: "wing" },
  { id: "feuillage-leger",label: "Feuillage léger", family: "feuillages", cx: 30, cy: 65, zoom: 13, mask: "drift" },
  { id: "arbre-fin",      label: "Arbre fin",       family: "feuillages", cx: 85, cy: 80, zoom: 18, mask: "spire" },
  { id: "arbuste",        label: "Arbuste vaporeux",family: "feuillages", cx: 65, cy: 88, zoom: 18, mask: "drift" },
  // ciel
  { id: "nuage-doux",     label: "Nuage",           family: "ciel",       cx: 50, cy: 5,  zoom: 22, mask: "drift" },
  { id: "brume",          label: "Brume",           family: "ciel",       cx: 95, cy: 50, zoom: 20, mask: "drift" },
  { id: "halo",           label: "Halo",            family: "ciel",       cx: 5,  cy: 95, zoom: 18, mask: "round" },
  { id: "souffle",        label: "Souffle",         family: "ciel",       cx: 75, cy: 10, zoom: 16, mask: "wing" },
  { id: "poussiere-or",   label: "Poussière d'or",  family: "ciel",       cx: 92, cy: 5,  zoom: 10, mask: "round" },
  // marin
  { id: "coquillage",     label: "Coquillage",      family: "marin",      cx: 78, cy: 92, zoom: 12, mask: "shell" },
  { id: "spirale",        label: "Spirale",         family: "marin",      cx: 15, cy: 88, zoom: 11, mask: "shell" },
  { id: "corail",         label: "Corail",          family: "marin",      cx: 42, cy: 65, zoom: 14, mask: "spire" },
  { id: "corail-souple",  label: "Corail souple",   family: "marin",      cx: 58, cy: 50, zoom: 13, mask: "wing" },
  { id: "nacre",          label: "Nacre",           family: "marin",      cx: 92, cy: 92, zoom: 9,  mask: "shell" },
  // minéral
  { id: "pierre",         label: "Pierre",          family: "minéral",    cx: 35, cy: 92, zoom: 10, mask: "round" },
  { id: "graine",         label: "Graine",          family: "minéral",    cx: 48, cy: 88, zoom: 8,  mask: "petal" },
  { id: "sable",          label: "Sable",           family: "minéral",    cx: 5,  cy: 50, zoom: 14, mask: "drift" },
  { id: "fragment",       label: "Fragment",        family: "minéral",    cx: 88, cy: 35, zoom: 9,  mask: "petal" },
];

/** Soft organic SVG masks — never circular icons, always painterly silhouettes. */
const MASK_PATHS: Record<Fragment["mask"], string> = {
  round:  "M50 6 C 78 6 96 26 94 54 C 92 82 70 96 48 94 C 22 92 6 72 6 48 C 6 24 24 6 50 6 Z",
  petal:  "M50 4 C 76 18 92 50 70 90 C 52 86 32 76 22 56 C 14 36 26 14 50 4 Z",
  drift:  "M8 60 C 4 38 22 22 46 26 C 64 16 90 28 94 50 C 96 70 78 86 56 84 C 36 96 10 84 8 60 Z",
  spire:  "M50 2 C 60 30 64 56 58 96 C 50 92 44 92 40 96 C 38 56 42 30 50 2 Z",
  wing:   "M6 70 C 14 36 50 22 94 30 C 86 56 60 76 36 86 C 22 90 8 84 6 70 Z",
  shell:  "M50 8 C 86 18 96 56 78 86 C 56 90 30 84 18 64 C 8 44 22 16 50 8 Z",
};

export const Route = createFileRoute("/compose/$zone")({
  head: () => ({ meta: [{ title: "Composer un souvenir — Legato" }] }),
  component: Compose,
});

type MemoryType = "voice" | "note" | "photo" | "video";

const TYPES: { id: MemoryType; label: string; whisper: string }[] = [
  { id: "voice", label: "Une voix", whisper: "Enregistrer un son, un mot, un silence." },
  { id: "note",  label: "Un texte", whisper: "Quelques mots, une phrase, une lettre." },
  { id: "photo", label: "Une photo", whisper: "Une image, fixée doucement." },
  { id: "video", label: "Une vidéo", whisper: "Quelques secondes en mouvement." },
];

type Item = {
  id: string;
  fragmentId: string;
  x: number;        // % of canvas
  y: number;        // % of canvas
  size: number;     // 36..160
  rotation: number; // deg
  tint: string;     // halo wash color
};

const TINTS = [
  "var(--rose)", "var(--peach)", "var(--sage)", "var(--mist)",
  "var(--lavender)", "var(--clay)",
];

/** A painted fragment — masked extract of the garden painting. */
function PaintedFragment({
  fragment, size, rotation = 0,
}: { fragment: Fragment; size: number; rotation?: number }) {
  const maskId = `m-${fragment.id}-${size}-${Math.round(rotation)}`;
  // Background-position is the *focal point* in the source image.
  // Background-size > 100% acts as zoom: lower zoom% means we see a small region magnified.
  const bgScale = (100 / fragment.zoom) * 100; // % of mask-box
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={maskId}>
          <path d={MASK_PATHS[fragment.mask]} />
        </clipPath>
        <filter id={`${maskId}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      <g clipPath={`url(#${maskId})`} filter={`url(#${maskId}-blur)`}
         transform={`rotate(${rotation} 50 50)`}>
        <image
          href={gardenPainted}
          x={50 - bgScale / 2 - ((fragment.cx - 50) * bgScale) / 100}
          y={50 - bgScale / 2 - ((fragment.cy - 50) * bgScale) / 100}
          width={bgScale}
          height={bgScale}
          preserveAspectRatio="xMidYMid slice"
          style={{ opacity: 0.95 }}
        />
        {/* soft inner glow to keep edges evanescent */}
        <path d={MASK_PATHS[fragment.mask]} fill="none"
              stroke="rgba(255,248,232,0.55)" strokeWidth="3" filter={`url(#${maskId}-blur)`} />
      </g>
    </svg>
  );
}

function Compose() {
  const { zone } = Route.useParams();
  const navigate = useNavigate();
  const { mode } = useLegato();

  const [step, setStep] = useState<"type" | "compose">("type");
  const [type, setType] = useState<MemoryType | null>(null);

  return (
    <Shell hideNav>
      <div className="relative min-h-dvh flex flex-col">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex items-center justify-between px-7 pt-10">
            <button
              onClick={() =>
                step === "compose"
                  ? setStep("type")
                  : navigate({ to: "/garden/$zone", params: { zone } })
              }
              className="text-[11px] uppercase tracking-[0.22em] text-dusk/50"
            >
              ← Retour
            </button>
            <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
              {step === "type" ? "1 · type" : "2 · composition"}
            </span>
          </div>

          {step === "type" && (
            <ChooseType
              type={type}
              setType={setType}
              next={() => type && setStep("compose")}
            />
          )}

          {step === "compose" && type && (
            <Composer type={type} onSave={() => navigate({ to: "/garden/$zone", params: { zone } })} />
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ────────── Step 1 — choose the memory type ────────── */

function ChooseType({
  type, setType, next,
}: { type: MemoryType | null; setType: (t: MemoryType) => void; next: () => void }) {
  return (
    <div className="flex-1 flex flex-col px-7 pt-10 pb-10">
      <header>
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Étape 1</p>
        <h1 className="mt-3 font-serif text-[2.2rem] leading-[1.05] font-light text-dusk text-balance">
          Quel type de <span className="italic">souvenir ?</span>
        </h1>
        <p className="mt-4 max-w-[30ch] text-[13.5px] leading-relaxed text-dusk/60">
          Vous le déposerez ensuite dans une composition vivante.
        </p>
      </header>

      <div className="mt-10 space-y-3">
        {TYPES.map((t) => {
          const active = type === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`w-full organic-radius-3 px-6 py-5 text-left transition-all ${
                active ? "ceramic" : "paper-card opacity-90"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-xl italic text-dusk">{t.label}</span>
                <span className={`size-1.5 rounded-full ${active ? "bg-rose breath" : "bg-dusk/15"}`} />
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-dusk/55">{t.whisper}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-12">
        <button
          onClick={next}
          disabled={!type}
          className={`w-full organic-radius-3 px-7 py-5 text-center transition-opacity ${
            type ? "ceramic" : "paper-card opacity-40"
          }`}
        >
          <span className="font-serif text-xl italic text-dusk">Continuer</span>
        </button>
      </div>
    </div>
  );
}

/* ────────── Step 2 — composer ────────── */

function Composer({ type, onSave }: { type: MemoryType; onSave: () => void }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openMemoryId, setOpenMemoryId] = useState<string | null>(null);
  const [family, setFamily] = useState<"végétal" | "minéral" | "marin" | "ciel" | "vivant" | "exotique">("végétal");
  const [brush, setBrush] = useState<ShapeKind | null>("petal");
  const lastStampRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const stampAt = (kind: ShapeKind, x: number, y: number, baseSize = 44) => {
    const tint = TINTS[Math.floor(Math.random() * TINTS.length)];
    const id = `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const jitter = (r: number) => (Math.random() - 0.5) * r;
    setItems((prev) => [
      ...prev,
      {
        id,
        kind,
        x: clamp(x + jitter(4), 3, 97),
        y: clamp(y + jitter(4), 3, 97),
        size: clamp(baseSize + jitter(28), 20, 110),
        rotation: jitter(360),
        tint: tint.a,
        tint2: tint.b,
      },
    ]);
  };

  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const deleteSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  };

  const pctFromEvent = (e: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const onCanvasPointerDown = (e: React.PointerEvent) => {
    if (e.target !== canvasRef.current && !(e.target as HTMLElement).dataset?.ground) return;
    setSelectedId(null);
    if (!brush) return;
    const p = pctFromEvent(e);
    stampAt(brush, p.x, p.y);
    lastStampRef.current = { x: p.x, y: p.y, t: Date.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onCanvasPointerMove = (e: React.PointerEvent) => {
    if (!brush || !lastStampRef.current) return;
    const p = pctFromEvent(e);
    const dx = p.x - lastStampRef.current.x;
    const dy = p.y - lastStampRef.current.y;
    if (Math.hypot(dx, dy) < 5) return;
    stampAt(brush, p.x, p.y);
    lastStampRef.current = { x: p.x, y: p.y, t: Date.now() };
  };

  const onCanvasPointerUp = () => {
    lastStampRef.current = null;
  };

  // Pointer drag handling on shapes
  const startDrag = (e: React.PointerEvent, item: Item) => {
    e.stopPropagation();
    setSelectedId(item.id);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPctX = item.x;
    const startPctY = item.y;
    const move = (ev: PointerEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      updateItem(item.id, {
        x: clamp(startPctX + dx, 4, 96),
        y: clamp(startPctY + dy, 4, 96),
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const startResize = (e: React.PointerEvent, item: Item) => {
    e.stopPropagation();
    const startY = e.clientY;
    const startSize = item.size;
    const move = (ev: PointerEvent) => {
      const dy = ev.clientY - startY;
      updateItem(item.id, { size: clamp(startSize + dy * 0.6, 32, 180) });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const startRotate = (e: React.PointerEvent, item: Item) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + (item.x / 100) * rect.width;
    const cy = rect.top + (item.y / 100) * rect.height;
    const startAngle =
      (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI - item.rotation;
    const move = (ev: PointerEvent) => {
      const a = (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI;
      updateItem(item.id, { rotation: a - startAngle });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const palette = SHAPE_LIBRARY.filter((s) => s.family === family);

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <div className="px-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
          Étape 2 · {labelFor(type).toLowerCase()}
        </p>
        <h1 className="mt-2 font-serif text-[1.6rem] leading-[1.1] font-light text-dusk text-balance">
          Peignez votre souvenir.
        </h1>
        <p className="mt-2 text-[12.5px] text-dusk/55 max-w-[34ch]">
          Choisissez un élément, puis peignez sur la toile pour faire éclore le jardin.
          Touchez une forme pour l'ajuster.
        </p>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        onPointerDown={onCanvasPointerDown}
        onPointerMove={onCanvasPointerMove}
        onPointerUp={onCanvasPointerUp}
        onPointerCancel={onCanvasPointerUp}
        className="relative mt-5 w-full paper-card overflow-hidden touch-none select-none"
        style={{ aspectRatio: "3 / 4", borderRadius: 28, cursor: brush ? "crosshair" : "default" }}
      >
        {/* painted ground — same world as the garden, blurred to a wash */}
        <img
          src={gardenPainted}
          alt=""
          aria-hidden
          data-ground="1"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ filter: "blur(28px) saturate(0.85)", opacity: 0.35, transform: "scale(1.1)" }}
        />
        <div
          data-ground="1"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, color-mix(in oklab, var(--paper) 85%, white) 0%, color-mix(in oklab, var(--paper) 70%, transparent) 70%, transparent 100%)",
          }}
        />

        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-serif italic text-dusk/40 text-center px-8 text-balance">
              Une page nue. Choisissez un premier élément ci-dessous.
            </p>
          </div>
        )}

        {items.map((it) => {
          const selected = selectedId === it.id;
          const opening = openMemoryId === it.id;
          return (
            <div
              key={it.id}
              onPointerDown={(e) => startDrag(e, it)}
              onClick={(e) => {
                e.stopPropagation();
                if (selected) {
                  setOpenMemoryId(it.id);
                  setTimeout(() => setOpenMemoryId(null), 2400);
                } else {
                  setSelectedId(it.id);
                }
              }}
              className={`absolute ${opening ? "bloom" : selected ? "" : "sway"}`}
              style={{
                top: `${it.y}%`,
                left: `${it.x}%`,
                width: it.size,
                height: it.size,
                transform: `translate(-50%, -50%) rotate(${it.rotation}deg)`,
                filter: "blur(0.4px) saturate(0.92)",
                opacity: 0.86,
                mixBlendMode: "multiply",
              }}
            >
              {/* watercolor wash behind each stamp */}
              <div
                aria-hidden
                className="absolute inset-[-25%] rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${it.tint} 0%, transparent 65%)`,
                  opacity: 0.18,
                  filter: "blur(6px)",
                }}
              />
              {/* halo for selection */}
              {(selected || opening) && (
                <div
                  className="absolute inset-[-30%] -z-0 halo-lg"
                  style={{
                    background: `radial-gradient(circle, ${it.tint} 0%, transparent 70%)`,
                    opacity: 0.5,
                  }}
                />
              )}
              <OrganicShape kind={it.kind} size={it.size} tint={it.tint} tint2={it.tint2} />

              {selected && (
                <>
                  {/* resize handle (bottom-right) */}
                  <button
                    onPointerDown={(e) => startResize(e, it)}
                    className="absolute -bottom-2 -right-2 size-6 rounded-full bg-dusk/85 text-paper text-[10px] flex items-center justify-center shadow-md"
                    aria-label="Redimensionner"
                  >
                    ↘
                  </button>
                  {/* rotate handle (top) */}
                  <button
                    onPointerDown={(e) => startRotate(e, it)}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 size-6 rounded-full bg-dusk/85 text-paper text-[10px] flex items-center justify-center shadow-md"
                    aria-label="Faire pivoter"
                  >
                    ↻
                  </button>
                </>
              )}
            </div>
          );
        })}

        {/* memory preview overlay when an item is "opened" */}
        {openMemoryId && (
          <div className="absolute inset-x-4 bottom-4 paper-card p-4 z-10 pointer-events-none">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              Souvenir lié — {labelFor(type)}
            </p>
            <p className="mt-1 font-serif text-[15px] italic text-dusk leading-snug text-balance">
              {previewFor(type)}
            </p>
          </div>
        )}
      </div>

      {/* Family tabs */}
      <div className="mt-5 flex justify-center gap-2 flex-wrap">
        {(["végétal", "marin", "vivant", "exotique", "minéral", "ciel"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFamily(f)}
            className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] transition-colors ${
              family === f ? "bg-dusk text-paper" : "text-dusk/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Palette */}
      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar px-1 pb-2">
        {palette.map((s) => (
          <button
            key={s.kind}
            onClick={() => setBrush(s.kind)}
            className={`shrink-0 flex flex-col items-center gap-1.5 paper-card p-2.5 w-[72px] transition-all ${
              brush === s.kind ? "ring-2 ring-dusk/60 scale-[1.04]" : ""
            }`}
          >
            <div
              className="relative"
              style={{
                width: 40,
                height: 40,
                filter: "blur(0.5px) saturate(0.9)",
                opacity: 0.85,
                mixBlendMode: "multiply",
              }}
            >
              <div
                aria-hidden
                className="absolute inset-[-20%] rounded-full"
                style={{
                  background: "radial-gradient(circle, var(--clay) 0%, transparent 65%)",
                  opacity: 0.22,
                  filter: "blur(5px)",
                }}
              />
              <OrganicShape kind={s.kind} size={40} tint="var(--clay)" tint2="var(--peach)" />
            </div>
            <span className="text-[10px] tracking-wide text-dusk/65">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom action bar */}
      <div className="mt-4 flex items-center gap-3">
        {selectedId ? (
          <button
            onClick={deleteSelected}
            className="paper-card px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-dusk/65"
          >
            Retirer
          </button>
        ) : null}
        <button
          onClick={onSave}
          className="ceramic organic-radius-3 flex-1 px-6 py-4 text-center"
        >
          <span className="font-serif text-lg italic text-dusk">Garder ce souvenir</span>
        </button>
      </div>
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function labelFor(t: MemoryType) {
  switch (t) {
    case "voice": return "Voix";
    case "note":  return "Texte";
    case "photo": return "Photo";
    case "video": return "Vidéo";
  }
}
function previewFor(t: MemoryType) {
  switch (t) {
    case "voice": return "« Lecture sous le porche » — 0:42";
    case "note":  return "« Tu reviens toujours plus doux que tu n'es parti. »";
    case "photo": return "La cuisine, fin d'après-midi.";
    case "video": return "Quelques secondes au lac, août.";
  }
}
