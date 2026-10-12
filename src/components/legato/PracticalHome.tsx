import { StandardLayout, SplitHeader, SectionLabel, Row, PrimaryButton, TextLink } from "@/components/legato/ds";
import { useDemarches, subtitle, titleText, BUCKET_LABEL, type Demarche } from "@/lib/demarches";
import { useVault } from "@/lib/vault-store";

export const demarcheLink = (d: Demarche) => (d.letter && d.id === "banque" ? `/practical/tasks/${d.id}/template` : `/practical/tasks/${d.id}`);

export function Practical() {
  const { by, done, total } = useDemarches();
  const { missing } = useVault();
  const week = by("week").open;
  const month = by("month").open;

  return (
    <StandardLayout space="practical" title="Démarches" activeTab="/practical">
      <SplitHeader space="practical" title={<>Ce qu'il reste<br /><em>à faire.</em></>} value={done} total={total}>
        <PrimaryButton space="practical" to="/practical/progress" className="!h-10 !px-6">Mon avancement</PrimaryButton>
      </SplitHeader>

      {week.length > 0 && <>
        <SectionLabel space="practical" accent className="mt-10">{BUCKET_LABEL.week}</SectionLabel>
        <div className="mt-1">
          {week.map((d, i) => <Row key={d.id} space="practical" n={i + 1} title={titleText(d)} subtitle={subtitle(d)} to={demarcheLink(d)} last={i === week.length - 1} />)}
        </div>
      </>}

      {month.length > 0 && <>
        <SectionLabel space="practical" className="mt-10">{BUCKET_LABEL.month}</SectionLabel>
        <div className="mt-1">
          {month.map((d, i) => <Row key={d.id} space="practical" n={i + 1} title={titleText(d)} subtitle={subtitle(d)} to={demarcheLink(d)} last={i === month.length - 1} />)}
        </div>
      </>}

      {week.length + month.length === 0 && (
        <p className="mt-10 lg-lead" style={{ color: "var(--sp-sub)" }}>Rien d'urgent ce mois-ci. Le reste peut attendre.</p>
      )}

      <div className="mt-10 px-5" style={{ background: "var(--lg-linen)" }}>
        <Row space="practical" title="Mes documents" subtitle={missing ? `Il manque ${missing.short}` : "Tout est rangé"} to="/practical/vault" last />
      </div>
      <TextLink space="practical" to="/practical/letter" className="mt-6 inline-block">Un courrier à comprendre ? Photographiez-le</TextLink>
    </StandardLayout>
  );
}
