import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { BackLink } from "@/components/legato/BackLink";
import { useLovedName } from "@/lib/loved-name";
import { addMemory, useMemories, type Memory, type MemoryType } from "@/lib/memories-store";

type ZoneKind = "photo" | "voix" | "lettre" | "musique" | "objet" | "citation";

const ZONES: Record<ZoneKind, {
  label: string;
  title: string;
  intro: string;
  bg: string;
  type: MemoryType;
  input: "image" | "audio" | "text";
  placeholder: string;
  cta: string;
}> = {
  photo:    { label: "Photos",   title: "Photos",   intro: "Un visage, un jour, une lumière.",   bg: "var(--whisper)", type: "photo",    input: "image", placeholder: "Un mot sur cette photo (facultatif)", cta: "Choisir une photo" },
  objet:    { label: "Objets",   title: "Objets",   intro: "Une trace qu'on peut tenir.",         bg: "var(--whisper)", type: "photo",    input: "image", placeholder: "Ce que représente cet objet (facultatif)", cta: "Photographier l'objet" },
  lettre:   { label: "Lettres",  title: "Lettres",  intro: "Ce que vous auriez voulu dire.",      bg: "var(--sun)",     type: "text",     input: "text",  placeholder: "Écrivez ici…", cta: "Déposer la lettre" },
  citation: { label: "Citations", title: "Citations", intro: "Une phrase qui reste.",             bg: "color-mix(in oklab, var(--bordeaux) 18%, var(--whisper))", type: "sentence", input: "text", placeholder: "La phrase…", cta: "Déposer la phrase" },
  voix:     { label: "Voix",     title: "Voix",     intro: "Un message, un rire, un souffle.",    bg: "var(--blush)",   type: "voice",    input: "audio", placeholder: "De quoi s'agit-il ? (facultatif)", cta: "Choisir un enregistrement" },
  musique:  { label: "Musiques", title: "Musiques", intro: "Les chansons qui vous relient.",      bg: "color-mix(in oklab, var(--olive) 22%, var(--whisper))", type: "sound", input: "audio", placeholder: "Titre de la chanson", cta: "Ajouter la musique" },
};

export const Route = createFileRoute("/care/garden/$zone")({
  beforeLoad: ({ params }) => {
    if (!(params.zone in ZONES)) throw notFound();
  },
  head: () => ({ meta: [{ title: "Parcelle — Jardin Legato" }] }),
  notFoundComponent: () => (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk px-6 pt-9">
        <BackLink to="/care/garden" label="Retour au Jardin" />
        <p className="mt-8 font-serif text-[22px]">Cette parcelle n'existe pas.</p>
      </div>
    </Shell>
  ),
  component: GardenZone,
});

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
        <header className="px-6 pt-7 flex items-center justify-between">
          <BackLink to="/care/garden" label="Jardin" />
          <span className="mono-label text-dusk/45">{cfg.label}</span>
        </header>

        <section className="px-6 pt-8">
          <p className="mono-label">Jardin de {lovedName}</p>
          <h1 className="mt-3 ed-page-title">{cfg.title}</h1>
          <p className="mt-4 text-[13.5px] leading-[1.65] text-dusk/60 max-w-[34ch]">{cfg.intro}</p>
        </section>

        <section className="px-5 pt-7">
          <div className="rounded-[20px] px-5 py-5" style={{ background: cfg.bg }}>
            <p className="mono-label text-dusk/60">Déposer</p>
            {cfg.input === "text" ? (
              <>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={cfg.placeholder}
                  rows={4}
                  className="mt-3 w-full resize-none rounded-[12px] border border-dusk/12 bg-paper px-4 py-3 text-[13.5px] leading-[1.6] text-dusk outline-none"
                />
                <button
                  onClick={submitText}
                  disabled={!text.trim()}
                  className="mt-3 h-11 w-full rounded-full text-[12px] tracking-[0.06em] disabled:opacity-40"
                  style={{ background: "var(--dusk)", color: "var(--paper)" }}
                >
                  {cfg.cta}
                </button>
              </>
            ) : (
              <>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={cfg.placeholder}
                  className="mt-3 h-11 w-full rounded-[12px] border border-dusk/12 bg-paper px-4 text-[13px] text-dusk outline-none"
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept={cfg.input === "image" ? "image/*" : "audio/*"}
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 h-11 w-full rounded-full text-[12px] tracking-[0.06em]"
                  style={{ background: "var(--dusk)", color: "var(--paper)" }}
                >
                  {cfg.cta}
                </button>
              </>
            )}
            {saved && <p className="mt-3 text-[12px] text-dusk/70">Déposé dans le Jardin.</p>}
          </div>
        </section>

        <section className="px-5 pt-8">
          <p className="mono-label px-1 text-dusk/55">
            {memories.length > 0 ? `${memories.length} déposé${memories.length > 1 ? "s" : ""}` : "Rien encore"}
          </p>
          {memories.length === 0 ? (
            <p className="mt-3 px-1 text-[13px] leading-[1.6] text-dusk/55 max-w-[32ch]">
              Ce que vous déposerez ici restera, sans limite de temps.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {[...memories].reverse().map((m) => <MemoryRow key={m.id} memory={m} />)}
            </div>
          )}
        </section>

        <section className="px-5 pt-9">
          <Link to="/care/garden" className="block rounded-[18px] border border-dusk/12 px-5 py-4 text-center">
            <span className="mono-label text-dusk/60">Revenir au Jardin</span>
          </Link>
        </section>
      </div>
    </Shell>
  );
}

function MemoryRow({ memory }: { memory: Memory }) {
  const date = new Date(memory.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4">
      {memory.imageDataUrl && (
        <img src={memory.imageDataUrl} alt={memory.title ?? "Souvenir"} className="mb-3 w-full rounded-[12px] object-cover" style={{ maxHeight: 220 }} />
      )}
      {memory.title && <p className="font-serif text-[17px] leading-[1.2]">{memory.title}</p>}
      {memory.body && <p className="mt-1 text-[13.5px] leading-[1.6] text-dusk/75 whitespace-pre-wrap">{memory.body}</p>}
      <p className="mt-2 mono-label text-dusk/40">{date}</p>
    </div>
  );
}
