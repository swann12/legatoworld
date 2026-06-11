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
  const [primary, ...rest] = orderForMode(mode);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        {/* En-tête — wordmark serif, espace lien discret */}
        <header className="px-7 pt-9 flex items-center justify-between">
          <span className="font-serif text-[20px] text-dusk leading-none">Legato</span>
          <Link
            to="/space"
            className="text-[12px] tracking-wide text-dusk/65 hover:text-dusk underline underline-offset-4"
          >
            Espace
          </Link>
        </header>

        {/* Salutation éditoriale Co-Star */}
        <section className="px-7 pt-16">
          <p
            className="text-[10px] uppercase tracking-[0.32em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Bonjour, {name}.
          </p>
          <h1 className="mt-5 font-serif text-[36px] leading-[1.05] text-dusk font-light text-balance">
            De quoi auriez-vous besoin <span className="italic">maintenant&nbsp;?</span>
          </h1>
        </section>

        {/* Une priorité émotionnelle — grande carte pleine couleur */}
        <section className="px-5 pt-10">
          <Link
            to={primary.to as never}
            className="block rounded-[22px] overflow-hidden text-[color:var(--paper)]"
            style={{ background: "var(--terracotta)" }}
          >
            <div className="px-7 pt-9 pb-7 min-h-[210px] flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif text-[32px] leading-[1.04] font-light">
                  {primary.bigTitle}
                </h2>
                <span className="text-[24px] leading-none translate-y-2 opacity-85">→</span>
              </div>
              <p
                className="mt-auto pt-10 text-[11px] tracking-[0.28em]"
                style={{ fontFamily: "var(--font-mono)", color: "color-mix(in oklab, var(--paper) 80%, transparent)" }}
              >
                {primary.eyebrow.toUpperCase()}
              </p>
            </div>
          </Link>
        </section>

        {/* Liste éditoriale — autres portes */}
        <section className="px-7 pt-12">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50 mb-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Autres portes
          </p>
          <div className="divide-y divide-dusk/10 border-t border-dusk/12">
            {rest.map((a) => (
              <Link
                key={a.to + a.key}
                to={a.to as never}
                className="py-4 flex items-baseline justify-between gap-4 group"
              >
                <h3 className="font-serif text-[20px] text-dusk leading-snug">
                  {a.title}
                </h3>
                <span className="text-dusk/40 group-hover:text-dusk transition-colors">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Le jardin de — bandeau pleine couleur, calme */}
        <section className="px-5 pt-10">
          <Link
            to="/garden"
            className="block rounded-[22px] overflow-hidden"
            style={{ background: "var(--blush)", color: "var(--dusk)" }}
          >
            <div className="px-7 py-7 flex items-baseline justify-between gap-4">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.3em] text-dusk/55"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Le jardin de {lostName}
                </p>
                <p className="mt-2 font-serif text-[24px] italic text-dusk">
                  Y déposer un souvenir.
                </p>
              </div>
              <span className="text-dusk/70 text-[22px]">→</span>
            </div>
          </Link>
        </section>

        {/* Lien crise — discret */}
        <section className="px-7 pt-8">
          <Link to="/crisis" className="block flex items-baseline justify-between">
            <p
              className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--ember)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Si aujourd'hui pèse trop
            </p>
            <span className="text-[color:var(--ember)]/70">→</span>
          </Link>
        </section>
      </div>
    </Shell>
  );
}

/* ─── Actions de l'espace émotionnel ─── */

type Action = { to: string; eyebrow: string; title: string; bigTitle: React.ReactNode; key: string };

const ACTIONS: Action[] = [
  { key: "presence", to: "/presence",    eyebrow: "Être écouté·e", title: "Parler à une présence",
    bigTitle: <>Parler à<br /><span className="italic">une présence</span></> },
  { key: "journal",  to: "/journal",     eyebrow: "Écrire",        title: "Écrire quelques mots",
    bigTitle: <>Écrire<br /><span className="italic">quelques mots</span></> },
  { key: "nowords",  to: "/no-words",    eyebrow: "Respirer",      title: "Respirer sans rien dire",
    bigTitle: <>Respirer,<br /><span className="italic">sans mots</span></> },
  { key: "garden",   to: "/garden",      eyebrow: "Jardin",        title: "Entrer dans le jardin",
    bigTitle: <>Entrer dans<br /><span className="italic">le jardin</span></> },
  { key: "memories", to: "/memories",    eyebrow: "Souvenir",      title: "Retrouver un souvenir",
    bigTitle: <>Retrouver<br /><span className="italic">un souvenir</span></> },
  { key: "rituals",  to: "/inspiration", eyebrow: "Rituel",        title: "Découvrir un rituel",
    bigTitle: <>Découvrir<br /><span className="italic">un rituel</span></> },
  { key: "contact",  to: "/resources",   eyebrow: "Contacter",     title: "Contacter quelqu'un",
    bigTitle: <>Contacter<br /><span className="italic">quelqu'un</span></> },
  { key: "guide",    to: "/presence",    eyebrow: "Me guider",     title: "Me laisser guider",
    bigTitle: <>Me laisser<br /><span className="italic">guider</span></> },
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