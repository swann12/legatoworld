import type { ReactNode } from "react";
import { StandardLayout, PageTitle, Lead, SectionLabel, Tip, Row, PrimaryButton, TextLink } from "@/components/legato/ds";

/** Écrans 049–053 : un sujet du corps = trois conseils numérotés + exercice guidé + contenus. */
export type CorpsSujet = "nuits" | "manger" | "eau" | "habiller";

type Content = { tag: string; title: string; meta: string; to: string };
type Topic = {
  label: string; title: [string, string]; lead: string; tips: [string, string, string];
  contenus: { lead: string; items: Content[] };
};

export const CORPS: Record<CorpsSujet, Topic> = {
  nuits: {
    label: "Dormir", title: ["Quand le sommeil", "ne vient pas."],
    lead: "Mal dormir est très fréquent les premières semaines. Ce n'est pas un échec.",
    tips: [
      "Gardez la même heure de lever, même après une mauvaise nuit.",
      "Pas de sommeil après vingt minutes ? Levez-vous un moment, puis revenez.",
      "Si cela dure plus de deux semaines, parlez-en à votre médecin.",
    ],
    contenus: {
      lead: "Des contenus choisis pour les nuits difficiles. Prenez seulement ce qui vous fait du bien.",
      items: [
        { tag: "Écouter", title: "Des sons pour s'endormir", meta: "Pluie, mer, forêt · 20 à 45 minutes", to: "/care/sons" },
        { tag: "Lire", title: "Pourquoi le chagrin empêche de dormir", meta: "Article · 5 minutes", to: "/library/lire/chagrin-sommeil" },
        { tag: "En parler", title: "Groupe « Les nuits difficiles »", meta: "120 membres · modéré", to: "/care/community/nuits" },
      ],
    },
  },
  manger: {
    label: "Manger", title: ["Manger,", "même un peu."],
    lead: "L'appétit disparaît souvent avec le chagrin.",
    tips: [
      "Mangez peu mais souvent : une soupe, un yaourt, une banane.",
      "Gardez près de vous des aliments qui ne demandent aucune préparation.",
      "Si vous ne mangez presque plus depuis plusieurs jours, consultez votre médecin.",
    ],
    contenus: {
      lead: "Des contenus choisis pour les jours sans faim. Prenez seulement ce qui vous fait du bien.",
      items: [
        { tag: "Écouter", title: "Un moment de calme avant de manger", meta: "Respirer · 3 minutes", to: "/care/respirer" },
        { tag: "Lire", title: "Quand le chagrin coupe l'appétit", meta: "Article · 4 minutes", to: "/library/lire/chagrin-appetit" },
        { tag: "En parler", title: "Groupe « Les premiers mois »", meta: "2 640 membres · modéré", to: "/care/community/premiers-mois" },
      ],
    },
  },
  eau: {
    label: "Se laver", title: ["Se laver,", "un geste à la fois."],
    lead: "Une douche peut sembler impossible. On peut commencer beaucoup plus petit.",
    tips: [
      "De l'eau sur le visage et les mains, c'est déjà prendre soin de soi.",
      "Préparez une serviette et des vêtements propres avant d'entrer.",
      "Une douche de deux minutes compte autant qu'une longue.",
    ],
    contenus: {
      lead: "Des contenus choisis pour les jours où tout coûte. Prenez seulement ce qui vous fait du bien.",
      items: [
        { tag: "Écouter", title: "Le bruit de la pluie", meta: "Pluie · 20 minutes", to: "/care/sons" },
        { tag: "Lire", title: "Les petits gestes qui comptent", meta: "Article · 4 minutes", to: "/library/lire/petits-gestes" },
        { tag: "En parler", title: "Groupe « Les premiers mois »", meta: "2 640 membres · modéré", to: "/care/community/premiers-mois" },
      ],
    },
  },
  habiller: {
    label: "S'habiller", title: ["S'habiller,", "sans y penser."],
    lead: "Choisir des vêtements demande de l'énergie. On peut s'en épargner une partie.",
    tips: [
      "Préparez vos vêtements la veille au soir.",
      "Choisissez ce qui est confortable, pas ce qui est beau.",
      "Sortez cinq minutes, même avec un manteau sur le pyjama.",
    ],
    contenus: {
      lead: "Des contenus choisis pour les matins difficiles. Prenez seulement ce qui vous fait du bien.",
      items: [
        { tag: "Écouter", title: "Trois minutes pour se lever", meta: "Respirer · 3 minutes", to: "/care/respirer" },
        { tag: "Lire", title: "Les petits gestes qui comptent", meta: "Article · 4 minutes", to: "/library/lire/petits-gestes" },
        { tag: "En parler", title: "Groupe « Les premiers mois »", meta: "2 640 membres · modéré", to: "/care/community/premiers-mois" },
      ],
    },
  },
};

export const isSujet = (s: string): s is CorpsSujet => s in CORPS;

function Title({ t }: { t: [string, string] }) {
  return <PageTitle space="support" className="pt-8">{t[0]}<br /><em>{t[1]}</em></PageTitle>;
}

export function CorpsTopic({ sujet }: { sujet: CorpsSujet }) {
  const t = CORPS[sujet];
  return (
    <StandardLayout space="support" back="/help/corps" backLabel="Le corps" activeTab="/care">
      <Title t={t.title} />
      <Lead space="support" className="mt-4">{t.lead}</Lead>
      <SectionLabel space="support" className="mt-10">Ce qui aide</SectionLabel>
      <div className="mt-2">
        {t.tips.map((tip, i) => <Tip key={i} space="support" n={i + 1} last={i === 2}>{tip}</Tip>)}
      </div>
      <div className="mt-10 flex flex-col items-start gap-6">
        <PrimaryButton space="support" to={`/help/corps/soin/${sujet}`}>Faire l'exercice guidé</PrimaryButton>
        <TextLink space="support" to={`/help/corps/${sujet}/contenus`}>Écouter, lire, en parler</TextLink>
      </div>
    </StandardLayout>
  );
}

export function CorpsContenus({ sujet }: { sujet: CorpsSujet }) {
  const t = CORPS[sujet];
  return (
    <StandardLayout space="support" back={`/help/corps/${sujet}`} backLabel={t.label} activeTab="/care">
      <Title t={[`${t.label} :`, "écouter, lire, en parler."]} />
      <Lead space="support" className="mt-4">{t.contenus.lead}</Lead>
      <div className="mt-8">
        {t.contenus.items.map((c, i) => (
          <Row key={c.tag} space="support" to={c.to} last={i === t.contenus.items.length - 1}
            title={<><span className="lg-mono mb-2 block" style={{ color: "var(--sp-ink)" }}>{c.tag.toUpperCase()}</span>{c.title}</>}
            subtitle={c.meta} />
        ))}
      </div>
    </StandardLayout>
  );
}

export function CorpsList({ children }: { children: ReactNode }) {
  return <div className="mt-8">{children}</div>;
}
