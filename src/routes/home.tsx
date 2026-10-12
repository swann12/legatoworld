import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLegato, type Emotion } from "@/lib/legato-state";
import { useSpaces, upcomingForSpaces, formatDaysAway } from "@/lib/spaces-store";
import { useActiveSpaceId } from "@/lib/active-space";
import { useAgenda, daysAway } from "@/lib/agenda-store";
import { getDeathDate } from "@/lib/onboarding-flow";
import { isNightHour, sinceWords } from "@/lib/today";
import { StandardLayout, Block, OutlineButton, PrimaryButton, Row, Lead } from "@/components/legato/ds";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Aujourd'hui — Legato" },
      { name: "description", content: "Chaque jour, une seule chose à faire, adaptée à votre humeur." },
      { property: "og:title", content: "Aujourd'hui — Legato" },
      { property: "og:description", content: "Une seule chose à faire aujourd'hui, adaptée à votre humeur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Today,
});

const MOODS: { id: Emotion | "autre"; label: string }[] = [
  { id: "tristesse", label: "Tristesse" },
  { id: "fatigue", label: "Fatigue" },
  { id: "colere", label: "Colère" },
  { id: "nostalgie", label: "Nostalgie" },
  { id: "autre", label: "Autre" },
];

/** Une seule proposition, choisie selon l'humeur déclarée. */
function suggestion(emotions: Emotion[], loved: string) {
  const who = loved || "elle";
  if (emotions.includes("fatigue")) return { title: "Une respiration de trois minutes", meta: "3 minutes · parce que vous vous sentez fatigué", cta: "Respirer", to: "/care/respirer" };
  if (emotions.includes("colere")) return { title: "Écrire ce qui vous met en colère", meta: "10 minutes · parce que vous vous sentez en colère", cta: "Commencer à écrire", to: "/care/journal" };
  if (emotions.includes("nostalgie")) return { title: `Déposer un souvenir de ${who}`, meta: "5 minutes · parce que vous pensez à elle", cta: "Ouvrir la mémoire", to: "/care/garden" };
  return { title: `Écrire une lettre à ${who}`, meta: "10 minutes · parce que vous vous sentez triste", cta: "Commencer à écrire", to: "/care/journal" };
}

function Today() {
  const { lovedOneName, currentEmotions, name: localName } = useLegato();
  const { spaces } = useSpaces();
  const activeId = useActiveSpaceId();
  const { events } = useAgenda();
  const [night, setNight] = useState(false);
  const [first, setFirst] = useState("");

  useEffect(() => {
    setNight(isNightHour());
    const t = window.setInterval(() => setNight(isNightHour()), 60_000);
    supabase.auth.getUser().then(({ data }) => {
      const n = (data.user?.user_metadata?.display_name as string | undefined) ?? "";
      if (n && !n.includes("@")) setFirst(n.split(" ")[0]);
    });
    return () => window.clearInterval(t);
  }, []);

  const active = spaces.find((s) => s.id === activeId) ?? spaces.find((s) => !s.archived);
  const loved = (active?.name ?? lovedOneName).trim();
  const initial = (loved || "L").charAt(0).toUpperCase();
  const who = first || localName.trim();
  const since = sinceWords(active?.deathDate ?? getDeathDate());

  const header = (
    <Link to="/space" aria-label="Vos espaces" className="grid size-8 place-items-center rounded-full"
      style={{ border: "1px solid currentColor", fontFamily: "var(--lg-serif)", fontSize: 16 }}>{initial}</Link>
  );

  if (night) {
    return (
      <StandardLayout space="night" title="Legato" headerLeft={header}>
        <h1 className="lg-title pt-10" style={{ fontSize: 34 }}>Bonsoir{who ? ` ${who}` : ""}.<br /><em>Le soir, seulement du repos.</em></h1>
        <Lead className="mt-3">Aucune démarche après 21 h. Elles vous attendront demain.</Lead>
        <Block space="night" className="mt-8" label="Pour ce soir" title="Une respiration avant de dormir" meta="5 minutes · pour laisser la journée se poser">
          <PrimaryButton space="night" to="/care/respirer">Commencer</PrimaryButton>
        </Block>
        <div className="mt-4">
          <Row space="night" title="Des sons pour s'endormir" subtitle="Pluie, mer, forêt" to="/care/respirer" />
          <Row space="night" title="Écrire à Présence" subtitle="Elle répond à toute heure" to="/presence" last />
        </div>
      </StandardLayout>
    );
  }

  const s = suggestion(currentEmotions, loved);
  const week = events.filter((e) => e.kind === "demarche" && daysAway(e.date) >= 0 && daysAway(e.date) <= 7);
  const next = upcomingForSpaces(active ? [active] : spaces, 60)[0];

  return (
    <StandardLayout space="today" title="Legato" headerLeft={header}>
      <h1 className="lg-title pt-8" style={{ fontSize: 34 }}>
        Bonjour{who ? ` ${who}` : ""}.{since ? ` Cela fait ${since}.` : ""} <em>Comment allez-vous</em> aujourd'hui&nbsp;?
      </h1>
      <p className="mt-4" style={{ fontFamily: "var(--lg-serif)", fontSize: 21, lineHeight: 1.3 }}>
        {MOODS.map((m, i) => {
          const on = m.id !== "autre" && currentEmotions.includes(m.id);
          return (
            <Fragment key={m.id}><span className="whitespace-nowrap">
              <Link to="/care/emotions" className={on ? "underline underline-offset-4" : ""} style={{ color: on ? "var(--sp-ink)" : "var(--sp-sub)", textDecorationThickness: 1 }}>{m.label}</Link>
              {i < MOODS.length - 1 && <span style={{ color: "var(--sp-sub)" }}>,</span>}
            </span>{" "}</Fragment>
          );
        })}
      </p>
      <Block className="mt-8" label="Pour aujourd'hui" title={s.title} meta={s.meta}>
        <OutlineButton to={s.to} className="h-12 px-6 text-[15px]">{s.cta}</OutlineButton>
      </Block>
      <div className="mt-2">
        <Row title="Cette semaine" to="/practical"
          subtitle={week.length ? `${week.length} démarche${week.length > 1 ? "s" : ""} à l'agenda` : "Voir ce qui reste à faire"} last={!next} />
        {next && <Row title={formatDaysAway(next.daysAway)} subtitle={`${next.label} · préparer un geste`} to="/care/dates" last />}
      </div>
    </StandardLayout>
  );
}
