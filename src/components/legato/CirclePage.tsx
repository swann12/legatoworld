import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { listMyCircles, getCircle, createInvite } from "@/lib/circle.functions";
import { StandardLayout, PageTitle, Lead, PrimaryButton, TextLink } from "@/components/legato/ds";

type Member = { id: string; user_id: string | null; email: string | null; role: string; status: string; display_name: string | null };
type Invite = { token: string; email: string | null; created_at: string };

const ROLE: Record<string, string> = { proche: "Un proche", aidant: "Un aidant", owner: "Vous" };

function ago(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d <= 0 ? "aujourd'hui" : d === 1 ? "hier" : `il y a ${d} jours`;
}

/** 022 · Votre cercle — membres, invitations en attente, inviter un proche */
export function CirclePage() {
  const list = useServerFn(listMyCircles);
  const get = useServerFn(getCircle);
  const invite = useServerFn(createInvite);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [me, setMe] = useState<string | null>(null);
  const [circleId, setCircleId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async (id: string) => {
    const r = await get({ data: { circleId: id } });
    setMembers(r.members as Member[]);
    setInvites(r.invites as Invite[]);
  };

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setAuthed(!!data.user);
      if (!data.user) return;
      setMe(data.user.id);
      try {
        const { circles } = await list();
        const own = circles.find((c) => c.owner_id === data.user!.id) ?? circles[0];
        if (own) { setCircleId(own.id); await load(own.id); }
      } catch { toast.error("Impossible de charger votre cercle."); }
    });
  }, []);

  const onInvite = async () => {
    if (!circleId || busy) return;
    setBusy(true);
    try {
      const { token } = await invite({ data: { circleId } });
      const url = `${window.location.origin}/invite/${token}`;
      if (navigator.share) await navigator.share({ title: "Rejoindre mon espace Legato", url }).catch(() => {});
      else { await navigator.clipboard.writeText(url); toast.success("Lien d'invitation copié."); }
      await load(circleId);
    } catch { toast.error("Invitation impossible pour le moment."); }
    finally { setBusy(false); }
  };

  const others = members.filter((m) => m.user_id !== me);

  return (
    <StandardLayout back="/space" backLabel="Vos espaces" activeTab="/home">
      <PageTitle className="pt-8">Votre <em>cercle.</em></PageTitle>
      <Lead className="mt-3">Les proches qui partagent cet espace avec vous. Chacun ne voit que ce que vous lui ouvrez.</Lead>
      <ul className="mt-6" style={{ borderTop: "1px solid var(--sp-line-2)" }}>
        {others.map((m) => (
          <Person key={m.id} name={m.display_name || m.email || "Un proche"} sub={ROLE[m.role] ?? "Un proche"} tag={m.status === "active" ? "Membre" : "En attente"} />
        ))}
        {invites.map((i) => (
          <Person key={i.token} name={i.email || "Lien d'invitation"} sub={`Invitation envoyée ${ago(i.created_at)}`} tag="En attente" />
        ))}
        {authed && others.length === 0 && invites.length === 0 && (
          <li className="py-5 text-[14px]" style={{ color: "var(--sp-sub)" }}>Personne pour l'instant.</li>
        )}
      </ul>
      <p className="mt-6 px-5 py-4 text-[14px] leading-[1.5]" style={{ background: "var(--sp-block)" }}>
        Votre journal, votre humeur et vos échanges avec Présence restent toujours privés.
      </p>
      <div className="mt-6">
        {authed === false
          ? <TextLink to="/auth">Se connecter pour inviter un proche</TextLink>
          : <PrimaryButton plus onClick={onInvite} disabled={!circleId || busy}>Inviter un proche</PrimaryButton>}
      </div>
    </StandardLayout>
  );
}

function Person({ name, sub, tag }: { name: string; sub: string; tag: string }) {
  return (
    <li className="flex items-center gap-4 py-[14px]" style={{ borderBottom: "1px solid var(--sp-line)" }}>
      <span className="grid size-11 shrink-0 place-items-center rounded-full" style={{ border: "1px solid var(--sp-stroke)", fontFamily: "var(--lg-serif)", fontSize: 19 }}>
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="lg-row-title block truncate">{name}</span>
        <span className="lg-row-sub mt-0.5 block" style={{ color: "var(--sp-sub)" }}>{sub}</span>
      </span>
      <span className="lg-mono" style={{ color: "var(--sp-ink)" }}>{tag}</span>
    </li>
  );
}
