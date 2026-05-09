import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { CompositionThumb } from "@/components/legato/CompositionThumb";
import { useLegato } from "@/lib/legato-state";
import { BEINGS } from "./garden.index";
import { ELEMENTS, type ElementFamily } from "@/lib/elements";
import { useMemories } from "@/lib/memories-store";

export const Route = createFileRoute("/garden/$zone")({
  head: () => ({ meta: [{ title: "Un jardin — Legato" }] }),
  component: GardenZone,
});

/**
 * Each zone is now a being's garden — a single person or animal.
 * Memories of every kind (voice, light, words, gestures, objects)
 * coexist inside this one garden.
 */
type ItemKind = "voice" | "photo" | "sentence" | "habit" | "object";
type Item = { id: string; kind: ItemKind; title: string; date: string; preview: string };

const BEING_MEMORIES: Record<string, Item[]> = {
  elise: [
    { id: "e1", kind: "voice",    title: "Lecture sous le porche", date: "14 avril 2024", preview: "0:42" },
    { id: "e2", kind: "sentence", title: "Quelque chose qu'elle a dit", date: "—", preview: "« Tu reviens toujours plus doux… »" },
    { id: "e3", kind: "photo",    title: "La cuisine, fin d'après-midi", date: "11 août 2023", preview: "" },
    { id: "e4", kind: "habit",    title: "Le thé de 16 h", date: "Chaque jour", preview: "Une cuillère et demie de miel." },
  ],
  papa: [
    { id: "p1", kind: "voice",    title: "Il chantonne en conduisant", date: "été 2019", preview: "0:28" },
    { id: "p2", kind: "object",   title: "La montre en cuir usé",     date: "—",          preview: "Toujours en retard d'une minute." },
  ],
  leon: [
    { id: "l1", kind: "habit",    title: "Le tour du jardin, midi", date: "tous les jours", preview: "Trois pas, une pause, un regard." },
    { id: "l2", kind: "photo",    title: "Endormi sur le pull",     date: "novembre 2022",  preview: "" },
  ],
  mamie: [
    { id: "m1", kind: "sentence", title: "Sa formule du matin", date: "—", preview: "« Doucement le matin, pas trop vite le soir. »" },
    { id: "m2", kind: "object",   title: "Le foulard bleu",     date: "—", preview: "Plié dans le deuxième tiroir." },
  ],
  theo: [
    { id: "t1", kind: "voice",    title: "Rire pour rien",     date: "2 mars 2024", preview: "0:18" },
    { id: "t2", kind: "photo",    title: "Des mains, chapeau d'été", date: "30 juin 2023", preview: "" },
  ],
};

const KIND_LABEL: Record<ItemKind, string> = {
  voice: "voix", photo: "lumière", sentence: "phrase", habit: "geste", object: "objet",
};

/** Choisit 6–8 fragments d'atlas pour composer une petite scène
 *  paysagère (220×120) au-dessus du prénom. */
function signatureFor(beingId: string) {
  const seed = beingId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const familyOrder: ElementFamily[] = [
    "feuillage", "florale", "feuillage", "florale", "feuillage", "florale", "feuillage",
  ];
  const picks: { src: string; w: number; h: number; x: number; y: number; r: number; s: number; dur: number; delay: number }[] = [];
  familyOrder.forEach((fam, i) => {
    const pool = ELEMENTS.filter((e) => e.family === fam);
    if (!pool.length) return;
    const el = pool[(seed + i * 37) % pool.length];
    const t = i / (familyOrder.length - 1); // 0..1 → balayage horizontal
    picks.push({
      src: el.src,
      w: el.width,
      h: el.height,
      x: 8 + t * 84 + (((seed + i * 13) % 10) - 5),     // étalé en largeur
      y: 70 + (((seed + i * 19) % 24) - 12),             // ligne d'horizon basse
      r: ((seed + i * 23) % 16) - 8,
      s: 0.5 + ((seed + i * 11) % 35) / 100,
      dur: 7 + ((seed + i * 7) % 5),
      delay: ((seed + i * 11) % 40) / 10,
    });
  });
  return picks;
}

