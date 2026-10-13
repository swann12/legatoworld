import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { StandardLayout, SectionLabel, Lead, OutlineButton } from "./ds";
import { VIGIL } from "@/lib/community-vigil";
import type { Thread } from "@/lib/community-data";
export function CommunityLayout({ children, group, backLabel, back, title }: { children: ReactNode; group?: string; backLabel?: string; back?: string; title?: string }) {
 return <StandardLayout space="community" title={title} back={group ? undefined : back} backLabel={backLabel} headerLeft={group ? <Link className="flex items-center gap-2 min-h-11 text-[14px]" to="/care/community/$group" params={{group}}><ArrowLeft className="size-4" strokeWidth={1.3}/>{backLabel || "Un groupe"}</Link> : undefined} activeTab="/care/community">{children}</StandardLayout>;
}
export function CommunityExtras({children}: {children:ReactNode}) {return <details className="lg-community-extras mt-10"><summary>Autres options</summary><div className="pt-5">{children}</div></details>;}
export function DemoNote(){return <Lead className="mt-7">Groupes et échanges d’exemple. Vos messages et soutiens restent sur cet appareil ; aucune modération réelle n’est connectée.</Lead>;}
export function GroupLink({id,label,hint}: {id:string;label:string;hint:string}) {return <Link to="/care/community/$group" params={{group:id}} className="lg-community-row"><span className="min-w-0 flex-1"><span className="lg-row-title block">{label}</span><span className="lg-row-sub block mt-1">{hint}</span></span><ChevronRight className="size-4" strokeWidth={1.3}/></Link>;}
export function VigilHighlight({when="jeudi · 20 h · exemple",title=VIGIL.title}:{when?:string;title?:string}={}){return <section className="lg-community-vigil mt-7 p-6"><SectionLabel>Prochaine veillée</SectionLabel><p className="lg-mono mt-3">{when}</p><h2 className="lg-title text-[25px] mt-3">{title}</h2><Link className="inline-block mt-5 underline underline-offset-4 text-[13px]" to="/care/community/vigil/$id" params={{id:VIGIL.id}}>Voir la veillée</Link></section>;}
export function ThreadPreview({t,supported,onCare}: {t:Thread;supported:boolean;onCare:()=>void}) {return <article className="lg-community-message py-5"><p className="lg-row-sub flex justify-between gap-3"><span>{t.author}</span><span>{t.when}</span></p><p className="lg-title text-[23px] mt-3">{t.body || t.title}</p><div className="flex flex-wrap gap-3 mt-4"><Link to="/care/community/$group/$thread" params={{group:t.group,thread:t.id}} className="lg-community-outline">Répondre</Link><OutlineButton space="community" onClick={onCare}>{supported ? "Pensée gardée" : "Je pense à vous"}</OutlineButton></div></article>;}
