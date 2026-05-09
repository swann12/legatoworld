import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { Halos } from "@/components/legato/Halos";
import { ConfideDock } from "@/components/legato/ConfideDock";
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
          <div className="px-7 pt-10 flex items-center justify-between">
            <Link to="/practical/atmosphere" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Atmosphère</Link>
            <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">Fleurs</span>
          </div>
          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Composition florale</p>
            <h1 className="mt-3 font-serif text-[2.1rem] leading-[1.08] font-light text-dusk text-balance">
              Imaginer un bouquet,<br/><span className="italic">à montrer au fleuriste.</span>
            </h1>
            <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/65">
              Choisissez un format. Touchez les fleurs, glissez, exportez l'image.
            </p>
          </header>

          {!preset && (
            <div className="px-5 mt-8 space-y-3">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setPreset(p.id); savePractical({ flowerStyle: p.id }); }}
                  className="w-full text-left paper-card p-5"
                >
                  <p className="font-serif italic text-[17px] text-dusk">{p.label}</p>
                  <p className="mt-1.5 text-[13px] text-dusk/65">{p.body}</p>
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
                    className={`px-3 py-1 organic-radius text-[11px] uppercase tracking-[0.18em] ${preset === p.id ? "ceramic text-dusk" : "text-dusk/50"}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <MiniComposer preset={preset} />
              <button onClick={sendToFlorist} className="mt-5 w-full ceramic organic-radius-3 px-5 py-4 text-center font-serif italic text-[15px] text-dusk">
                Envoyer cette ambiance à un fleuriste →
              </button>
              <p className="mt-2 text-[12px] text-dusk/55 text-center">L'image s'enregistre, vous pourrez l'attacher au mail.</p>
            </div>
          )}
        </div>
      </div>
      <ConfideDock step="fleurs" />
    </Shell>
  );
}
