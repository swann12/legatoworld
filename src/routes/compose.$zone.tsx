import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { ELEMENTS, ELEMENT_FAMILIES, getElementById, type ElementAsset, type ElementFamily } from "@/lib/elements";
import { addMemory, type CompositionItem, type MemoryType } from "@/lib/memories-store";
import JSZip from "jszip";

export const Route = createFileRoute("/compose/$zone")({
  head: () => ({ meta: [{ title: "Composer un souvenir — Legato" }] }),
  component: Compose,
});

type Step = "type" | "import" | "ask" | "compose";
type EditorTool = "select" | "place" | "replace" | "erase";

type EditorElement = ElementAsset;

type EditorLayer = CompositionItem & {
  elementId: string;
  width: number;
  height: number;
  name: string;
  hidden: boolean;
  locked: boolean;
  opacity: number;
  rotation: number;
  z: number;
  source?: string;
};

const TYPES: { id: MemoryType; label: string; whisper: string }[] = [
  { id: "voice", label: "Une voix", whisper: "Enregistrer un son, un mot, un silence." },
  { id: "sentence", label: "Une phrase", whisper: "Une parole, une promesse, une trace." },
  { id: "photo", label: "Une photo", whisper: "Une image, fixée doucement." },
  { id: "text", label: "Un texte", whisper: "Quelques mots, une lettre." },
  { id: "sound", label: "Un son", whisper: "Un environnement, une musique." },
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
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex items-center justify-between px-7 pt-10">
            <button onClick={back} className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">
              ← Retour
            </button>
            <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
              {step === "type" && "1 · type"}
              {step === "import" && "2 · souvenir"}
              {step === "ask" && "3 · composer ?"}
              {step === "compose" && "4 · composition"}
            </span>
          </div>

          {step === "type" && <ChooseType type={type} setType={setType} next={() => type && setStep("import")} />}
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
          {step === "ask" && <AskCompose onYes={() => setStep("compose")} onNo={() => saveMemory(false)} />}
          {step === "compose" && <Composer items={items} setItems={setItems} onSave={() => saveMemory(true)} />}
        </div>
      </div>
    </Shell>
  );
}

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
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Étape 1</p>
        <h1 className="mt-3 font-serif text-[2.2rem] leading-[1.05] font-light text-dusk text-balance">
          Quel type de <span className="italic">souvenir ?</span>
        </h1>
        <p className="mt-4 max-w-[32ch] text-[13.5px] leading-relaxed text-dusk/60">
          Vous le déposerez d'abord. Vous pourrez ensuite, si vous le souhaitez, composer un jardin autour.
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
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Étape 2</p>
        <h1 className="mt-3 font-serif text-[2.2rem] leading-[1.05] font-light text-dusk text-balance">
          Déposez ce <span className="italic">souvenir.</span>
        </h1>
        <p className="mt-4 max-w-[34ch] text-[13.5px] leading-relaxed text-dusk/60">Prenez le temps. Une trace — sans mise en scène.</p>
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

