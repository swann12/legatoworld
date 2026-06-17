import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { acceptInvite } from "@/lib/circle.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/invite/$token")({
  head: () => ({ meta: [{ title: "Rejoindre un cercle — Legato" }] }),
  component: InvitePage,
});

function InvitePage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const acceptFn = useServerFn(acceptInvite);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  }, []);

  const accept = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const r = await acceptFn({ data: { token } });
      toast.success("Vous avez rejoint le cercle.");
      navigate({ to: "/circle" });
    } catch (e: any) {
      toast.error(e?.message ?? "Impossible d'accepter l'invitation.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-dvh bg-paper text-dusk flex items-center justify-center px-6">
      <div className="max-w-[400px] w-full">
        <p className="mono-label">Invitation</p>
        <h1 className="ed-page-title mt-5">Un proche vous invite <span className="italic" style={{ color: "var(--terracotta)" }}>dans son cercle</span>.</h1>
        <p className="mt-6 body-meta">
          Un cercle Legato est un espace doux où l'on partage souvenirs, textes, et où l'on peut s'entraider sur les démarches.
        </p>
        {authed === null ? (
          <p className="mt-8 body-meta">Un instant…</p>
        ) : authed ? (
          <button onClick={accept} disabled={busy} className="btn-dark w-full mt-8 disabled:opacity-50">
            {busy ? "…" : "Rejoindre le cercle"}
          </button>
        ) : (
          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate({ to: "/auth", search: { redirect: `/invite/${token}` } as any })}
              className="btn-dark w-full"
            >
              Créer mon espace pour rejoindre
            </button>
            <p className="text-[12px] italic text-dusk/55 text-center">
              Vous serez automatiquement ajouté·e après la création de votre compte.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}