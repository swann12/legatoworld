import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import type { Mode } from "@/lib/legato-state";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Aujourd'hui — Legato" },
      { name: "description", content: "Un intérieur tranquille pour traverser, se souvenir, avancer." },
    ],
  }),
  component: Home,
});

/* ─── Accueil ESPACE ÊTRE ACCOMPAGNÉ·E ───
 * Une seule question : « De quoi auriez-vous besoin maintenant ? »
 * Une liste éditoriale d'actions claires, ordonnée selon le ressenti
 * choisi à l'onboarding. Une carte feature bordeaux discrète pour
 * la porte calme (présence). Pas de halos, pas de grille de cards
 * répétées, pas de sélecteur de mode flou. */

function Home() {
  const { name, lostName, mode } = useLegato();
  const actions = orderForMode(mode);
  const today = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" })
    .format(new Date()).toUpperCase();
  const reading = READING[mode];

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32 px-7">
        <header className="pt-9 flex items-center justify-between">
          <span className="font-serif text-[20px] leading-none">Legato</span>
          <Link
            to="/space"
            className="text-[11px] uppercase tracking-[0.18em] text-dusk/55 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Espace ↩
          </Link>
        </header>

        {/* Lecture du jour — phrase édito, Co-Star register */}
        <section className="pt-16">
          <p
            className="text-[10px] uppercase tracking-[0.34em] text-dusk/55"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {today} — DEDANS · {name ? name.toUpperCase() : "VOUS"}
          </p>
          <h1 className="mt-6 font-serif text-[36px] leading-[1.05] font-light text-balance">
            {reading.before}{" "}
            <span className="italic" style={{ color: "var(--terracotta)" }}>
              {reading.accent}
            </span>
            {reading.after}
          </h1>
        </section>

        {/* Liste numérotée — Co-Star asymmetric typographic menu */}
        <section className="pt-14">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/45 mb-2"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Ce que vous pourriez faire
          </p>
          <ol>
            {actions.map((a, i) => (
              <li key={a.key}>
                <Link
                  to={a.to as never}
                  className="group flex items-baseline gap-5 py-4 border-b border-dusk/12"
                >
                  <span
                    className="text-[11px] tracking-[0.22em] text-dusk/40 w-6 shrink-0"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex-1 font-serif text-[22px] leading-snug font-light">
                    {a.title}
                  </h3>
                  <span
                    className="text-[10px] uppercase tracking-[0.22em] text-dusk/45 group-hover:text-[color:var(--terracotta)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {a.meta}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Jardin — ligne typographique, pas de bloc couleur */}
        <section className="pt-10">
          <Link to="/garden" className="block py-6 border-b border-dusk/15 group">
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Le jardin de {lostName || "votre proche"}
            </p>
            <p className="mt-2 font-serif italic text-[22px] text-dusk group-hover:text-[color:var(--terracotta)] transition-colors">
              Y déposer quelque chose, ou simplement le regarder. →
            </p>
          </Link>
        </section>

        {/* Crise — discret, en bas */}
        <section className="pt-8">
          <Link
            to="/crisis"
            className="flex items-baseline justify-between"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--ember)]">
              Si quelque chose déborde
            </span>
            <span className="text-[color:var(--ember)]/70 text-[12px]">→</span>
          </Link>
        </section>
      </div>
    </Shell>
  );
}

/* Phrases d'ouverture — registre Co-Star (court, direct, tendre, jamais kitsch) */
const READING: Record<Mode, { before: string; accent: string; after: string }> = {
  cocoon:    { before: "Vous n'avez", accent: "rien", after: " à faire de plus que respirer." },
  anchoring: { before: "Le sol est encore", accent: "là", after: ". Vos pieds aussi." },
  breath:    { before: "Aujourd'hui, le silence", accent: "compte", after: " comme une parole." },
  relay:     { before: "Quelqu'un peut", accent: "tenir", after: " ce que vous ne pouvez plus porter." },
};

/* ─── Actions de l'espace émotionnel ─── */

type Action = { to: string; meta: string; title: React.ReactNode; key: string };

const ACTIONS: Action[] = [
  { key: "presence", to: "/presence",    meta: "5 min",  title: <>Parler à <span className="italic">une présence</span></> },
  { key: "nowords",  to: "/no-words",    meta: "3 min",  title: <>Respirer <span className="italic">sans rien dire</span></> },
  { key: "journal",  to: "/journal",     meta: "Écrire", title: <>Poser ce qui <span className="italic">traverse</span></> },
  { key: "memories", to: "/memories",    meta: "Garder", title: <>Revoir <span className="italic">un souvenir</span></> },
  { key: "garden",   to: "/garden",      meta: "Lieu",   title: <>Marcher dans <span className="italic">le jardin</span></> },
  { key: "rituals",  to: "/inspiration", meta: "Rituel", title: <>S'inspirer <span className="italic">d'un geste</span></> },
  { key: "contact",  to: "/resources",   meta: "Humain", title: <>Demander à <span className="italic">quelqu'un</span></> },
  { key: "guide",    to: "/presence",    meta: "Guidé",  title: <>Être <span className="italic">accompagné·e</span></> },
];

/* L'ordre s'adapte au ressenti choisi à l'onboarding, sans rien retirer. */
function orderForMode(mode: Mode): Action[] {
  const orderKeys: Record<Mode, string[]> = {
    cocoon:    ["presence", "nowords", "memories", "journal", "garden", "rituals", "contact", "guide"],
    anchoring: ["journal", "presence", "garden", "memories", "rituals", "nowords", "contact", "guide"],
    breath:    ["nowords", "garden", "presence", "journal", "rituals", "memories", "contact", "guide"],
    relay:     ["contact", "presence", "journal", "memories", "garden", "nowords", "rituals", "guide"],
  };
  const order = orderKeys[mode];
  return order.map((k) => ACTIONS.find((a) => a.key === k)!).filter(Boolean);
}