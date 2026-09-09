import { createFileRoute, Link } from "@tanstack/react-router";
import { CorpsPage, CorpsSection, CorpsFooterNote } from "@/components/legato/CorpsPage";

export const Route = createFileRoute("/help/corps/nuits")({
  head: () => ({
    meta: [
      { title: "Les nuits — Legato" },
      { name: "description", content: "Ce que d'autres ont fait à trois heures du matin, quand se rendormir n'était pas possible." },
      { property: "og:title", content: "Les nuits — Legato" },
      { property: "og:description", content: "Traverser les heures sans lutter contre le sommeil." },
    ],
  }),
  component: Nuits,
});

type Card = { title: string; body: string; linkLabel?: string; linkTo?: "/no-words" | "/care/journal" | "/care/respirer" };

const CARDS: Card[] = [
  { title: "Rester au lit sans dormir", body: "Le repos sans sommeil fait quand même du bien au corps. Vous n'êtes pas obligé·e de lutter pour vous rendormir." },
  { title: "Se lever", body: "Si rester allongé·e est trop difficile, changez de pièce. Une seule lumière, basse.", linkLabel: "Ouvrir Sans mots", linkTo: "/no-words" },
  { title: "Écrire ce qui tourne", body: "Pas pour que ça parte. Pour le poser hors de vous un moment.", linkLabel: "Ouvrir le journal", linkTo: "/care/journal" },
  { title: "Ralentir le souffle", body: "Expiration deux fois plus longue que l'inspiration, allongé·e. C'est le seul levier volontaire sur le cœur.", linkLabel: "Préparer la nuit", linkTo: "/care/respirer" },
];

const TEMOIGNAGES = [
  "J'ai passé des nuits entières à regarder des photos sur mon téléphone. C'est devenu un rituel, et ça m'a aidé.",
  "Je me levais faire du thé que je ne buvais pas. Le temps de faire bouillir l'eau, j'avais traversé quelque chose.",
  "J'écoutais des podcasts très ennuyeux, sur des sujets que je ne comprenais pas. Ça remplissait la tête sans lui demander d'y penser.",
];

function Nuits() {
  return (
    <CorpsPage
      kicker="LE CORPS · LES NUITS"
      title="Les nuits qui n'en finissent pas."
      intro="La nuit, la pensée tourne sans issue et le sommeil se refuse. L'objectif n'est pas de dormir à tout prix, mais de passer les heures sans lutter."
    >
      <CorpsSection label="Cette nuit" meta={String(CARDS.length).padStart(2, "0")}>
        <ul className="craft px-5">
          {CARDS.map((c, i) => (
            <li
              key={c.title}
              className="border-b border-dashed py-5 last:border-0"
              style={{ borderColor: i < CARDS.length - 1 ? "color-mix(in oklab, var(--dusk) 16%, transparent)" : undefined }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-serif text-[17.5px] leading-[1.2]">{c.title}</p>
                <span className="text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-1.5 max-w-[38ch] text-[13px] leading-[1.6] text-dusk/62">{c.body}</p>
              {c.linkLabel && c.linkTo && (
                <Link to={c.linkTo} className="mono-label mt-3 inline-block" style={{ color: "var(--terracotta)" }}>
                  {c.linkLabel} →
                </Link>
              )}
            </li>
          ))}
        </ul>
      </CorpsSection>

      <CorpsSection label="Ils étaient là aussi, à 3 h">
        <div className="tint-sand rounded-[18px] px-6 py-6 space-y-5">
          {TEMOIGNAGES.map((t) => (
            <blockquote key={t} className="font-serif text-[15.5px] leading-[1.7]">
              « {t} »
            </blockquote>
          ))}
        </div>
      </CorpsSection>

      <CorpsFooterNote>
        Si les nuits difficiles se prolongent plusieurs semaines, en parler compte : le manque de sommeil fragilise tout le reste.
        <Link to="/practical/pros" className="mono-label mt-3 block" style={{ color: "var(--terracotta)" }}>
          Médecin, psychologue, association →
        </Link>
        <p className="mt-5">
          Si cette nuit est particulièrement difficile et qu'il vous faut une voix humaine :{" "}
          <a href="tel:3114" className="font-serif text-[15px] text-dusk">3114 — joignable maintenant</a>
        </p>
      </CorpsFooterNote>
    </CorpsPage>
  );
}
