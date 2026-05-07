import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/garden/$zone")({
  head: () => ({
    meta: [{ title: "Une zone du jardin — Legato" }],
  }),
  component: GardenZone,
});

const ZONE_DATA: Record<
  string,
  {
    name: string;
    whisper: string;
    color: string;
    color2: string;
    traces: { id: string; kind: string; title: string; date: string; body: string }[];
  }
> = {
  voice: {
    name: "Voix",
    whisper: "Un son que l'on emporte.",
    color: "var(--rose)",
    color2: "var(--peach)",
    traces: [
      { id: "1", kind: "Mémo vocal", title: "Lecture sous le porche", date: "14 avril 2024", body: "0:42" },
      { id: "2", kind: "Mémo vocal", title: "Rire pour rien", date: "2 mars 2024", body: "0:18" },
    ],
  },
  photo: {
    name: "Photographies",
    whisper: "La lumière, fixée dans le temps.",
    color: "var(--peach)",
    color2: "var(--rose)",
    traces: [
      { id: "1", kind: "Photographie", title: "La cuisine, fin d'après-midi", date: "11 août 2023", body: "" },
      { id: "2", kind: "Photographie", title: "Des mains, chapeau d'été", date: "30 juin 2023", body: "" },
      { id: "3", kind: "Photographie", title: "Fenêtre, pluie du matin", date: "4 sept. 2022", body: "" },
    ],
  },
  sentence: {
    name: "Phrases",
    whisper: "Des mots gardés en poche.",
    color: "var(--lavender)",
    color2: "var(--mist)",
    traces: [
      { id: "1", kind: "Phrase", title: "Quelque chose qu'elle a dit", date: "—", body: "« Tu reviens toujours plus doux que tu n'es parti. »" },
    ],
  },
  habit: {
    name: "Gestes",
    whisper: "De petites tendresses répétées.",
    color: "var(--sage)",
    color2: "var(--mist)",
    traces: [
      { id: "1", kind: "Geste", title: "Le thé de 16 h", date: "Tous les jours", body: "Toujours une cuillère et demie de miel." },
    ],
  },
  object: {
    name: "Objets",
    whisper: "Ce que la main connaît encore.",
    color: "var(--clay)",
    color2: "var(--peach)",
    traces: [
      { id: "1", kind: "Objet", title: "Le foulard bleu", date: "—", body: "Plié dans le deuxième tiroir." },
    ],
  },
  place: {
    name: "Lieux",
    whisper: "La géographie du souvenir.",
    color: "var(--mist)",
    color2: "var(--sage)",
    traces: [
      { id: "1", kind: "Lieu", title: "Le café du coin", date: "—", body: "Toujours la place près de la fenêtre." },
      { id: "2", kind: "Lieu", title: "Le chemin le long de la rivière", date: "—", body: "" },
    ],
  },
};

function GardenZone() {
  const { zone } = Route.useParams();
  const { mode } = useLegato();
  const data = ZONE_DATA[zone] ?? ZONE_DATA.voice;

  return (
    <Shell>
      <div className="relative min-h-dvh">
        <Halos mode={mode} variant="calm" />

        <div className="relative z-10">
          <div className="px-7 pt-10">
            <Link
              to="/garden"
              className="text-[11px] uppercase tracking-[0.22em] text-dusk/50 hover:text-dusk"
            >
              ← Le Jardin
            </Link>
          </div>

          <ScreenHeader
            eyebrow={`Zone — ${data.name.toLowerCase()}`}
            title={
              <>
                {data.name}
                <br />
                <span className="italic text-dusk/70">dans ce coin.</span>
              </>
            }
            subtitle={data.whisper}
          />

          {/* large symbolic blob for the zone */}
          <Section className="mt-8">
            <div className="ceramic-soft organic-radius-3 p-8 flex justify-center">
              <div
                className="size-44 organic-radius-2 drift"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${data.color}, ${data.color2})`,
                  boxShadow:
                    "inset 0 2px 4px rgba(255,255,255,0.6), 0 18px 40px -16px rgba(60,40,40,0.3)",
                }}
              />
            </div>
          </Section>

          {/* traces */}
          <Section className="mt-8 space-y-3">
            {data.traces.map((t) => (
              <article
                key={t.id}
                className="ceramic-soft organic-radius-3 p-5"
              >
                <div className="flex items-baseline justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40">{t.kind}</p>
                  <p className="text-[10px] tracking-[0.1em] text-dusk/40">{t.date}</p>
                </div>
                <h3 className="mt-2 font-serif text-xl italic text-dusk">{t.title}</h3>
                {t.body && (
                  <p className="mt-2 text-[14px] leading-relaxed text-dusk/65">{t.body}</p>
                )}
              </article>
            ))}
          </Section>

          <Section className="mt-8">
            <button className="ceramic organic-radius-3 w-full px-7 py-5 text-center">
              <span className="font-serif text-lg italic text-dusk">
                Ajouter une nouvelle {data.name.toLowerCase().replace(/s$/, "")}
              </span>
            </button>
          </Section>
        </div>
      </div>
    </Shell>
  );
}