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
  const today = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long" }).format(new Date());
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        {/* Folio header — magazine top strip */}
        <header className="pt-8 px-6">
          <div className="folio">
            <LegatoMark to="/space" size={22} />
            <span>{today}</span>
          </div>
        </header>

        {/* COVER — index numeral collé au titre */}
        <section className="pt-14 px-6">
          <p className="eyebrow">{name ? `Bonjour, ${name}` : "Bonjour"}</p>
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 items-start">
            <span className="index-num leading-none -mt-1">№</span>
            <h1 className="ed-title text-[46px]">
              De quoi
              <br />
              avez-vous
              <br />
              <span className="italic" style={{ color: "var(--terracotta)" }}>besoin</span>&nbsp;?
            </h1>
          </div>
          <p className="mt-7 body-meta max-w-[30ch] pl-[3.25rem]">
            Deux espaces, distincts mais reliés. Vous passez de l'un à l'autre à tout moment.
          </p>
        </section>

        {/* Rule label */}
        <div className="px-6 mt-10">
          <div className="rule-label"><span>Choisir un seuil</span></div>
        </div>

        {/* Plates — asymétrie volontaire : carte large + carte plus courte décalée */}
        <section className="px-5 pt-6 space-y-4">
          <Plate
            to={careTarget}
            tone="card-tomato"
            number="01"
            eyebrow="L'espace de Soi"
            title={<>Prendre soin <span className="italic">de soi</span>.</>}
            body="Pour traverser ce que vous ressentez. Parler, écrire, respirer, ou préserver un souvenir."
            captionLeft="Soi"
            captionRight="Entrer →"
            tall
          />
          <div className="pl-6 pr-2">
            <Plate
              to={practicalTarget}
              tone="card-oven"
              number="02"
              eyebrow="L'espace des Démarches"
              title={<>Organiser, <span className="italic">avancer</span>.</>}
              body="Pour être guidé·e dans les démarches, la cérémonie, les documents."
              captionLeft="Démarches"
              captionRight="Voir le plan →"
            />
          </div>
        </section>

        {/* Marginalia footer */}
        <p className="mt-12 px-6 pb-10 text-[11.5px] tracking-[0.05em] text-dusk/55 italic font-serif">
          — vous pouvez changer d'espace à tout moment.
        </p>
      </div>
    </main>
  );
}

function Plate({
  to, tone, number, eyebrow, title, body, captionLeft, captionRight, tall,
}: {
  to: string; tone: string; number: string; eyebrow: string;
  title: React.ReactNode; body: string;
  captionLeft: string; captionRight: string; tall?: boolean;
}) {
  return (
    <Link
      to={to as "/home"}
      className={`plate ${tone} px-6 ${tall ? "pt-7 pb-6" : "pt-6 pb-5"} transition-transform active:scale-[0.99]`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="eyebrow-on-dark">{eyebrow}</span>
        <span className="index-num-sm opacity-80">{number}</span>
      </div>
      <h2 className={`mt-5 font-serif font-normal leading-[1.0] tracking-[-0.01em] ${tall ? "text-[36px]" : "text-[30px]"}`}>
        {title}
      </h2>
      <p className="mt-4 text-[13px] leading-[1.55] opacity-85 max-w-[32ch]">{body}</p>
      <div className="plate-caption">
        <span>{captionLeft}</span>
        <span>{captionRight}</span>
      </div>
    </Link>
  );
}