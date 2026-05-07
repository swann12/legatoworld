import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { OrganicShape, type ShapeKind } from "@/components/legato/OrganicShape";

export const Route = createFileRoute("/garden/")({
  head: () => ({ meta: [{ title: "Une zone du jardin — Legato" }] }),
  component: GardenZone,
});

type ZoneData = {
  name: { fr: string; en: string };
  whisper: { fr: string; en: string };
  color: string; color2: string;
  shape: ShapeKind;
  items: { id: string; title: string; date: string; preview: string; shape: ShapeKind }[];
};

const ZONE: Record<string, ZoneData> = {
  voice: {
    name: { fr: "Le bosquet des voix", en: "The grove of voices" },
    whisper: { fr: "Un son qu'on emporte.", en: "A sound to carry along." },
    color: "var(--rose)", color2: "var(--peach)", shape: "rose",
    items: [
      { id: "v1", title: "Lecture sous le porche", date: "14 avril 2024", preview: "0:42", shape: "rose" },
      { id: "v2", title: "Rire pour rien", date: "2 mars 2024", preview: "0:18", shape: "petal" },
    ],
  },
  photo: {
    name: { fr: "La clairière de lumière", en: "The clearing of light" },
    whisper: { fr: "La lumière, fixée dans le temps.", en: "Light, held in time." },
    color: "var(--peach)", color2: "var(--rose)", shape: "daisy",
    items: [
      { id: "p1", title: "La cuisine, fin d'après-midi", date: "11 août 2023", preview: "Une nappe blanche, deux tasses.", shape: "daisy" },
      { id: "p2", title: "Des mains, chapeau d'été", date: "30 juin 2023", preview: "On voit le soleil dans son sourire.", shape: "sun" },
    ],
  },
  sentence: {
    name: { fr: "Les pierres aux phrases", en: "The stones of words" },
    whisper: { fr: "Des mots gardés en poche.", en: "Words kept in a pocket." },
    color: "var(--lavender)", color2: "var(--mist)", shape: "stone",
    items: [
      { id: "s1", title: "Quelque chose qu'elle a dit", date: "—", preview: "« Tu reviens toujours plus doux que tu n'es parti. »", shape: "stone" },
    ],
  },
  habit: {
    name: { fr: "Le sentier des gestes", en: "The path of gestures" },
    whisper: { fr: "De petites tendresses répétées.", en: "Small tendernesses, repeated." },
    color: "var(--sage)", color2: "var(--mist)", shape: "fern",
    items: [{ id: "h1", title: "Le thé de 16 h", date: "Tous les jours", preview: "Une cuillère et demie de miel.", shape: "fern" }],
  },
  object: {
    name: { fr: "Le rivage des objets", en: "The shore of objects" },
    whisper: { fr: "Ce que la main connaît encore.", en: "What the hand still remembers." },
    color: "var(--clay)", color2: "var(--peach)", shape: "shell",
    items: [{ id: "o1", title: "Le foulard bleu", date: "—", preview: "Plié dans le deuxième tiroir.", shape: "shell" }],
  },
};

function GardenZone() {
  const { zone } = Route.useParams();
  const { mode, lang, lostName, t } = useLegato();
  const data = ZONE[zone] ?? ZONE.voice;
  const [openId, setOpenId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <Shell>
      <div className="relative pb-12">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10">
            <Link to="/garden" className="text-[11px] uppercase tracking-[0.22em] text-dusk/55">
              ← {lang === "fr" ? "Le Jardin" : "The Garden"}
            </Link>
          </div>

          {/* Sculptural emblem of the zone */}
          <div className="px-7 pt-10 flex flex-col items-center text-center">
            <div className="relative size-32 sway">
              <div
                className="absolute inset-0"
                style={{
                  borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
                  background: `radial-gradient(ellipse at 32% 28%, ${data.color} 0%, ${data.color2} 70%)`,
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.6), 0 18px 40px -16px rgba(60,40,40,0.28)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <OrganicShape kind={data.shape} size={62} tint={data.color2} tint2={data.color} />
              </div>
            </div>
            <p className="mt-7 text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              {t("garden.belong")} · {lostName}
            </p>
            <h1 className="mt-2 font-serif text-[1.9rem] leading-[1.05] font-light text-dusk text-balance max-w-[26ch]">
              {data.name[lang]}
            </h1>
            <p className="mt-3 font-serif italic text-[15px] text-dusk/65 max-w-[28ch]">
              {data.whisper[lang]}
            </p>
          </div>

          {/* Memory cards */}
          <div className="px-7 mt-10 space-y-3">
            {data.items.map((it) => {
              const open = openId === it.id;
              const playing = playingId === it.id;
              const isVoice = zone === "voice";
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setOpenId(open ? null : it.id)}
                  className={`w-full text-left paper-card p-5 transition-all duration-500 ${
                    open ? "shadow-lg" : ""
                  }`}
                  style={{ borderRadius: 24 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`shrink-0 ${open ? "bloom" : "sway"}`}>
                      <OrganicShape kind={it.shape} size={42} tint={data.color} tint2={data.color2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg italic text-dusk leading-snug truncate">{it.title}</h3>
                      <p className="text-[11px] tracking-[0.06em] text-dusk/45 mt-0.5">{it.date}</p>
                    </div>
                    <span className={`text-[10px] uppercase tracking-[0.18em] text-dusk/45 transition-transform ${open ? "rotate-90" : ""}`}>
                      ▸
                    </span>
                  </div>

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
                          background: `linear-gradient(135deg, color-mix(in oklab, ${data.color} 30%, var(--paper)), color-mix(in oklab, ${data.color2} 22%, var(--paper)))`,
                        }}
                      >
                        {isVoice ? (
                          <div className="flex items-center gap-3">
                            <span
                              onClick={(e) => { e.stopPropagation(); setPlayingId(playing ? null : it.id); }}
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
                            {it.preview}
                          </p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
                            {lang === "fr" ? "Souvenir vivant" : "Living memory"}
                          </span>
                          <Link
                            to="/compose/$zone"
                            params={{ zone }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] uppercase tracking-[0.22em] text-dusk/70 underline-offset-4 hover:underline"
                          >
                            {lang === "fr" ? "Enrichir →" : "Enrich →"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-7 mt-10">
            <Link
              to="/compose/$zone"
              params={{ zone }}
              className="ceramic organic-radius-3 block px-7 py-5 text-center"
            >
              <span className="block font-serif text-xl italic text-dusk">
                {lang === "fr" ? "Composer un nouveau souvenir" : "Compose a new memory"}
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-dusk/50">
                {lang === "fr" ? "voix · note · photo · vidéo" : "voice · note · photo · video"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
