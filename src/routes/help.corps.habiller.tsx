import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HelpShell, HelpHeader } from "@/components/legato/HelpShell";
import { BloomFlower, SoftToast } from "@/components/legato/BloomFlower";

export const Route = createFileRoute("/help/corps/habiller")({
  head: () => ({ meta: [{ title: "S'habiller — Aide" }] }),
  component: Habiller,
});

const COLORS = [
  { hex: "#F5C8C0", name: "rose poudré" },
  { hex: "#C8D8E8", name: "bleu doux" },
  { hex: "#D8E8C8", name: "vert pâle" },
  { hex: "#F5E8C8", name: "crème chaud" },
  { hex: "#E8C8E8", name: "lavande" },
];

const PREFS_KEY = "legato.help.habiller.matin";

function Habiller() {
  const [foundSoft, setFoundSoft] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [bloom, setBloom] = useState<{ x: number; y: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [matin, setMatin] = useState({ on: false, hour: "08:00" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) setMatin(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(matin)); } catch {}
  }, [matin]);

  const onSoft = (e: React.MouseEvent) => {
    if (foundSoft) return;
    setFoundSoft(true);
    setBloom({ x: e.clientX, y: e.clientY });
    setToast("C'est parfait.");
  };

  return (
    <HelpShell backTo="/help/corps" backLabel="← Le corps">
      <HelpHeader
        title="S'habiller."
        subtitle={
          <>
            Les vêtements portent beaucoup en ce moment.
            <br />Il n'y a pas de bonne façon de faire.
          </>
        }
      />

      {/* SECTION 1 — La chose la plus douce */}
      <section className="px-7 mt-12">
        <h2 className="font-serif italic text-[1.4rem] text-dusk">La chose la plus douce.</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-dusk/70 max-w-[34ch]">
          Aujourd'hui, trouvez la chose la plus douce que vous avez dans votre armoire. Pas la plus jolie. Pas la plus pratique. La plus douce au toucher.
        </p>
        <button
          type="button"
          onClick={onSoft}
          className={`mt-5 ceramic px-5 py-2.5 rounded-full text-[12px] uppercase tracking-[0.18em] text-dusk/85 transition ${
            foundSoft ? "opacity-50" : "hover:opacity-90"
          }`}
        >
          {foundSoft ? "C'est trouvé" : "Je l'ai trouvée →"}
        </button>
      </section>

      {/* SECTION 2 — Une couleur */}
      <section className="px-7 mt-14">
        <h2 className="font-serif italic text-[1.4rem] text-dusk">Une couleur.</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-dusk/70">
          Est-ce qu'il y a une couleur qui vous fait du bien en ce moment ?
        </p>
        <div className="mt-6 flex items-center gap-4">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setPicked(c.hex)}
              aria-label={c.name}
              className={`size-11 rounded-full transition-transform ${picked === c.hex ? "scale-110 ring-2 ring-dusk/30 ring-offset-2 ring-offset-transparent" : "hover:scale-105"}`}
              style={{ background: c.hex, boxShadow: "inset 0 0 10px rgba(255,255,255,0.5), 0 4px 14px -4px rgba(0,0,0,0.1)" }}
            />
          ))}
        </div>
        {picked && (
          <p key={picked} className="mt-6 font-serif text-[18px] text-dusk/85 leading-snug max-w-[34ch] animate-fade-in">
            Quelque chose de cette couleur, si vous en avez. Même juste une écharpe, une chaussette.
          </p>
        )}
      </section>

      {/* SECTION 3 — Ses vêtements */}
      <section className="px-7 mt-14">
        <div className="border-t border-dusk/10 pt-8">
          <h2 className="font-serif italic text-[1.4rem] text-dusk">Ses affaires.</h2>
          <div className="mt-5 space-y-5 text-[14.5px] leading-[1.75] text-dusk/72 max-w-[36ch]">
            <p>Certaines personnes gardent un vêtement de lui, d'elle, près d'elles.</p>
            <p>Un pull. Une veste. Quelque chose qui garde son odeur.</p>
            <p>C'est permis. Pour aussi longtemps que vous en avez besoin.</p>
            <p>Ses affaires n'ont pas à partir. Il n'y a pas de calendrier pour ça.</p>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Le rituel du matin */}
      <section className="px-7 mt-14 mb-6">
        <div className="glass-card organic-radius-3 px-6 py-6">
          <h3 className="font-serif italic text-[1.2rem] text-dusk">Un matin accompagné.</h3>
          <p className="mt-3 text-[13.5px] leading-relaxed text-dusk/65 max-w-[36ch]">
            Si vous voulez, Legato peut vous envoyer un mot très doux le matin, à l'heure que vous choisissez. Pas une alarme. Juste une présence.
          </p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <span className="text-[12px] uppercase tracking-[0.18em] text-dusk/65">Activer</span>
            <button
              type="button"
              role="switch"
              aria-checked={matin.on}
              onClick={() => setMatin((m) => ({ ...m, on: !m.on }))}
              className={`relative h-7 w-12 rounded-full transition-colors ${matin.on ? "bg-dusk/55" : "bg-dusk/15"}`}
            >
              <span
                className="absolute top-1 size-5 rounded-full bg-white shadow transition-all"
                style={{ left: matin.on ? "calc(100% - 1.25rem - 0.25rem)" : "0.25rem" }}
              />
            </button>
          </div>
          {matin.on && (
            <div className="mt-5 animate-fade-in">
              <label className="text-[11px] uppercase tracking-[0.18em] text-dusk/60">À quelle heure</label>
              <input
                type="time"
                value={matin.hour}
                onChange={(e) => setMatin((m) => ({ ...m, hour: e.target.value }))}
                className="mt-2 w-full ceramic-soft organic-radius px-4 py-3 font-serif text-[18px] text-dusk outline-none"
              />
              <p className="mt-3 text-[11px] leading-relaxed text-dusk/55">
                Notification activée localement. Pour la recevoir même app fermée, votre navigateur peut vous demander l'autorisation.
              </p>
            </div>
          )}
        </div>
      </section>

      {bloom && <BloomFlower x={bloom.x} y={bloom.y} onDone={() => setBloom(null)} />}
      {toast && <SoftToast text={toast} onDone={() => setToast(null)} />}
    </HelpShell>
  );
}