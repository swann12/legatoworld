import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { OrganicHandles } from "@/components/legato/OrganicHandles";
import { useLegato } from "@/lib/legato-state";
import {
  ELEMENTS,
  ELEMENT_FAMILIES,
  getElementById,
  type ElementFamily,
} from "@/lib/elements";
import { addMemory, type CompositionItem, type MemoryType } from "@/lib/memories-store";

export const Route = createFileRoute("/compose/$zone")({
  head: () => ({ meta: [{ title: "Composer un souvenir — Legato" }] }),
  component: Compose,
});

type Step = "type" | "import" | "ask" | "compose";

const TYPES: { id: MemoryType; label: string; whisper: string }[] = [
  { id: "voice", label: "Une voix", whisper: "Enregistrer un son, un mot, un silence." },
  { id: "sentence", label: "Une phrase", whisper: "Une parole, une promesse, une trace." },
  { id: "photo", label: "Une photo", whisper: "Une image, gardée doucement." },
  { id: "text", label: "Un texte", whisper: "Quelques mots, une lettre." },
  { id: "sound", label: "Un son", whisper: "Une ambiance, une musique." },
];

function Compose() {
  const { zone } = Route.useParams();
  const navigate = useNavigate();
  const { mode } = useLegato();

  const [step, setStep] = useState<Step>("type");
  const [type, setType] = useState<MemoryType | null>(null);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [items, setItems] = useState<CompositionItem[]>([]);

  const back = () => {
    if (step === "compose") setStep("ask");
    else if (step === "ask") setStep("import");
    else if (step === "import") setStep("type");
    else navigate({ to: "/garden/$zone", params: { zone } });
  };

  const saveMemory = (withComposition: boolean) => {
    if (!type) return;
    addMemory({
      zone,
      type,
      title: title.trim() || undefined,
      body: body.trim() || undefined,
      durationSec: durationSec ?? undefined,
      imageDataUrl: photoUrl ?? undefined,
      composition: withComposition ? items : undefined,
    });
    navigate({ to: "/garden/$zone", params: { zone } });
  };

  return (
    <Shell hideNav>
      <div className="relative min-h-dvh flex flex-col">
        {step !== "compose" && <Halos mode={mode} variant="calm" />}
        <div className="relative z-10 flex-1 flex flex-col">
          {step !== "compose" && (
            <div className="flex items-center justify-between px-7 pt-10">
              <button onClick={back} className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">
                ← Retour
              </button>
              <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
                {step === "type" && "Le type"}
                {step === "import" && "Le souvenir"}
                {step === "ask" && "La composition"}
              </span>
            </div>
          )}

          {step === "type" && (
            <ChooseType type={type} setType={setType} next={() => type && setStep("import")} />
          )}
          {step === "import" && type && (
            <ImportMemory
              type={type}
              title={title}
              setTitle={setTitle}
              body={body}
              setBody={setBody}
              photoUrl={photoUrl}
              setPhotoUrl={setPhotoUrl}
              durationSec={durationSec}
              setDurationSec={setDurationSec}
              next={() => setStep("ask")}
            />
          )}
          {step === "ask" && (
            <AskCompose onYes={() => setStep("compose")} onNo={() => saveMemory(false)} />
          )}
          {step === "compose" && (
            <Composer
              items={items}
              setItems={setItems}
              onSave={() => saveMemory(true)}
              onCancel={() => setStep("ask")}
            />
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ───────────────── Étape 1 — Type ───────────────── */

function ChooseType({
  type,
  setType,
  next,
}: {
  type: MemoryType | null;
  setType: (t: MemoryType) => void;
  next: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col px-7 pt-10 pb-10">
      <header>
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">premier pas</p>
        <h1 className="mt-3 font-serif text-[2.2rem] leading-[1.05] font-light text-dusk text-balance">
          Quel type de <span className="italic">souvenir ?</span>
        </h1>
        <p className="mt-4 max-w-[32ch] text-[13.5px] leading-relaxed text-dusk/60">
          On le dépose d'abord. Vous pourrez ensuite, si le cœur vous en dit, composer un jardin autour.
        </p>
      </header>

      <div className="mt-10 space-y-3">
        {TYPES.map((t) => {
          const active = type === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`w-full organic-radius-3 px-6 py-5 text-left transition-all ${active ? "ceramic" : "paper-card opacity-90"}`}
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
          className={`w-full organic-radius-3 px-7 py-5 text-center transition-opacity ${type ? "ceramic" : "paper-card opacity-40"}`}
        >
          <span className="font-serif text-xl italic text-dusk">Continuer</span>
        </button>
      </div>
    </div>
  );
}

/* ───────────────── Étape 2 — Importer ───────────────── */

function ImportMemory({
  type,
  title,
  setTitle,
  body,
  setBody,
  photoUrl,
  setPhotoUrl,
  durationSec,
  setDurationSec,
  next,
}: {
  type: MemoryType;
  title: string;
  setTitle: (s: string) => void;
  body: string;
  setBody: (s: string) => void;
  photoUrl: string | null;
  setPhotoUrl: (s: string | null) => void;
  durationSec: number | null;
  setDurationSec: (n: number | null) => void;
  next: () => void;
}) {
  const [recording, setRecording] = useState(false);
  const startedAt = useRef<number | null>(null);

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result as string);
    reader.readAsDataURL(f);
  };

  const toggleRecord = () => {
    if (!recording) {
      startedAt.current = Date.now();
      setRecording(true);
      return;
    }
    setRecording(false);
    if (startedAt.current) setDurationSec(Math.round((Date.now() - startedAt.current) / 1000));
  };

  const ready =
    type === "sentence" || type === "text"
      ? body.trim().length > 0
      : type === "photo"
        ? !!photoUrl
        : durationSec !== null && durationSec > 0;

  return (
    <div className="flex-1 flex flex-col px-7 pt-10 pb-10">
      <header>
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">le souvenir</p>
        <h1 className="mt-3 font-serif text-[2.2rem] leading-[1.05] font-light text-dusk text-balance">
          Déposez ce <span className="italic">souvenir.</span>
        </h1>
        <p className="mt-4 max-w-[34ch] text-[13.5px] leading-relaxed text-dusk/60">
          Prenez le temps. Une trace, sans mise en scène.
        </p>
      </header>

      <div className="mt-8 space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Un titre, si vous le sentez…"
          className="w-full bg-transparent border-b border-dusk/15 focus:border-dusk/40 outline-none py-3 font-serif text-lg italic text-dusk placeholder:text-dusk/30"
        />

        {(type === "sentence" || type === "text") && (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={type === "sentence" ? 3 : 7}
            placeholder={type === "sentence" ? "Une phrase qui reste…" : "Quelques mots, librement."}
            className="w-full paper-card organic-radius-3 px-5 py-4 text-[14.5px] leading-relaxed text-dusk/85 placeholder:text-dusk/30 outline-none resize-none"
          />
        )}

        {type === "photo" && (
          <div className="paper-card organic-radius-3 p-5">
            {photoUrl ? (
              <div className="space-y-3">
                <img src={photoUrl} alt="" className="w-full max-h-72 object-contain rounded-xl" />
                <button onClick={() => setPhotoUrl(null)} className="text-[11px] uppercase tracking-[0.2em] text-dusk/55">
                  Choisir une autre image
                </button>
              </div>
            ) : (
              <label className="block text-center cursor-pointer py-10">
                <span className="font-serif italic text-dusk/70">Choisir une photo</span>
                <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
              </label>
            )}
          </div>
        )}

        {(type === "voice" || type === "sound") && (
          <div className="paper-card organic-radius-3 p-7 text-center">
            <button
              onClick={toggleRecord}
              className={`size-20 rounded-full mx-auto flex items-center justify-center transition-all ${recording ? "bg-rose/70 breath" : "bg-dusk/85"}`}
              aria-label={recording ? "Arrêter" : "Enregistrer"}
            >
              <span className="size-6 bg-paper rounded-sm" />
            </button>
            <p className="mt-4 text-[12px] tracking-[0.18em] uppercase text-dusk/55">
              {recording ? "enregistrement…" : durationSec ? `enregistré · ${durationSec}s` : "appuyer pour enregistrer"}
            </p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-12">
        <button
          onClick={next}
          disabled={!ready}
          className={`w-full organic-radius-3 px-7 py-5 text-center transition-opacity ${ready ? "ceramic" : "paper-card opacity-40"}`}
        >
          <span className="font-serif text-xl italic text-dusk">Continuer</span>
        </button>
      </div>
    </div>
  );
}

/* ───────────────── Étape 3 — Demande ───────────────── */

function AskCompose({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-7 py-12 text-center">
      <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">la composition</p>
      <h1 className="mt-5 font-serif text-[1.9rem] leading-[1.2] font-light text-dusk text-balance max-w-[20ch]">
        Souhaitez-vous composer un <span className="italic">jardin</span> autour de ce souvenir&nbsp;?
      </h1>
      <p className="mt-5 max-w-[28ch] text-[13.5px] leading-relaxed text-dusk/55">
        Une petite scène végétale, posée librement. Vous pourrez y revenir plus tard.
      </p>

      <div className="w-full max-w-[320px] mt-12 space-y-3">
        <button onClick={onYes} className="w-full ceramic organic-radius-3 px-7 py-5 text-center">
          <span className="font-serif text-xl italic text-dusk">Oui, composer</span>
        </button>
        <button onClick={onNo} className="w-full paper-card organic-radius-3 px-7 py-5 text-center">
          <span className="font-serif text-lg italic text-dusk/70">Non, simplement le garder</span>
        </button>
      </div>
    </div>
  );
}

/* ───────────────── Étape 4 — Composeur (refonte) ─────────────────
   Principe : un geste, pas un logiciel.
   - Tap sur un élément du tiroir → posé au centre, sélectionné.
   - Drag → déplace · Wheel/pinch → redimensionne · Poignée du haut → rotation.
   - Sélection unique. Pas de calques visibles.
   - Bouton Fermer (annuler), Enregistrer, Annuler/Refaire, Gomme, Exporter.
*/

type Sel = string | null;

function Composer({
  items,
  setItems,
  onSave,
  onCancel,
}: {
  items: CompositionItem[];
  setItems: React.Dispatch<React.SetStateAction<CompositionItem[]>>;
  onSave: () => void;
  onCancel: () => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Sel>(null);
  const [drawerOpen, setDrawerOpen] = useState(items.length === 0);
  const [family, setFamily] = useState<ElementFamily>("florale");
  const historyRef = useRef<{ past: CompositionItem[][]; future: CompositionItem[][] }>({
    past: [],
    future: [],
  });

  /* ───── history ───── */
  const commit = (next: CompositionItem[]) => {
    historyRef.current.past.push(items);
    if (historyRef.current.past.length > 40) historyRef.current.past.shift();
    historyRef.current.future = [];
    setItems(next);
  };
  const undo = () => {
    const p = historyRef.current.past.pop();
    if (!p) return;
    historyRef.current.future.unshift(items);
    setItems(p);
  };
  const redo = () => {
    const n = historyRef.current.future.shift();
    if (!n) return;
    historyRef.current.past.push(items);
    setItems(n);
  };

  /* ───── add element ───── */
  const addElement = (id: string) => {
    const el = getElementById(id);
    if (!el) return;
    const baseW = 28; // % of canvas
    const aspect = el.height / el.width;
    const newItem: CompositionItem = {
      id: `i-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      elementId: el.id,
      x: 50,
      y: 50,
      width: baseW,
      height: baseW * aspect * 0.75, // canvas is 3:4 portrait → ratio compensation
      rotation: 0,
      opacity: 1,
      z: items.length + 1,
    };
    commit([...items, newItem]);
    setSelected(newItem.id);
  };

  /* ───── pointer drag/scale/rotate ───── */
  const dragRef = useRef<{
    id: string;
    mode: "move" | "scale" | "rotate";
    startX: number;
    startY: number;
    item: CompositionItem;
    canvasRect: DOMRect;
  } | null>(null);

  const onLayerPointerDown = (
    e: React.PointerEvent,
    item: CompositionItem,
    mode: "move" | "scale" | "rotate" | "opacity" = "move",
  ) => {
    e.stopPropagation();
    setSelected(item.id);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      id: item.id,
      mode: mode as "move" | "scale" | "rotate",
      startX: e.clientX,
      startY: e.clientY,
      item,
      canvasRect: rect,
    };
    // stocker opacity dans le mode via cast — on étend avec un champ
    (dragRef.current as { extra?: string }).extra = mode === "opacity" ? "opacity" : "";
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    historyRef.current.past.push(items);
    historyRef.current.future = [];
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const w = d.canvasRect.width;
    const h = d.canvasRect.height;
    const extra = (d as { extra?: string }).extra;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== d.id) return it;
        if (extra === "opacity") {
          const op = Math.max(0.1, Math.min(1, (d.item.opacity ?? 1) - dy / 200));
          return { ...it, opacity: op };
        }
        if (d.mode === "move") {
          return { ...it, x: d.item.x + (dx / w) * 100, y: d.item.y + (dy / h) * 100 };
        }
        if (d.mode === "scale") {
          const factor = 1 + dy / 180; // drag down = grow, up = shrink
          const newW = Math.max(4, Math.min(180, (d.item.width ?? 20) * factor));
          const ratio = (d.item.height ?? 20) / (d.item.width ?? 20);
          return { ...it, width: newW, height: newW * ratio };
        }
        if (d.mode === "rotate") {
          const cx = d.canvasRect.left + (d.item.x / 100) * w;
          const cy = d.canvasRect.top + (d.item.y / 100) * h;
          const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90;
          return { ...it, rotation: angle };
        }
        return it;
      }),
    );
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  /* ───── delete / duplicate / z-order ───── */
  const deleteSelected = () => {
    if (!selected) return;
    commit(items.filter((it) => it.id !== selected));
    setSelected(null);
  };
  const bringForward = () => {
    if (!selected) return;
    const maxZ = Math.max(0, ...items.map((i) => i.z ?? 0));
    commit(items.map((it) => (it.id === selected ? { ...it, z: maxZ + 1 } : it)));
  };
  const sendBackward = () => {
    if (!selected) return;
    const minZ = Math.min(0, ...items.map((i) => i.z ?? 0));
    commit(items.map((it) => (it.id === selected ? { ...it, z: minZ - 1 } : it)));
  };

  /* ───── flip horizontal / vertical ───── */
  const flipH = () => {
    if (!selected) return;
    commit(items.map((it) => (it.id === selected ? { ...it, flipX: !it.flipX } : it)));
  };
  const flipV = () => {
    if (!selected) return;
    commit(items.map((it) => (it.id === selected ? { ...it, flipY: !it.flipY } : it)));
  };

  /* ───── wheel zoom on canvas ───── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = (e: WheelEvent) => {
      if (!selected) return;
      e.preventDefault();
      const factor = 1 - e.deltaY / 400;
      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== selected) return it;
          const newW = Math.max(4, Math.min(180, (it.width ?? 20) * factor));
          const ratio = (it.height ?? 20) / (it.width ?? 20);
          return { ...it, width: newW, height: newW * ratio };
        }),
      );
    };
    canvas.addEventListener("wheel", handler, { passive: false });
    return () => canvas.removeEventListener("wheel", handler);
  }, [selected, setItems]);

  /* ───── export — always white background ───── */
  const exportHD = async () => {
    const W = 2400;
    const H = 3200;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    const sorted = [...items].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));
    for (const it of sorted) {
      const el = it.elementId ? getElementById(it.elementId) : null;
      if (!el) continue;
      const img = await loadImage(el.src);
      const w = ((it.width ?? 20) / 100) * W;
      const h = ((it.height ?? 20) / 100) * H;
      const x = ((it.x ?? 50) / 100) * W;
      const y = ((it.y ?? 50) / 100) * H;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(((it.rotation ?? 0) * Math.PI) / 180);
      ctx.scale(it.flipX ? -1 : 1, it.flipY ? -1 : 1);
      ctx.globalAlpha = it.opacity ?? 1;
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    }
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `legato-composition-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.z ?? 0) - (b.z ?? 0)),
    [items],
  );
  const elementsForFamily = useMemo(
    () => ELEMENTS.filter((e) => e.family === family),
    [family],
  );

  return (
    <div className="absolute inset-0 flex flex-col bg-paper">
      {/* Top bar — close, title, save */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-dusk/8">
        <button
          onClick={() => {
            if (items.length === 0 || confirm("Quitter sans enregistrer la composition ?")) onCancel();
          }}
          aria-label="Fermer"
          className="size-9 flex items-center justify-center text-dusk/60 hover:text-dusk text-lg"
        >
          ✕
        </button>
        <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Composition</span>
        <button
          onClick={onSave}
          className="ceramic px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.18em] text-dusk"
        >
          Enregistrer
        </button>
      </div>

      {/* Canvas — fully visible, paper backdrop */}
      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center px-3 py-3"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div
          ref={canvasRef}
          onPointerDown={() => setSelected(null)}
          className="relative bg-paper"
          style={{
            width: "min(100%, calc((100dvh - 220px) * 0.75))",
            aspectRatio: "3 / 4",
            boxShadow: "0 30px 70px -40px rgba(60,40,40,0.25), inset 0 0 0 1px rgba(60,40,40,0.04)",
            borderRadius: 18,
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--paper) 96%, white), var(--paper))",
          }}
        >
          {sortedItems.map((it) => {
            const el = it.elementId ? getElementById(it.elementId) : null;
            if (!el) return null;
            const isSel = selected === it.id;
            return (
              <div
                key={it.id}
                className="absolute"
                style={{
                  left: `${it.x}%`,
                  top: `${it.y}%`,
                  width: `${it.width}%`,
                  height: `${it.height}%`,
                  transform: `translate(-50%, -50%) rotate(${it.rotation ?? 0}deg)`,
                  opacity: it.opacity ?? 1,
                  touchAction: "none",
                }}
              >
                <img
                  src={el.src}
                  alt=""
                  draggable={false}
                  onPointerDown={(e) => onLayerPointerDown(e, it, "move")}
                  className="block w-full h-full select-none feathered-soft"
                  style={{
                    transform: `scale(${it.flipX ? -1 : 1}, ${it.flipY ? -1 : 1})`,
                  }}
                />
                {isSel && (
                  <OrganicHandles
                    onPointerDown={(kind) => (e) => onLayerPointerDown(e, it, kind)}
                    onFlipH={flipH}
                    onFlipV={flipV}
                  />
                )}
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="font-serif italic text-dusk/35 text-center px-6 text-[15px]">
                Une toile vide.<br />Choisissez un élément pour commencer.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contextual selection bar */}
      {selected && (
        <div className="px-5 pb-1 flex items-center justify-center gap-2">
          <button
            onClick={sendBackward}
            className="paper-card px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.18em] text-dusk/65"
          >
            ↓ Derrière
          </button>
          <button
            onClick={bringForward}
            className="paper-card px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.18em] text-dusk/65"
          >
            ↑ Devant
          </button>
          <button
            onClick={deleteSelected}
            className="paper-card px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.18em] text-dusk/65"
          >
            Supprimer
          </button>
        </div>
      )}

      {/* Bottom bar — single, calm row : Éléments · Annuler · Refaire · Exporter */}
      <div className="border-t border-dusk/8 bg-paper">
        <div className="flex items-center justify-between gap-2 px-4 py-2">
          <BarBtn
            label="Éléments"
            active={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
          />
          <BarBtn
            label="↶ Annuler"
            onClick={undo}
            disabled={historyRef.current.past.length === 0}
          />
          <BarBtn
            label="↷ Refaire"
            onClick={redo}
            disabled={historyRef.current.future.length === 0}
          />
          <BarBtn label="Exporter" onClick={exportHD} />
        </div>

        {/* Elements drawer */}
        {drawerOpen && (
          <div className="border-t border-dusk/8 bg-clay/30">
            <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
              {ELEMENT_FAMILIES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFamily(f.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.18em] transition ${
                    family === f.id ? "bg-dusk text-paper" : "text-dusk/60"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="px-3 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
              {elementsForFamily.map((el) => (
                <button
                  key={el.id}
                  onClick={() => addElement(el.id)}
                  className="shrink-0 size-16 bg-paper rounded-xl flex items-center justify-center p-1.5 hover:scale-105 transition"
                  title={el.label}
                >
                  <img
                    src={el.src}
                    alt=""
                    draggable={false}
                    className="max-w-full max-h-full object-contain feathered"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BarBtn({
  label,
  onClick,
  active,
  disabled,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-full text-[11px] uppercase tracking-[0.18em] transition ${
        active ? "bg-dusk text-paper" : "text-dusk/70"
      } ${disabled ? "opacity-30" : "hover:text-dusk"}`}
    >
      {label}
    </button>
  );
}

const imageCache = new Map<string, HTMLImageElement>();
function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached && cached.complete) return Promise.resolve(cached);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}