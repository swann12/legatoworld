import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpShell, HelpHeader } from "@/components/legato/HelpShell";

export const Route = createFileRoute("/help/corps/nuits")({
  head: () => ({ meta: [{ title: "Les nuits — Aide" }] }),
  component: Nuits,
});

type Card = { title: string; body: string; linkLabel?: string; linkTo?: "/no-words" | "/journal" };
const CARDS: Card[] = [
  { title: "Rester dans le lit sans dormir", body: "C'est permis. Le repos sans sommeil fait quand même du bien au corps. Vous n'êtes pas obligé·e de lutter." },
  { title: "Se lever",                         body: "Si rester allongé est trop difficile — levez-vous. Allez dans une autre pièce. Allumez une seule lumière, douce.", linkLabel: "Ouvrir Sans mots →", linkTo: "/no-words" },
  { title: "Écrire ce qui tourne",             body: "Pas pour que ça parte. Juste pour le poser hors de vous un moment.", linkLabel: "Ouvrir le Journal →", linkTo: "/journal" },
  { title: "Écouter quelque chose",            body: "Une voix, de la musique très douce, un son de pluie. Quelque chose qui remplit le silence.", linkLabel: "Ouvrir Souffles →", linkTo: "/no-words" },
];

const TEMOIGNAGES = [
  "J'ai passé des nuits entières à regarder des photos sur mon téléphone. Un moment, c'est devenu un rituel. Ça m'a aidé.",
  "Je me levais faire du thé que je ne buvais pas. Mais le temps de faire bouillir l'eau, j'avais traversé quelque chose.",
  "J'écoutais des podcasts très ennuyeux, sur des sujets que je ne comprenais pas. Ça remplissait la tête sans lui demander d'y penser.",
];

function Nuits() {
  return (
    <HelpShell backTo="/help/corps" backLabel="← Le corps">
      <HelpHeader
        title="Les nuits qui n'en finissent pas."
        subtitle="Ce que d'autres ont fait à 3 h du matin."
      />

      {/* SECTION 1 — Ce qui peut aider cette nuit */}
      <section className="px-5 mt-12">
        <p className="eyebrow mb-3 px-2">
          Ce qui peut aider cette nuit
        </p>
        <div className="space-y-3">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="glass-card organic-radius-3 px-6 py-6"
              style={{ background: "color-mix(in oklab, #F0EBF8 70%, transparent)" }}
            >
              <h3 className="font-serif text-[17px] text-dusk leading-snug">{c.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-dusk/70">{c.body}</p>
              {c.linkLabel && c.linkTo && (
                <Link
                  to={c.linkTo}
                  className="mt-3 inline-block eyebrow hover:text-dusk transition"
                >
                  {c.linkLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 — Ce que d'autres ont fait */}
      <section className="px-7 mt-14">
        <h2 className="font-serif text-[1.4rem] text-dusk">Ils étaient là aussi, à 3 h du matin.</h2>
        <div className="mt-6 space-y-5">
          {TEMOIGNAGES.map((t, i) => (
            <blockquote
              key={i}
              className="font-serif text-[15.5px] leading-[1.7] text-dusk/80 pl-5 py-2 border-l-2"
              style={{ borderColor: "#B0A0C8" }}
            >
              « {t} »
            </blockquote>
          ))}
        </div>
      </section>

      {/* SECTION 3 — Si les nuits durent depuis longtemps */}
      <section className="px-7 mt-14 mb-6">
        <div className="border-t border-dusk/10 pt-6">
          <p className="text-[13px] leading-relaxed text-dusk/65 max-w-[36ch]">
            Si les nuits difficiles se prolongent depuis plusieurs semaines, c'est important d'en parler à quelqu'un. Le manque de sommeil peut fragiliser encore plus.
          </p>
          <Link
            to="/resources"
            className="mt-4 inline-block eyebrow hover:text-dusk transition"
          >
            Trouver un médecin ou thérapeute →
          </Link>

          <div className="mt-8 pt-5 border-t border-dusk/10">
            <p className="text-[11.5px] leading-relaxed text-dusk/55 max-w-[36ch]">
              Si cette nuit est particulièrement difficile et que vous avez besoin d'une voix humaine →
            </p>
            <a
              href="tel:3114"
              className="mt-2 inline-block font-serif text-[15px] text-dusk hover:opacity-80 transition"
            >
              3114 — disponible maintenant
            </a>
          </div>
        </div>
      </section>
    </HelpShell>
  );
}