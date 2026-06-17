import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { listMyCircles, createCircle, getCircle, createInvite, shareItem } from "@/lib/circle.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/circle")({
  head: () => ({ meta: [{ title: "Mon cercle — Legato" }] }),
  component: CirclePage,
});

function CirclePage() {
  const navigate = useNavigate();
  const listFn = useServerFn(listMyCircles);
  const createFn = useServerFn(createCircle);
  const qc = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["circles"], queryFn: () => listFn() });

  useEffect(() => {
    if (data?.circles?.length && !activeId) setActiveId(data.circles[0].id);
  }, [data, activeId]);

  const createMut = useMutation({
    mutationFn: () => createFn({ data: { name: "Nouveau cercle" } }),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["circles"] });
      setActiveId(r.id);
      toast.success("Cercle créé.");
    },
    onError: (e: any) => toast.error(e?.message ?? "Erreur"),
  });

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <Shell livingBg={false}>
      <header className="px-6 pt-9 pb-6 flex items-center justify-between">
        <LegatoMark to="/space" size={22} />
        <button onClick={signOut} className="eyebrow underline-offset-2 hover:underline">Déconnexion</button>
      </header>

      <ScreenHeader
        eyebrow="Cercle"
        title={<>Vous n'êtes pas seul·e <span className="italic" style={{ color: "var(--terracotta)" }}>à traverser</span>.</>}
        subtitle="Invitez vos proches, déléguez ce qui pèse, partagez les souvenirs qui comptent."
      />

      <Section className="mt-2">
        {isLoading ? (
          <p className="body-meta">Chargement…</p>
        ) : (data?.circles?.length ?? 0) === 0 ? (
          <div className="card-plain p-6">
            <p className="eyebrow">Aucun cercle pour l'instant</p>
            <p className="mt-3 body-meta">Créez votre premier cercle pour commencer.</p>
            <button onClick={() => createMut.mutate()} className="btn-dark mt-4">Créer mon cercle</button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-6">
            {data!.circles.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`px-4 py-2 text-[13px] rounded-full border transition ${
                  activeId === c.id ? "bg-dusk text-paper border-dusk" : "border-dusk/15 text-dusk/70 hover:border-dusk/30"
                }`}
              >
                {c.name}
              </button>
            ))}
            <button
              onClick={() => createMut.mutate()}
              className="px-4 py-2 text-[13px] rounded-full border border-dashed border-dusk/30 text-dusk/60 hover:border-dusk/60"
            >
              + nouveau
            </button>
          </div>
        )}
      </Section>

      {activeId && <CircleDetail circleId={activeId} />}
    </Shell>
  );
}

function CircleDetail({ circleId }: { circleId: string }) {
  const getFn = useServerFn(getCircle);
  const inviteFn = useServerFn(createInvite);
  const shareFn = useServerFn(shareItem);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["circle", circleId],
    queryFn: () => getFn({ data: { circleId } }),
  });

  const [inviteEmail, setInviteEmail] = useState("");
  const [noteText, setNoteText] = useState("");

  const inviteMut = useMutation({
    mutationFn: (email?: string) => inviteFn({ data: { circleId, email: email || undefined } }),
    onSuccess: (r) => {
      const url = `${window.location.origin}/invite/${r.token}`;
      navigator.clipboard?.writeText(url).catch(() => {});
      toast.success("Lien copié — partagez-le à votre proche.", { description: url });
      setInviteEmail("");
      qc.invalidateQueries({ queryKey: ["circle", circleId] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Erreur"),
  });

  const shareMut = useMutation({
    mutationFn: (title: string) => shareFn({ data: { circleId, kind: "note", title } }),
    onSuccess: () => {
      toast.success("Partagé au cercle.");
      setNoteText("");
      qc.invalidateQueries({ queryKey: ["circle", circleId] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Erreur"),
  });

  if (isLoading || !data) {
    return <Section><p className="body-meta">Chargement du cercle…</p></Section>;
  }

  return (
    <>
      <Section>
        <p className="eyebrow">Membres</p>
        <ul className="mt-3 space-y-2">
          {data.members.map((m) => (
            <li key={m.id} className="card-plain px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[14px] text-dusk">{m.display_name || m.email || "Proche"}</p>
                <p className="eyebrow mt-1">{m.role} · {m.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="mt-8">
        <p className="eyebrow">Inviter un proche</p>
        <div className="mt-3 card-plain p-4">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="email@proche.fr (optionnel)"
            className="w-full px-3 py-2 bg-transparent border border-dusk/15 rounded outline-none focus-visible:ring-1 focus-visible:ring-dusk/40 text-[14px]"
          />
          <button
            onClick={() => inviteMut.mutate(inviteEmail)}
            disabled={inviteMut.isPending}
            className="btn-dark w-full mt-3 disabled:opacity-50"
          >
            {inviteMut.isPending ? "Création du lien…" : "Générer un lien d'invitation"}
          </button>
          <p className="mt-3 text-[12px] italic text-dusk/55">Le lien sera copié — collez-le dans un SMS, email, message.</p>
        </div>
        {data.invites.length > 0 && (
          <ul className="mt-3 space-y-1">
            {data.invites.map((i) => (
              <li key={i.token} className="text-[12px] text-dusk/60 truncate">
                {i.email || "lien"} — <span className="italic">en attente</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section className="mt-8">
        <p className="eyebrow">Partager au cercle</p>
        <div className="mt-3 card-plain p-4">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            placeholder="Un souvenir, une pensée, une nouvelle à partager…"
            className="w-full px-3 py-2 bg-transparent border border-dusk/15 rounded outline-none focus-visible:ring-1 focus-visible:ring-dusk/40 text-[14px] resize-none"
          />
          <button
            onClick={() => shareMut.mutate(noteText.trim())}
            disabled={!noteText.trim() || shareMut.isPending}
            className="btn-dark w-full mt-3 disabled:opacity-50"
          >
            Partager
          </button>
        </div>
      </Section>

      <Section className="mt-8 pb-12">
        <p className="eyebrow">Fil du cercle</p>
        {data.items.length === 0 ? (
          <p className="mt-3 body-meta italic">Rien de partagé pour l'instant. Soyez le premier.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {data.items.map((it) => (
              <li key={it.id} className="card-plain px-4 py-3">
                <p className="eyebrow">{it.kind}{it.status ? ` · ${it.status}` : ""}</p>
                <p className="mt-2 text-[14px] text-dusk">{it.title}</p>
                <p className="mt-1 text-[11px] text-dusk/50">{new Date(it.created_at).toLocaleDateString("fr-FR")}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}