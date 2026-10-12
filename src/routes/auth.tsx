import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Field, PrimaryButton, TextLink } from "@/components/legato/ds";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Se connecter — Legato" },
      { name: "description", content: "Retrouvez votre espace Legato, tel que vous l'avez laissé." },
      { property: "og:title", content: "Se connecter — Legato" },
      { property: "og:description", content: "Votre espace vous attend, tel que vous l'avez laissé." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

/** 004 · Se connecter */
function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/home" }); });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/home" } });
        if (error) throw error;
        toast.success("Compte créé. Vérifiez votre boîte mail.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/home" });
      }
    } catch (err: any) {
      toast.error(err?.message || "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  };

  const onForgot = async () => {
    if (!email.trim()) { toast("Indiquez d'abord votre adresse e-mail."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + "/auth" });
    if (error) toast.error("Envoi impossible pour le moment.");
    else toast.success("Un lien vous a été envoyé par e-mail.");
  };

  const onGoogle = async () => {
    if (busy) return;
    setBusy(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/home" });
    if (res.error) { toast.error("Connexion Google impossible."); setBusy(false); }
  };

  return (
    <main className="lg-space-today min-h-dvh" style={{ background: "var(--lg-cream)", color: "var(--lg-deep)", fontFamily: "var(--lg-sans)" }}>
      <form onSubmit={onSubmit} className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-[28px]">
        <header className="flex h-16 shrink-0 items-center">
          <Link to="/start" className="flex min-h-11 items-center gap-[9px] text-[14px]"><ArrowLeft className="size-4" strokeWidth={1.4} /> Retour</Link>
        </header>
        <h1 className="lg-title pt-6" style={{ fontSize: 36 }}>{mode === "signin" ? <>Bon <em>retour.</em></> : <>Créer <em>un compte.</em></>}</h1>
        <p className="lg-lead mt-3">Votre espace vous attend, tel que vous l'avez laissé.</p>
        <Field className="mt-[34px]" label="Adresse e-mail" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="victor@exemple.fr" />
        <Field className="mt-5" label="Mot de passe" type="password" required minLength={6} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" />
        <div className="min-h-8 flex-1" />
        <div className="flex flex-col items-center gap-4 pb-[34px]">
          <PrimaryButton space="support" full type="submit" disabled={busy}>{busy ? "Un instant…" : mode === "signin" ? "Se connecter" : "Créer mon compte"}</PrimaryButton>
          {mode === "signin" && <TextLink onClick={onForgot}>Mot de passe oublié</TextLink>}
          {/* Hors maquette — conservés en attendant ta décision */}
          <div className="flex gap-4 pt-2 text-[12px]" style={{ color: "var(--lg-sub)" }}>
            <button type="button" onClick={onGoogle} className="underline underline-offset-4">Continuer avec Google</button>
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="underline underline-offset-4">
              {mode === "signin" ? "Créer un compte" : "Se connecter"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
