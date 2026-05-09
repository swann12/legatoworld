import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { Halos } from "@/components/legato/Halos";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { useLegato } from "@/lib/legato-state";

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
  const { mode } = useLegato();
  return (
    <Shell>
      <div className="relative pb-12">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10 flex items-center justify-between">
            <Link to="/practical" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Aides concrètes</Link>
            <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">Atmosphère</span>
          </div>
          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Fleurs · textes · objets</p>
            <h1 className="mt-3 font-serif text-[2.1rem] leading-[1.08] font-light text-dusk text-balance">
              Composer une ambiance,<br/><span className="italic">avec délicatesse.</span>
            </h1>
            <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/65">
              Trois portes simples. Vous pouvez tout sauter — et revenir plus tard.
            </p>
          </header>
          <div className="px-5 mt-8 space-y-3">
            {TILES.map((t) => (
              <Link key={t.to} to={t.to} className="paper-card p-6 flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{t.eyebrow}</p>
                  <p className="mt-1.5 font-serif italic text-[16px] text-dusk">{t.title}</p>
                </div>
                <span className="text-dusk/40">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <ConfideDock step="atmosphère" />
    </Shell>
  );
}
