import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/memories")({
  head: () => ({ meta: [{ title: "Memory library — Legato" }] }),
  component: Memories,
});

const KINDS = [
  { id: "voice", label: "Voice", color: "var(--rose)" },
  { id: "photo", label: "Photo", color: "var(--peach)" },
  { id: "sentence", label: "Sentence", color: "var(--lavender)" },
  { id: "habit", label: "Habit", color: "var(--sage)" },
  { id: "object", label: "Object", color: "var(--clay)" },
  { id: "place", label: "Place", color: "var(--mist)" },
  { id: "date", label: "Date", color: "var(--rose)" },
];

const ENTRIES = [
  { kind: "Sentence", title: "Something she said", date: "—", body: "\"You always come back gentler than you left.\"" },
  { kind: "Photograph", title: "Kitchen, late afternoon", date: "Aug 11, 2023", body: "" },
  { kind: "Voice memo", title: "Reading on the porch", date: "April 14, 2024", body: "0:42" },
  { kind: "Habit", title: "Tea at 4pm", date: "Daily", body: "Always one and a half spoons of honey." },
  { kind: "Place", title: "The corner café", date: "—", body: "Window seat, always." },
];

function Memories() {
  const { mode } = useLegato();
  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10">
            <Link to="/garden" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← The Garden</Link>
          </div>
          <ScreenHeader
            eyebrow="Memory library"
            title={<>Everything <br /><span className="italic">you've kept.</span></>}
            subtitle="A long shelf. Add traces here, and they find their way to a zone in the garden."
          />

          <Section className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40 mb-3">Add a trace</p>
            <div className="grid grid-cols-4 gap-2">
              {KINDS.map((k) => (
                <button key={k.id} className="ceramic-soft organic-radius p-3 flex flex-col items-center gap-2">
                  <span
                    className="size-7 organic-radius-2"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${k.color}, var(--clay))` }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.18em] text-dusk/60">{k.label}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section className="mt-10">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40 mb-3">Already kept</p>
            <div className="space-y-3">
              {ENTRIES.map((e, i) => (
                <article key={i} className="ceramic-soft organic-radius-3 p-5">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40">{e.kind}</p>
                    <p className="text-[10px] tracking-[0.1em] text-dusk/40">{e.date}</p>
                  </div>
                  <h3 className="mt-2 font-serif text-lg italic text-dusk">{e.title}</h3>
                  {e.body && <p className="mt-2 text-[14px] leading-relaxed text-dusk/65">{e.body}</p>}
                </article>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </Shell>
  );
}