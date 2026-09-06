import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { EMOTIONS, useLegato, type Emotion } from "@/lib/legato-state";

// Couleur sémantique par émotion — pastilles colorées sur fond clair,
// comme la référence "How are you feeling today?". Sans saturer la page.
const EMOTION_COLORS: Record<Emotion, { bg: string; fg: string }> = {
  tristesse:    { bg: "var(--sky)",       fg: "var(--dusk)"  },
  colere:       { bg: "var(--bordeaux)",  fg: "var(--paper)" },
  peur:         { bg: "var(--mist)",      fg: "var(--dusk)"  },
  anxiete:      { bg: "var(--terracotta)",fg: "var(--paper)" },
  sideration:   { bg: "var(--whisper)",   fg: "var(--dusk)"  },
  culpabilite:  { bg: "var(--olive)",     fg: "var(--paper)" },
  solitude:     { bg: "var(--lavender)",  fg: "var(--dusk)"  },
  fatigue:      { bg: "var(--clay)",      fg: "var(--dusk)"  },
  confusion:    { bg: "var(--whisper)",   fg: "var(--dusk)"  },
  nostalgie:    { bg: "var(--blush)",     fg: "var(--dusk)"  },
  soulagement:  { bg: "var(--sun)",       fg: "var(--dusk)"  },
  vide:         { bg: "var(--clay)",      fg: "var(--dusk)"  },
  besoin_calme: { bg: "var(--sage)",      fg: "var(--dusk)"  },
  besoin_aide:  { bg: "var(--ember)",     fg: "var(--paper)" },
};

export const Route = createFileRoute("/care/emotions")({
  head: () => ({ meta: [{ title: "Émotions — Legato" }] }),
  component: CareEmotions,
});

function CareEmotions() {
  const { currentEmotions, setCurrentEmotions } = useLegato();
  const toggle = (id: Emotion) => setCurrentEmotions(currentEmotions.includes(id) ? currentEmotions.filter((e) => e !== id) : [...currentEmotions, id]);
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between"><LegatoMark size={22} /><span className="mono-label text-dusk/45">Soutien</span></header>
        <section className="px-6 pt-8">
          <p className="mono-label">Check-in émotionnel</p>
          <h1 className="mt-5 ed-page-title">Comment vous sentez-vous <span className="italic" style={{ color: "var(--terracotta)" }}>maintenant&nbsp;?</span></h1>
          <p className="mt-3 text-[12.5px] text-dusk/55">Plusieurs, si plusieurs sont là.</p>
        </section>
        <section className="px-6 pt-8 flex flex-wrap gap-2.5">
          {EMOTIONS.map((e) => {
            const c = EMOTION_COLORS[e.id];
            const active = currentEmotions.includes(e.id);
            return (
              <button
                key={e.id}
                onClick={() => toggle(e.id)}
                className={`rounded-full px-4 py-2 text-[13.5px] font-medium transition-all ${active ? "ring-2 ring-dusk/30 scale-[1.02]" : "opacity-85 hover:opacity-100"}`}
                style={{ background: c.bg, color: c.fg }}
              >
                {e.label}
              </button>
            );
          })}
        </section>
      </div>
    </Shell>
  );
}