function AskCompose({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <div className="flex-1 flex flex-col px-7 pt-16 pb-10">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Étape 3</p>
        <h1 className="mt-4 font-serif text-[2rem] leading-[1.15] font-light text-dusk text-balance max-w-[22ch] mx-auto">
          Souhaitez-vous composer un <span className="italic">jardin</span> autour de ce souvenir ?
        </h1>
      </div>
      <div className="mt-auto pt-10 space-y-3">
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

function Composer({
  items,
  setItems,
  onSave,
}: {
  items: CompositionItem[];
  setItems: React.Dispatch<React.SetStateAction<CompositionItem[]>>;
  onSave: () => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageCacheRef = useRef(new Map<string, HTMLImageElement>());
  const sourceCanvasRef = useRef(new Map<string, HTMLCanvasElement>());
  const maskCanvasRef = useRef(new Map<string, HTMLCanvasElement>());
  const dragLayerIdRef = useRef<string | null>(null);
  const historyRef = useRef<{ past: string[]; future: string[] }>({ past: [], future: [] });
  const erasingRef = useRef<string | null>(null);
  const pointerOffsetRef = useRef({ dx: 0, dy: 0 });

  const [family, setFamily] = useState<ElementFamily>("florale");
  const [tool, setTool] = useState<EditorTool>("place");
  const [brush, setBrush] = useState<string | null>(ELEMENTS[0]?.id ?? null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [eraserSize, setEraserSize] = useState(56);
  const [eraserOpacity, setEraserOpacity] = useState(80);
  const [eraserHardness, setEraserHardness] = useState(30);
  const [userElements, setUserElements] = useState<EditorElement[]>([]);

  const allElements = useMemo(() => [...ELEMENTS, ...userElements], [userElements]);

  const normalizedLayers = useMemo<EditorLayer[]>(() => {
    return items
      .map((item, index) => {
        const elementId = item.elementId ?? item.atlasId;
        if (!elementId) return null;
        const element = allElements.find((entry) => entry.id === elementId);
        if (!element) return null;
        const width = item.width ?? item.size ?? clamp(element.width * 0.4, 70, 280);
        const height = item.height ?? Math.max(40, Math.round((width / element.width) * element.height));
        return {
          ...item,
          elementId,
          width,
          height,
          name: item.name ?? element.label,
          hidden: item.hidden ?? false,
          locked: item.locked ?? false,
          opacity: item.opacity ?? 1,
          rotation: item.rotation ?? 0,
          z: item.z ?? index + 1,
          source: item.source ?? element.source,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a?.z ?? 0) - (b?.z ?? 0)) as EditorLayer[];
  }, [allElements, items]);

  const selected = normalizedLayers.find((layer) => layer.id === selectedId) ?? null;
  const palette = useMemo(() => allElements.filter((entry) => entry.family === family), [allElements, family]);

  useEffect(() => {
    allElements.forEach((entry) => {
      if (imageCacheRef.current.has(entry.id)) return;
      const img = new Image();
      img.src = entry.src;
      imageCacheRef.current.set(entry.id, img);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0);
        sourceCanvasRef.current.set(entry.id, canvas);
      };
    });
  }, [allElements]);

  const commitHistory = (snapshot: CompositionItem[]) => {
    historyRef.current.past.push(JSON.stringify(snapshot));
    if (historyRef.current.past.length > 40) historyRef.current.past.shift();
    historyRef.current.future = [];
  };

  const updateLayers = (updater: (prev: EditorLayer[]) => EditorLayer[]) => {
    setItems((prev) => {
      const current = prev as EditorLayer[];
      const next = updater(current).map((layer, index) => ({ ...layer, z: index + 1 }));
      return next;
    });
  };

  const loadMaskCanvas = (layer: EditorLayer) => {
    const existing = maskCanvasRef.current.get(layer.id);
    if (existing && existing.width === Math.round(layer.width) && existing.height === Math.round(layer.height)) return existing;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(layer.width));
    canvas.height = Math.max(1, Math.round(layer.height));
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (layer.maskDataUrl) {
        const img = new Image();
        img.src = layer.maskDataUrl;
        img.onload = () => {
          const draw = canvas.getContext("2d");
          if (!draw) return;
          draw.clearRect(0, 0, canvas.width, canvas.height);
          draw.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      }
    }
    maskCanvasRef.current.set(layer.id, canvas);
    return canvas;
  };

  const hitTestLayer = (layer: EditorLayer, clientX: number, clientY: number) => {
    if (layer.hidden) return false;
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + (layer.x / 100) * rect.width;
    const cy = rect.top + (layer.y / 100) * rect.height;
    const left = cx - layer.width / 2;
    const top = cy - layer.height / 2;
    if (clientX < left || clientX > left + layer.width || clientY < top || clientY > top + layer.height) return false;
    const source = sourceCanvasRef.current.get(layer.elementId);
    if (!source) return true;
    const localX = Math.floor(((clientX - left) / layer.width) * source.width);
    const localY = Math.floor(((clientY - top) / layer.height) * source.height);
    const ctx = source.getContext("2d", { willReadFrequently: true });
    if (!ctx) return true;
    const alpha = ctx.getImageData(clamp(localX, 0, source.width - 1), clamp(localY, 0, source.height - 1), 1, 1).data[3];
    if (alpha < 12) return false;
    if (!layer.maskDataUrl) return true;
    const mask = loadMaskCanvas(layer);
    const maskCtx = mask.getContext("2d", { willReadFrequently: true });
    if (!maskCtx) return true;
    const maskX = clamp(Math.floor(((clientX - left) / layer.width) * mask.width), 0, mask.width - 1);
    const maskY = clamp(Math.floor(((clientY - top) / layer.height) * mask.height), 0, mask.height - 1);
    return maskCtx.getImageData(maskX, maskY, 1, 1).data[3] > 12;
  };

  const getTopLayerAtPoint = (clientX: number, clientY: number) => {
    const ordered = [...normalizedLayers].sort((a, b) => b.z - a.z);
    return ordered.find((layer) => hitTestLayer(layer, clientX, clientY)) ?? null;
  };

  const stampAt = (elementId: string, x: number, y: number) => {
    const element = getElementById(elementId) ?? userElements.find((entry) => entry.id === elementId);
    if (!element) return;
    const baseWidth = clamp(element.width * 0.42, 70, family === "atmosphere" ? 420 : 280);
    const width = family === "atmosphere" ? Math.max(baseWidth, 380) : baseWidth;
    const height = Math.max(40, Math.round((width / element.width) * element.height));
    updateLayers((prev) => [
      ...prev,
      {
        id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        elementId,
        x: clamp(x, 3, 97),
        y: clamp(y, 3, 97),
        width,
        height,
        rotation: 0,
        opacity: 1,
        z: prev.length + 1,
        name: element.label,
        hidden: false,
        locked: false,
        maskDataUrl: null,
        source: element.source,
      },
    ]);
  };

  const updateLayer = (id: string, patch: Partial<EditorLayer>) => {
    updateLayers((prev) => prev.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)));
  };

  const moveLayer = (id: string, direction: "up" | "down" | "front" | "back") => {
    updateLayers((prev) => {
      const list = [...prev];
      const index = list.findIndex((layer) => layer.id === id);
      if (index < 0) return list;
      const [layer] = list.splice(index, 1);
      let nextIndex = index;
      if (direction === "up") nextIndex = Math.min(list.length, index + 1);
      if (direction === "down") nextIndex = Math.max(0, index - 1);
      if (direction === "front") nextIndex = list.length;
      if (direction === "back") nextIndex = 0;
      list.splice(nextIndex, 0, layer);
      return list;
    });
  };

  const duplicateSelected = () => {
    if (!selected) return;
    commitHistory(items);
    updateLayers((prev) => [
      ...prev,
      {
        ...selected,
        id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        x: clamp(selected.x + 2, 3, 97),
        y: clamp(selected.y + 2, 3, 97),
        name: `${selected.name} copie`,
      },
    ]);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    commitHistory(items);
    updateLayers((prev) => prev.filter((layer) => layer.id !== selectedId));
    setSelectedId(null);
  };

  const undo = () => {
    const prev = historyRef.current.past.pop();
    if (!prev) return;
    historyRef.current.future.unshift(JSON.stringify(items));
    setItems(JSON.parse(prev));
  };

  const redo = () => {
    const next = historyRef.current.future.shift();
    if (!next) return;
    historyRef.current.past.push(JSON.stringify(items));
    setItems(JSON.parse(next));
  };

  const replaceSelected = (elementId: string) => {
    if (!selected) return;
    const element = getElementById(elementId) ?? userElements.find((entry) => entry.id === elementId);
    if (!element) return;
    commitHistory(items);
    const area = selected.width * selected.height;
    const width = Math.max(48, Math.sqrt((area * element.width) / element.height));
    const height = Math.max(48, Math.round((width / element.width) * element.height));
    updateLayer(selected.id, { elementId, name: element.label, width, height, source: element.source });
  };

  const beginErase = (layer: EditorLayer, clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = (layer.x / 100) * rect.width;
    const cy = (layer.y / 100) * rect.height;
    const localX = clientX - rect.left - (cx - layer.width / 2);
    const localY = clientY - rect.top - (cy - layer.height / 2);
    const mask = loadMaskCanvas(layer);
    const ctx = mask.getContext("2d");
    if (!ctx) return;
    const maskX = (localX / layer.width) * mask.width;
    const maskY = (localY / layer.height) * mask.height;
    const radius = Math.max(4, (eraserSize / layer.width) * mask.width);
    const hardness = clamp(eraserHardness / 100, 0.05, 1);
    const inner = radius * hardness;
    const gradient = ctx.createRadialGradient(maskX, maskY, inner * 0.2, maskX, maskY, radius);
    gradient.addColorStop(0, `rgba(0,0,0,${eraserOpacity / 100})`);
    gradient.addColorStop(Math.min(0.98, hardness), `rgba(0,0,0,${eraserOpacity / 100})`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(maskX, maskY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    updateLayer(layer.id, { maskDataUrl: mask.toDataURL("image/png") });
  };

  const onCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hit = getTopLayerAtPoint(e.clientX, e.clientY);
    if (tool === "place" && brush) {
      commitHistory(items);
      const rect = canvas.getBoundingClientRect();
      stampAt(brush, ((e.clientX - rect.left) / rect.width) * 100, ((e.clientY - rect.top) / rect.height) * 100);
      return;
    }
    if (!hit) {
      setSelectedId(null);
      return;
    }
    setSelectedId(hit.id);
    if (tool === "replace" && brush) {
      replaceSelected(brush);
      return;
    }
    if (tool === "erase") {
      if (hit.locked) return;
      commitHistory(items);
      erasingRef.current = hit.id;
      beginErase(hit, e.clientX, e.clientY);
      return;
    }
    if (hit.locked) return;
    const rect = canvas.getBoundingClientRect();
    pointerOffsetRef.current = {
      dx: e.clientX - (rect.left + (hit.x / 100) * rect.width),
      dy: e.clientY - (rect.top + (hit.y / 100) * rect.height),
    };
    erasingRef.current = null;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const onCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const selectedLayer = normalizedLayers.find((layer) => layer.id === selectedId);
    if (!selectedLayer) return;
    if (tool === "erase" && erasingRef.current === selectedLayer.id) {
      beginErase(selectedLayer, e.clientX, e.clientY);
      return;
    }
    if (tool !== "select" || selectedLayer.locked || !(e.buttons & 1)) return;
    const rect = canvas.getBoundingClientRect();
    updateLayer(selectedLayer.id, {
      x: clamp(((e.clientX - rect.left - pointerOffsetRef.current.dx) / rect.width) * 100, 0, 100),
      y: clamp(((e.clientY - rect.top - pointerOffsetRef.current.dy) / rect.height) * 100, 0, 100),
    });
  };

  const onCanvasPointerUp = () => {
    erasingRef.current = null;
  };

  const exportComposition = async () => {
    const blob = await renderExport(normalizedLayers);
    downloadBlob(blob, "composition-hd.png");
  };

  const exportSelected = async () => {
    if (!selected) return;
    const blob = await renderExport([selected], { isolate: true });
    downloadBlob(blob, `${selected.name}.png`);
  };

  const exportAllLayers = async () => {
    const zip = new JSZip();
    for (const layer of normalizedLayers.filter((entry) => !entry.hidden)) {
      const blob = await renderExport([layer], { isolate: true });
      zip.file(`${sanitizeFileName(layer.name)}.png`, blob);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "calques.zip");
  };

  const renderExport = async (layers: EditorLayer[], options?: { isolate?: boolean }) => {
    const canvas = document.createElement("canvas");
    if (options?.isolate && layers.length === 1) {
      canvas.width = Math.max(1, Math.round(layers[0].width * 2));
      canvas.height = Math.max(1, Math.round(layers[0].height * 2));
    } else {
      canvas.width = 2400;
      canvas.height = 3200;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponible");
    for (const layer of [...layers].sort((a, b) => a.z - b.z)) {
      const element = getElementById(layer.elementId) ?? userElements.find((entry) => entry.id === layer.elementId);
      if (!element || layer.hidden) continue;
      const img = await loadImage(element.src);
      const drawCanvas = document.createElement("canvas");
      drawCanvas.width = Math.max(1, Math.round(layer.width * 2));
      drawCanvas.height = Math.max(1, Math.round(layer.height * 2));
      const drawCtx = drawCanvas.getContext("2d");
      if (!drawCtx) continue;
      drawCtx.globalAlpha = layer.opacity;
      drawCtx.drawImage(img, 0, 0, drawCanvas.width, drawCanvas.height);
      if (layer.maskDataUrl) {
        const mask = await loadImage(layer.maskDataUrl);
        drawCtx.globalCompositeOperation = "destination-in";
        drawCtx.drawImage(mask, 0, 0, drawCanvas.width, drawCanvas.height);
        drawCtx.globalCompositeOperation = "source-over";
      }
      const x = options?.isolate && layers.length === 1 ? canvas.width / 2 : (layer.x / 100) * canvas.width;
      const y = options?.isolate && layers.length === 1 ? canvas.height / 2 : (layer.y / 100) * canvas.height;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.drawImage(drawCanvas, -drawCanvas.width / 2, -drawCanvas.height / 2);
      ctx.restore();
    }
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Export impossible"));
      }, "image/png");
    });
  };

  const onImportElement = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        const img = new Image();
        img.onload = () => {
          const entry: EditorElement = {
            id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            label: file.name.replace(/\.[^.]+$/, ""),
            family,
            width: img.naturalWidth,
            height: img.naturalHeight,
            src: url,
            source: file.name,
          };
          setUserElements((prev) => [...prev, entry]);
          setBrush(entry.id);
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-5 pb-5">
      <div className="px-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Étape 4 · composition</p>
        <h1 className="mt-2 font-serif text-[1.6rem] leading-[1.1] font-light text-dusk">Éditeur précis d’éléments illustrés</h1>
        <p className="mt-2 text-[12.5px] leading-relaxed text-dusk/55 max-w-[70ch]">
          Chaque élément est traité comme un objet indépendant, avec fond transparent, calque dédié, remplacement fidèle et gomme douce non destructive.
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[72px_minmax(0,1fr)_320px]">
        <aside className="paper-card organic-radius-3 p-2 flex lg:flex-col gap-2 lg:items-stretch overflow-auto">
          {[
            ["select", "Sélect."],
            ["place", "Poser"],
            ["replace", "Rempl."],
            ["erase", "Gomme"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTool(id as EditorTool)}
              className={`px-3 py-3 text-[11px] uppercase tracking-[0.16em] ${tool === id ? "ceramic" : "paper-card"}`}
            >
              {label}
            </button>
          ))}
          <button onClick={undo} className="px-3 py-3 text-[11px] uppercase tracking-[0.16em] paper-card">Annuler</button>
          <button onClick={redo} className="px-3 py-3 text-[11px] uppercase tracking-[0.16em] paper-card">Rétablir</button>
        </aside>

        <section className="min-w-0">
          <div className="paper-card organic-radius-3 px-3 py-3 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-dusk/60">
            <span>Outil : {tool}</span>
            {selected && <span>Calque : {selected.name}</span>}
            {selected && (
              <>
                <Slider label="Opacité" value={Math.round(selected.opacity * 100)} min={1} max={100} onChange={(v) => updateLayer(selected.id, { opacity: v / 100 })} />
                <Slider label="Rotation" value={Math.round(selected.rotation)} min={-180} max={180} onChange={(v) => updateLayer(selected.id, { rotation: v })} />
                <Slider label="Largeur" value={Math.round(selected.width)} min={30} max={900} onChange={(v) => updateLayer(selected.id, { width: v, height: Math.round((v / (getElementById(selected.elementId)?.width ?? v)) * (getElementById(selected.elementId)?.height ?? selected.height)) })} />
              </>
            )}
            {tool === "erase" && (
              <>
                <Slider label="Taille" value={eraserSize} min={8} max={220} onChange={setEraserSize} />
                <Slider label="Opacité" value={eraserOpacity} min={1} max={100} onChange={setEraserOpacity} />
                <Slider label="Douceur" value={eraserHardness} min={1} max={100} onChange={setEraserHardness} />
              </>
            )}
          </div>

          <div
            ref={canvasRef}
            onPointerDown={onCanvasPointerDown}
            onPointerMove={onCanvasPointerMove}
            onPointerUp={onCanvasPointerUp}
            onPointerCancel={onCanvasPointerUp}
            className="relative mt-3 w-full overflow-hidden touch-none select-none"
            style={{
              aspectRatio: "3 / 4",
              borderRadius: 24,
              background: "radial-gradient(ellipse at 50% 35%, color-mix(in oklab, var(--paper) 92%, white) 0%, color-mix(in oklab, var(--paper) 78%, transparent) 70%, transparent 100%), var(--paper)",
              cursor: tool === "place" ? "copy" : tool === "erase" ? "cell" : "default",
            }}
          >
            {normalizedLayers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="font-serif italic text-dusk/40 text-center px-8 text-balance">Commence par poser une atmosphère, une fleur, un arbre ou un élément marin.</p>
              </div>
            )}
            {normalizedLayers.map((layer) => {
              const element = getElementById(layer.elementId) ?? userElements.find((entry) => entry.id === layer.elementId);
              if (!element || layer.hidden) return null;
              const isSelected = selectedId === layer.id;
              return (
                <div
                  key={layer.id}
                  className="absolute pointer-events-none"
                  style={{
                    top: `${layer.y}%`,
                    left: `${layer.x}%`,
                    width: layer.width,
                    height: layer.height,
                    zIndex: layer.z,
                    transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                    opacity: layer.locked ? 0.96 : 1,
                  }}
                >
                  {isSelected && (
                    <div className="absolute inset-[-8px] border border-dusk/35 rounded-[6px]" style={{ boxShadow: "0 0 0 1px color-mix(in oklab, var(--paper) 65%, transparent)" }} />
                  )}
                  <img
                    src={element.src}
                    alt={layer.name}
                    draggable={false}
                    className="w-full h-full object-contain"
                    style={{
                      opacity: layer.opacity,
                      WebkitMaskImage: layer.maskDataUrl ? `url(${layer.maskDataUrl})` : undefined,
                      maskImage: layer.maskDataUrl ? `url(${layer.maskDataUrl})` : undefined,
                      WebkitMaskSize: "100% 100%",
                      maskSize: "100% 100%",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-3 paper-card organic-radius-3 p-3">
            <div className="flex flex-wrap items-center gap-2">
              {ELEMENT_FAMILIES.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setFamily(entry.id)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] ${family === entry.id ? "ceramic" : "paper-card"}`}
                >
                  {entry.label}
                </button>
              ))}
              <label className="ml-auto px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] paper-card cursor-pointer">
                Importer PNG
                <input type="file" accept="image/png,image/webp,image/jpeg" multiple className="hidden" onChange={onImportElement} />
              </label>
            </div>
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-6 gap-2 max-h-72 overflow-auto pr-1">
              {palette.map((entry) => {
                const active = brush === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => {
                      setBrush(entry.id);
                      if (tool === "select") setTool(selected ? "replace" : "place");
                    }}
                    className={`p-2 text-left organic-radius-3 ${active ? "ceramic" : "paper-card"}`}
                  >
                    <div className="h-24 flex items-center justify-center overflow-hidden">
                      <img src={entry.src} alt={entry.label} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="mt-1 text-[10px] leading-tight text-dusk/65">{entry.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={exportComposition} className="ceramic organic-radius-3 px-4 py-3 text-[11px] uppercase tracking-[0.16em]">Exporter composition HD</button>
            <button onClick={exportSelected} disabled={!selected} className="paper-card organic-radius-3 px-4 py-3 text-[11px] uppercase tracking-[0.16em] disabled:opacity-40">Exporter calque</button>
            <button onClick={exportAllLayers} disabled={!normalizedLayers.length} className="paper-card organic-radius-3 px-4 py-3 text-[11px] uppercase tracking-[0.16em] disabled:opacity-40">Exporter tous les calques</button>
            <button onClick={onSave} className="paper-card organic-radius-3 px-4 py-3 text-[11px] uppercase tracking-[0.16em]">Garder ce souvenir</button>
          </div>
        </section>

        <aside className="paper-card organic-radius-3 p-3 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="font-serif italic text-lg text-dusk">Calques</h2>
            <span className="text-[10px] uppercase tracking-[0.18em] text-dusk/45">{normalizedLayers.length}</span>
          </div>
          <div className="mt-3 space-y-2 max-h-[720px] overflow-auto pr-1">
            {[...normalizedLayers].sort((a, b) => b.z - a.z).map((layer) => {
              const element = getElementById(layer.elementId) ?? userElements.find((entry) => entry.id === layer.elementId);
              if (!element) return null;
              return (
                <div
                  key={layer.id}
                  draggable
                  onDragStart={() => {
                    dragLayerIdRef.current = layer.id;
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    const dragged = dragLayerIdRef.current;
                    if (!dragged || dragged === layer.id) return;
                    commitHistory(items);
                    updateLayers((prev) => {
                      const list = [...prev];
                      const from = list.findIndex((entry) => entry.id === dragged);
                      const to = list.findIndex((entry) => entry.id === layer.id);
                      if (from < 0 || to < 0) return list;
                      const [moved] = list.splice(from, 1);
                      list.splice(to, 0, moved);
                      return list;
                    });
                  }}
                  className={`organic-radius-3 border px-2 py-2 ${selectedId === layer.id ? "border-dusk/35 bg-paper" : "border-dusk/10"}`}
                >
                  <div className="flex gap-2 items-start">
                    <button onClick={() => setSelectedId(layer.id)} className="shrink-0 size-14 paper-card organic-radius-3 flex items-center justify-center overflow-hidden">
                      <img src={element.src} alt={layer.name} className="max-h-full max-w-full object-contain" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <input
                        value={layer.name}
                        onChange={(e) => updateLayer(layer.id, { name: e.target.value })}
                        className="w-full bg-transparent text-[12px] text-dusk outline-none"
                      />
                      <p className="text-[10px] text-dusk/45 truncate">{layer.source}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.16em]">
                    <button onClick={() => updateLayer(layer.id, { hidden: !layer.hidden })} className="paper-card px-2 py-1">{layer.hidden ? "Afficher" : "Masquer"}</button>
                    <button onClick={() => updateLayer(layer.id, { locked: !layer.locked })} className="paper-card px-2 py-1">{layer.locked ? "Déverr." : "Verrou"}</button>
                    <button onClick={() => moveLayer(layer.id, "front")} className="paper-card px-2 py-1">Tout devant</button>
                    <button onClick={() => moveLayer(layer.id, "back")} className="paper-card px-2 py-1">Tout derrière</button>
                    <button onClick={() => moveLayer(layer.id, "up")} className="paper-card px-2 py-1">+1</button>
                    <button onClick={() => moveLayer(layer.id, "down")} className="paper-card px-2 py-1">-1</button>
                    <button onClick={() => { setSelectedId(layer.id); duplicateSelected(); }} className="paper-card px-2 py-1">Dupliquer</button>
                    <button onClick={() => { setSelectedId(layer.id); deleteSelected(); }} className="paper-card px-2 py-1">Supprimer</button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <span>{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-dusk w-24" />
    </label>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function sanitizeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-_]+/gi, "-");
}
