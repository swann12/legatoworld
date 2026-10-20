import { useState } from "react";
import { StandardLayout, PageTitle, SectionLabel, OutlineButton } from "@/components/legato/ds";
import { clearPresenceHistory } from "@/lib/presence-history";

const line = { fontFamily: "var(--lg-serif)", fontSize: 20, lineHeight: 1.25 } as const;
const CAN = ["Vous écouter, à toute heure.", "Vous ouvrir la bonne page, au bon moment.", "Préparer un courrier ou un message avec vos informations.", "Créer un rappel, ou demander de l'aide à vos proches."];
const CANNOT = ["Remplacer un médecin, un psychologue ou un notaire.", "Répondre à une question pratique sans source : elle vous le dit.", "Décider ou envoyer quoi que ce soit sans votre accord."];

/** D122 · p-capacites : ce que Présence peut faire. */
export function PresenceInfos() {
  const [done, setDone] = useState(false);
  const List = ({ items }: { items: string[] }) => (
    <ul className="mt-2">{items.map((t, i) => <li key={t} className="py-[13px]" style={{ ...line, borderBottom: i < items.length - 1 ? "1px solid var(--sp-line)" : "none" }}>{t}</li>)}</ul>
  );
  return (
    <StandardLayout space="support" back="/presence" backLabel="Présence" activeTab="/care">
      <PageTitle className="pt-6">Ce que Présence<br /><em>peut faire.</em></PageTitle>
      <SectionLabel className="mt-8">Elle peut</SectionLabel>
      <List items={CAN} />
      <SectionLabel className="mt-8">Elle ne fait pas</SectionLabel>
      <List items={CANNOT} />
      {/* Hors maquette, demandé par 04-PRESENCE §6 : conversations effaçables. */}
      <div className="mt-8 pt-5" style={{ borderTop: "1px solid var(--sp-line)" }}>
        <p className="text-[13px] leading-[1.55]" style={{ color: "var(--sp-sub)" }}>Vos échanges restent sur ce téléphone.</p>
        <OutlineButton className="mt-4" disabled={done} onClick={() => { if (confirm("Effacer toutes vos conversations avec Présence ?")) { clearPresenceHistory(); setDone(true); } }}>
          {done ? "Conversations effacées" : "Effacer mes conversations"}
        </OutlineButton>
      </div>
    </StandardLayout>
  );
}
