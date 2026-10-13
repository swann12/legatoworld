import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/crisis")({
  head: () => ({
    meta: [
      { title: "Besoin d'aide — Legato" },
      { name: "description", content: "Vous n'êtes pas seul. Parlez à quelqu'un maintenant : gratuit, anonyme, jour et nuit." },
      { property: "og:title", content: "Besoin d'aide — Legato" },
      { property: "og:description", content: "3114, 15, 112 : parlez à quelqu'un maintenant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Crisis,
});

const LINES = [
  { n: "3114", title: "Si vous pensez au suicide", tag: "Écoute professionnelle" },
  { n: "15", title: "Urgence médicale", tag: "SAMU" },
  { n: "112", title: "Toute urgence", tag: "Depuis tout téléphone" },
];

/** 018 · Besoin d'aide — plein écran bordeaux, sans barre */
function Crisis() {
  return (
    <main className="min-h-dvh" style={{ background: "var(--lg-bordeaux)", color: "var(--lg-blush)", fontFamily: "var(--lg-sans)" }}>
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-[28px] pb-10">
        <header className="flex h-16 items-center justify-between" style={{ borderBottom: "1px solid color-mix(in oklab, var(--lg-blush) 30%, transparent)" }}>
          <Link to="/home" className="flex min-h-11 items-center gap-2 text-[14px]"><ArrowLeft className="size-4" strokeWidth={1.4} /> Retour</Link>
          <span className="lg-mono" style={{ color: "var(--lg-blush)" }}>Besoin d'aide</span>
        </header>
        <h1 className="lg-title pt-10" style={{ fontSize: 38 }}>Vous n'êtes pas seul.<br /><em>Parlez à quelqu'un</em><br />maintenant.</h1>
        <p className="mt-4 text-[14px]">Gratuit, anonyme, jour et nuit.</p>
        <ul className="mt-8">
          {LINES.map((l, i) => (
            <li key={l.n} className="grid grid-cols-[96px_1fr_auto] items-center gap-2 py-5"
              style={{ borderBottom: i < LINES.length - 1 ? "1px solid color-mix(in oklab, var(--lg-blush) 25%, transparent)" : "none" }}>
              <span style={{ fontFamily: "var(--lg-serif)", fontSize: 44, lineHeight: 1 }}>{l.n}</span>
              <span>
                <span className="block" style={{ fontFamily: "var(--lg-serif)", fontSize: 19, lineHeight: 1.15 }}>{l.title}</span>
                <span className="lg-mono mt-1 block" style={{ color: "color-mix(in oklab, var(--lg-blush) 75%, transparent)" }}>{l.tag}</span>
              </span>
              <a href={`tel:${l.n}`} className="flex h-10 items-center rounded-full px-5 text-[14.5px]" style={{ background: i === 0 ? "var(--lg-blush)" : "transparent", color: i === 0 ? "var(--lg-bordeaux)" : "var(--lg-blush)", border: "1px solid var(--lg-blush)" }}>Appeler</a>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex gap-7 text-[14.5px]">
          <Link to="/care/respirer" className="underline underline-offset-4">Respirer avec moi</Link>
          <Link to="/presence" className="underline underline-offset-4">Écrire à Présence</Link>
        </div>
      </div>
    </main>
  );
}
