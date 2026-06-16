import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { Halos } from "@/components/legato/Halos";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { PersonalSuggestions } from "@/components/legato/PersonalSuggestions";
import { MiniComposer, type FlowerPreset } from "@/components/legato/MiniComposer";
import { useLegato } from "@/lib/legato-state";
import { savePractical } from "@/lib/practical-store";

export const Route = createFileRoute("/practical/flowers")({
  head: () => ({ meta: [{ title: "Composition florale — Legato" }] }),
  component: Flowers,
});

const PRESETS: { id: FlowerPreset; label: string; body: string }[] = [
  { id: "bouquet",   label: "Bouquet",   body: "À tenir, à poser sur le cercueil ou la stèle." },
  { id: "couronne",  label: "Couronne",  body: "Circulaire, posée ou suspendue." },
  { id: "ambiance",  label: "Ambiance",  body: "Une palette à montrer au fleuriste." },
];

function Flowers() {
  const { mode } = useLegato();
  const [preset, setPreset] = useState<FlowerPreset | "">("");

  const sendToFlorist = () => {
    const subject = encodeURIComponent("Demande de composition florale");
    const body = encodeURIComponent("Bonjour,\n\nJe souhaite vous montrer une ambiance florale que j'ai imaginée. Vous trouverez l'image en pièce jointe.\n\nMerci pour votre attention,\n");
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Shell hideNav>
      <div className="relative pb-12">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-6 pt-9 flex items-center justify-between">
            <Link to="/practical/atmosphere" className="eyebrow hover:underline underline-offset-4">← Atmosphère</Link>
            <span className="eyebrow">Fleurs</span>
          </div>
          <header className="px-6 pt-10">
            <p className="eyebrow">Composition florale</p>
            <h1 className="mt-4 display-xl">
              Un bouquet, <span className="italic">à montrer au fleuriste.</span>
            </h1>
            <p className="mt-5 body-meta max-w-[34ch]">
              Choisissez un format. Touchez les fleurs, glissez, exportez l'image.
            </p>
          </header>

          {!preset && (
            <div className="px-5 mt-8 space-y-3">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setPreset(p.id); savePractical({ flowerStyle: p.id }); }}
                  className="w-full text-left card-plain p-5 active:scale-[0.99] transition-transform"
                >
                  <p className="h-section italic">{p.label}</p>
                  <p className="mt-1.5 body-meta">{p.body}</p>
                </button>
              ))}
            </div>
          )}

          {preset && (
            <div className="px-5 mt-6">
              <div className="flex items-center gap-2 mb-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.18em] font-medium ${preset === p.id ? "" : "text-dusk/55"}`}
                    style={preset === p.id ? { background: "var(--ink)", color: "var(--paper)" } : undefined}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <MiniComposer preset={preset} />
              <button onClick={sendToFlorist} className="btn-primary mt-5 w-full">
                Envoyer cette ambiance à un fleuriste →
              </button>
              <p className="mt-2 text-[12px] text-dusk/60 text-center">L'image s'enregistre, vous pourrez l'attacher au mail.</p>
            </div>
          )}

          <PersonalSuggestions
            topic="flowers"
            eyebrow="Sur mesure — fleurs"
            cta="Recevoir des compositions florales sur mesure"
          />
        </div>
      </div>
      <ConfideDock step="fleurs" />
    </Shell>
  );
}
