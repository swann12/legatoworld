import { createFileRoute, Link } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";
import { LegatoMark } from "@/components/legato/LegatoMark";

export const Route = createFileRoute("/space")({
  head: () => ({
    meta: [
      { title: "Choisir un espace — Legato" },
      { name: "description", content: "Deux espaces distincts : prendre soin de soi, ou organiser et avancer." },
    ],
  }),
  component: Space,
});

/** Page centrale du produit. Deux blocs très lisibles. Rien d'autre. */
function Space() {
  const { name } = useLegato();
  // Plus de rebouclage vers l'onboarding : les deux blocs mènent directement
  // à leur espace. L'onboarding ne se fait qu'une fois, depuis /onboarding.
  const careTarget = "/home";
  const practicalTarget = "/practical";
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="pt-10 px-7">
          <LegatoMark to="/space" size={24} />
        </header>

        <section className="pt-14 px-7">
          <p className="eyebrow">{name ? `Bonjour ${name}` : "Bonjour"}</p>
          <h1 className="mt-5 font-serif text-[44px] leading-[1.02] tracking-[-0.01em] text-dusk font-normal">
            De quoi avez-vous <span className="italic" style={{ color: "var(--terracotta)" }}>besoin&nbsp;?</span>
          </h1>
          <p className="mt-5 body-meta max-w-[32ch]">
            Deux espaces, distincts mais reliés. Vous passez de l'un à l'autre à tout moment.
          </p>
        </section>

        <section className="px-5 pt-9 space-y-3">
          <Block
            to={careTarget}
            className="card-tomato"
            eyebrow="Espace · Soi"
            title="Prendre soin de soi"
            text="Pour traverser ce que vous ressentez, parler, écrire, respirer ou préserver un souvenir."
            cta="Entrer dans cet espace"
          />
          <Block
            to={practicalTarget}
            className="card-oven"
            eyebrow="Espace · Démarches"
            title="Organiser et avancer"
            text="Pour être guidé·e dans les démarches, la cérémonie, les documents et les prochaines étapes."
            cta="Voir ce qu'il faut faire"
          />
        </section>

        <p className="mt-8 text-center text-[12px] text-dusk/55 px-7 pb-10">
          Vous pourrez changer d'espace à tout moment.
        </p>
      </div>
    </main>
  );
}

function Block({
  to, className, eyebrow, title, text, cta,
}: { to: string; className: string; eyebrow: string; title: string; text: string; cta: string }) {
  return (
    <Link
      to={to as "/home"}
      className={`block ${className} px-6 py-7 transition-transform active:scale-[0.99]`}
    >
      <span className="eyebrow-on-dark">{eyebrow}</span>
      <h2 className="mt-3 font-serif text-[28px] leading-[1.05]">{title}</h2>
      <p className="mt-3 text-[13.5px] leading-[1.55] opacity-85 max-w-[34ch]">{text}</p>
      <p className="mt-6 text-[11px] uppercase tracking-[0.18em] font-medium opacity-95 inline-flex items-center gap-2">
        {cta} <span className="font-serif text-[18px]">→</span>
      </p>
    </Link>
  );
}