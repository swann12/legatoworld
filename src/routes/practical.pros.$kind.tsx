import { createFileRoute, notFound } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, SectionLabel, Tip, PrimaryButton } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

const GUIDES: Record<string, { title: string; timing: string; body: string; tips: string[]; cta: string; to: string }> = {
  notaire: { title: "Le notaire.", timing: "À appeler dans le premier mois", body: "Il règle la succession : ce qui revient à chacun, les comptes, le logement.", tips: ["Le montant de ses honoraires.", "Le délai pour la déclaration de succession.", "Les documents à réunir avant le rendez-vous."], cta: "Trouver un notaire près de chez vous", to: "/resources/notaires" },
  officiant: { title: "L'officiant.", timing: "Avant la cérémonie", body: "Il accompagne le déroulement de la cérémonie et les prises de parole des proches.", tips: ["Le déroulé de la cérémonie.", "La place des textes et de la musique.", "Ses honoraires et ses disponibilités."], cta: "Préparer la cérémonie", to: "/practical/ceremony" },
  marbrier: { title: "Le marbrier.", timing: "Après les obsèques, sans urgence", body: "Il prépare le monument, les inscriptions et l'aménagement du lieu de repos.", tips: ["Un devis détaillé, avant tout engagement.", "Les règles du cimetière.", "Les matériaux et les délais de réalisation."], cta: "Voir les options", to: "/practical/objects" },
};
export const Route = createFileRoute("/practical/pros/$kind")({
  head: ({ params }) => legatoHead(GUIDES[params.kind]?.title ?? "Guide professionnel", GUIDES[params.kind]?.body ?? "Repères pour appeler le bon professionnel."),
  component: ProGuide,
});
function ProGuide() {
  const { kind } = Route.useParams();
  const guide = GUIDES[kind];
  if (!guide) throw notFound();
  return <StandardLayout space="practical" back="/practical/pros" backLabel="Les professionnels" activeTab="/practical">
    <p className="lg-mono mt-[30px]">{guide.timing}</p>
    <PageTitle space="practical" className="mt-[10px]">{guide.title}</PageTitle>
    <Lead space="practical" className="mt-3">{guide.body}</Lead>
    <SectionLabel space="practical" accent className="mt-7">Ce qu'il faut lui demander</SectionLabel>
    {guide.tips.map((tip, i) => <Tip key={tip} space="practical" n={i + 1} last={i === 2}>{tip}</Tip>)}
    <PrimaryButton space="practical" className="mt-[26px] text-center !px-5" to={guide.to}>{guide.cta}</PrimaryButton>
  </StandardLayout>;
}
