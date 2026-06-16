import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HelpShell, HelpHeader } from "@/components/legato/HelpShell";
import { CheckableCard } from "@/components/legato/CheckableCard";
import { BloomFlower, SoftToast } from "@/components/legato/BloomFlower";

export const Route = createFileRoute("/help/corps/manger")({
  head: () => ({ meta: [{ title: "Quand le corps oublie de manger — Aide" }] }),
  component: Manger,
});

/* ─── Petites micro-illustrations SVG simples (ligne, pas photo) ─── */
const stroke = "#8B7C70";
const IconGlass = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={stroke} strokeWidth="1.2">
    <path d="M6 4h10l-1.2 14a1 1 0 0 1-1 .9H8.2a1 1 0 0 1-1-.9L6 4Z" />
    <path d="M6.6 9h8.8" opacity="0.45" />
  </svg>
);
const IconClementine = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={stroke} strokeWidth="1.2">
    <circle cx="11" cy="12" r="6.5" />
    <path d="M11 5.5c1.2-1.4 2.6-1.7 3.6-1.2" />
    <path d="M11 12l-2.5-2.5M11 12l2.5-2.5M11 12v3.5M11 12l-3 1.8M11 12l3 1.8" opacity="0.35" />
  </svg>
);
const IconBread = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={stroke} strokeWidth="1.2">
    <rect x="4.5" y="7" width="13" height="9" rx="2" />
    <path d="M7 10h8M7 13h8" opacity="0.4" />
  </svg>
);
const IconChocolate = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={stroke} strokeWidth="1.2">
    <rect x="5.5" y="5.5" width="11" height="11" rx="1.5" />
    <path d="M11 5.5v11M5.5 11h11" opacity="0.4" />
  </svg>
);
const IconCup = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={stroke} strokeWidth="1.2">
    <path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
    <path d="M16 9h1.5a2 2 0 0 1 0 4H16" />
    <path d="M8 5c.5.8.5 1.5 0 2.2M11 5c.5.8.5 1.5 0 2.2" opacity="0.45" />
  </svg>
);

const CARDS = [
  { id: "manger-eau",        icon: IconGlass,      title: "Un verre d'eau",      body: "Posez-le devant vous. Juste le poser suffit." },
  { id: "manger-clementine", icon: IconClementine, title: "Une clémentine",       body: "Elle s'épluche seule, presque." },
  { id: "manger-pain",       icon: IconBread,      title: "Du pain, debout",      body: "Pas besoin de s'asseoir. Pas besoin de faire semblant." },
  { id: "manger-chocolat",   icon: IconChocolate,  title: "Un carré de chocolat", body: "C'est suffisant." },
  { id: "manger-bouillon",   icon: IconCup,        title: "Un bouillon chaud",    body: "Comme un thé. Dans la même tasse si vous voulez." },
];

const STEPS = [
  { title: "Faites bouillir de l'eau.", body: "Juste l'eau. Pas encore décider quoi faire avec.", cta: "Je peux faire ça →" },
  { title: "Prenez une tasse qui vous plaît.", body: "Pas la plus pratique. Celle qui vous fait du bien à tenir.", cta: "C'est fait →" },
  { title: "Versez l'eau. Ajoutez ce que vous avez — un cube de bouillon, un sachet de thé, rien du tout.", body: "Tenez la tasse entre vos mains. La chaleur fait du bien même quand on ne le sent pas.", cta: "Je l'ai →" },
];

