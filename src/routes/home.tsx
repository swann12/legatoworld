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

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        {/* ─── En-tête ─── */}
        <header className="px-7 pt-10">
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Legato · Être accompagné·e
            </span>
            <Link
              to="/space"
              className="text-[10px] uppercase tracking-[0.24em] text-dusk/50 hover:text-dusk"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Changer d'espace
            </Link>
          </div>
        </header>

        {/* ─── Salutation éditoriale ─── */}
        <section className="px-7 pt-14">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Bonjour {name}
          </p>
          <h1 className="mt-4 font-serif text-[36px] leading-[1.05] text-dusk font-light text-balance">
            De quoi auriez-vous besoin <span className="italic">maintenant&nbsp;?</span>
          </h1>
          <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.6] text-dusk/60">
            Une porte par envie. Vous n'avez rien à choisir parfaitement —
            tout reste accessible.
          </p>
        </section>

        {/* ─── Liste éditoriale — actions ─── */}
        <section className="px-7 pt-10">
          <div className="divide-y divide-dusk/10 border-y border-dusk/12">
            {actions.map((a, i) => (
              <Link
                key={a.to}
                to={a.to as never}
                className="py-5 flex items-baseline gap-4 group"
              >
                <span
                  className="text-[11px] tracking-[0.18em] text-dusk/45 w-7 shrink-0"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[10px] uppercase tracking-[0.26em] text-dusk/55"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {a.eyebrow}
                  </p>
                  <h3 className="mt-1.5 font-serif text-[20px] italic text-dusk leading-snug">
                    {a.title}
                  </h3>
                </div>
                <span className="text-dusk/45 group-hover:text-dusk transition-colors">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Carte feature — porte calme (présence) ─── */}
        <section className="px-7 pt-10">
          <Link
            to="/presence"
            className="block rounded-[18px] overflow-hidden text-[color:var(--paper)]"
            style={{ background: "var(--bordeaux)" }}
          >
            <div className="px-6 pt-6 pb-5">
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--paper)]/65"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                La porte calme
              </p>
              <p className="mt-3 font-serif text-[22px] leading-[1.15]">
                Parler à une présence, <span className="italic">sans rien devoir dire.</span>
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--paper)]/85"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Entrer
                </span>
                <span className="text-[color:var(--paper)]/75">→</span>
              </div>
            </div>
          </Link>
        </section>

        {/* ─── Le jardin de — bandeau souvenir ─── */}
        <section className="px-7 pt-8">
          <Link
            to="/garden"
            className="block border-y border-dusk/12 py-5 flex items-baseline justify-between gap-4"
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-dusk/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Le jardin de <span className="not-italic text-dusk/80">{lostName}</span>
              </p>
              <p className="mt-2 font-serif italic text-[18px] text-dusk">
                Y déposer un souvenir.
              </p>
            </div>
            <span className="text-dusk/50">→</span>
          </Link>
        </section>

        {/* ─── Crise — discrète, toujours là ─── */}
        <section className="px-7 pt-8">
          <Link
            to="/crisis"
            className="block flex items-baseline justify-between"
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--ember)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Si aujourd'hui pèse trop
              </p>
              <p className="mt-1 font-serif italic text-[16px] text-dusk">
                Une porte calme, ouverte.
              </p>
            </div>
            <span className="text-dusk/50">→</span>
          </Link>
        </section>
      </div>
    </Shell>
  );
}

/* ─── Actions de l'espace émotionnel ─── */

type Action = { to: string; eyebrow: string; title: string; key: string };

const ACTIONS: Action[] = [
  { key: "presence", to: "/presence",  eyebrow: "Parler",     title: "Parler à une présence" },
  { key: "journal",  to: "/journal",   eyebrow: "Écrire",     title: "Écrire quelques mots" },
  { key: "nowords",  to: "/no-words",  eyebrow: "Respirer",   title: "Respirer sans rien dire" },
  { key: "garden",   to: "/garden",    eyebrow: "Jardin",     title: "Entrer dans le jardin" },
  { key: "memories", to: "/memories",  eyebrow: "Souvenir",   title: "Retrouver un souvenir" },
  { key: "rituals",  to: "/inspiration", eyebrow: "Rituel",   title: "Découvrir un rituel" },
  { key: "contact",  to: "/resources", eyebrow: "Contacter",  title: "Contacter quelqu'un" },
  { key: "guide",    to: "/presence",  eyebrow: "Me guider",  title: "Me laisser guider" },
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