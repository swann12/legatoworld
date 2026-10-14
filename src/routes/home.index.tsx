import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLegato, type Emotion } from "@/lib/legato-state";
import { useSpaces, upcomingForSpaces, formatDaysAway, spaceKind, type Space, type SpaceKind } from "@/lib/spaces-store";
import { getSpacePrefs } from "@/lib/space-prefs";
import { Fragment as F2 } from "react";
import { useActiveSpaceId } from "@/lib/active-space";
import { useAgenda, daysAway } from "@/lib/agenda-store";
import { getDeathDate } from "@/lib/onboarding-flow";
import { isNightHour, sinceWords } from "@/lib/today";
import { StandardLayout, Block, OutlineButton, PrimaryButton, Row, Lead } from "@/components/legato/ds";
import { getDiscovery, useDiscovery } from "@/lib/discovery";
import { useCarnet } from "@/lib/carnet";
import { upcoming, dayName, hour, cap } from "@/lib/carnet-model";
import { useSelf, prepareSummary } from "@/lib/self-space";

export const Route = createFileRoute("/home/")({
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
  const { active: discovery } = useDiscovery();
  const { lovedOneName, currentEmotions, name: localName } = useLegato();
  const { spaces } = useSpaces();
  const activeId = useActiveSpaceId();
  const { events } = useAgenda();
  const [night, setNight] = useState(false);
  const [first, setFirst] = useState("");

  useEffect(() => {
    setNight(isNightHour());
    const t = window.setInterval(() => setNight(isNightHour()), 60_000);
    if (!getDiscovery().active) supabase.auth.getUser().then(({ data }) => {
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

  const kind: SpaceKind = active ? spaceKind(active) : "deuil";
  const nightOn = night && getSpacePrefs(active?.id).nuit;

  if (nightOn) {
    return (
      <StandardLayout space="night" title="Legato" headerLeft={header} className="lg-home-screen">
        <h1 className="lg-title pt-10" style={{ fontSize: 34 }}>Bonsoir{who ? ` ${who}` : ""}.<br /><em>Le soir, seulement du repos.</em></h1>
        <Lead className="mt-3">Aucune démarche après 21 h. Elles vous attendront demain.</Lead>
        <Block space="night" className="lg-home-block" label="Pour ce soir" title="Une respiration avant de dormir" meta="5 minutes · parce que vous dormez mal ces jours-ci">
          <PrimaryButton space="night" to="/care/respirer">Commencer</PrimaryButton>
        </Block>
        <div>
          <Row space="night" title="Des sons pour s'endormir" subtitle="Pluie, mer, forêt" to="/care/sons" />
          <Row space="night" title="Écrire à Présence" subtitle="Elle répond à toute heure" to="/presence" last />
        </div>
      </StandardLayout>
    );
  }

  if (kind === "malade" && active) return <MaladeHome space={active} header={header} emotions={currentEmotions} />;
  if (kind === "questions" && active) return <SelfHome header={header} who={who} emotions={currentEmotions} />;
  if (kind !== "deuil" && active) return <KindHome kind={kind} space={active} header={header} emotions={currentEmotions} />;

  const s = suggestion(currentEmotions, loved);
  const week = events.filter((e) => e.kind === "demarche" && daysAway(e.date) >= 0 && daysAway(e.date) <= 7);
  const next = upcomingForSpaces(active ? [active] : spaces, 60)[0];

  return (
    <StandardLayout space="today" title="Legato" headerLeft={header} className="lg-home-screen">
      <h1 className="lg-title pt-8" style={{ fontSize: 34 }}>
        Bonjour{who ? ` ${who}` : ""}.{since ? ` Cela fait ${since}.` : ""} <em>Comment allez-vous</em> aujourd'hui&nbsp;?
      </h1>
      <p className="lg-home-moods" style={{ fontFamily: "var(--lg-serif)", fontSize: 21 }}>
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
      <Block className="lg-home-block" label="Pour aujourd'hui" title={s.title} meta={s.meta}>
        {discovery ? <PrimaryButton space="today" to={s.to}>{s.cta}</PrimaryButton> : <OutlineButton to={s.to} className="lg-home-action">{s.cta}</OutlineButton>}
      </Block>
      <div>
        {discovery && <Row title="Inviter un proche" subtitle="Pour partager des souvenirs" to="/start/compte-requis" />}
        <Row title="Cette semaine" to="/practical"
          subtitle={week.length ? `${week.length} démarche${week.length > 1 ? "s" : ""} à l'agenda` : "Voir ce qui reste à faire"} last={!next} />
        {next && <Row title={formatDaysAway(next.daysAway)} subtitle={`${next.label} · préparer un geste`} to="/care/dates" last />}
      </div>
    </StandardLayout>
  );
}

type Variant = {
  title: React.ReactNode; tag: string; moods: { id: Emotion | "autre"; label: string }[];
  label: string; blockTitle: React.ReactNode; meta: string; cta: string; to: string;
  rows: { title: string; subtitle: string; to: string }[];
};

function variantFor(kind: SpaceKind, space: Space): Variant {
  const name = space.name;
  if (kind === "malade") return {
    title: <>Et vous, comment allez-vous <em>aujourd'hui ?</em></>,
    tag: `Espace « ${name} » · accompagner un proche malade`,
    moods: [{ id: "anxiete", label: "Inquiet" }, { id: "fatigue", label: "Épuisé" }, { id: "soulagement", label: "Serein" }, { id: "autre", label: "Autre" }],
    label: "Pour aujourd'hui", blockTitle: <>Préparer vos questions<br />pour le médecin</>, meta: "Avant le prochain rendez-vous · 10 minutes",
    cta: "Préparer mes questions", to: "/home/questions-medecin",
    rows: [
      { title: "Ses prochains rendez-vous", subtitle: "Le carnet, à remplir ensemble", to: "/home/carnet" },
      { title: "Si vous n'en pouvez plus", subtitle: "Trouver un relais, souffler un peu", to: "/care/epuisement" },
      { title: "Parler à d'autres aidants", subtitle: "Un groupe, une ligne d'écoute", to: "/care/community" },
    ],
  };
  if (kind === "animal") {
    const atVet = space.animalBodyState === "choisir";
    const papersHidden = space.animalBodyState === "pas_maintenant";
    const left = space.animalBodyState === "fait" ? 3 : 4;
    return {
      title: <>{name} vous manque.<br /><em>C'est un vrai chagrin.</em></>,
      tag: `Espace « ${name} » · perte d'un animal`,
      moods: [{ id: "tristesse", label: "Tristesse" }, { id: "culpabilite", label: "Culpabilité" }, { id: "vide", label: "Vide" }, { id: "autre", label: "Autre" }],
      label: "Pour aujourd'hui",
      blockTitle: atVet ? "Choisir sa crémation ou son enterrement" : "Rassembler ses photos préférées",
      meta: atVet ? "10 minutes · il est encore chez le vétérinaire" : "15 minutes · pour garder sa trace",
      cta: atVet ? "Voir les possibilités" : "Commencer", to: atVet ? "/practical/animal-body" : "/care/garden",
      rows: [
        ...(papersHidden ? [] : [{ title: "Cette semaine", subtitle: `${left} démarches, rien d'urgent`, to: "/practical" }]),
        { title: "Si vous vous sentez coupable", subtitle: "C'est très fréquent, surtout après une euthanasie", to: "/care/guilt" },
        { title: "Ses affaires", subtitle: "Que garder, que donner, à votre rythme", to: "/home/ses-affaires" },
        { title: "En parler à un enfant", subtitle: "Des mots simples pour expliquer", to: "/home/parler-enfant" },
      ],
    };
  }
  return {
    title: <>Vos questions <em>sur la mort.</em></>,
    tag: "Espace personnel · sans urgence",
    moods: [{ id: "confusion", label: "Curieux" }, { id: "anxiete", label: "Inquiet" }, { id: "soulagement", label: "Serein" }, { id: "autre", label: "Autre" }],
    label: "Pour commencer", blockTitle: "Écrire vos volontés, pas à pas", meta: "20 minutes · modifiable à tout moment",
    cta: "Commencer", to: "/practical/wishes",
    rows: [
      { title: "Ce qui se passe, concrètement", subtitle: "Les étapes après un décès, expliquées", to: "/practical" },
      { title: "En parler avec ses proches", subtitle: "Comment ouvrir la conversation", to: "/home/en-parler" },
    ],
  };
}

/** 026 · 027 · 028 — /home selon le type de l'espace actif */
function KindHome({ kind, space, header, emotions, variant }: { kind: SpaceKind; space: Space; header: React.ReactNode; emotions: Emotion[]; variant?: Variant }) {
  const v = variant ?? variantFor(kind, space);
  return (
    <StandardLayout space="today" title="Legato" headerLeft={header}>
      <h1 className="lg-title pt-8" style={{ fontSize: 32 }}>{v.title}</h1>
      <p className="lg-mono mt-3">{v.tag}</p>
      <p className="mt-3" style={{ fontFamily: "var(--lg-serif)", fontSize: 21, lineHeight: 1.3 }}>
        {v.moods.map((m, i) => {
          const on = m.id !== "autre" && emotions.includes(m.id);
          return (
            <F2 key={m.id}><span className="whitespace-nowrap">
              <Link to="/care/emotions" className={on ? "underline underline-offset-4" : ""} style={{ color: on ? "var(--sp-ink)" : "var(--sp-sub)", textDecorationThickness: 1 }}>{m.label}</Link>
              {i < v.moods.length - 1 && <span style={{ color: "var(--sp-sub)" }}>,</span>}
            </span>{" "}</F2>
          );
        })}
      </p>
      <Block className="mt-7" label={v.label} title={v.blockTitle} meta={v.meta}>
        <PrimaryButton to={v.to}>{v.cta}</PrimaryButton>
      </Block>
      <div className="mt-2">
        {v.rows.map((r, i) => <Row key={r.to} title={r.title} subtitle={r.subtitle} to={r.to} last={i === v.rows.length - 1} />)}
      </div>
    </StandardLayout>
  );
}

/** B047 · Aujourd'hui pour un proche malade : le bloc et la ligne du carnet suivent le prochain rendez-vous. */
function MaladeHome({ space, header, emotions }: { space: Space; header: React.ReactNode; emotions: Emotion[] }) {
  const { rdvs } = useCarnet();
  const next = upcoming(rdvs)[0];
  const base = variantFor("malade", space);
  const v: Variant = next ? {
    ...base,
    blockTitle: <>Préparer vos questions<br />pour {doctorLabel(next.who)}</>,
    meta: `Rendez-vous ${dayName(next.date)} · 10 minutes`,
    rows: base.rows.map((r) => r.to === "/home/carnet" ? { ...r, subtitle: [cap(dayName(next.date)) + (next.time ? ` ${hour(next.time)}` : ""), next.with ? `${next.with} l'accompagne` : ""].filter(Boolean).join(" · ") } : r),
  } : base;
  return <KindHome kind="malade" space={space} header={header} emotions={emotions} variant={v} />;
}
function doctorLabel(who: string) {
  const w = who.split(",")[0].trim().toLowerCase();
  if (!w) return "le médecin";
  return /^[aeiouyéèh]/.test(w) ? `l'${w}` : `le ${w}`;
}

const SELF_MOODS: { id: Emotion | "autre"; label: string }[] = [
  { id: "anxiete", label: "Angoisse" }, { id: "confusion", label: "Curiosité" }, { id: "tristesse", label: "Tristesse" }, { id: "soulagement", label: "Apaisé" }, { id: "autre", label: "Autre" },
];

/** B072 · Aujourd'hui, espace « je pense beaucoup à la mort » — le 3114 reste accessible (§7). */
function SelfHome({ header, who, emotions }: { header: React.ReactNode; who: string; emotions: Emotion[] }) {
  const d = useSelf();
  const anxious = emotions.length === 0 || emotions.includes("anxiete");
  return (
    <StandardLayout space="today" title="Legato" headerLeft={header} className="lg-home-screen">
      <h1 className="lg-title pt-6" style={{ fontSize: 32 }}>Bonjour{who ? ` ${who}` : ""}. Qu'est-ce qui vous occupe <em>aujourd'hui ?</em></h1>
      <p className="lg-home-moods mt-[14px]" style={{ fontFamily: "var(--lg-serif)", fontSize: 20 }}>
        {SELF_MOODS.map((m, i) => {
          const on = m.id !== "autre" && emotions.includes(m.id);
          return <Fragment key={m.id}><span className="whitespace-nowrap"><Link to="/care/emotions" className={on ? "underline underline-offset-4" : ""} style={{ color: on ? "var(--sp-ink)" : "var(--sp-sub)", textDecorationThickness: 1 }}>{m.label}</Link>{i < SELF_MOODS.length - 1 && <span style={{ color: "var(--sp-sub)" }}>,</span>}</span>{" "}</Fragment>;
        })}
      </p>
      <Block className="lg-home-block mt-6" label="Pour aujourd'hui" title="Écrire ce qui vous fait peur" meta={anxious ? "10 minutes · parce que l'angoisse est là" : "10 minutes · pour y voir plus clair"}>
        <PrimaryButton to="/home/ecrire-peur">Commencer à écrire</PrimaryButton>
      </Block>
      <div>
        <Row title="Préparer" subtitle={prepareSummary(d)} to="/practical" />
        <Row title="Penser à la mort, ou penser à mourir ?" subtitle="Si les pensées deviennent trop lourdes" to="/home/penser-a-mourir" last />
      </div>
    </StandardLayout>
  );
}
