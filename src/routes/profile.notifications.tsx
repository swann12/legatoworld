import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DEFAULT_NOTIFS, getNotifs, setNotifs, type NotifPrefs } from "@/lib/space-prefs";
import { StandardLayout, PageTitle, Lead, SectionLabel, ToggleRow } from "@/components/legato/ds";

export const Route = createFileRoute("/profile/notifications")({
  head: () => ({
    meta: [
      { title: "Les notifications — Legato" },
      { name: "description", content: "Legato ne vous écrit jamais après 21 h, et jamais plus d'une fois le matin." },
      { property: "og:title", content: "Les notifications — Legato" },
      { property: "og:description", content: "Choisir ce que vous recevez." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Notifications,
});

/** 024 · Notifications */
function Notifications() {
  const [p, setP] = useState<NotifPrefs>(DEFAULT_NOTIFS);
  useEffect(() => { setP(getNotifs()); }, []);
  const set = (k: keyof NotifPrefs) => (v: boolean) => { const n = { ...p, [k]: v }; setP(n); setNotifs(n); };
  return (
    <StandardLayout back="/profile" backLabel="Mon compte" activeTab="/home">
      <PageTitle className="pt-8">Les <em>notifications.</em></PageTitle>
      <Lead className="mt-3">Legato ne vous écrit jamais après 21 h, et jamais plus d'une fois le matin.</Lead>
      <SectionLabel className="mt-7">Ce que vous recevez</SectionLabel>
      <ToggleRow title="La proposition du jour" subtitle="Chaque matin à 9 h" checked={p.jour} onChange={set("jour")} />
      <ToggleRow title="Les échéances des démarches" subtitle="La veille seulement" checked={p.echeances} onChange={set("echeances")} />
      <ToggleRow title="Les messages de vos groupes" subtitle="Un résumé par jour" checked={p.groupes} onChange={set("groupes")} />
      <ToggleRow title="Les dates importantes" subtitle="Son anniversaire, un mois après" checked={p.dates} onChange={set("dates")} last />
    </StandardLayout>
  );
}
