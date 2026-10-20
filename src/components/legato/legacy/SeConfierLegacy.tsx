import type { ReactNode } from "react";
import { StandardLayout, PageTitle, SectionLabel, PrimaryButton, OutlineButton } from "@/components/legato/ds";

/** Ancienne page « Se confier » (B-étape), hors maquette D051 : conservée en attendant accord. */
// Ligne d'écoute du deuil (Empreintes) — numéro et horaires à confirmer.
const LIGNE_DEUIL = "0142380808";

function Human({ title, subtitle, action, last }: { title: string; subtitle: string; action: ReactNode; last?: boolean }) {
  return (
    <div className="flex items-center gap-4 py-[18px]" style={{ borderBottom: last ? "none" : "1px solid var(--sp-line)" }}>
      <div className="min-w-0 flex-1">
        <p className="lg-row-title">{title}</p>
        <p className="lg-row-sub mt-1" style={{ color: "var(--sp-sub)" }}>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function SeConfierLegacy() {
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" className="mt-12">À qui voulez-vous<br /><em>parler ?</em></PageTitle>

      <section className="mt-10 p-6" style={{ background: "var(--sp-block)", color: "var(--sp-block-ink)" }}>
        <p className="lg-section">Tout de suite —</p>
        <h2 className="lg-ds-title mt-3" style={{ fontFamily: "var(--lg-serif)", fontSize: 25 }}>Présence</h2>
        <p className="mt-3 text-[14.5px] leading-[1.55]" style={{ color: "var(--sp-sub)" }}>
          Une écoute à toute heure. Intelligence artificielle : elle ne remplace ni vos proches ni un professionnel.
        </p>
        <PrimaryButton space="support" to="/presence" className="mt-6">Écrire à Présence</PrimaryButton>
      </section>

      <SectionLabel space="support" className="mt-10">Ou un humain</SectionLabel>
      <div className="mt-2">
        <Human title="Un bénévole" subtitle="Ligne d'écoute du deuil · 9 h – 21 h"
          action={<a href={`tel:${LIGNE_DEUIL}`} className="inline-flex h-9 items-center rounded-full px-5 text-[13.5px]" style={{ border: "1px solid var(--sp-stroke)", color: "var(--sp-stroke)" }}>Appeler</a>} />
        <Human title="Un groupe" subtitle="Des personnes qui vivent la même chose" action={<OutlineButton space="support" to="/care/community">Voir</OutlineButton>} />
        <Human title="Un professionnel" subtitle="Psychologue, sur rendez-vous" action={<OutlineButton space="support" to="/care/help">Chercher</OutlineButton>} last />
      </div>
    </StandardLayout>
  );
}
