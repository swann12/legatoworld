import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { acceptInvite } from "@/lib/circle.functions";
import { toast } from "sonner";
import { PrimaryButton, TextLink } from "@/components/legato/ds";

export const Route = createFileRoute("/invite/$token")({
  head: () => ({
    meta: [
      { title: "Une invitation — Legato" },
      { name: "description", content: "Un proche vous invite à rejoindre son espace Legato." },
      { property: "og:title", content: "Une invitation — Legato" },
      { property: "og:description", content: "Rejoindre un espace pour partager des souvenirs et quelques démarches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InvitePage,
});

/** 005 · Une invitation */
function InvitePage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const acceptFn = useServerFn(acceptInvite);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user)); }, []);

  const join = async () => {
    if (busy) return;
    if (!authed) { navigate({ to: "/auth", search: { redirect: `/invite/${token}` } as any }); return; }
    setBusy(true);
    try {
      await acceptFn({ data: { token } });
      toast.success("Vous avez rejoint l'espace.");
      navigate({ to: "/home" });
    } catch (e: any) {
      toast.error(e?.message ?? "Impossible d'accepter l'invitation.");
    } finally { setBusy(false); }
  };

  return (
    <main className="lg-space-today min-h-dvh" style={{ background: "var(--lg-cream)", color: "var(--lg-deep)", fontFamily: "var(--lg-sans)" }}>
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-[28px]">
        <header className="flex h-16 shrink-0 items-center justify-between" style={{ borderBottom: "1px solid var(--lg-line-2)" }}>
          <span style={{ fontFamily: "var(--lg-serif)", fontSize: 25 }}>Legato</span>
          <span className="lg-mono" style={{ color: "var(--lg-deep)" }}>Invitation</span>
        </header>
        <h1 className="lg-title pt-10" style={{ fontSize: 32 }}>Un proche vous invite<br /><em>dans son espace.</em></h1>
        <p className="lg-lead mt-4">Il aimerait partager avec vous des souvenirs et quelques démarches.</p>
        <div className="mt-8 px-[22px] py-6" style={{ background: "var(--lg-linen)" }}>
          <p className="lg-section">Vous pourrez —</p>
          <ol className="mt-3 space-y-3" style={{ fontFamily: "var(--lg-serif)", fontSize: 19, lineHeight: 1.25 }}>
            <li className="grid grid-cols-[30px_1fr]"><span>1</span><span>Voir et ajouter des souvenirs</span></li>
            <li className="grid grid-cols-[30px_1fr]"><span>2</span><span>Recevoir les démarches qu'il vous confie</span></li>
          </ol>
        </div>
        <p className="lg-lead mt-7">Son journal, son humeur et ses échanges avec Présence restent privés.</p>
        <div className="min-h-8 flex-1" />
        <div className="flex flex-col items-center gap-4 pb-[34px]">
          <PrimaryButton space="support" full onClick={join} disabled={busy || authed === null}>{busy ? "Un instant…" : "Rejoindre l'espace"}</PrimaryButton>
          <TextLink to="/start">Pas maintenant</TextLink>
        </div>
      </div>
    </main>
  );
}
