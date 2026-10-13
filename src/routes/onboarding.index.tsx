import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useLegato, type PrimaryNeed, type Stage } from "@/lib/legato-state";
import { recordEmotion } from "@/lib/emotional.functions";
import { supabase } from "@/integrations/supabase/client";
import { useSpaces } from "@/lib/spaces-store";
import { setActiveSpaceId } from "@/lib/active-space";
import { kindForWhom } from "@/lib/space-navigation";
import {
  TOTAL_STEPS, getDeathDate, getForWhom, getNeeds, getPapers, setDeathDate, setForWhom,
  setNeeds, setPapers, showsName, showsPapers, getAnimalBodyState, type ForWhom,
} from "@/lib/onboarding-flow";
import { Field, Lead, OptionCard, PageTitle, QuestionFooter, QuestionLayout, StepBar, PrimaryButton } from "@/components/legato/ds";

type Search = { etape?: "prenom" | "pret" };

export const Route = createFileRoute("/onboarding/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    etape: s.etape === "prenom" || s.etape === "pret" ? s.etape : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Créer votre espace — Legato" },
      { name: "description", content: "Quatre questions pour créer votre espace Legato." },
      { property: "og:title", content: "Créer votre espace — Legato" },
      { property: "og:description", content: "Quatre questions courtes pour adapter Legato à votre situation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Onboarding,
});

const FOR_WHOM: { id: ForWhom; label: string; hint: string }[] = [
  { id: "personne", label: "Une personne qui est décédée", hint: "Soutien, démarches, mémoire" },
  { id: "animal", label: "Un animal qui est mort", hint: "Soutien et mémoire" },
  { id: "malade", label: "Un proche gravement malade", hint: "L'accompagner et prendre soin de vous" },
  { id: "moi", label: "Moi : je pense souvent à la mort", hint: "Comprendre, préparer, transmettre" },
];

function Onboarding() {
  const { etape } = Route.useSearch();
  if (etape === "pret") return <Ready />;
  if (etape === "prenom") return <NameStep />;
  return <ForWhomStep />;
}

/** 006 · 1 · Pour qui */
function ForWhomStep() {
  const navigate = useNavigate();
  const { hydrated, setSituation, setLovedOneRelation, setStage } = useLegato();
  const [choice, setChoice] = useState<ForWhom | null>(null);
  useEffect(() => { if (hydrated) { const v = getForWhom(); if (v) setChoice(v); } }, [hydrated]);

  const next = () => {
    if (!choice) return;
    setForWhom(choice);
    setSituation(choice === "malade" ? "accompagner" : choice === "moi" ? "questionnement" : "perdu");
    setLovedOneRelation(choice === "animal" ? "animal" : null);
    setStage(null);
    if (showsName(choice)) navigate({ to: "/onboarding", search: { etape: "prenom" } });
    else navigate({ to: "/onboarding/care" });
  };

  return (
    <QuestionLayout step={1} total={TOTAL_STEPS} footer={<QuestionFooter cta="Continuer" onCta={next} ctaDisabled={!choice} />}>
      <PageTitle size={30}>Pour qui créez-vous<br /><em>cet espace ?</em></PageTitle>
      <Lead className="mt-3">Choisissez la situation la plus proche. Vous pourrez créer d'autres espaces plus tard.</Lead>
      <div className="mt-6 flex flex-col gap-[10px]">
        {FOR_WHOM.map((o) => (
          <OptionCard key={o.id} label={o.label} hint={o.hint} selected={choice === o.id} onClick={() => setChoice(o.id)} />
        ))}
      </div>
    </QuestionLayout>
  );
}

