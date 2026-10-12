import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StandardLayout, PageTitle, Lead, Row } from "@/components/legato/ds";
import { loadPractical } from "@/lib/practical-store";

export const Route = createFileRoute("/practical/share")({
  head: () => ({
    meta: [
      { title: "Envoyer vos choix — Legato" },
      { name: "description", content: "Un message clair pour les pompes funèbres, l'officiant, le fleuriste et vos proches. Vous relisez avant d'envoyer." },
      { property: "og:title", content: "Envoyer vos choix — Legato" },
      { property: "og:description", content: "Envoyer vos choix aux bonnes personnes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ShareLayout,
});

const KEY = "legato.share.sent.v1";
const RELAY = [
  { id: "pf", who: "Pompes funèbres", sub: "Vos choix, pour préparer le devis", intro: "Voici nos choix pour préparer le devis :" },
  { id: "officiant", who: "Officiant", sub: "Le déroulé et les textes", intro: "Voici le déroulé et les textes que nous avons choisis :" },
  { id: "fleuriste", who: "Fleuriste", sub: "La proposition de fleurs", intro: "Voici la proposition de fleurs :" },
  { id: "proches", who: "Vos proches", sub: "La date, le lieu, le déroulé", intro: "Voici la date, le lieu et le déroulé de la cérémonie :" },
];

function buildMail(who: string, intro: string) {
  const s = loadPractical();
  const lines = [
    "Bonjour,", "", intro, "",
    s.ceremonyKind && `• Type : ${s.ceremonyKind}`,
    s.ceremonyVenue && `• Lieu : ${s.ceremonyVenue}`,
    s.flowerStyle && `• Fleurs : ${s.flowerStyle}`,
    s.selectedTexts.length > 0 && `• Textes : ${s.selectedTexts.join(", ")}`,
    s.selectedMusic.length > 0 && `• Musique : ${s.selectedMusic.join(", ")}`,
    s.budget && `• Budget indicatif : ${s.budget}`,
    "", "Merci,",
  ].filter((l) => l !== false && l !== "" || l === "").join("\n");
  return `mailto:?subject=${encodeURIComponent(`Cérémonie — ${who}`)}&body=${encodeURIComponent(lines)}`;
}

function ShareLayout() {
  const match = useMatchRoute();
  if (match({ to: "/practical/share/$taskId" })) return <Outlet />;
  return <Share />;
}

function Share() {
  const [sent, setSent] = useState<string[]>(["pf"]);
  useEffect(() => { try { const v = localStorage.getItem(KEY); if (v) setSent(JSON.parse(v)); } catch { /* rien */ } }, []);
  const mark = (id: string) => {
    const next = Array.from(new Set([...sent, id])); setSent(next); localStorage.setItem(KEY, JSON.stringify(next));
  };

  return (
    <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
      <PageTitle space="practical" className="pt-8">Envoyer vos choix<br /><em>aux bonnes personnes.</em></PageTitle>
      <Lead space="practical" className="mt-4">Legato prépare un message clair pour chacun, avec vos choix en pièce jointe. Vous relisez avant d'envoyer.</Lead>
      <div className="mt-8">
        {RELAY.map((r, i) => {
          const done = sent.includes(r.id);
          const last = i === RELAY.length - 1;
          return done ? (
            <a key={r.id} href={buildMail(r.who, r.intro)} className="flex items-center gap-4 py-[18px]" style={{ borderBottom: last ? "none" : "1px solid var(--sp-line)" }}>
              <span className="flex-1">
                <span className="lg-row-title block">{r.who}</span>
                <span className="lg-row-sub mt-1 block" style={{ color: "var(--sp-sub)" }}>{r.sub}</span>
              </span>
              <span className="lg-mono" style={{ color: "var(--sp-accent)" }}>Envoyé</span>
            </a>
          ) : (
            <a key={r.id} href={buildMail(r.who, r.intro)} onClick={() => mark(r.id)} className="block">
              <Row space="practical" title={r.who} subtitle={r.sub} last={last} onClick={() => undefined} />
            </a>
          );
        })}
      </div>
    </StandardLayout>
  );
}
