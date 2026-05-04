import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/garden/$zone")({
  head: () => ({
    meta: [{ title: "A zone in the garden — Legato" }],
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
    name: "Voice",
    whisper: "Sound carried forward.",
    color: "var(--rose)",
    color2: "var(--peach)",
    traces: [
      { id: "1", kind: "Voice memo", title: "Reading on the porch", date: "April 14, 2024", body: "0:42" },
      { id: "2", kind: "Voice memo", title: "Laughing at nothing", date: "March 02, 2024", body: "0:18" },
    ],
  },
  photo: {
    name: "Photographs",
    whisper: "Light, fixed in time.",
    color: "var(--peach)",
    color2: "var(--rose)",
    traces: [
      { id: "1", kind: "Photograph", title: "Kitchen, late afternoon", date: "Aug 11, 2023", body: "" },
      { id: "2", kind: "Photograph", title: "Hands, summer hat", date: "Jun 30, 2023", body: "" },
      { id: "3", kind: "Photograph", title: "Window, morning rain", date: "Sept 4, 2022", body: "" },
    ],
  },
  sentence: {
    name: "Sentences",
    whisper: "Words kept in a pocket.",
    color: "var(--lavender)",
    color2: "var(--mist)",
    traces: [
      { id: "1", kind: "Sentence", title: "Something she said", date: "—", body: "\"You always come back gentler than you left.\"" },
    ],
  },
  habit: {
    name: "Habits",
    whisper: "Small, repeated tendernesses.",
    color: "var(--sage)",
    color2: "var(--mist)",
    traces: [
      { id: "1", kind: "Habit", title: "Tea at 4pm", date: "Daily", body: "Always one and a half spoons of honey." },
    ],
  },
  object: {
    name: "Objects",
    whisper: "What the hand still knows.",
    color: "var(--clay)",
    color2: "var(--peach)",
    traces: [
      { id: "1", kind: "Object", title: "The blue scarf", date: "—", body: "Folded in the second drawer." },
    ],
  },
  place: {
    name: "Places",
    whisper: "Geography of memory.",
    color: "var(--mist)",
    color2: "var(--sage)",
    traces: [
      { id: "1", kind: "Place", title: "The corner café", date: "—", body: "Window seat, always." },
      { id: "2", kind: "Place", title: "The path by the river", date: "—", body: "" },
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
              ← The Garden
            </Link>
          </div>

          <ScreenHeader
            eyebrow={`Zone — ${data.name.toLowerCase()}`}
            title={
              <>
                {data.name}
                <br />
                <span className="italic text-dusk/70">in this corner.</span>
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
                Add a new {data.name.toLowerCase().replace(/s$/, "")}
              </span>
            </button>
          </Section>
        </div>
      </div>
    </Shell>
  );
}