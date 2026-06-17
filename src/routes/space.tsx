import { createFileRoute, Link } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";
import { LegatoMark } from "@/components/legato/LegatoMark";
import type { ReactNode } from "react";

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
  const careTarget = "/home";
  const practicalTarget = "/practical";
  const today = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long" }).format(new Date());
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="pt-8 px-6">
          <div className="folio">
            <LegatoMark to="/space" size={22} />
            <span>{today}</span>
          </div>
        </header>

        <section className="pt-12 px-6">
          <p className="eyebrow">{name ? `Bonjour, ${name}` : "Bonjour"}</p>
          <div className="mt-5 max-w-[20rem]">
            <h1 className="ed-title text-[47px]">
              De quoi avez-vous
              <br />
              <span className="italic" style={{ color: "var(--terracotta)" }}>besoin</span>&nbsp;?
            </h1>
          </div>
          <p className="mt-6 body-meta max-w-[30ch]">
            Deux espaces, distincts mais reliés. Vous passez de l'un à l'autre à tout moment.
          </p>
        </section>

        <div className="px-6 mt-9">
          <div className="rule-label"><span>Choisir un seuil</span></div>
        </div>

        <section className="px-5 pt-6 space-y-4">
          <EditorialCard
            to={careTarget}
            tone="card-tomato"
            eyebrow="Espace de soi"
            title={<>Prendre soin de <span className="italic">soi</span>.</>}
            body="Pour traverser ce que vous ressentez, écrire, respirer, parler ou préserver un souvenir."
            detail="Journal, rituels, cercle, présence"
            cta="Entrer dans cet espace"
          />
          <EditorialCard
            to={practicalTarget}
            tone="card-oven"
            eyebrow="Espace démarches"
            title={<>Organiser et <span className="italic">avancer</span>.</>}
            body="Pour être guidé·e dans les démarches, la cérémonie, les documents et les prochaines étapes."
            detail="Checklist, priorités, documents, rendez-vous"
            cta="Voir le plan d'action"
          />
        </section>

        <p className="mt-10 px-6 pb-10 body-meta">
          Vous pourrez changer d'espace à tout moment.
        </p>
      </div>
    </main>
  );
}

function EditorialCard({
  to, tone, eyebrow, title, body, detail, cta,
}: {
  to: string;
  tone: string;
  eyebrow: string;
  title: ReactNode;
  body: string;
  detail: string;
  cta: string;
}) {
  return (
    <Link
      to={to as "/home"}
      className={`plate ${tone} px-6 pt-6 pb-5 transition-transform active:scale-[0.99]`}
    >
      <span className="eyebrow-on-dark">{eyebrow}</span>
      <h2 className="mt-4 max-w-[14ch] font-serif text-[34px] font-normal leading-[0.98] tracking-[-0.01em]">{title}</h2>
      <p className="mt-4 text-[13px] leading-[1.55] opacity-85 max-w-[32ch]">{body}</p>
      <div className="plate-caption">
        <span>{detail}</span>
        <span>{cta} →</span>
      </div>
    </Link>
  );
}