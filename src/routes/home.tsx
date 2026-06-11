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
  const [primary, ...rest] = actions;

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32 px-7">
        <header className="pt-9 flex items-center justify-between">
          <span className="font-serif text-[20px] leading-none">Legato</span>
          <Link
            to="/space"
            className="text-[13px] text-dusk/60 hover:text-dusk underline underline-offset-4"
          >
            Espace
          </Link>
        </header>

        <section className="pt-16">
          <h1 className="font-serif text-[38px] leading-[1.05] font-light text-balance">
            Bonjour {name}.<br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>
              Que voulez-vous faire&nbsp;?
            </span>
          </h1>
        </section>

        {/* Action principale — carte couleur, lisible */}
        <section className="-mx-7 px-5 pt-10">
          <Link
            to={primary.to as never}
            className="block rounded-[22px] px-7 py-7 text-[color:var(--paper)]"
            style={{ background: "var(--terracotta)" }}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-[28px] leading-[1.08] font-light">
                {primary.label}
              </h2>
              <span className="text-[22px] opacity-85">→</span>
            </div>
          </Link>
        </section>

        {/* Liste sobre — verbes courts */}
        <section className="pt-10">
          <ol className="divide-y divide-dusk/12 border-t border-dusk/12">
            {rest.map((a) => (
              <li key={a.key}>
                <Link
                  to={a.to as never}
                  className="flex items-center justify-between py-4 group"
                >
                  <span className="font-serif text-[20px] leading-snug font-light">
                    {a.label}
                  </span>
                  <span className="text-dusk/35 group-hover:text-[color:var(--terracotta)] text-[18px]">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Jardin — bande blush, ligne unique */}
        <section className="-mx-7 px-5 pt-10">
          <Link
            to="/garden"
            className="block rounded-[22px] px-7 py-6"
            style={{ background: "var(--blush)", color: "var(--dusk)" }}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-serif text-[22px] italic">
                Le jardin de {lostName || "votre proche"}
              </p>
              <span className="text-dusk/55 text-[20px]">→</span>
            </div>
          </Link>
        </section>

        {/* Lien crise — discret */}
        <section className="pt-8">
          <Link to="/crisis" className="text-[13px] text-[color:var(--ember)] underline underline-offset-4">
            Si ça déborde, appelez à l'aide →
          </Link>
        </section>
      </div>
    </Shell>
  );
}


/* ─── Actions de l'espace émotionnel ─── */

type Action = { key: string; to: string; label: string };

const ACTIONS: Action[] = [
  { key: "presence", to: "/presence",    label: "Parler" },
  { key: "nowords",  to: "/no-words",    label: "Respirer" },
  { key: "journal",  to: "/journal",     label: "Écrire" },
  { key: "memories", to: "/memories",    label: "Se souvenir" },
  { key: "garden",   to: "/garden",      label: "Marcher au jardin" },
  { key: "rituals",  to: "/inspiration", label: "Un rituel" },
  { key: "contact",  to: "/resources",   label: "Appeler quelqu'un" },
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