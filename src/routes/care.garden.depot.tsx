import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Row, Block, TextLink } from "@/components/legato/ds";
import { MemoryExtras } from "@/components/legato/MemoryUI";
import { legatoHead } from "@/lib/legato-head";
export const Route = createFileRoute("/care/garden/depot")({ head: () => legatoHead("Ajouter un souvenir", "Une photo, sa voix, un texte ou un lieu : garder ce qui compte."), component: MemoryDepot });
function MemoryDepot() { const navigate = useNavigate(); const open = (zone: string) => navigate({ to: "/compose/$zone", params: { zone } }); return <StandardLayout space="memory" back="/care/garden/space" backLabel="Mémoire" activeTab="/care/garden">
  <PageTitle space="memory" className="mt-8">Que voulez-vous<br /><em>garder ?</em></PageTitle><Lead className="mt-4">Un souvenir peut être très simple : une phrase, un son, une image.</Lead>
  <div className="mt-7"><Row n={1} title="Une photo" subtitle="Depuis votre téléphone" onClick={() => open("photo")} /><Row n={2} title="Sa voix" subtitle="Un message, un enregistrement" onClick={() => open("voix")} /><Row n={3} title="Un texte" subtitle="Une phrase qu’elle disait, une lettre" onClick={() => open("lettre")} /><Row n={4} title="Un lieu" subtitle="Un endroit qui compte" onClick={() => open("lieu")} last /></div>
  <Block space="memory" className="mt-7"><p className="text-[14px] leading-relaxed">Vos proches peuvent aussi ajouter leurs souvenirs.</p><TextLink space="memory" to="/care/garden/invite" className="inline-block mt-3">Les inviter</TextLink></Block>
  <MemoryExtras><Row title="Musiques" onClick={() => open("musique")} /><Row title="Objets" onClick={() => open("objet")} /><Row title="Citations" onClick={() => open("citation")} last /></MemoryExtras>
</StandardLayout>; }