function Manger() {
  const [openStep, setOpenStep] = useState(0);
  const [bloom, setBloom] = useState<{ x: number; y: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [souvenir, setSouvenir] = useState("");
  const [saved, setSaved] = useState(false);

  const advance = (e: React.MouseEvent) => {
    setBloom({ x: e.clientX, y: e.clientY });
    if (openStep === STEPS.length - 1) {
      setToast("Bien.");
    }
    setTimeout(() => setOpenStep((s) => Math.min(s + 1, STEPS.length)), 200);
  };

  const saveSouvenir = (e: React.MouseEvent) => {
    if (!souvenir.trim()) return;
    setBloom({ x: e.clientX, y: e.clientY });
    setToast("C'est gardé dans votre jardin.");
    setSaved(true);
    try {
      const key = "legato.help.souvenirs.gouts";
      const prev: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([souvenir.trim(), ...prev]));
    } catch {}
  };

  return (
    <HelpShell backTo="/help/corps" backLabel="← Le corps">
      <HelpHeader
        title="Quand le corps oublie de manger."
        subtitle="Il y a des jours où c'est trop. Voilà ce qui ne demande presque rien."
      />

      {/* SECTION 1 — Cinq choses */}
      <section className="px-5 mt-10">
        <p className="eyebrow mb-3 px-2">
          Cinq choses qu'on peut avaler sans y penser
        </p>
        <div className="space-y-3">
          {CARDS.map((c) => (
            <CheckableCard key={c.id} {...c} />
          ))}
        </div>
      </section>

      {/* SECTION 2 — Quelque chose de chaud */}
      <section className="px-7 mt-14">
        <h2 className="font-serif italic text-[1.4rem] text-dusk">Une étape à la fois.</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-dusk/65">
          Rien à finir. Juste commencer.
        </p>

        <div className="mt-7 space-y-5">
          {STEPS.slice(0, openStep + 1).map((s, i) => (
            <div
              key={i}
              className="glass-card organic-radius-3 px-6 py-6 animate-fade-in"
            >
              <p className="eyebrow">Étape {i + 1}</p>
              <h3 className="mt-2 font-serif italic text-[18px] text-dusk leading-snug">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-dusk/70">{s.body}</p>
              {i === openStep && (
                <button
                  type="button"
                  onClick={advance}
                  className="mt-5 ceramic px-5 py-2.5 rounded-full text-[12px] uppercase tracking-[0.18em] text-dusk/85 hover:opacity-90 transition"
                >
                  {s.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — Un souvenir dans l'assiette */}
      <section className="px-7 mt-14">
        <div className="border-t border-dusk/10 pt-8">
          <h2 className="font-serif italic text-[1.4rem] text-dusk">Un repas pour se souvenir.</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-dusk/70 max-w-[34ch]">
            Y a-t-il quelque chose qu'il ou elle aimait manger ? Vous pourriez manger ça aujourd'hui — pas pour vous nourrir, mais pour être près d'elle, de lui.
          </p>
          <textarea
            value={souvenir}
            onChange={(e) => setSouvenir(e.target.value)}
            placeholder="Ce qu'il ou elle aimait..."
            rows={3}
            className="mt-5 w-full glass-card organic-radius-3 px-5 py-4 font-serif italic text-[15px] text-dusk placeholder:text-dusk/40 outline-none resize-none"
          />
          {!saved ? (
            <button
              type="button"
              onClick={saveSouvenir}
              disabled={!souvenir.trim()}
              className="mt-4 ceramic px-5 py-2.5 rounded-full text-[12px] uppercase tracking-[0.18em] text-dusk/85 disabled:opacity-40 hover:opacity-90 transition"
            >
              Garder ce souvenir →
            </button>
          ) : (
            <p className="mt-4 font-serif italic text-[14px] text-dusk/70">
              C'est gardé.
            </p>
          )}
        </div>
      </section>

      <div className="px-7 mt-14 pb-4">
        <Link to="/garden" className="text-[11px] uppercase tracking-[0.22em] text-dusk/45 hover:text-dusk transition">
          Voir le jardin →
        </Link>
      </div>

      {bloom && <BloomFlower x={bloom.x} y={bloom.y} onDone={() => setBloom(null)} />}
      {toast && <SoftToast text={toast} onDone={() => setToast(null)} />}
    </HelpShell>
  );
}