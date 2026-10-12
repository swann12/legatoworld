import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PrimaryButton, TextLink } from "@/components/legato/ds";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Ce que Legato fait pour vous — Legato" },
      { name: "description", content: "Aujourd'hui, Soutien, Démarches, Mémoire, Communauté : les cinq espaces de Legato." },
      { property: "og:title", content: "Ce que Legato fait pour vous" },
      { property: "og:description", content: "Les cinq espaces de Legato pour traverser le deuil, à votre rythme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Presentation,
});

const ITEMS = [
  { t: "Aujourd'hui", s: "Chaque jour, une seule chose à faire, adaptée à votre humeur" },
  { t: "Soutien", s: "Parler à quelqu'un, respirer, dormir, écrire" },
  { t: "Démarches", s: "Les papiers à faire, dans l'ordre, avec des modèles" },
  { t: "Mémoire", s: "Garder ses photos, sa voix, ses mots" },
  { t: "Communauté", s: "Échanger avec des personnes qui vivent la même chose" },
];

/** 003 · Comment ça marche */
function Presentation() {
  return (
    <main className="lg-space-today min-h-dvh" style={{ background: "var(--lg-cream)", color: "var(--lg-deep)", fontFamily: "var(--lg-sans)" }}>
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-[28px]">
        <header className="flex h-16 shrink-0 items-center">
          <Link to="/start" className="flex min-h-11 items-center gap-[9px] text-[14px]"><ArrowLeft className="size-4" strokeWidth={1.4} /> Retour</Link>
        </header>
        <h1 className="lg-title pt-3" style={{ fontSize: 30 }}>Ce que Legato<br /><em>fait pour vous.</em></h1>
        <ol className="mt-5" style={{ borderTop: "1px solid var(--lg-line-2)" }}>
          {ITEMS.map((it, i) => (
            <li key={it.t} className="grid grid-cols-[36px_1fr] py-[14px]" style={{ borderBottom: "1px solid var(--lg-line-2)" }}>
              <span style={{ fontFamily: "var(--lg-serif)", fontSize: 22 }}>{i + 1}</span>
              <span>
                <span className="block" style={{ fontFamily: "var(--lg-serif)", fontSize: 20, lineHeight: 1.15 }}>{it.t}</span>
                <span className="mt-1 block text-[13px] leading-[1.45]" style={{ color: "var(--lg-sub)" }}>{it.s}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="min-h-8 flex-1" />
        <div className="flex flex-col items-center gap-4 pb-[34px]">
          <PrimaryButton space="support" full to="/onboarding">Créer mon espace</PrimaryButton>
          <TextLink to="/auth">J'ai déjà un compte</TextLink>
        </div>
      </div>
    </main>
  );
}
