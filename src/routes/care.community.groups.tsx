import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, Lead } from "@/components/legato/ds";
import { CommunityLayout, GroupLink, CommunityExtras, DemoNote } from "@/components/legato/CommunityUI";
import { GROUPS } from "@/lib/community-data";
import { legatoHead } from "@/lib/legato-head";
export const Route=createFileRoute("/care/community/groups")({head:()=>legatoHead("Trouver un groupe", "Trouver des personnes qui vivent quelque chose de proche de votre deuil."),component:FindGroups});
function FindGroups(){const ids=["conjoint","parent","enfant","suicide","aidants"];return <CommunityLayout back="/care/community" backLabel="Communauté"><PageTitle space="community" className="mt-8">Trouver<br/><em>un groupe.</em></PageTitle><Lead className="mt-4">Des personnes qui vivent quelque chose de proche. Tous les groupes sont modérés.</Lead><div className="mt-6">{ids.map(id=>{const g=GROUPS.find(g=>g.id===id);return g?<GroupLink key={id} id={id} label={g.label} hint={`${g.members.toLocaleString("fr-FR")} membres · exemple`}/>:null;})}</div><CommunityExtras>{GROUPS.filter(g=>!ids.includes(g.id)).map(g=><GroupLink key={g.id} id={g.id} label={g.label} hint={g.hint}/>)}</CommunityExtras><DemoNote/></CommunityLayout>;}
