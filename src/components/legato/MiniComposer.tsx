import { useMemo, useRef, useState } from "react";
import { ELEMENTS, type ElementAsset } from "@/lib/elements";

export type FlowerPreset = "bouquet" | "couronne" | "ambiance";

type Placed = {
  uid: string;
  asset: ElementAsset;
  x: number; y: number; // 0..1 relative
  scale: number;
  rotate: number;
};

const FAMILIES: Array<ElementAsset["family"]> = ["florale", "feuillage"];

export function MiniComposer({
  preset,
  onExport,
}: {
  preset: FlowerPreset;
  onExport?: (dataUrl: string) => void;
}) {
  const [items, setItems] = useState<Placed[]>([]);
  const [familyTab, setFamilyTab] = useState<ElementAsset["family"]>("florale");
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ uid: string; ox: number; oy: number } | null>(null);

  const palette = useMemo(
    () => ELEMENTS.filter((e) => e.family === familyTab).slice(0, 24),
    [familyTab]
  );

  const addElement = (a: ElementAsset) => {
    const center = preset === "couronne"
      ? { x: 0.5, y: 0.5 }
      : preset === "bouquet"
      ? { x: 0.5, y: 0.6 }
      : { x: 0.3 + Math.random() * 0.4, y: 0.3 + Math.random() * 0.4 };
    setItems((p) => [
      ...p,
      {
        uid: `it-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        asset: a,
        x: center.x + (Math.random() - 0.5) * 0.2,
        y: center.y + (Math.random() - 0.5) * 0.2,
        scale: 0.35 + Math.random() * 0.25,
        rotate: (Math.random() - 0.5) * 30,
      },
    ]);
  };

  const onPointerDown = (uid: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { uid, ox: e.clientX, oy: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragRef.current.ox) / rect.width;
    const dy = (e.clientY - dragRef.current.oy) / rect.height;
    const uid = dragRef.current.uid;
    setItems((prev) =>
      prev.map((it) => (it.uid === uid ? { ...it, x: clamp(it.x + dx, 0, 1), y: clamp(it.y + dy, 0, 1) } : it))
    );
    dragRef.current.ox = e.clientX;
    dragRef.current.oy = e.clientY;
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const remove = (uid: string) => setItems((p) => p.filter((i) => i.uid !== uid));
  const clearAll = () => setItems([]);

  const exportPng = async () => {
    const W = 1600, H = 1200;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fbf7f1";
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
        className="relative w-full aspect-[4/3] ceramic organic-radius-3 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #fbf7f1, #f3ece1)" }}
      >
        {preset === "couronne" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[60%] aspect-square rounded-full border border-dashed border-dusk/15" />
          </div>
        )}
        {items.map((it) => (
          <img
            key={it.uid}
            src={it.asset.src}
            alt=""
            draggable={false}
            onPointerDown={onPointerDown(it.uid)}
            onDoubleClick={() => remove(it.uid)}
            className="absolute select-none cursor-grab active:cursor-grabbing"
            style={{
              left: `${it.x * 100}%`,
              top: `${it.y * 100}%`,
              transform: `translate(-50%, -50%) rotate(${it.rotate}deg) scale(${it.scale})`,
              transformOrigin: "center",
              width: it.asset.width,
              height: it.asset.height,
              maxWidth: "none",
              touchAction: "none",
            }}
          />
        ))}
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center px-8">
            <p className="font-serif italic text-dusk/50 text-[15px]">
              Touchez une fleur en bas pour commencer.
              <br />Glissez pour déplacer, double-tap pour retirer.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
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
            <img src={a.src} alt="" className="w-full h-full object-contain" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
