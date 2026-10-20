import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Row } from "@/components/legato/ds";
import { SearchRow } from "@/components/legato/SoutienUI";
import { ConfirmedCall } from "@/components/legato/ActionFeedback";
import { legatoHead } from "@/lib/legato-head";

/** D054 · so-psy : parler à quelqu'un */
export const Route = createFileRoute("/care/parler/")({
  head: () => legatoHead("Parler à quelqu'un", "Médecin traitant, psychologue remboursé, groupe de parole ou Présence."),
  component: Parler,
});

function Parler() {
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" size={36} className="pt-[22px]">Parler<br /><em>à quelqu'un.</em></PageTitle>
      <Lead className="mt-2 max-w-[310px]">Selon ce que vous cherchez. Il n'y a pas de mauvais choix.</Lead>
      <div className="pt-3">
        <SearchRow title="Votre médecin traitant" subtitle="le premier à voir si vous dormez ou mangez mal" to="/partage/message"
          search={{ destinataires: "Mon médecin", texte: "« Bonjour, je traverse un deuil et je dors ou mange mal depuis quelque temps. Je souhaiterais prendre rendez-vous pour en parler. Merci. »" }} />
        <Row space="support" title="Un psychologue, remboursé" subtitle="12 séances par an, sans ordonnance" to="/care/parler/psychologue" />
        <Row space="support" title="Un groupe de parole" subtitle="avec d'autres personnes en deuil" to="/care/community/groups" />
        <Row space="support" title="Présence, à toute heure" subtitle="une intelligence artificielle, pas une personne" to="/presence" last />
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 p-[18px]" style={{ background: "var(--lg-bordeaux)", color: "var(--lg-blush)" }}>
        <p className="text-[14px] leading-[1.45]">Des idées de mort ? Appelez le 3114, gratuit, jour et nuit.</p>
        <ConfirmedCall href="tel:3114" number="3114" label="3114" subtitle="Gratuit, jour et nuit."
          className="inline-flex h-10 shrink-0 items-center rounded-full px-5 text-[15px]"
          style={{ border: "1px solid var(--lg-blush)", color: "var(--lg-blush)" }} />
      </div>

      {/* Hors maquette D054 : repris de l'ancienne page « Se confier », replié en attendant votre accord. */}
      <details className="mt-8">
        <summary className="lg-mono cursor-pointer py-3" style={{ color: "var(--sp-sub)" }}>Autres façons de se confier</summary>
        <div className="flex items-center gap-4 py-[18px]">
          <div className="min-w-0 flex-1">
            <p className="lg-row-title">Un bénévole</p>
            <p className="lg-row-sub mt-1" style={{ color: "var(--sp-sub)" }}>Ligne d'écoute du deuil · 9 h – 21 h</p>
          </div>
          <ConfirmedCall href="tel:0142380808" number="01 42 38 08 08" label="Appeler" subtitle="Ligne d'écoute du deuil."
            className="inline-flex h-9 items-center rounded-full px-5 text-[13.5px]" style={{ border: "1px solid var(--sp-stroke)", color: "var(--sp-stroke)" }} />
        </div>
      </details>
    </StandardLayout>
  );
}
