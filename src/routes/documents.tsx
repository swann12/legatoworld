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
        <Link
          to="/home"
          className="text-[10px] uppercase tracking-[0.3em] text-dusk/55 hover:text-dusk"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← Aujourd'hui
        </Link>
        <SpaceSwitcher />
      </div>
      <header className="px-7 pt-12">
        <p className="text-[10px] uppercase tracking-[0.28em] text-dusk/55" style={{ fontFamily: "var(--font-mono)" }}>
          Mes documents
        </p>
        <h1 className="mt-3 font-serif text-[34px] leading-[1.05] font-light text-dusk text-balance">
          Tout retrouver, <span className="italic">au bon moment.</span>
        </h1>
        <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.6] text-dusk/65">
          Rangez ce qui est utile, par catégorie. Vous pouvez partager une catégorie avec un proche.
        </p>
      </header>
      <section className="px-7 mt-10 space-y-3">
        {CATS.map((c) => (
          <div
            key={c.title}
            className="rounded-[16px] border border-dusk/12 bg-paper p-5 flex items-baseline justify-between gap-4"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
                {c.eyebrow}
              </p>
              <h3 className="mt-1.5 font-serif text-[18px] italic text-dusk leading-snug">{c.title}</h3>
              <p className="mt-1.5 text-[12.5px] leading-[1.5] text-dusk/65 max-w-[34ch]">{c.body}</p>
            </div>
            <button
              className="rounded-full border border-dusk/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-dusk/65 hover:bg-dusk/5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Ajouter
            </button>
          </div>
        ))}
      </section>
      <p className="px-7 mt-10 text-[12px] text-dusk/50 max-w-[34ch]">
        Le coffre est en cours de mise en place. Vous pourrez bientôt importer, scanner et partager chaque document.
      </p>
    </Shell>
  );
}