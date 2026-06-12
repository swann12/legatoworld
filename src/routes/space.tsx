import { createFileRoute, Link } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

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
  const { name, careOnboarded, practicalOnboarded } = useLegato();
  const careTarget = careOnboarded ? "/home" : "/onboarding/care";
  const practicalTarget = practicalOnboarded ? "/practical" : "/onboarding/practical";
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="pt-10 px-7">
          <span className="font-serif text-[20px] leading-none">Legato</span>
        </header>

        <section className="pt-14 px-7">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {name ? `Bonjour ${name}` : "Bonjour"}
          </p>
          <h1 className="mt-4 font-serif text-[36px] leading-[1.03] font-light text-balance">
            De quoi avez-vous <span className="italic" style={{ color: "var(--terracotta)" }}>besoin&nbsp;?</span>
          </h1>
        </section>

        <section className="px-5 pt-10 space-y-3">
          <Block
            to={careTarget}
            bg="var(--terracotta)"
            fg="var(--paper)"
            title="Prendre soin de soi"
            text="Pour traverser ce que vous ressentez, parler, écrire, respirer ou préserver un souvenir."
            cta="Entrer dans cet espace"
          />
          <Block
            to={practicalTarget}
            bg="var(--bordeaux)"
            fg="var(--paper)"
            title="Organiser et avancer"
            text="Pour être guidé·e dans les démarches, la cérémonie, les documents et les prochaines étapes."
            cta="Voir ce qu'il faut faire"
          />
        </section>

        <p className="mt-7 text-center text-[12px] text-dusk/55 px-7 pb-10">
          Vous pourrez changer d'espace à tout moment.
        </p>
      </div>
    </main>
  );
}

function Block({
  to, bg, fg, title, text, cta,
}: { to: string; bg: string; fg: string; title: string; text: string; cta: string }) {
  return (
    <Link
      to={to as "/home"}
      className="block rounded-[22px] px-6 py-7"
      style={{ background: bg, color: fg }}
    >
      <h2 className="font-serif text-[24px] leading-[1.15] font-light">{title}</h2>
      <p className="mt-2.5 text-[13.5px] leading-[1.55] opacity-85 max-w-[34ch]">{text}</p>
      <p
        className="mt-5 text-[11px] uppercase tracking-[0.22em] opacity-90 inline-flex items-center gap-2"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {cta} <span>→</span>
      </p>
    </Link>
  );
}