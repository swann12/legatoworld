import type { ReactNode } from "react";
import { StandardLayout, PageTitle, Lead, Row } from "@/components/legato/ds";
import { SectionTitle } from "./AnimalPractical";

/* Onglet « Aides » d'un espace « proche malade » (B056–B062) : rose et bleu,
   accents vert profond, jamais de corail ni de bordeaux. */

export function MaladeSheet({ back = "/practical", backLabel = "Aides", eyebrow, title, children }: { back?: string; backLabel?: string; eyebrow?: string; title: ReactNode; children: ReactNode }) {
  return (
    <StandardLayout space="practical" back={back} backLabel={backLabel} activeTab="/practical">
      {eyebrow && <p className="lg-mono pt-[30px]" style={{ color: "var(--sp-accent)" }}>{eyebrow}</p>}
      <PageTitle className={eyebrow ? "mt-4" : "pt-[30px]"}>{title}</PageTitle>
      {children}
    </StandardLayout>
  );
}

export function Numbered({ items, className = "" }: { items: string[]; className?: string }) {
  return <div className={className}>{items.map((t, i) => (
    <div key={t} className="flex gap-4 py-4" style={{ borderBottom: i < items.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
      <span className="lg-title" style={{ fontSize: 24, lineHeight: 1, color: "var(--sp-accent)" }}>{i + 1}</span><p className="text-[15px]">{t}</p>
    </div>
  ))}</div>;
}

/** B056 · Aides */
export function MaladeAides() {
  return (
    <StandardLayout space="practical" title="Aides" activeTab="/practical">
      <PageTitle className="pt-[30px]">Ce qui peut<br /><em>vous aider.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[320px]">Vos droits d'aidant, et ce qu'il vaut mieux préparer avec elle pendant qu'il est temps.</Lead>
      <SectionTitle className="mt-8">Pour vous</SectionTitle>
      <Row space="practical" n={1} title="Le congé de proche aidant" subtitle="Arrêter ou réduire votre travail" to="/practical/conge-aidant" />
      <Row space="practical" n={2} title="L'allocation journalière" subtitle="Une aide pendant ce congé" to="/practical/ajpa" />
      <Row space="practical" n={3} title="Une aide à domicile" subtitle="Pour elle, et pour vous soulager" to="/practical/aide-domicile" last />
      <SectionTitle accent={false} className="mt-10">Avec elle</SectionTitle>
      <Row space="practical" n={4} title="Ses volontés et sa personne de confiance" subtitle="À préparer ensemble, sans urgence" to="/practical/wishes" last />
    </StandardLayout>
  );
}

/** B060 · Ses volontés, pendant qu'il est temps */
export function MaladeWishes() {
  return (
    <StandardLayout space="practical" back="/practical" backLabel="Aides" activeTab="/practical">
      <PageTitle className="pt-[30px]">Ses volontés,<br /><em>pendant qu'il est temps.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[320px]">Ce n'est pas renoncer. C'est lui permettre de décider, et vous éviter d'avoir à deviner.</Lead>
      <div className="mt-6">
        <Row space="practical" n={1} title="Sa personne de confiance" subtitle="Celle que les médecins consulteront si elle ne peut plus s'exprimer" to="/practical/wishes/confiance" />
        <Row space="practical" n={2} title="Ses directives anticipées" subtitle="Ce qu'elle souhaite, ou non, pour la fin de sa vie" to="/practical/wishes/directives" />
        <Row space="practical" n={3} title="Ses souhaits pour après" subtitle="Obsèques, messages, objets" to="/practical/wishes?view=obseques" last />
      </div>
      <div className="mt-8 p-5" style={{ background: "var(--sp-block)" }}>
        <p className="text-[15px]">Vous ne savez pas comment en parler avec elle ? Legato vous propose des mots pour commencer.</p>
        <a href="/home/en-parler" className="mt-4 inline-block text-[13.5px] underline underline-offset-4" style={{ color: "var(--sp-stroke)" }}>Comment ouvrir la conversation</a>
      </div>
    </StandardLayout>
  );
}
