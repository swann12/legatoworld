import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PersonalSuggestions } from "@/components/legato/PersonalSuggestions";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/practical/objects")({
  head: () => ({ meta: [{ title: "Cercueil, objets, rituels — Legato" }] }),
  component: Objects,
});

type Item = {
  cat: string;
  title: string;
  body: string;
  range: string;
  refs: { label: string; href: string }[];
};

const ITEMS: Item[] = [
  {
    cat: "Cercueil",
    title: "Bois clair, lignes simples",
    body: "Pin, peuplier, tilleul. L'épure. Souvent le choix par défaut, et le plus juste.",
    range: "≈ 700 – 1 500 €",
    refs: [
      { label: "Pompes funèbres générales", href: "https://www.pompesfunebres.fr" },
      { label: "Roc Eclerc — gamme bois", href: "https://www.roc-eclerc.com" },
    ],
  },
  {
    cat: "Cercueil",
    title: "Bois noble, finitions soignées",
    body: "Chêne, acajou. Pour un hommage plus formel.",
    range: "≈ 1 500 – 3 500 €",
    refs: [{ label: "Comparer chez plusieurs PF", href: "https://www.service-public.fr/particuliers/vosdroits/F938" }],
  },
  {
    cat: "Urne",
    title: "Céramique, biodégradable, ou pierre",
    body: "Selon que l'urne sera conservée, dispersée ou inhumée.",
    range: "≈ 80 – 600 €",
    refs: [{ label: "Urnes biodégradables (Capsula Mundi)", href: "https://www.capsulamundi.it" }],
  },
  {
    cat: "Plaque",
    title: "Granit, lave émaillée, marbre",
    body: "Une phrase courte vaut souvent mieux qu'un long texte.",
    range: "≈ 60 – 350 €",
    refs: [{ label: "Plaque funéraire — exemples", href: "https://www.plaquedeces.fr" }],
  },
  {
    cat: "Livret",
    title: "Livret de cérémonie imprimé",
    body: "Photo, dates, programme, textes. Quelques pages sobres.",
    range: "≈ 1 – 3 € l'unité",
    refs: [{ label: "Génère le tien — Legato", href: "/practical/booklet" }],
  },
  {
    cat: "Objets rituels",
    title: "Bougies, photo, lettres, fleurs séchées",
    body: "De petits gestes simples. À déposer, à brûler, à garder.",
    range: "—",
    refs: [],
  },
];

function Objects() {
  const { mode } = useLegato();
  return (
    <Shell hideNav>
      <div className="relative pb-12">
        
        <div className="relative z-10">
          <div className="px-7 pt-10 flex items-center justify-between">
            <Link to="/practical/atmosphere" className="eyebrow">← Atmosphère</Link>
            <span className="eyebrow">Objets</span>
          </div>
          <header className="px-7 pt-12">
            <p className="eyebrow">Cercueil, urne, objets, rituels</p>
            <h1 className="mt-3 display-xl text-dusk">
              Des choix concrets,<br/><span className="italic">décrits sans jargon.</span>
            </h1>
            <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/65">
              Fourchettes de prix indicatives. Liens vers des ressources extérieures, pour aller voir.
            </p>
          </header>

          <div className="px-5 mt-8 space-y-3">
            {ITEMS.map((it) => (
              <article key={it.title} className="ceramic-warm organic-radius-3 p-5">
                <p className="eyebrow">{it.cat}</p>
                <h3 className="mt-1.5 font-serif italic text-[17px] text-dusk">{it.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-dusk/70">{it.body}</p>
                <p className="mt-3 text-[12px] uppercase tracking-[0.16em] text-dusk/55">{it.range}</p>
                {it.refs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {it.refs.map((r) => (
                      <a
                        key={r.label}
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ceramic organic-radius px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase text-dusk/75"
                      >
                        ↗ {r.label}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          <PersonalSuggestions
            topic="objects"
            eyebrow="Sur mesure — objets & rituels"
            cta="Recevoir des objets et rituels sur mesure"
          />
        </div>
      </div>
      <ConfideDock step="objets" />
    </Shell>
  );
}