function OrganicSignature({ beingId }: { beingId: string }) {
  const picks = signatureFor(beingId);
  return (
    <div className="relative mx-auto" style={{ width: 240, height: 130 }}>
      {picks.map((p, i) => (
        <img
          key={i}
          src={p.src}
          alt=""
          aria-hidden
          className="absolute feathered-soft select-none sway-soft"
          draggable={false}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${Math.max(36, p.w * p.s * 0.16)}px`,
            height: `${Math.max(36, p.h * p.s * 0.16)}px`,
            transform: `translate(-50%, -80%) rotate(${p.r}deg)`,
            opacity: 0.92,
            mixBlendMode: "multiply",
            ["--sway-dur" as string]: `${p.dur}s`,
            ["--sway-delay" as string]: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function GardenZone() {
  const { zone } = Route.useParams();
  const { mode } = useLegato();
  const being = BEINGS.find((b) => b.id === zone) ?? BEINGS[0];
  const seedItems = BEING_MEMORIES[being.id] ?? [];
  const userMemories = useMemories(being.id);
  const items = seedItems;
  const color = being.blooms[0].tint;
  const color2 = being.blooms[1]?.tint ?? being.blooms[0].tint2;
  const [openId, setOpenId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <Shell>
      <div className="relative pb-12">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10">
            <Link to="/garden" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">
              ← Le Jardin
            </Link>
          </div>

          {/* Organic signature — fragments of the atlases, gathered around the being */}
          <div className="px-7 pt-8 flex flex-col items-center text-center">
            <OrganicSignature beingId={being.id} />
            <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              {being.kind === "person" ? "Le jardin de" : "Le coin de"}
            </p>
            <h1 className="mt-2 font-serif text-[2rem] leading-[1.05] font-light text-dusk text-balance">
              {being.name}
            </h1>
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-dusk/40">
              {items.length + userMemories.length} {items.length + userMemories.length > 1 ? "souvenirs" : "souvenir"}
            </p>
          </div>

          {/* User-created memories first (with composition badge) */}
          {userMemories.length > 0 && (
            <div className="px-7 mt-10 space-y-3">
              {userMemories.map((m) => (
                <Link
                  key={m.id}
                  to="/compose/$zone"
                  params={{ zone }}
                  className="block paper-card p-5"
                  style={{ borderRadius: 24 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg italic text-dusk leading-snug">
                        {m.title || "Souvenir"}
                      </h3>
                      {m.body && (
                        <p className="mt-2 text-[13.5px] leading-relaxed text-dusk/65 line-clamp-3">{m.body}</p>
                      )}
                      {m.composition && m.composition.length > 0 && (
                        <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-dusk/45">
                          composition · toucher pour rouvrir
                        </p>
                      )}
                    </div>
                    {m.composition && m.composition.length > 0 && (
                      <CompositionThumb items={m.composition} />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Existing memories — every kind coexists in one being's garden */}
          <div className="px-7 mt-10 space-y-3">
            {items.map((it) => {
              const open = openId === it.id;
              const playing = playingId === it.id;
              const isVoice = it.kind === "voice";
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setOpenId(open ? null : it.id)}
                  className={`w-full text-left paper-card p-5 transition-all duration-500 ${
                    open ? "scale-[1.01] shadow-lg" : "hover:scale-[1.005]"
                  }`}
                  style={{ borderRadius: 24 }}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-lg italic text-dusk leading-snug">{it.title}</h3>
                    <span className="text-[10px] tracking-[0.1em] text-dusk/45 shrink-0">{it.date}</span>
                  </div>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-dusk/40">
                    {KIND_LABEL[it.kind]}
                  </p>
                  {it.preview && (
                    <p className="mt-2 text-[13.5px] leading-relaxed text-dusk/65">{it.preview}</p>
                  )}

                  {/* Expanded interactive panel */}
                  <div
                    className="grid transition-all duration-500 ease-out"
                    style={{
                      gridTemplateRows: open ? "1fr" : "0fr",
                      opacity: open ? 1 : 0,
                      marginTop: open ? 16 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <div
                        className="rounded-[18px] p-4"
                        style={{
                          background: `linear-gradient(135deg, color-mix(in oklab, ${color} 35%, var(--paper)), color-mix(in oklab, ${color2} 25%, var(--paper)))`,
                        }}
                      >
                        {isVoice ? (
                          <div className="flex items-center gap-3">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlayingId(playing ? null : it.id);
                              }}
                              className="size-11 rounded-full bg-dusk text-paper flex items-center justify-center cursor-pointer shadow-md"
                              aria-label={playing ? "Pause" : "Écouter"}
                            >
                              {playing ? "❚❚" : "▸"}
                            </span>
                            <div className="flex-1 flex items-center gap-[2px] h-9">
                              {Array.from({ length: 28 }).map((_, i) => (
                                <span
                                  key={i}
                                  className="flex-1 rounded-full bg-dusk/60"
                                  style={{
                                    height: `${20 + Math.abs(Math.sin(i * 0.7)) * 70}%`,
                                    opacity: playing ? 0.85 : 0.35,
                                    transition: `opacity 300ms ${i * 30}ms`,
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] tabular-nums text-dusk/65">{it.preview}</span>
                          </div>
                        ) : (
                          <p className="font-serif italic text-dusk/85 text-[15px] leading-relaxed text-balance">
                            {it.preview || "Touchez à nouveau pour refermer."}
                          </p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
                            Souvenir vivant
                          </span>
                          <Link
                            to="/compose/$zone"
                            params={{ zone }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] uppercase tracking-[0.22em] text-dusk/70 underline-offset-4 hover:underline"
                          >
                            Enrichir →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!open && (
                    <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-dusk/35">
                      Toucher pour ouvrir
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Single primary action: plant a new memory composition */}
          <div className="px-7 mt-10">
            <Link
              to="/compose/$zone"
              params={{ zone }}
              className="ceramic organic-radius-3 block px-7 py-5 text-center"
            >
              <span className="block font-serif text-xl italic text-dusk">
                Déposer un nouveau souvenir
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-dusk/50">
                choisir le type · le déposer · composer si vous le souhaitez
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}