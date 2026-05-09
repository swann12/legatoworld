import { useMemo, useRef, useState } from "react";
import { ELEMENTS, type ElementAsset } from "@/lib/elements";
import { OrganicHandles } from "./OrganicHandles";

export type FlowerPreset = "bouquet" | "couronne" | "ambiance";

type Placed = {
  uid: string;
  asset: ElementAsset;
  x: number; y: number;          // 0..1 relative
  scale: number;                  // 0..2
  rotate: number;                 // deg
  opacity: number;                // 0..1
  flipX?: boolean;
  flipY?: boolean;
};

const FAMILIES: Array<ElementAsset["family"]> = ["florale", "feuillage"];

/* Placement intelligent selon le préréglage. Recalcule la couronne
 * pour répartir tous les éléments sur le cercle, rotation tangente. */
function layoutFor(preset: FlowerPreset, list: Placed[]): Placed[] {
  if (preset === "couronne") {
    const N = list.length;
    const R = 0.30; // 30% du canvas
    return list.map((it, i) => {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      return {
        ...it,
        x: 0.5 + Math.cos(a) * R,
        y: 0.5 + Math.sin(a) * R * 0.85,
        rotate: (a * 180) / Math.PI + 90, // tangente au cercle
      };
    });
  }
  if (preset === "bouquet") {
    // converge vers le bas-centre, tiges vers le haut
    const N = list.length;
    return list.map((it, i) => {
      const t = N === 1 ? 0 : (i / (N - 1)) - 0.5;
      return {
        ...it,
        x: 0.5 + t * 0.32,
        y: 0.62 - Math.abs(t) * 0.18,
        rotate: t * 35,
      };
    });
  }
  // ambiance — dispersion organique douce
  return list;
}

