import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, SectionLabel, OutlineButton } from "@/components/legato/ds";
import { clearPresenceHistory } from "@/lib/presence-history";

export const Route = createFileRoute("/presence/about")({
  head: () => ({
    meta: [
      { title: "Ce que Présence peut faire — Legato" },
      { name: "description", content: "Ce que Présence, l'écoute par intelligence artificielle de Legato, peut faire ou non." },
      { property: "og:title", content: "Ce que Présence peut faire — Legato" },
      { property: "og:description", content: "Elle écoute et oriente. Elle ne remplace ni un proche ni un professionnel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

const para = { fontFamily: "var(--lg-serif)", fontSize: 21, lineHeight: 1.3 } as const;

function About() {
  const [done, setDone] = useState(false);
  return (
    <StandardLayout space="support" back="/presence" backLabel="Présence" activeTab="/care">
      <PageTitle space="support" className="mt-12">Ce que Présence<br /><em>peut faire, ou non.</em></PageTitle>
      <SectionLabel space="support" className="mt-10">Elle peut</SectionLabel>
      <p className="mt-3" style={para}>Vous écouter à toute heure, vous aider à mettre des mots, expliquer un courrier, vous proposer des fleurs ou des textes, vous orienter.</p>
      <SectionLabel space="support" className="mt-9">Elle ne peut pas</SectionLabel>
      <p className="mt-3" style={para}>Remplacer un proche, un médecin ou un psychologue. En cas d'urgence, elle vous donnera toujours les bons numéros.</p>
      <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--sp-line)" }}>
        <p className="text-[14px] leading-[1.55]" style={{ color: "var(--sp-sub)" }}>Vos échanges restent privés et vous pouvez les effacer à tout moment.</p>
        <OutlineButton space="support" className="mt-5" disabled={done}
          onClick={() => { if (confirm("Effacer toutes vos conversations avec Présence ?")) { clearPresenceHistory(); setDone(true); } }}>
          {done ? "Conversations effacées" : "Effacer mes conversations"}
        </OutlineButton>
      </div>
    </StandardLayout>
  );
}
