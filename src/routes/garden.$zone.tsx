import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";
import { CompositionThumb } from "@/components/legato/CompositionThumb";
import { BEINGS } from "./garden.index";
import { useMemories } from "@/lib/memories-store";
import bouquet01 from "@/assets/bouquets/bouquet-01.png";
import bouquet02 from "@/assets/bouquets/bouquet-02.png";
import bouquet03 from "@/assets/bouquets/bouquet-03.png";
import bouquet04 from "@/assets/bouquets/bouquet-04.png";

const BOUQUET_BY_BEING: Record<string, string> = {
  elise: bouquet01,
  papa: bouquet02,
  leon: bouquet03,
  mamie: bouquet04,
  theo: bouquet01,
};

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

function GardenZone() {
  const { zone } = Route.useParams();
  const being = BEINGS.find((b) => b.id === zone) ?? BEINGS[0];
  const seedItems = BEING_MEMORIES[being.id] ?? [];
  const userMemories = useMemories(being.id);
  const items = seedItems;
  const color = being.blooms[0].tint;
  const color2 = being.blooms[1]?.tint ?? being.blooms[0].tint2;
  const [openId, setOpenId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="LE JARDIN" back="/garden" />

        {/* Parcelle — éditorial */}
        <section className="px-6 pt-10 pb-8">
          <p className="mono-label">{being.kind === "person" ? "La parcelle de" : "Le coin de"}</p>
          <h1 className="mt-4 ed-page-title">
            <span className="italic">{being.name}</span>
          </h1>
          <p className="mt-4 body-meta">
            {items.length + userMemories.length} {items.length + userMemories.length > 1 ? "souvenirs déposés" : "souvenir déposé"}
          </p>
          <img
            src={BOUQUET_BY_BEING[being.id] ?? bouquet01}
            alt=""
            aria-hidden
            draggable={false}
            className="mt-6 h-[140px] w-auto max-w-[260px] object-contain select-none"
          />
        </section>

          {/* User-created memories first (with composition badge) */}
          {userMemories.length > 0 && (
            <div className="px-5 mt-2 space-y-3">
              {userMemories.map((m) => (
                <Link
                  key={m.id}
                  to="/compose/$zone"
                  params={{ zone }}
                  className="block card-plain p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="h-section italic">
                        {m.title || "Souvenir"}
                      </h3>
                      {m.body && (
                        <p className="mt-2 body-meta line-clamp-3">{m.body}</p>
                      )}
                      {m.composition && m.composition.length > 0 && (
                        <p className="mt-3 eyebrow">Composition · rouvrir</p>
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
          <div className="px-5 mt-3 space-y-3">
            {items.map((it) => {
              const open = openId === it.id;
              const playing = playingId === it.id;
              const isVoice = it.kind === "voice";
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setOpenId(open ? null : it.id)}
                  className={`w-full text-left card-plain p-5 transition-all duration-500 ${
                    open ? "scale-[1.01] shadow-lg" : "active:scale-[0.99]"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="h-section italic">{it.title}</h3>
                    <span className="eyebrow shrink-0">{it.date}</span>
                  </div>
                  <p className="mt-2 eyebrow">{KIND_LABEL[it.kind]}</p>
                  {it.preview && (
                    <p className="mt-2 body-meta">{it.preview}</p>
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
                        className="rounded-[20px] p-4"
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
                              className="size-11 rounded-full flex items-center justify-center cursor-pointer shadow-md"
                              style={{ background: "var(--ink)", color: "var(--paper)" }}
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
                          <p className="font-serif italic text-[16px] leading-relaxed text-balance" style={{ color: "var(--dusk)" }}>
                            {it.preview || "Touchez à nouveau pour refermer."}
                          </p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="eyebrow">Souvenir vivant</span>
                          <Link
                            to="/compose/$zone"
                            params={{ zone }}
                            onClick={(e) => e.stopPropagation()}
                            className="eyebrow underline underline-offset-4"
                            style={{ color: "var(--terracotta)" }}
                          >
                            Enrichir →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!open && (
                    <p className="mt-3 eyebrow opacity-60">Toucher pour ouvrir</p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Single primary action: plant a new memory composition */}
          <div className="px-5 mt-8">
            <Link
              to="/compose/$zone"
              params={{ zone }}
              className="card-olive block px-7 py-6 text-center"
            >
              <span className="eyebrow-on-dark">Déposer</span>
              <p className="mt-2 font-serif text-[22px] italic">Un nouveau souvenir →</p>
            </Link>
          </div>
      </div>
    </Shell>
  );
}