export function MiniComposer({
  preset,
  onExport,
}: {
  preset: FlowerPreset;
  onExport?: (dataUrl: string) => void;
}) {
  const [items, setItems] = useState<Placed[]>([]);
  const [familyTab, setFamilyTab] = useState<ElementAsset["family"]>("florale");
  const [selected, setSelected] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    uid: string;
    mode: "move" | "rotate" | "scale" | "opacity";
    startX: number;
    startY: number;
    item: Placed;
    rect: DOMRect;
  } | null>(null);

  const palette = useMemo(
    () => ELEMENTS.filter((e) => e.family === familyTab).slice(0, 24),
    [familyTab],
  );

  const addElement = (a: ElementAsset) => {
    setItems((p) => {
      const draft: Placed = {
        uid: `it-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        asset: a,
        x: 0.5, y: 0.5,
        scale: preset === "couronne" ? 0.32 : 0.4,
        rotate: 0,
        opacity: 1,
      };
      const next = layoutFor(preset, [...p, draft]);
      setSelected(draft.uid);
      return next;
    });
  };

  const onPointerDown =
    (uid: string, mode: "move" | "rotate" | "scale" | "opacity") =>
    (e: React.PointerEvent) => {
      e.stopPropagation();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const item = items.find((i) => i.uid === uid);
      if (!item) return;
      (e.target as Element).setPointerCapture(e.pointerId);
      dragRef.current = { uid, mode, startX: e.clientX, startY: e.clientY, item, rect };
      setSelected(uid);
    };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    setItems((prev) =>
      prev.map((it) => {
        if (it.uid !== d.uid) return it;
        if (d.mode === "move") {
          return {
            ...it,
            x: clamp(d.item.x + dx / d.rect.width, 0, 1),
            y: clamp(d.item.y + dy / d.rect.height, 0, 1),
          };
        }
        if (d.mode === "scale") {
          const factor = 1 + dy / 180;
          return { ...it, scale: clamp(d.item.scale * factor, 0.08, 1.6) };
        }
        if (d.mode === "rotate") {
          const cx = d.rect.left + d.item.x * d.rect.width;
          const cy = d.rect.top + d.item.y * d.rect.height;
          const a = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90;
          return { ...it, rotate: a };
        }
        if (d.mode === "opacity") {
          return { ...it, opacity: clamp(d.item.opacity - dy / 200, 0.1, 1) };
        }
        return it;
      }),
    );
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const flipH = () => {
    if (!selected) return;
    setItems((p) => p.map((it) => (it.uid === selected ? { ...it, flipX: !it.flipX } : it)));
  };
  const flipV = () => {
    if (!selected) return;
    setItems((p) => p.map((it) => (it.uid === selected ? { ...it, flipY: !it.flipY } : it)));
  };
  const removeSelected = () => {
    if (!selected) return;
    setItems((p) => layoutFor(preset, p.filter((i) => i.uid !== selected)));
    setSelected(null);
  };
  const clearAll = () => { setItems([]); setSelected(null); };

  const exportPng = async () => {
    const W = 1600, H = 1200;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    for (const it of items) {
      const img = new Image();
      img.src = it.asset.src;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      const w = it.asset.width * it.scale * 1.6;
      const h = it.asset.height * it.scale * 1.6;
      const cx = it.x * W, cy = it.y * H;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((it.rotate * Math.PI) / 180);
      ctx.scale(it.flipX ? -1 : 1, it.flipY ? -1 : 1);
      ctx.globalAlpha = it.opacity;
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
    }
    const url = canvas.toDataURL("image/png");
    onExport?.(url);
    const a = document.createElement("a");
    a.href = url; a.download = `composition-florale.png`;
    a.click();
  };

  return (
    <div>
      <div
        ref={canvasRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerDown={() => setSelected(null)}
        className="relative w-full aspect-[4/3] ceramic organic-radius-3 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #fbf7f1, #f3ece1)" }}
      >
        {preset === "couronne" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[60%] aspect-square rounded-full border border-dashed border-dusk/15" />
          </div>
        )}
        {items.map((it) => {
          const isSel = selected === it.uid;
          const sx = it.flipX ? -1 : 1;
          const sy = it.flipY ? -1 : 1;
          return (
            <div
              key={it.uid}
              className="absolute"
              style={{
                left: `${it.x * 100}%`,
                top: `${it.y * 100}%`,
                width: `${it.asset.width * it.scale * 0.6}px`,
                height: `${it.asset.height * it.scale * 0.6}px`,
                transform: `translate(-50%, -50%) rotate(${it.rotate}deg)`,
                opacity: it.opacity,
                touchAction: "none",
              }}
            >
              <img
                src={it.asset.src}
                alt=""
                draggable={false}
                onPointerDown={onPointerDown(it.uid, "move")}
                className="absolute inset-0 w-full h-full select-none cursor-grab active:cursor-grabbing feathered-soft"
                style={{ transform: `scale(${sx}, ${sy})` }}
              />
              {isSel && (
                <OrganicHandles
                  onPointerDown={(kind) => onPointerDown(it.uid, kind)}
                  onFlipH={flipH}
                  onFlipV={flipV}
                />
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center px-8 pointer-events-none">
            <p className="font-serif italic text-dusk/50 text-[15px]">
              Touchez une fleur en bas pour commencer.
              <br />Glissez pour déplacer.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {FAMILIES.map((f) => (
          <button
            key={f}
            onClick={() => setFamilyTab(f)}
            className={`px-3 py-1.5 organic-radius text-[11px] uppercase tracking-[0.18em] ${
              familyTab === f ? "ceramic text-dusk" : "text-dusk/50"
            }`}
          >
            {f === "florale" ? "Fleurs" : "Feuillages"}
          </button>
        ))}
        <div className="flex-1" />
        {selected && (
          <button onClick={removeSelected} className="text-[11px] uppercase tracking-[0.18em] text-dusk/55">
            retirer
          </button>
        )}
        <button onClick={clearAll} className="text-[11px] uppercase tracking-[0.18em] text-dusk/50">
          tout retirer
        </button>
        <button onClick={exportPng} className="ceramic organic-radius px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-dusk">
          exporter
        </button>
      </div>

      <div className="mt-3 grid grid-cols-6 sm:grid-cols-8 gap-2">
        {palette.map((a) => (
          <button
            key={a.id}
            onClick={() => addElement(a)}
            className="aspect-square ceramic-soft organic-radius p-1 hover:opacity-80"
            aria-label={`Ajouter ${a.label}`}
          >
            <img src={a.src} alt="" className="w-full h-full object-contain feathered-soft" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}