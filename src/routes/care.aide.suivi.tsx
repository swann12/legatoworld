import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, PrimaryButton, TextLink } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";
import { joinNames, useSoutien } from "@/lib/soutien";

/** D053 · so-aide-suivi : qui s'occupe de quoi */
export const Route = createFileRoute("/care/aide/suivi")({
  head: () => legatoHead("Qui s'occupe de quoi", "Voir ce que vos proches ont choisi de faire pour vous."),
  component: Suivi,
});

function sentWords(iso?: string) {
  if (!iso) return "Pas encore envoyé.";
  const d = Math.round((Date.now() - new Date(iso).getTime()) / 864e5);
  return d <= 0 ? "Envoyé aujourd'hui" : d === 1 ? "Envoyé hier" : `Envoyé il y a ${d} jours`;
}

function Suivi() {
  const { s } = useSoutien();
  const names = s.recipients.map((r) => r.name);
  const items = s.help.filter((h) => h.checked);
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" size={36} className="pt-[22px]">Qui s'occupe<br /><em>de quoi.</em></PageTitle>
      <Lead className="mt-2 max-w-[310px]">{s.sentAt && names.length ? `${sentWords(s.sentAt)} à ${joinNames(names)}.` : sentWords(s.sentAt)}</Lead>
      <div className="pt-3">
        {items.map((h) => (
          <div key={h.id} className="flex items-center justify-between gap-3 py-[14px]" style={{ borderBottom: "1px solid var(--sp-line)" }}>
            <span className="flex flex-col gap-[2px]">
              <span style={{ fontFamily: "var(--lg-serif)", fontSize: 19 }}>{h.title}</span>
              {h.when && <span className="text-[12px]" style={{ color: "var(--sp-sub)" }}>{h.when}</span>}
            </span>
            <span className="text-[12.5px]" style={h.who ? undefined : { color: "var(--sp-sub)" }}>{h.who ?? "personne encore"}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-[22px] pt-5">
        <PrimaryButton space="support" to="/partage/message" search={{
          destinataires: names.join(","),
          texte: "« Je me permets de vous redire ce qui m'aiderait en ce moment. Seulement si c'est possible pour vous, sans obligation. Merci. »",
        }}>Relancer gentiment</PrimaryButton>
        <TextLink space="support" to="/care/aide">Modifier ma liste</TextLink>
      </div>
    </StandardLayout>
  );
}
