import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { ATLAS, FAMILIES, STYLES, getAtlasItem, type AtlasItem, type Family, type Style } from "@/lib/atlas";
import { addMemory, type CompositionItem, type MemoryType } from "@/lib/memories-store";

export const Route = createFileRoute("/compose/$zone")({
  head: () => ({ meta: [{ title: "Composer un souvenir — Legato" }] }),
  component: Compose,
});

/* ───────── Types & étapes du parcours ───────── */

type Step = "type" | "import" | "ask" | "compose";

const TYPES: { id: MemoryType; label: string; whisper: string }[] = [
  { id: "voice",    label: "Une voix",    whisper: "Enregistrer un son, un mot, un silence." },
  { id: "sentence", label: "Une phrase",  whisper: "Une parole, une promesse, une trace." },
  { id: "photo",    label: "Une photo",   whisper: "Une image, fixée doucement." },
  { id: "text",     label: "Un texte",    whisper: "Quelques mots, une lettre." },
  { id: "sound",    label: "Un son",      whisper: "Un environnement, une musique." },
];

/* ───────── Vignette peinte — extrait pictural d'une planche atlas ───────── */

function AtlasVignette({
  item, size, opacity = 1, soft = true,
}: { item: AtlasItem; size: number; opacity?: number; soft?: boolean }) {
  // On resserre la fenêtre visible à ~70% du crop pour exclure
  // le fond crème et les labels qui suivent l'élément. Le mask radial
  // dissout les bords pour ne garder QUE le sujet peint.
  const innerScale = 0.7;
  const visibleW = item.cw * innerScale;
  const visibleH = item.ch * innerScale;
  const bgW = (100 / visibleW) * 100;
  const bgH = (100 / visibleH) * 100;
  const posX = ((item.cx - visibleW / 2) / (100 - visibleW)) * 100;
  const posY = ((item.cy - visibleH / 2) / (100 - visibleH)) * 100;
  // Masque radial très resserré : noir uniquement au centre,
  // disparaît bien avant les bords du carré → impossible de voir
  // le fond crème ou la typographie résiduelle.
  const mask = "radial-gradient(ellipse at center, black 30%, rgba(0,0,0,0.85) 50%, transparent 78%)";
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${item.src})`,
        backgroundSize: `${bgW}% ${bgH}%`,
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundRepeat: "no-repeat",
        opacity,
        WebkitMaskImage: soft ? mask : undefined,
        maskImage: soft ? mask : undefined,
        // Multiply contre le fond crème de la toile : le fond crème
        // de la planche source disparaît visuellement, seuls les
        // pigments plus sombres (la peinture) restent.
        mixBlendMode: "multiply",
        filter: "saturate(0.95) contrast(1.05)",
      }}
    />
  );
}

/* ───────── Page ───────── */

function Compose() {
  const { zone } = Route.useParams();
  const navigate = useNavigate();
  const { mode } = useLegato();

  const [step, setStep] = useState<Step>("type");
  const [type, setType] = useState<MemoryType | null>(null);

  // Données du souvenir saisies à l'étape "import"
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [durationSec, setDurationSec] = useState<number | null>(null);

  // Composition
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

          {step === "type" && (
            <ChooseType type={type} setType={setType} next={() => type && setStep("import")} />
          )}

          {step === "import" && type && (
            <ImportMemory
              type={type}
              title={title} setTitle={setTitle}
              body={body} setBody={setBody}
              photoUrl={photoUrl} setPhotoUrl={setPhotoUrl}
              durationSec={durationSec} setDurationSec={setDurationSec}
              next={() => setStep("ask")}
            />
          )}

          {step === "ask" && (
            <AskCompose
              onYes={() => setStep("compose")}
              onNo={() => saveMemory(false)}
            />
          )}

          {step === "compose" && (
            <Composer
              items={items}
              setItems={setItems}
              onSave={() => saveMemory(true)}
            />
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ───────── Étape 1 — choix du type ───────── */

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
        <p className="mt-4 max-w-[32ch] text-[13.5px] leading-relaxed text-dusk/60">
          Vous le déposerez d'abord. Vous pourrez ensuite, si vous le souhaitez,
          composer un jardin autour.
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

/* ───────── Étape 2 — importer / écrire le souvenir ───────── */

function ImportMemory({
  type, title, setTitle, body, setBody,
  photoUrl, setPhotoUrl, durationSec, setDurationSec, next,
}: {
  type: MemoryType;
  title: string; setTitle: (s: string) => void;
  body: string; setBody: (s: string) => void;
  photoUrl: string | null; setPhotoUrl: (s: string | null) => void;
  durationSec: number | null; setDurationSec: (n: number | null) => void;
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
    } else {
      setRecording(false);
      if (startedAt.current) {
        setDurationSec(Math.round((Date.now() - startedAt.current) / 1000));
      }
    }
  };

  const ready =
    (type === "sentence" || type === "text") ? body.trim().length > 0 :
    (type === "photo") ? !!photoUrl :
    (type === "voice" || type === "sound") ? durationSec !== null && durationSec > 0 :
    false;

  return (
    <div className="flex-1 flex flex-col px-7 pt-10 pb-10">
      <header>
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Étape 2</p>
        <h1 className="mt-3 font-serif text-[2.2rem] leading-[1.05] font-light text-dusk text-balance">
          Déposez ce <span className="italic">souvenir.</span>
        </h1>
        <p className="mt-4 max-w-[34ch] text-[13.5px] leading-relaxed text-dusk/60">
          Prenez le temps. Une trace — sans mise en scène.
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
              className={`size-20 rounded-full mx-auto flex items-center justify-center transition-all ${
                recording ? "bg-rose/70 breath" : "bg-dusk/85"
              }`}
              aria-label={recording ? "Arrêter" : "Enregistrer"}
            >
              <span className="size-6 bg-paper rounded-sm" />
            </button>
            <p className="mt-4 text-[12px] tracking-[0.18em] uppercase text-dusk/55">
              {recording ? "enregistrement…" : durationSec ? `enregistré · ${durationSec}s` : "appuyer pour enregistrer"}
            </p>
            {durationSec !== null && !recording && (
              <button
                onClick={() => { setDurationSec(null); }}
                className="mt-3 text-[11px] uppercase tracking-[0.2em] text-dusk/45"
              >
                Reprendre
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto pt-12">
        <button
          onClick={next}
          disabled={!ready}
          className={`w-full organic-radius-3 px-7 py-5 text-center transition-opacity ${
            ready ? "ceramic" : "paper-card opacity-40"
          }`}
        >
          <span className="font-serif text-xl italic text-dusk">Continuer</span>
        </button>
      </div>
    </div>
  );
}

/* ───────── Étape 3 — composer ou non ───────── */

function AskCompose({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <div className="flex-1 flex flex-col px-7 pt-16 pb-10">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Étape 3</p>
        <h1 className="mt-4 font-serif text-[2rem] leading-[1.15] font-light text-dusk text-balance max-w-[22ch] mx-auto">
          Souhaitez-vous composer un <span className="italic">jardin</span> autour de ce souvenir ?
        </h1>
        <p className="mt-5 max-w-[34ch] mx-auto text-[13.5px] leading-relaxed text-dusk/60">
          Une œuvre vivante — fleurs, coquillages, ciels — qui le portera dans le jardin de haut.
          Vous pouvez aussi simplement le déposer.
        </p>
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

/* ───────── Étape 4 — composer (atlas + canvas) ───────── */

const TINTS = ["var(--rose)","var(--peach)","var(--sage)","var(--mist)","var(--lavender)","var(--clay)"];

function Composer({
  items, setItems, onSave,
}: { items: CompositionItem[]; setItems: (f: (p: CompositionItem[]) => CompositionItem[]) => void; onSave: () => void }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [family, setFamily] = useState<Family>("florale");
  const [styleFilter, setStyleFilter] = useState<Style | null>(null);
  const [brush, setBrush] = useState<string | null>("rose-ancienne");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const palette = useMemo(
    () => ATLAS.filter((a) => a.family === family && (!styleFilter || a.styles.includes(styleFilter))),
    [family, styleFilter]
  );

  const stampAt = (atlasId: string, x: number, y: number) => {
    const tint = TINTS[Math.floor(Math.random() * TINTS.length)];
    const id = `s-${Date.now()}-${Math.random().toString(36).slice(2,5)}`;
    const j = (r: number) => (Math.random() - 0.5) * r;
    setItems((prev) => [
      ...prev,
      {
        id, atlasId,
        x: clamp(x + j(2), 3, 97),
        y: clamp(y + j(2), 3, 97),
        size: 76 + j(28),
        rotation: j(20),
        opacity: 1,
        tint,
      },
    ]);
  };

  const updateItem = (id: string, patch: Partial<CompositionItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const deleteSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  };

  const onCanvasClick = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).dataset?.shape) return;
    setSelectedId(null);
    if (!brush || !canvasRef.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    stampAt(brush, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
  };

  const startDrag = (e: React.PointerEvent, item: CompositionItem) => {
    e.stopPropagation();
    setSelectedId(item.id);
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    const sx = item.x, sy = item.y;
    const move = (ev: PointerEvent) => updateItem(item.id, {
      x: clamp(sx + ((ev.clientX - startX) / rect.width) * 100, 3, 97),
      y: clamp(sy + ((ev.clientY - startY) / rect.height) * 100, 3, 97),
    });
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  };

  const selected = items.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
      <div className="px-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Étape 4 · composition</p>
        <h1 className="mt-2 font-serif text-[1.6rem] leading-[1.1] font-light text-dusk text-balance">
          Peignez le jardin de ce souvenir.
        </h1>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        onPointerDown={onCanvasClick}
        className="relative mt-5 w-full overflow-hidden touch-none select-none"
        style={{
          aspectRatio: "3 / 4",
          borderRadius: 28,
          background:
            "radial-gradient(ellipse at 50% 35%, color-mix(in oklab, var(--paper) 90%, white) 0%, color-mix(in oklab, var(--paper) 75%, transparent) 70%, transparent 100%), var(--paper)",
          cursor: brush ? "crosshair" : "default",
        }}
      >
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-serif italic text-dusk/40 text-center px-8 text-balance">
              Une page nue. Choisissez un élément ci-dessous, puis touchez la toile.
            </p>
          </div>
        )}

        {items.map((it) => {
          const a = getAtlasItem(it.atlasId); if (!a) return null;
          const isSel = selectedId === it.id;
          return (
            <div
              key={it.id}
              data-shape="1"
              onPointerDown={(e) => startDrag(e, it)}
              className="absolute"
              style={{
                top: `${it.y}%`, left: `${it.x}%`,
                transform: `translate(-50%, -50%) rotate(${it.rotation}deg)`,
              }}
            >
              <div className="relative" style={{ width: it.size, height: it.size }}>
                {isSel && (
                  <div
                    aria-hidden
                    className="absolute inset-[-30%] -z-10"
                    style={{
                      background: `radial-gradient(circle, ${it.tint} 0%, transparent 70%)`,
                      opacity: 0.45, filter: "blur(8px)",
                    }}
                  />
                )}
                <AtlasVignette item={a} size={it.size} opacity={it.opacity} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Réglages de l'élément sélectionné */}
      {selected && (
        <div className="mt-3 paper-card organic-radius-3 px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] tracking-wide text-dusk/65">
          <Slider label="Taille" value={selected.size} min={40} max={200}
            onChange={(v) => updateItem(selected.id, { size: v })} />
          <Slider label="Opacité" value={Math.round(selected.opacity * 100)} min={20} max={100}
            onChange={(v) => updateItem(selected.id, { opacity: v / 100 })} />
          <Slider label="Rotation" value={Math.round(selected.rotation)} min={-180} max={180}
            onChange={(v) => updateItem(selected.id, { rotation: v })} />
          <button onClick={deleteSelected} className="ml-auto uppercase tracking-[0.2em]">Retirer</button>
        </div>
      )}

      {/* Onglets famille */}
      <div className="mt-4 flex justify-center gap-1.5 flex-wrap">
        {FAMILIES.map((f) => (
          <button
            key={f.id}
            onClick={() => setFamily(f.id)}
            className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.18em] transition-colors ${
              family === f.id ? "bg-dusk text-paper" : "text-dusk/55"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Sous-filtres style */}
      <div className="mt-2 flex justify-center gap-1.5 flex-wrap">
        <button
          onClick={() => setStyleFilter(null)}
          className={`px-3 py-1 text-[10px] tracking-[0.16em] italic ${styleFilter === null ? "text-dusk" : "text-dusk/40"}`}
        >
          tous
        </button>
        {STYLES.map((s) => (
          <button
            key={s}
            onClick={() => setStyleFilter(s === styleFilter ? null : s)}
            className={`px-3 py-1 text-[10px] tracking-[0.16em] italic transition-opacity ${
              styleFilter === s ? "text-dusk" : "text-dusk/40 hover:text-dusk/65"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Palette d'éléments — vignettes peintes */}
      <div className="mt-3 flex gap-4 overflow-x-auto no-scrollbar px-2 pb-3">
        {palette.map((a) => {
          const active = brush === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setBrush(a.id)}
              className={`shrink-0 flex flex-col items-center gap-1.5 transition-all ${
                active ? "scale-[1.1]" : "opacity-75 hover:opacity-100"
              }`}
              aria-pressed={active}
            >
              <div className="relative">
                <AtlasVignette item={a} size={62} />
                {active && (
                  <span aria-hidden className="absolute inset-[-30%] -z-10"
                    style={{ background: "radial-gradient(circle, rgba(255,242,215,0.6), transparent 70%)", filter: "blur(8px)" }} />
                )}
              </div>
              <span className="text-[10px] tracking-wide text-dusk/55 italic">{a.label}</span>
            </button>
          );
        })}
        {palette.length === 0 && (
          <p className="text-[12px] italic text-dusk/40 px-4 py-6">Aucun élément pour ce filtre.</p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-3">
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

/* ───────── Petit slider unifié ───────── */

function Slider({
  label, value, min, max, onChange,
}: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-2">
      <span className="uppercase tracking-[0.18em] text-dusk/50">{label}</span>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-dusk w-28"
      />
    </label>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}