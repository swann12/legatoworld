import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HelpShell, HelpHeader } from "@/components/legato/HelpShell";
import { BloomFlower, SoftToast } from "@/components/legato/BloomFlower";

export const Route = createFileRoute("/help/corps/eau")({
  head: () => ({ meta: [{ title: "L'eau et le corps — Aide" }] }),
  component: Eau,
});

const POINTS = [
  { title: "Juste entrer dans la salle de bain.", body: "Pas se laver. Juste entrer. S'asseoir sur le bord si besoin.", cta: "J'y suis →" },
  { title: "Ouvrir le robinet.", body: "Pas encore entrer dedans. Juste écouter le son de l'eau un moment.", cta: "C'est fait →" },
  { title: "Mettre une main sous l'eau.", body: "Sentir si elle est chaude. Rien d'autre.", cta: "Je l'ai fait →" },
  { title: "Si vous pouvez, entrez.", body: "Vous n'avez pas à vous laver. Juste rester sous l'eau quelques minutes suffit.", cta: "Je suis sous l'eau →" },
  { title: "L'eau est chaude.", body: "Elle prend soin de vous même quand vous n'y pensez pas.", cta: null },
];

function Eau() {
  const [reached, setReached] = useState(0);
  const [bloom, setBloom] = useState<{ x: number; y: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const advance = (e: React.MouseEvent, i: number) => {
    setBloom({ x: e.clientX, y: e.clientY });
    setReached((r) => Math.max(r, i + 1));
    if (i === POINTS.length - 2) {
      // L'utilisateur a touché le dernier point cochable → fin du parcours.
      setTimeout(() => {
        setDone(true);
        setToast("C'est fait. C'est suffisant pour aujourd'hui.");
      }, 400);
    }
  };

  return (
    <HelpShell backTo="/help/corps" backLabel="← Le corps">
      <HelpHeader
        title="L'eau et le corps."
        subtitle={
          <>
            Se laver n'est pas une obligation. C'est un retour dans son corps.
            <br />Certains jours, c'est la chose la plus difficile du monde.
          </>
        }
      />

      <section className="px-7 mt-12">
        <div className="relative">
          {/* Ligne verticale qui relie les points */}
          <div
            className="absolute left-[18px] top-3 bottom-3 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(176,160,200,0.5), transparent)" }}
            aria-hidden
          />
          <ol className="space-y-7">
            {POINTS.map((p, i) => {
              const visible = i <= reached;
              const isLast = i === POINTS.length - 1;
              return (
                <li
                  key={i}
                  className={`relative pl-12 ${visible ? "animate-fade-in" : "opacity-30"}`}
                >
                  <div
                    className="absolute left-0 top-1 size-9 rounded-full flex items-center justify-center"
                    style={{
                      background: i <= reached - 1 || (isLast && done)
                        ? "radial-gradient(circle, #C9B8E0, #B0A0C8)"
                        : "rgba(176,160,200,0.22)",
                      boxShadow: "inset 0 0 12px rgba(255,255,255,0.4)",
                    }}
                  />
                  <h3 className="font-serif text-[17px] text-dusk leading-snug">{p.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-dusk/65">{p.body}</p>
                  {p.cta && i === reached && !done && (
                    <button
                      type="button"
                      onClick={(e) => advance(e, i)}
                      className="mt-3 ceramic px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.18em] text-dusk/85 hover:opacity-90 transition"
                    >
                      {p.cta}
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {done && (
          <div className="mt-12 py-10 text-center animate-fade-in">
            <p className="font-serif text-[1.4rem] text-dusk text-balance max-w-[26ch] mx-auto">
              C'est fait. C'est suffisant pour aujourd'hui.
            </p>
          </div>
        )}

        <div className="mt-14 border-t border-dusk/10 pt-6">
          <p className="text-[11px] leading-relaxed text-dusk/55 max-w-[36ch]">
            Si les jours sans se laver se prolongent et que cela vous pèse, un professionnel peut vous aider à traverser cette période.
          </p>
          <Link
            to="/resources"
            className="mt-3 inline-block eyebrow hover:text-dusk transition"
          >
            Trouver un thérapeute →
          </Link>
        </div>
      </section>

      {bloom && <BloomFlower x={bloom.x} y={bloom.y} onDone={() => setBloom(null)} />}
      {toast && <SoftToast text={toast} onDone={() => setToast(null)} />}
    </HelpShell>
  );
}