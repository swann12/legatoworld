import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { PersonalSuggestions } from "@/components/legato/PersonalSuggestions";
import { PageHeader, IvoryCard } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/practical/atmosphere")({
  head: () => ({ meta: [{ title: "Atmosphère — Legato" }] }),
  component: Atmosphere,
});

const TILES = [
  { to: "/practical/flowers", eyebrow: "Fleurs",   title: "Composer un bouquet, une couronne, une ambiance" },
  { to: "/practical/texts",   eyebrow: "Textes",   title: "Poèmes, lectures, paroles" },
  { to: "/practical/objects", eyebrow: "Objets",   title: "Cercueil, urne, plaque, livret, rituels" },
];

function Atmosphere() {
  return (
    <Shell hideNav>
      <div className="min-h-dvh bg-paper text-dusk pb-12">
        <PageHeader title="ATMOSPHÈRE" back="/practical" />

        <section className="px-6 pt-4 pb-6">
          <p className="mono-label">Composer une ambiance</p>
          <h1 className="mt-4 ed-page-title">
            Une atmosphère <span className="italic">qui lui ressemble.</span>
          </h1>
          <p className="mt-5 body-meta max-w-[34ch]">
            Décrivez la personne ou l'atmosphère souhaitée. Nous vous proposerons une première sélection que vous pourrez modifier.
          </p>
        </section>

        <section className="px-5 space-y-2.5">
          {TILES.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="block rounded-[18px] border border-dusk/10 bg-paper p-5 flex items-baseline justify-between hover:bg-dusk/[0.02] transition-colors"
            >
              <div>
                <p className="mono-label">{t.eyebrow}</p>
                <p className="mt-2 font-serif italic text-[17px] text-dusk">{t.title}</p>
              </div>
              <span className="text-dusk/45">→</span>
            </Link>
          ))}
        </section>

        <PersonalSuggestions
          topic="ceremony"
          eyebrow="Me laisser guider"
          cta="Composer une première version"
        />
      </div>
      <ConfideDock step="atmosphère" />
    </Shell>
  );
}
