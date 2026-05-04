import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/garden")({
  head: () => ({
    meta: [
      { title: "The Garden — Legato" },
      { name: "description", content: "A symbolic inner landscape, planted slowly." },
    ],
  }),
  component: Garden,
});

const ZONES = [
  {
    id: "voice",
    name: "Voice",
    count: 2,
    whisper: "Sound carried forward.",
    color: "var(--rose)",
    color2: "var(--peach)",
    pos: "top-[8%] left-[14%]",
    size: "size-32",
  },
  {
    id: "photo",
    name: "Photographs",
    count: 5,
    whisper: "Light, fixed in time.",
    color: "var(--peach)",
    color2: "var(--rose)",
    pos: "top-[18%] right-[10%]",
    size: "size-28",
  },
  {
    id: "sentence",
    name: "Sentences",
    count: 3,
    whisper: "Words kept in a pocket.",
    color: "var(--lavender)",
    color2: "var(--mist)",
    pos: "top-[42%] left-[8%]",
    size: "size-24",
  },
  {
    id: "habit",
    name: "Habits",
    count: 1,
    whisper: "Small, repeated tendernesses.",
    color: "var(--sage)",
    color2: "var(--mist)",
    pos: "top-[48%] right-[18%]",
    size: "size-28",
  },
  {
    id: "object",
    name: "Objects",
    count: 2,
    whisper: "What the hand still knows.",
    color: "var(--clay)",
    color2: "var(--peach)",
    pos: "top-[68%] left-[22%]",
    size: "size-24",
  },
  {
    id: "place",
    name: "Places",
    count: 4,
    whisper: "Geography of memory.",
    color: "var(--mist)",
    color2: "var(--sage)",
    pos: "top-[72%] right-[8%]",
    size: "size-32",
  },
];

function Garden() {
  const { mode } = useLegato();
  return (
    <Shell>
      <div className="relative min-h-dvh">
        <Halos mode={mode} variant="rich" />

        <div className="relative z-10">
          <ScreenHeader
            eyebrow="The Garden — for someone you carry"
            title={
              <>
                A landscape, <br />
                <span className="italic">slowly tended.</span>
              </>
            }
            subtitle="Each trace finds its zone. Walk through what feels right today."
          />

          {/* Symbolic landscape */}
          <Section className="mt-10">
            <div className="ceramic-soft organic-radius-3 relative h-[480px] overflow-hidden">
              {/* horizon glow */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/2 opacity-50"
                style={{
                  background:
                    "linear-gradient(to top, color-mix(in oklab, var(--peach) 50%, transparent), transparent)",
                }}
              />
              {ZONES.map((z) => (
                <Link
                  key={z.id}
                  to="/garden/$zone"
                  params={{ zone: z.id }}
                  className={`absolute ${z.pos} ${z.size} group`}
                >
                  <div
                    className="absolute inset-0 organic-radius-2 transition-transform group-hover:scale-105 drift"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${z.color}, ${z.color2})`,
                      boxShadow:
                        "inset 0 1px 2px rgba(255,255,255,0.6), 0 12px 30px -12px rgba(60,40,40,0.25)",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                    <span className="font-serif text-[15px] italic text-dusk">{z.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-dusk/55 mt-0.5">
                      {z.count}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          <Section className="mt-8">
            <p className="font-serif text-base italic text-dusk/60 text-balance">
              "A garden is a slow conversation with what remains."
            </p>
          </Section>

          <Section className="mt-8">
            <Link
              to="/memories"
              className="ceramic organic-radius-3 block px-7 py-5 text-center"
            >
              <span className="font-serif text-lg italic text-dusk">Plant a new trace</span>
            </Link>
          </Section>
        </div>
      </div>
    </Shell>
  );
}