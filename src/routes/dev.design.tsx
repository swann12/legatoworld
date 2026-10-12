import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  SPACES, SPACE_LABEL, spaceClass, type Space,
  PageHeader, PageTitle, Lead, SectionLabel, Row, ArrowRow, Tip, Block, PrimaryButton, OutlineButton, TextLink,
  Spec, Columns, SplitHeader, Boxed, OptionCard, StepBar, QuestionFooter, Field, TextArea, MoodBar, ProgressBar,
  ChatBubble, BottomNav,
} from "@/components/legato/ds";

export const Route = createFileRoute("/dev/design")({
  head: () => ({
    meta: [
      { title: "Système de design — Legato" },
      { name: "description", content: "Page de vérification interne des composants Legato." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Système de design — Legato" },
      { property: "og:description", content: "Vérification interne des composants Legato." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignPage,
});

function Variant({ space }: { space: Space }) {
  const [sel, setSel] = useState(0);
  const [mood, setMood] = useState(35);
  return (
    <section className={`${spaceClass(space)} pb-16`} style={{ background: "var(--sp-bg)", color: "var(--sp-ink)", paddingInline: "var(--lg-margin)" }}>
      <p className="lg-mono pt-10" style={{ color: "var(--sp-sub)" }}>Variante · {SPACE_LABEL[space]}</p>
      <PageHeader space={space} title={SPACE_LABEL[space]} />
      <div className="space-y-8 pt-8">
        <PageTitle space={space}>Ce qu'il reste <em>à faire.</em></PageTitle>
        <Lead space={space}>Douze souvenirs gardés. Le dernier, hier.</Lead>
        <div className="flex gap-6"><TextLink space={space}>Son portrait</TextLink><TextLink space={space}>Un livre souvenir</TextLink></div>
        <Block space={space} label="Pour aujourd'hui" title="Écrire une lettre à mon amour" meta="10 minutes · parce que vous vous sentez triste">
          <OutlineButton space={space}>Commencer à écrire</OutlineButton>
        </Block>
        <Block space={space} eyebrow="Dernier souvenir · photo" title="Le dimanche à Cassis" />
        <div>
          <SectionLabel space={space} accent>Cette semaine</SectionLabel>
          <Row space={space} n={1} title="Commander l'acte de décès" subtitle="10 min · avant vendredi 25" />
          <Row space={space} n={2} title="Prévenir la banque" subtitle="15 min · modèle de courrier prêt" />
          <ArrowRow space={space} title="Tous ses souvenirs" subtitle="Photos, voix, lettres, lieux" last />
        </div>
        <div>
          <Tip space={space} n={1}>Dormir à heures fixes, même mal.</Tip>
          <Tip space={space} n={2} last>Manger un peu, souvent.</Tip>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <PrimaryButton space={space} plus>Ajouter un souvenir</PrimaryButton>
          <OutlineButton space={space}>Mon avancement</OutlineButton>
        </div>
        <Spec space={space} items={[{ label: "Date", value: "Vendredi 25 octobre" }, { label: "Lieu", value: "Mairie du 11e" }]} />
        <Columns space={space} items={[{ label: "Écrit", value: "14" }, { label: "Lu", value: "6" }, { label: "Gardé", value: "3" }]} />
        <SplitHeader space={space} title={<>Ce qu'il reste <em>à faire.</em></>} value="3" total={8} />
        <Boxed space={space}><p className="lg-row-title">Votre espace est ouvert.</p></Boxed>
        <div className="space-y-2.5">
          {["Une personne", "Un animal", "Un proche malade"].map((l, i) => (
            <OptionCard key={l} space={space} label={l} hint={i === 0 ? "Un être aimé disparu" : undefined} selected={sel === i} onClick={() => setSel(i)} />
          ))}
        </div>
        <StepBar space={space} step={2} total={5} />
        <Field space={space} label="Son prénom" placeholder="Camille" />
        <TextArea space={space} label="Ce que vous voulez dire" placeholder="Écrivez librement…" />
        <MoodBar space={space} value={mood} onChange={setMood} />
        <ProgressBar space={space} value={3} total={8} />
        <div className="space-y-3">
          <ChatBubble space={space} from="presence">Bonsoir. Voulez-vous parler de votre journée ?</ChatBubble>
          <ChatBubble space={space} from="user">Oui, c'était difficile.</ChatBubble>
        </div>
        <QuestionFooter space={space} cta="Continuer" link="Passer cette étape" />
        <BottomNav fixed={false} night={space === "night"} active="/home" />
      </div>
    </section>
  );
}

function DesignPage() {
  return (
    <div className="mx-auto max-w-[430px]">
      {SPACES.map((s) => <Variant key={s} space={s} />)}
    </div>
  );
}
