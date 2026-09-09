import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CorpsPage, CorpsSection, CorpsFooterNote } from "@/components/legato/CorpsPage";

export const Route = createFileRoute("/help/corps/habiller")({
  head: () => ({
    meta: [
      { title: "S'habiller — Legato" },
      { name: "description", content: "Les vêtements portent beaucoup en ce moment. Il n'y a pas de bonne façon de faire." },
      { property: "og:title", content: "S'habiller — Legato" },
      { property: "og:description", content: "Le plus doux, une couleur, ses affaires." },
    ],
  }),
  component: Habiller,
});

/* Aplats issus de la palette — jamais rose et bleu côte à côte. */
const COLORS = [
  { name: "Terre", v: "color-mix(in oklab, var(--terracotta) 60%, var(--whisper))" },
  { name: "Sable", v: "color-mix(in oklab, var(--clay) 78%, var(--whisper))" },
  { name: "Blé", v: "color-mix(in oklab, var(--sun) 70%, var(--whisper))" },
  { name: "Bois", v: "color-mix(in oklab, var(--bordeaux) 45%, var(--whisper))" },
  { name: "Poudre", v: "color-mix(in oklab, var(--blush) 62%, var(--whisper))" },
];

function Habiller() {
  const [foundSoft, setFoundSoft] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [matin, setMatin] = useState({ on: false, hour: "08:30" });

  return (
    <CorpsPage
      kicker="LE CORPS · S'HABILLER"
      title="S'habiller, sans bonne façon de faire."
      intro="Les vêtements portent beaucoup en ce moment. Trois gestes simples, à prendre ou à laisser."
    >
      <CorpsSection label="Le plus doux">
        <div className="craft px-5 py-5">
          <p className="max-w-[34ch] text-[13.5px] leading-[1.65] text-dusk/70">
            Cherchez la chose la plus douce de votre armoire. Pas la plus jolie, pas la plus pratique : la plus douce au toucher.
          </p>
          <button
            type="button"
            onClick={() => setFoundSoft(true)}
            className="mono-label mt-4"
            style={{ color: foundSoft ? "color-mix(in oklab, var(--dusk) 45%, transparent)" : "var(--terracotta)" }}
          >
            {foundSoft ? "C'est trouvé" : "Je l'ai trouvée →"}
          </button>
        </div>
      </CorpsSection>

      <CorpsSection label="Une couleur">
        <div className="craft px-5 py-5">
          <p className="text-[13.5px] leading-[1.65] text-dusk/70">
            Y a-t-il une couleur qui vous fait du bien aujourd'hui ?
          </p>
          <div className="mt-5 grid grid-cols-5 gap-2">
            {COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setPicked(c.name)}
                aria-label={c.name}
                aria-pressed={picked === c.name}
                className="h-14 rounded-[10px] transition-transform"
                style={{
                  background: c.v,
                  outline: picked === c.name ? "1px solid var(--dusk)" : "none",
                  outlineOffset: "3px",
                }}
              />
            ))}
          </div>
          {picked && (
            <p className="mt-5 max-w-[34ch] font-serif text-[16px] leading-[1.4]">
              Quelque chose de cette couleur, si vous en avez. Même une écharpe, même une chaussette.
            </p>
          )}
        </div>
      </CorpsSection>

      <CorpsSection label="Ses affaires">
        <div className="tint-sand rounded-[18px] px-6 py-6">
          <div className="max-w-[36ch] space-y-3 text-[14px] leading-[1.7]">
            <p>Beaucoup gardent un vêtement de lui, d'elle, près d'eux. Un pull, une veste, quelque chose qui tient l'odeur.</p>
            <p>C'est permis, aussi longtemps que nécessaire. Il n'existe aucun calendrier pour ça.</p>
          </div>
        </div>
      </CorpsSection>

      <CorpsSection label="Un matin accompagné">
        <div className="craft px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <p className="max-w-[26ch] text-[13.5px] leading-[1.6] text-dusk/70">
              Un mot doux le matin, à l'heure que vous choisissez. Pas une alarme.
            </p>
            <button
              type="button"
              role="switch"
              aria-checked={matin.on}
              aria-label="Activer le mot du matin"
              onClick={() => setMatin((m) => ({ ...m, on: !m.on }))}
              className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
              style={{ background: matin.on ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
            >
              <span
                className="absolute top-1 size-4 rounded-full transition-all"
                style={{ background: "var(--paper)", left: matin.on ? "calc(100% - 1.25rem)" : "0.25rem" }}
              />
            </button>
          </div>
          {matin.on && (
            <div className="mt-4 border-t border-dashed pt-4" style={{ borderColor: "color-mix(in oklab, var(--dusk) 16%, transparent)" }}>
              <label className="mono-label" htmlFor="heure-matin">À quelle heure</label>
              <input
                id="heure-matin"
                type="time"
                value={matin.hour}
                onChange={(e) => setMatin((m) => ({ ...m, hour: e.target.value }))}
                className="mt-2 w-full rounded-[12px] bg-paper px-4 py-3 font-serif text-[17px] outline-none"
              />
            </div>
          )}
        </div>
      </CorpsSection>

      <CorpsFooterNote>
        Rester en pyjama plusieurs jours n'a rien de grave. Si cela s'installe et vous pèse, en parler aide.
        <Link to="/practical/pros" className="mono-label mt-3 block" style={{ color: "var(--terracotta)" }}>
          Trouver un·e professionnel·le →
        </Link>
      </CorpsFooterNote>
    </CorpsPage>
  );
}
