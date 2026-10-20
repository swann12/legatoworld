import { createFileRoute } from "@tanstack/react-router";
import { canUseConnectedAction } from "@/lib/discovery";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { StandardLayout, PageTitle, Lead, PrimaryButton, Field, Block, TextLink, OutlineButton } from "@/components/legato/ds";
import { useMemoryPerson } from "@/components/legato/MemoryUI";
import { supabase } from "@/integrations/supabase/client";
import { listMyCircles, getCircle, createCircle, createInvite } from "@/lib/circle.functions";
import { legatoHead } from "@/lib/legato-head";
import { ensureGarden } from "@/lib/garden.functions";
export const Route = createFileRoute("/care/garden/invite")({ head: () => legatoHead("Inviter des proches à se souvenir", "Préparer une invitation pour retrouver vos proches dans un cercle Legato."), component: MemoryInvite });
type Member = { id: string; user_id: string | null; email: string | null; display_name: string | null; status: string };
type Invite = { token: string; email: string | null; expires_at: string; created_at: string };
function MemoryInvite() {
  const { name, person } = useMemoryPerson(); const list = useServerFn(listMyCircles); const get = useServerFn(getCircle); const create = useServerFn(createCircle); const invite = useServerFn(createInvite);
  const [authed, setAuthed] = useState<boolean | null>(null); const [me, setMe] = useState(""); const [circleId, setCircleId] = useState(""); const [members, setMembers] = useState<Member[]>([]); const [invites, setInvites] = useState<Invite[]>([]); const [form, setForm] = useState(false); const [email, setEmail] = useState(""); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(""); const [url, setUrl] = useState("");
  const refresh = async (id: string) => { const result = await get({ data: { circleId: id } }); setMembers(result.members); setInvites(result.invites); };
  useEffect(() => {
    if (!canUseConnectedAction("invite")) return;
    let active = true; setCircleId(""); setMembers([]); setInvites([]); setUrl("");
    const load = async () => { try { const { data } = await supabase.auth.getUser(); if (!active) return; setAuthed(!!data.user); if (!data.user) return; setMe(data.user.id); const result = await list(); if (!active) return; const own = result.circles.find(c => c.owner_id === data.user?.id && c.memory_space_key === person?.id); if (own) { setCircleId(own.id); const details = await get({ data: { circleId: own.id } }); if (active) { setMembers(details.members); setInvites(details.invites); } } } catch { if (active) setNotice("Votre cercle n’a pas pu être chargé. Réessayez un peu plus tard."); } }; load(); return () => { active = false; };
  }, [person?.id, name]);
  const submit = async () => { if (!person) return; setBusy(true); setNotice(""); try { const id = circleId || (await ensureGarden({ data: { name, spaceKey: person.id } })).id; setCircleId(id); const result = await invite({ data: { circleId: id, email: email.trim() || undefined } }); setUrl(`${window.location.origin}/invite/${encodeURIComponent(result.token)}`); setForm(false); await refresh(id); setNotice("Le lien est prêt. Aucun courriel n’a été envoyé automatiquement."); } catch { setNotice("L’invitation n’a pas pu être préparée. Vous pouvez réessayer."); } finally { setBusy(false); } };
  const copy = async () => { try { await navigator.clipboard.writeText(url); setNotice("Le lien d’invitation est copié."); } catch { setNotice("Vous pouvez sélectionner et copier le lien ci-dessous."); } };
  return <StandardLayout space="memory" back="/care/garden/space" backLabel="Mémoire" activeTab="/care/garden">
    <PageTitle space="memory" className="mt-8">Inviter des proches<br />à <em>se souvenir.</em></PageTitle><Lead className="mt-4">Un cercle pour rassembler vos proches autour de {name}.</Lead>
    <ul className="mt-7">{members.filter(m => m.user_id !== me).map(m => <li key={m.id} className="lg-memory-invite-row"><span className="lg-memory-avatar">{(m.display_name || m.email || "?").charAt(0).toUpperCase()}</span><span className="min-w-0 flex-1"><span className="lg-row-title block">{m.display_name || m.email || "Un proche"}</span><span className="lg-row-sub block mt-1">Votre cercle</span></span><span className="lg-row-status">{m.status === "active" ? "invité·e" : "en attente"}</span></li>)}{invites.map(i => <li key={i.token} className="lg-memory-invite-row"><span className="min-w-0 flex-1"><span className="lg-row-title block">{i.email || "Un proche"}</span><span className="lg-row-sub block mt-1">Lien préparé · {new Date(i.created_at).toLocaleDateString("fr-FR")}</span></span><span className="lg-row-status">{new Date(i.expires_at).getTime() < Date.now() ? "expiré" : "en attente"}</span></li>)}</ul>
    {authed && !members.filter(m => m.user_id !== me).length && !invites.length && <Lead className="mt-4">Vous pourrez inviter la première personne quand vous le souhaiterez.</Lead>}
    <div className="mt-7">{authed === false ? <TextLink space="memory" to="/auth">Se connecter pour inviter quelqu’un</TextLink> : <PrimaryButton space="memory" plus onClick={() => setForm(!form)} disabled={authed === null || busy || !person}>Inviter quelqu’un</PrimaryButton>}</div>
    {form && <form className="mt-6 space-y-5" onSubmit={e => { e.preventDefault(); submit(); }}><Field space="memory" label="Son courriel · facultatif" type="email" value={email} onChange={e => setEmail(e.target.value)} /><PrimaryButton space="memory" type="submit" disabled={busy}>{busy ? "Préparation…" : "Préparer l’invitation"}</PrimaryButton></form>}
    {url && <div className="mt-6"><label className="lg-mono">Le lien d’invitation<input aria-label="Lien d’invitation" value={url} readOnly className="mt-2 w-full text-[13px] bg-transparent py-2 normal-case" /></label><div className="flex flex-wrap gap-4 mt-3"><OutlineButton space="memory" onClick={copy}>Copier le lien</OutlineButton>{email.trim() && <a className="lg-memory-cta" href={`mailto:${encodeURIComponent(email.trim())}?subject=${encodeURIComponent("Se souvenir ensemble sur Legato")}&body=${encodeURIComponent(`Rejoignez le cercle de ${name} : ${url}`)}`}>Envoyer par courriel</a>}</div></div>}
    {notice && <p role="status" className="lg-row-sub mt-5">{notice}</p>}
    <Block space="memory" className="mt-7"><p className="text-[14px] leading-relaxed">Seuls les souvenirs que vous partagez sont visibles par ce cercle. Les souvenirs proposés par vos proches attendent votre validation.</p></Block>
  </StandardLayout>;
}
