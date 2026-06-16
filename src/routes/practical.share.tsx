import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { loadPractical } from "@/lib/practical-store";

export const Route = createFileRoute("/practical/share")({
  head: () => ({ meta: [{ title: "Partage et relais — Legato" }] }),
  component: Share,
});

function buildMail(state: ReturnType<typeof loadPractical>, who: string) {
  const lines = [
    `Bonjour,`,
    ``,
    `Voici les choix que nous avons commencé à poser pour la cérémonie :`,
    ``,
    state.ceremonyKind ? `• Type : ${state.ceremonyKind}` : "",
    state.ceremonyVenue ? `• Lieu : ${state.ceremonyVenue}` : "",
    state.flowerStyle ? `• Style floral : ${state.flowerStyle}` : "",
    state.budget ? `• Budget indicatif : ${state.budget}` : "",
    "",
    `Merci de votre attention,`,
  ].filter(Boolean);
  const subject = encodeURIComponent(`Préparation de la cérémonie — ${who}`);
  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:?subject=${subject}&body=${body}`;
}

function Share() {
  const [state, setState] = useState(loadPractical());
  useEffect(() => { setState(loadPractical()); }, []);

  const RELAY = [
    { who: "Pompes funèbres",         body: "Transmettre vos choix pour préparer le devis." },
    { who: "Officiant ou maître de cérémonie", body: "Partager le déroulé et les textes." },
    { who: "Fleuriste",               body: "Envoyer la composition florale en pièce jointe." },
    { who: "Proches",                 body: "Annoncer la date, le lieu, le déroulé." },
  ];

  return (
    <Shell hideNav>
      <div className="relative pb-12">
        
        <div className="relative z-10">
          <div className="px-7 pt-10 flex items-center justify-between">
            <Link to="/practical" className="eyebrow">← Aides concrètes</Link>
            <span className="eyebrow">Partage</span>
          </div>
          <header className="px-7 pt-12">
            <p className="eyebrow">Transmettre, déléguer</p>
            <h1 className="mt-3 display-xl text-dusk">
              D'autres mains <span className="italic">peuvent prendre.</span>
            </h1>
            <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/65">
              Un mail pré-écrit pour chaque interlocuteur. Vous relisez, vous envoyez.
            </p>
          </header>

          <div className="px-5 mt-8 space-y-3">
            {RELAY.map((r) => (
              <a key={r.who} href={buildMail(state, r.who)} className="card-plain p-5 flex items-baseline justify-between">
                <div>
                  <p className="eyebrow">{r.who}</p>
                  <p className="mt-1.5 font-serif italic text-[15px] text-dusk">{r.body}</p>
                </div>
                <span className="text-dusk/40">✉</span>
              </a>
            ))}
          </div>

          <div className="px-7 mt-10 text-center">
            <p className="font-serif italic text-[14px] text-dusk/55 max-w-[28ch] mx-auto text-balance">
              Vous n'êtes pas obligée·e de tout porter seule.
            </p>
          </div>
        </div>
      </div>
      <ConfideDock step="partage" />
    </Shell>
  );
}