/** 007 · 2 · Son prénom */
function NameStep() {
  const navigate = useNavigate();
  const { hydrated, lovedOneName, setLovedOneName, lovedOther, setLovedOther, lovedOneRelation, setLovedOneRelation, setPracticalContext } = useLegato();
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    if (!hydrated) return;
    setName(lovedOneName.trim());
    setLink(lovedOther);
    setDate(getDeathDate() ?? "");
  }, [hydrated]);

  const goOn = () => navigate({ to: showsPapers(getForWhom()) ? "/onboarding/practical" : "/onboarding/care" });
  const save = () => {
    setLovedOneName(name.trim());
    setLovedOther(link.trim());
    if (link.trim() && lovedOneRelation !== "animal") setLovedOneRelation("autre");
    setDeathDate(date);
    setPracticalContext({ deathDate: date || null });
    goOn();
  };

  return (
    <QuestionLayout step={2} total={TOTAL_STEPS} footer={<QuestionFooter cta="Continuer" onCta={save} ctaDisabled={!name.trim()} link="Passer cette étape" onLink={goOn} />}>
      <PageTitle size={30}>Comment voulez-vous<br /><em>l'appeler ?</em></PageTitle>
      <Lead className="mt-3">Legato utilisera ce nom pour vous parler d'elle. Personne d'autre ne le verra.</Lead>
      <Field className="mt-7" label="Son prénom, ou le nom que vous lui donnez" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mon amour" />
      <Field className="mt-5" label="Votre lien avec elle" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Mon épouse" />
      <Field className="mt-5" label="Date du décès · facultatif" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
    </QuestionLayout>
  );
}

