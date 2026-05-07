import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { OrganicShape, SHAPE_LIBRARY, type ShapeKind } from "@/components/legato/OrganicShape";

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
  kind: ShapeKind;
  x: number;        // % of canvas
  y: number;        // % of canvas
  size: number;     // 36..160
  rotation: number; // deg
  tint: string;
  tint2: string;
};

const TINTS: { a: string; b: string }[] = [
  { a: "var(--rose)",     b: "var(--peach)" },
  { a: "var(--peach)",    b: "var(--rose)" },
  { a: "var(--sage)",     b: "var(--mist)" },
  { a: "var(--mist)",     b: "var(--lavender)" },
  { a: "var(--lavender)", b: "var(--rose)" },
  { a: "var(--clay)",     b: "var(--peach)" },
];

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

  const addShape = (kind: ShapeKind) => {
    const tint = TINTS[items.length % TINTS.length];
    const id = `s-${Date.now()}`;
    setItems((prev) => [
      ...prev,
      { id, kind, x: 50, y: 50, size: 80, rotation: 0, tint: tint.a, tint2: tint.b },
    ]);
    setSelectedId(id);
  };

  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const deleteSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  };

  const onCanvasPointerDown = (e: React.PointerEvent) => {
    if (e.target === canvasRef.current) setSelectedId(null);
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
          Composez votre souvenir.
        </h1>
        <p className="mt-2 text-[12.5px] text-dusk/55 max-w-[34ch]">
          Touchez un élément pour l'ajouter. Glissez pour déplacer.
          Touchez à nouveau pour le redimensionner ou le faire tourner.
        </p>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        onPointerDown={onCanvasPointerDown}
        className="relative mt-5 w-full paper-card overflow-hidden touch-none select-none"
        style={{ aspectRatio: "3 / 4", borderRadius: 28 }}
      >
        {/* soft inner ground */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, color-mix(in oklab, var(--paper) 92%, white) 0%, color-mix(in oklab, var(--clay) 50%, var(--paper)) 100%)",
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
              }}
            >
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
            onClick={() => addShape(s.kind)}
            className="shrink-0 flex flex-col items-center gap-1.5 paper-card p-2.5 w-[72px]"
          >
            <OrganicShape kind={s.kind} size={40} tint="var(--clay)" tint2="var(--peach)" />
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
