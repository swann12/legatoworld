import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { useLegato, EMOTIONS, type Emotion } from "@/lib/legato-state";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useState } from "react";

export const Route = createFileRoute("/checkin")({
  beforeLoad: () => { throw redirect({ to: "/care/emotions" }); },
  head: () => ({
    meta: [
      { title: "Check-in — Legato" },
      { name: "description", content: "Comment vous sentez-vous, là, maintenant ? Plusieurs choix possibles." },
    ],
  }),
  component: Checkin,
});

function Checkin() {
  const { currentEmotions, setCurrentEmotions, name } = useLegato();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Emotion[]>(currentEmotions);

  const toggle = (id: Emotion) => {
    setSelected(selected.includes(id) ? selected.filter((e) => e !== id) : [...selected, id]);
  };
  const validate = () => {
    setCurrentEmotions(selected);
    navigate({ to: "/home" });
  };

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <button onClick={() => navigate({ to: "/home" })} className="mono-label">← Retour</button>
          <LegatoMark size={20} />
          <span className="w-12" />
        </header>
        <section className="px-6 pt-10">
          <p className="mono-label">Check-in</p>
          <h1 className="mt-5 ed-page-title">
            Comment vous sentez-vous<br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>maintenant{name ? `, ${name}` : ""} ?</span>
          </h1>
          <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Plusieurs choix possibles. Ce sera enregistré pour adapter ce qui vous est proposé.
          </p>
        </section>
        <section className="px-6 pt-8 flex flex-wrap gap-2">
          {EMOTIONS.map((e) => {
            const active = selected.includes(e.id);
            return (
              <button
                key={e.id}
                onClick={() => toggle(e.id)}
                className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${active ? "border-dusk/40 bg-[color:var(--whisper)]" : "border-dusk/15 bg-paper text-dusk/70 hover:border-dusk/25"}`}
              >
                {e.label}
              </button>
            );
          })}
        </section>
        <section className="px-6 pt-10">
          <button
            onClick={validate}
            disabled={selected.length === 0}
            className="block w-full rounded-[999px] px-6 py-5 text-center disabled:opacity-40 transition-transform active:scale-[0.99]"
            style={{ background: "var(--terracotta)", color: "var(--paper)" }}
          >
            <span className="font-serif text-[20px]">Valider →</span>
          </button>
        </section>
      </div>
    </Shell>
  );
}