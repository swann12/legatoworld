import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { PersonalSuggestions } from "@/components/legato/PersonalSuggestions";

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
        <header className="px-7 pt-10 flex items-center justify-between">
          <Link to="/practical" className="eyebrow hover:text-dusk">← Accueil</Link>
          <span className="eyebrow">Atmosphère</span>
        </header>
        <section className="px-7 pt-14">
          <p className="eyebrow">Composer une ambiance</p>
          <h1 className="mt-4 display-xl text-dusk text-balance">
            Une atmosphère <span className="italic">qui lui ressemble.</span>
          </h1>
          <p className="mt-5 body-meta max-w-[36ch]">
            Décrivez la personne ou l'atmosphère souhaitée. Nous vous proposerons
            une première sélection que vous pourrez modifier.
          </p>
        </section>

        <section className="px-7 mt-8 space-y-2.5">
          {TILES.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="card-plain block p-5 flex items-baseline justify-between"
            >
              <div>
                <p className="eyebrow">{t.eyebrow}</p>
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
