import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { SpaceSwitcher } from "@/components/legato/SpaceSwitcher";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Legato" },
      { name: "description", content: "Coffre simple pour stocker, retrouver et partager les documents importants." },
    ],
  }),
  component: Documents,
});

type DocCat = { eyebrow: string; title: string; body: string };
const CATS: DocCat[] = [
  { eyebrow: "Identité",     title: "Pièces d'identité",    body: "Carte, passeport, livret de famille." },
  { eyebrow: "Décès",        title: "Certificats & actes",  body: "Certificat de décès, acte, procuration." },
  { eyebrow: "Banque",       title: "Comptes & contrats",   body: "Banques, assurances, abonnements." },
  { eyebrow: "Logement",     title: "Logement",             body: "Bail, charges, fournisseurs d'énergie." },
  { eyebrow: "Succession",   title: "Notaire & succession", body: "Testament, dépôts, héritiers." },
];

function Documents() {
  return (
    <Shell>
      <div className="px-7 pt-10 flex items-center justify-between">
        <Link to="/home" className="eyebrow hover:text-dusk">← Aujourd'hui</Link>
        <SpaceSwitcher />
      </div>
      <header className="px-7 pt-12">
        <p className="eyebrow">Mes documents</p>
        <h1 className="mt-3 font-serif text-[30px] leading-[1.06] font-light text-dusk text-balance">
          Tout retrouver, au bon moment.
        </h1>
        <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.6] text-dusk/65">
          Rangez ce qui est utile, par catégorie. Vous pouvez partager une catégorie avec un proche.
        </p>
      </header>
      <section className="px-7 mt-10 space-y-3">
        {CATS.map((c) => (
          <div
            key={c.title}
            className="surface p-5 flex items-baseline justify-between gap-4"
          >
            <div>
              <p className="eyebrow">{c.eyebrow}</p>
              <h3 className="mt-2 font-serif text-[18px] font-light text-dusk leading-snug">{c.title}</h3>
              <p className="mt-1.5 text-[12.5px] leading-[1.5] text-dusk/65 max-w-[34ch]">{c.body}</p>
            </div>
            <button className="btn-ghost shrink-0">Ajouter</button>
          </div>
        ))}
      </section>
      <p className="px-7 mt-10 text-[12px] text-dusk/50 max-w-[34ch]">
        Le coffre est en cours de mise en place. Vous pourrez bientôt importer, scanner et partager chaque document.
      </p>
    </Shell>
  );
}