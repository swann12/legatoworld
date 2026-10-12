import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSpaces, upcomingForSpaces } from "@/lib/spaces-store";
import { useActiveSpaceId } from "@/lib/active-space";
import { setDateReminder, getDateReminder } from "@/lib/today";
import { StandardLayout, PageTitle, Lead, Row, PrimaryButton } from "@/components/legato/ds";

export const Route = createFileRoute("/care/dates")({
  head: () => ({
    meta: [
      { title: "Une date difficile — Legato" },
      { name: "description", content: "Préparer un peu une date difficile, pour ne pas la passer seul." },
      { property: "og:title", content: "Une date difficile — Legato" },
      { property: "og:description", content: "Ces dates sont souvent plus dures qu'on ne l'imagine. Vous pouvez les préparer un peu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HardDate,
});

const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** 017 · Une date difficile */
function HardDate() {
  const { spaces } = useSpaces();
  const activeId = useActiveSpaceId();
  const [muted, setMuted] = useState<string[]>([]);
  const active = spaces.find((s) => s.id === activeId);
  const all = upcomingForSpaces(active ? [active] : spaces, 400);

  useEffect(() => { setMuted(all.filter((d) => getDateReminder(d.key) === "non").map((d) => d.key)); }, [all.length]);
  const d = all.find((x) => !muted.includes(x.key));

  if (!d) {
    return (
      <StandardLayout activeTab="/home" back="/agenda" backLabel="Les jours qui viennent">
        <PageTitle className="pt-8">Aucune date<br /><em>à préparer.</em></PageTitle>
        <Lead className="mt-3">Ajoutez une date importante : Legato vous aidera à ne pas la passer seul.</Lead>
        <div className="mt-8"><PrimaryButton plus to="/agenda/new">Ajouter une date</PrimaryButton></div>
      </StandardLayout>
    );
  }

  const when = `${DAYS[d.date.getDay()]} ${d.date.getDate()} ${MONTHS[d.date.getMonth()]}`;
  const away = d.daysAway === 0 ? "aujourd'hui" : d.daysAway === 1 ? "demain" : `dans ${d.daysAway} jours`;
  const tell = () => {
    const body = encodeURIComponent(`Le ${when}, c'est ${d.label.toLowerCase()} de ${d.spaceName}. J'aimerais ne pas être seul ce jour-là. Tu pourrais passer, ou m'appeler ?`);
    window.location.href = `sms:?&body=${body}`;
  };
  const letGo = () => {
    setDateReminder(d.key, "non");
    setMuted((m) => [...m, d.key]);
    toast("Legato ne vous rappellera pas cette date.");
  };

  return (
    <StandardLayout activeTab="/home" back="/agenda" backLabel="Les jours qui viennent">
      <p className="lg-mono pt-8" style={{ color: "var(--sp-ink)" }}>{when} · {away}</p>
      <PageTitle className="mt-3">{d.label}.<br /><em>Mieux vaut ne pas être seul.</em></PageTitle>
      <Lead className="mt-3">Ces dates sont souvent plus dures qu'on ne l'imagine. Vous pouvez les préparer un peu.</Lead>
      <div className="mt-6">
        <Row title="Prévenir un proche" subtitle="Lui demander de passer, ou d'appeler" onClick={tell} />
        <Row title="Prévoir un moment pour elle" subtitle="Un lieu, une musique, une bougie" to="/care/rituels" />
        <Row title="Parler à d'autres ce jour-là" subtitle="Veillée ou groupe" to="/care/community" />
        <Row title="Laisser passer la journée" subtitle="Legato ne vous le rappellera pas" onClick={letGo} last />
      </div>
    </StandardLayout>
  );
}
