import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";
import { useLovedName } from "@/lib/loved-name";
import { addMemory, useMemories, type Memory, type MemoryType } from "@/lib/memories-store";

type ZoneKind = "photo" | "voix" | "lettre" | "musique" | "objet" | "citation";

const ZONES: Record<ZoneKind, {
  label: string;
  title: string;
  intro: string;
  type: MemoryType;
  input: "image" | "audio" | "text";
  placeholder: string;
  cta: string;
}> = {
  photo:    { label: "Photos",    title: "Photos",    intro: "Un visage, un jour, une lumière.", type: "photo",    input: "image", placeholder: "Un mot sur cette photo (facultatif)", cta: "Choisir une photo" },
  objet:    { label: "Objets",    title: "Objets",    intro: "Une trace qu'on peut tenir.",       type: "photo",    input: "image", placeholder: "Ce que représente cet objet (facultatif)", cta: "Photographier l'objet" },
  lettre:   { label: "Lettres",   title: "Lettres",   intro: "Ce que vous auriez voulu dire.",    type: "text",     input: "text",  placeholder: "Écrivez ici…", cta: "Déposer la lettre" },
  citation: { label: "Citations", title: "Citations", intro: "Une phrase qui reste.",             type: "sentence", input: "text",  placeholder: "La phrase…", cta: "Déposer la phrase" },
  voix:     { label: "Voix",      title: "Voix",      intro: "Un message, un rire, un souffle.",  type: "voice",    input: "audio", placeholder: "De quoi s'agit-il ? (facultatif)", cta: "Choisir un enregistrement" },
  musique:  { label: "Musiques",  title: "Musiques",  intro: "Les chansons qui vous relient.",    type: "sound",    input: "audio", placeholder: "Titre de la chanson", cta: "Ajouter la musique" },
};

export const Route = createFileRoute("/care/garden/$zone")({
  beforeLoad: ({ params }) => {
    if (!(params.zone in ZONES)) throw notFound();
  },
  head: () => ({ meta: [{ title: "Parcelle — Jardin Legato" }] }),
  notFoundComponent: () => (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk">
        <PageHeader back="/care/garden" title="JARDIN" />
        <p className="px-6 pt-8 font-serif text-[22px]">Cette parcelle n'existe pas.</p>
      </div>
    </Shell>
  ),
  component: GardenZone,
});

const DASH = "color-mix(in oklab, var(--dusk) 16%, transparent)";

function GardenZone() {
  const { zone } = Route.useParams();
  const cfg = ZONES[zone as ZoneKind];
  const lovedName = useLovedName();
  const memories = useMemories(zone);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const confirm = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const submitText = () => {
    if (!text.trim()) return;
    addMemory({ zone, type: cfg.type, body: text.trim() });
    setText("");
    confirm();
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : undefined;
      const heavy = !dataUrl || dataUrl.length > 2_500_000;
      addMemory({
        zone,
        type: cfg.type,
        title: text.trim() || file.name,
        ...(cfg.input === "image" && !heavy ? { imageDataUrl: dataUrl } : {}),
      });
      setText("");
      confirm();
    };
    reader.readAsDataURL(file);
  };

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader back="/care/garden/depot" title={cfg.label.toUpperCase()} />

        <section className="px-6">
          <p className="mono-label">{lovedName}</p>
          <h1 className="mt-3 ed-page-title">{cfg.title}</h1>
        </section>

        {/* Dépôt — une feuille, pas un encart */}
        <section className="px-6 pt-8">
          <div className="border-t border-dashed pt-5" style={{ borderColor: DASH }}>
            <p className="mono-label">Déposer</p>
            {cfg.input === "text" ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={cfg.placeholder}
                rows={5}
                className="mt-3 w-full resize-none bg-transparent font-serif text-[16.5px] leading-[28px] text-dusk outline-none placeholder:text-dusk/30"
              />
            ) : (
              <>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={cfg.placeholder}
                  className="mt-3 w-full bg-transparent pb-2 font-serif text-[16.5px] text-dusk outline-none placeholder:text-dusk/30"
                  style={{ borderBottom: `1px dashed ${DASH}` }}
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept={cfg.input === "image" ? "image/*" : "audio/*"}
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
              </>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed pt-3" style={{ borderColor: DASH }}>
              <span className="text-[11px] tabular-nums tracking-[0.1em] text-dusk/35">
                {saved ? "Déposé dans le Jardin" : cfg.input === "text" ? `${text.trim().length} signes` : "\u00A0"}
              </span>
              <button
                type="button"
                onClick={cfg.input === "text" ? submitText : () => fileRef.current?.click()}
                disabled={cfg.input === "text" && !text.trim()}
                className="rounded-full px-5 py-2 text-[12.5px] disabled:opacity-35"
                style={{ background: "var(--terracotta)", color: "var(--paper)" }}
              >
                {cfg.cta} →
              </button>
            </div>
          </div>
        </section>

        {/* Ce qui pousse ici */}
        <section className="px-6 pt-10">
          <div className="flex items-baseline justify-between">
            <p className="mono-label">Ce qui pousse ici</p>
            <span className="text-[11px] tabular-nums text-dusk/35">{String(memories.length).padStart(2, "0")}</span>
          </div>
          {memories.length === 0 ? (
            <p className="mt-4 max-w-[30ch] text-[13px] leading-[1.6] text-dusk/50">
              Rien encore. Ce que vous déposerez ici restera, sans limite de temps.
            </p>
          ) : (
            <ul className="mt-2">
              {[...memories].reverse().map((m) => <MemoryRow key={m.id} memory={m} />)}
            </ul>
          )}
        </section>

        <section className="px-6 pt-10">
          <Link to="/care/garden" className="flex items-center justify-between border-t border-dashed pt-4" style={{ borderColor: DASH }}>
            <span className="mono-label">Revenir au Jardin</span>
            <span aria-hidden className="text-dusk/30">→</span>
          </Link>
        </section>
      </div>
    </Shell>
  );
}

function MemoryRow({ memory }: { memory: Memory }) {
  const date = new Date(memory.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <li className="border-b border-dashed py-4 last:border-0" style={{ borderColor: DASH }}>
      {memory.imageDataUrl && (
        <img
          src={memory.imageDataUrl}
          alt={memory.title ?? "Souvenir"}
          className="mb-3 w-full rounded-[6px] object-cover"
          style={{ maxHeight: 240 }}
        />
      )}
      {memory.title && <p className="font-serif text-[17px] leading-[1.2]">{memory.title}</p>}
      {memory.body && <p className="mt-1 whitespace-pre-wrap font-serif text-[15.5px] leading-[26px] text-dusk/80">{memory.body}</p>}
      <p className="mt-2 text-[10.5px] uppercase tracking-[0.14em] text-dusk/35" style={{ fontFamily: "var(--font-mono)" }}>{date}</p>
    </li>
  );
}