/** 010 · C'est prêt */
function Ready() {
  const navigate = useNavigate();
  const legato = useLegato();
  const { spaces, addSpace, updateSpace } = useSpaces();
  const record = useServerFn(recordEmotion);
  const [answers, setAnswers] = useState<{ who: ForWhom | null; needs: ReturnType<typeof getNeeds>; papers: ReturnType<typeof getPapers>; date: string | null }>({ who: null, needs: [], papers: null, date: null });
  useEffect(() => { setAnswers({ who: getForWhom(), needs: getNeeds(), papers: getPapers(), date: getDeathDate() }); }, []);
  const forWhom = answers.who;
  const name = forWhom === "moi" ? "vous" : legato.lovedOneName.trim() || "votre proche";
  const initial = (forWhom === "moi" ? legato.name : legato.lovedOneName).trim().charAt(0).toUpperCase() || "L";

  const open = async () => {
    const needs = getNeeds();
    const papers = getPapers();
    // Besoin principal déduit des choix multiples
    const practical = needs.includes("demarches");
    const others = needs.some((n) => n !== "demarches");
    const primary: PrimaryNeed = needs.length === 0 || (practical && others) ? "both" : practical ? "practical" : "emotional";
    legato.setPrimaryNeed(primary);
    const stage: Stage | null =
      papers === "rien" ? "nouvelle" : papers === "obseques" ? "obseques_passees" : papers === "presque" ? "apres" : papers === "delegue" ? "demarches" : forWhom === "moi" ? "indecis" : null;
    legato.setStage(stage);
    if (papers === "delegue") legato.setLegallyInvolved(false);
    else if (papers) legato.setLegallyInvolved(true);
    legato.setCareOnboarded(true);
    legato.setPracticalOnboarded(true);

    // Création de l'espace de la personne, qui devient l'espace actif
    const kind = kindForWhom(forWhom);
    {
      const spaceName = forWhom === "moi" ? "Questions sur la mort" : legato.lovedOneName.trim() || "Mon proche";
      // L'espace a pu être amorcé automatiquement à partir du prénom : on le complète plutôt que de le doubler.
      const existing = spaces.find((s) => !s.archived && s.name === spaceName);
      if (existing) {
        updateSpace(existing.id, { kind, relation: legato.lovedOneRelation, deathDate: getDeathDate(), animalBodyState: forWhom === "animal" ? getAnimalBodyState() ?? undefined : undefined });
        setActiveSpaceId(existing.id);
      } else {
        const space = addSpace({ name: spaceName, kind, relation: legato.lovedOneRelation, deathDate: getDeathDate(), animalBodyState: forWhom === "animal" ? getAnimalBodyState() ?? undefined : undefined });
        setActiveSpaceId(space.id);
      }
    }

    const { data } = await supabase.auth.getSession();
    if (data.session) {
      record({ data: { source: "onboarding", tags: ["accueil", forWhom ?? "inconnu", ...needs], note: `Espace : ${name}` } }).catch(() => {});
    }
    navigate({ to: "/home" });
  };

  const items = [
    "Chaque matin à 9 h, Legato vous propose une seule chose à faire. Vous pouvez l'ignorer.",
    "Après 21 h, l'application passe en mode nuit : seulement du repos, aucune démarche.",
    "Rien n'est partagé avec vos proches sans votre accord.",
  ];

  const needsLabel = { tenir: "Tenir le coup", demarches: "les démarches", parler: "Parler à quelqu'un", memoire: "Garder sa mémoire" };
  const date = answers.date ? new Date(`${answers.date}T12:00:00`) : null;
  const dateLabel = date && !Number.isNaN(date.getTime()) ? `le ${date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}` : "À préciser";
  const summary = forWhom === "moi" ? [
    { label: "Pour", value: "Vous" },
    { label: "En premier", value: answers.needs.map(n => needsLabel[n]).join(", ") || "À votre rythme" },
    { label: "Ensuite", value: "Préparer, pour vos proches" },
  ] : [
    { label: "Pour", value: `${name}${legato.lovedOther.trim() ? `, ${legato.lovedOther.trim()}` : ""}` },
    { label: forWhom === "malade" ? "Aujourd'hui" : "Depuis", value: forWhom === "malade" ? "Accompagner un proche malade" : dateLabel },
    { label: "En premier", value: answers.needs.map(n => needsLabel[n]).join(", ") || "À votre rythme" },
  ];
  const title = forWhom === "moi" ? "Votre espace" : forWhom === "malade" ? `L'espace pour ${name}` : `L'espace ${/^[aeiouyàâéèêëîïôùûü]/i.test(name) ? "d'" : "de "}${name}`;
  const columns = forWhom === "animal" ? [
    { label: "Chaque matin", value: "Une seule chose à faire" }, { label: "Les papiers", value: "Dans l'ordre" }, { label: "Sa mémoire", value: "Photos et souvenirs" },
  ] : forWhom === "malade" ? [
    { label: "Chaque matin", value: "Pour elle ou pour vous" }, { label: "Le carnet", value: "Ses rendez-vous" }, { label: "Vos droits", value: "Expliqués simplement" },
  ] : forWhom === "moi" ? [
    { label: "L'angoisse", value: "Des repères simples" }, { label: "Préparer", value: "À votre rythme" }, { label: "Transmettre", value: "Lettres, voix, histoire" },
  ] : [
    { label: "Chaque matin", value: "Une seule chose à faire" }, { label: "Après 21 h", value: "Seulement du repos" }, { label: "Vos proches", value: "Rien sans votre accord" },
  ];

  return (
    <main className={`lg-space-today min-h-dvh ${forWhom === "moi" ? "lg-journey-questions" : ""}`} style={{ background: "var(--sp-bg)", color: "var(--sp-ink)", fontFamily: "var(--lg-sans)" }}>
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-7 pt-[30px] pb-[34px]">
        <StepBar step={TOTAL_STEPS} total={TOTAL_STEPS} />
        <div className="mt-14 flex items-center gap-4">
          <span className="grid size-[46px] shrink-0 place-items-center rounded-full" style={{ background: "var(--lg-linen)", fontFamily: "var(--lg-serif)", fontSize: 23 }}>{initial}</span>
          <p className="lg-mono">Votre espace est prêt</p>
        </div>
        <PageTitle size={34} className="mt-[22px]">{title}<br /><em>vous attend.</em></PageTitle>
        <Lead className="mt-[14px]">Voici ce que vous avez choisi. Tout se modifie ensuite dans les réglages de l'espace.</Lead>
        <dl className="lg-ready-summary mt-[34px]">{summary.map(s => <div key={s.label}><dt className="lg-mono">{s.label}</dt><dd>{s.value}</dd></div>)}</dl>
        <div className="lg-ready-columns mt-[34px]">
          {columns.map(c => <div key={c.label}><p className="lg-mono">{c.label}</p><p>{c.value}</p></div>)}
        </div>
        <div className="min-h-8 flex-1" />
        <PrimaryButton full onClick={() => void open()}>Ouvrir {forWhom === "moi" ? "mon espace" : title.charAt(0).toLowerCase() + title.slice(1)}</PrimaryButton>
        <details className="mt-4 text-[12px]" style={{ color: "var(--sp-sub)" }}><summary>À propos de votre rythme</summary><ol className="mt-3 space-y-2">{items.map((t, i) => <li key={t}>{i + 1}. {t}</li>)}</ol></details>
      </div>
    </main>
  );
}
