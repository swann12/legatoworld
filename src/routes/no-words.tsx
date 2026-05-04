import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/no-words")({
  head: () => ({ meta: [{ title: "No words — Legato" }] }),
  component: NoWords,
});

function NoWords() {
  const { mode } = useLegato();
  const [tapped, setTapped] = useState(0);

  return (
    <Shell hideNav>
      <div className="relative min-h-dvh flex flex-col">
        <Halos mode={mode} variant="calm" />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="px-7 pt-10 flex justify-between">
            <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Home</Link>
            <Link to="/presence" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">Words →</Link>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-8">
            <button onClick={() => setTapped((t) => t + 1)} className="relative" aria-label="Tap to be heard">
              <div
                className="size-64 organic-radius-2 breath"
                style={{
                  background: "radial-gradient(circle at 30% 30%, var(--peach), var(--rose) 70%, var(--lavender))",
                  boxShadow: "inset 0 4px 8px rgba(255,255,255,0.5), 0 30px 60px -20px rgba(60,40,40,0.35)",
                  animationDuration: "6.5s",
                }}
              />
            </button>

            <p className="mt-12 font-serif text-2xl italic text-dusk text-center text-balance max-w-[24ch]">
              {tapped === 0
                ? "Breathe with this for a while."
                : tapped < 5
                  ? "I notice you. Stay as long as you need."
                  : "Held. Nothing else is required of you."}
            </p>
            <p className="mt-4 text-[12px] uppercase tracking-[0.22em] text-dusk/45">
              {tapped === 0 ? "Tap softly, or just watch" : `Held · ${tapped}`}
            </p>
          </div>

          <div className="px-7 pb-12 text-center">
            <Link to="/garden" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">
              When ready, the Garden →
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}