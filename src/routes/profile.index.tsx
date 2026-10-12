import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StandardLayout, PageTitle, Spec, ArrowRow, TextLink } from "@/components/legato/ds";

export const Route = createFileRoute("/profile/")({
  head: () => ({
    meta: [
      { title: "Mon compte — Legato" },
      { name: "description", content: "Votre prénom, votre e-mail, vos notifications et vos données." },
      { property: "og:title", content: "Mon compte — Legato" },
      { property: "og:description", content: "Gérer votre compte Legato." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Account,
});

/** 023 · Mon compte */
function Account() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [first, setFirst] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      const n = (data.user?.user_metadata?.display_name as string | undefined) ?? "";
      setFirst(n.includes("@") ? "" : n);
    });
  }, []);

  const save = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) { toast("Connectez-vous pour modifier votre prénom."); return; }
    const { error } = await supabase.auth.updateUser({ data: { display_name: first.trim() } });
    if (!error) await supabase.from("profiles").update({ display_name: first.trim() }).eq("id", data.user.id);
    if (error) toast.error("Enregistrement impossible."); else { toast.success("Prénom enregistré."); setEditing(false); }
  };
  const logout = async () => { await supabase.auth.signOut(); navigate({ to: "/start" }); };

  return (
    <StandardLayout back="/space" backLabel="Vos espaces" activeTab="/home">
      <PageTitle className="pt-8">Mon <em>compte.</em></PageTitle>
      <div className="mt-6">
        {editing ? (
          <div className="py-3" style={{ borderTop: "1px solid var(--sp-line-2)", borderBottom: "1px solid var(--sp-line-2)" }}>
            <label className="flex items-baseline gap-3">
              <span className="lg-mono w-[112px] shrink-0">Prénom</span>
              <input autoFocus value={first} onChange={(e) => setFirst(e.target.value)} maxLength={60}
                className="w-full bg-transparent outline-none" style={{ fontFamily: "var(--lg-serif)", fontSize: 19, color: "var(--sp-ink)" }} />
            </label>
          </div>
        ) : (
          <Spec items={[{ label: "Prénom", value: first || "—" }, { label: "E-mail", value: email || "Non connecté" }]} />
        )}
        <div className="mt-3 flex justify-end">
          {email ? <TextLink onClick={editing ? save : () => setEditing(true)}>{editing ? "Enregistrer" : "Modifier"}</TextLink> : <TextLink to="/auth">Se connecter</TextLink>}
        </div>
      </div>
      <div className="mt-4">
        <ArrowRow title="Notifications" subtitle="Une le matin à 9 h, jamais après 21 h" to="/profile/notifications" />
        <ArrowRow title="Qui voit quoi" subtitle="Ce que voient vos proches" to="/profile/privacy" />
        <ArrowRow title="Aide et contact" subtitle="Une question, un problème" to="/profile/help" />
        <ArrowRow title="Vos données" subtitle="Télécharger ou supprimer" to="/profile/data" last />
      </div>
      {email && <div className="mt-6"><TextLink onClick={logout}>Se déconnecter</TextLink></div>}
    </StandardLayout>
  );
}
