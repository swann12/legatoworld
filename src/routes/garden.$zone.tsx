import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/garden/$zone")({
  head: () => ({ meta: [{ title: "Une zone du jardin — Legato" }] }),
  component: GardenZone,
});

const ZONE: Record<string, { name: string; whisper: string; color: string; color2: string; items: { id: string; title: string; date: string; preview: string }[] }> = {
  voice: {
    name: "Voix", whisper: "Un son qu'on emporte.",
    color: "var(--rose)", color2: "var(--peach)",
    items: [
      { id: "v1", title: "Lecture sous le porche", date: "14 avril 2024", preview: "0:42" },
      { id: "v2", title: "Rire pour rien", date: "2 mars 2024", preview: "0:18" },
    ],
  },
  photo: {
    name: "Lumière", whisper: "La lumière, fixée dans le temps.",
    color: "var(--peach)", color2: "var(--rose)",
    items: [
      { id: "p1", title: "La cuisine, fin d'après-midi", date: "11 août 2023", preview: "" },
      { id: "p2", title: "Des mains, chapeau d'été", date: "30 juin 2023", preview: "" },
    ],
  },
  sentence: {
    name: "Phrases", whisper: "Des mots gardés en poche.",
    color: "var(--lavender)", color2: "var(--mist)",
    items: [
      { id: "s1", title: "Quelque chose qu'elle a dit", date: "—", preview: "« Tu reviens toujours plus doux… »" },
    ],
  },
  habit: {
    name: "Gestes", whisper: "De petites tendresses répétées.",
    color: "var(--sage)", color2: "var(--mist)",
    items: [{ id: "h1", title: "Le thé de 16 h", date: "Tous les jours", preview: "Une cuillère et demie de miel." }],
  },
  object: {
    name: "Objets", whisper: "Ce que la main connaît encore.",
    color: "var(--clay)", color2: "var(--peach)",
    items: [{ id: "o1", title: "Le foulard bleu", date: "—", preview: "Plié dans le deuxième tiroir." }],
  },
};

function GardenZone() {
  const { zone } = Route.useParams();
  const { mode } = useLegato();
  const data = ZONE[zone] ?? ZONE.voice;

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

          {/* Sculptural icon, very calm */}
          <div className="px-7 pt-10 flex flex-col items-center text-center">
            <div
              className="size-28 sway"
              style={{
                borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
                background: `radial-gradient(ellipse at 32% 28%, ${data.color} 0%, ${data.color2} 70%)`,
                boxShadow:
                  "inset 0 2px 4px rgba(255,255,255,0.6), 0 18px 40px -16px rgba(60,40,40,0.3)",
              }}
            />
            <p className="mt-7 text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              Parterre — {data.name.toLowerCase()}
            </p>
            <h1 className="mt-2 font-serif text-[2rem] leading-[1.05] font-light text-dusk text-balance">
              {data.whisper}
            </h1>
          </div>

          {/* Existing compositions */}
          <div className="px-7 mt-10 space-y-3">
            {data.items.map((it) => (
              <article key={it.id} className="paper-card p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-lg italic text-dusk leading-snug">{it.title}</h3>
                  <span className="text-[10px] tracking-[0.1em] text-dusk/45 shrink-0">{it.date}</span>
                </div>
                {it.preview && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-dusk/65">{it.preview}</p>
                )}
              </article>
            ))}
          </div>

          {/* Single primary action: plant a new memory composition */}
          <div className="px-7 mt-10">
            <Link
              to="/compose/$zone"
              params={{ zone }}
              className="ceramic organic-radius-3 block px-7 py-5 text-center"
            >
              <span className="block font-serif text-xl italic text-dusk">
                Composer un nouveau souvenir
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-dusk/50">
                choisir le type · puis composer
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}