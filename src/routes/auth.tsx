import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Field, PrimaryButton, TextLink } from "@/components/legato/ds";
import { getDiscovery, prepareDiscoveryAccount } from "@/lib/discovery";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { mode?: "signup" | "signin" } => ({ mode: s.mode === "signup" ? "signup" : undefined }),
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
  const search = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [displayName, setDisplayName] = useState("");
  const [info, setInfo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getDiscovery().active) prepareDiscoveryAccount();
    supabase.auth.getUser().then(({ data }) => { if (data.user && !getDiscovery().pending) navigate({ to: "/home" }); });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/auth", data: { display_name: displayName.trim() } } });
        if (error) throw error;
        if (!data.session) setInfo("Vérifiez votre boîte mail pour confirmer votre compte. Ce que vous avez commencé reste sur ce téléphone.");
        else if (!getDiscovery().pending) navigate({ to: "/onboarding" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!getDiscovery().pending) navigate({ to: "/home" });
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
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (res.error) { toast.error("Connexion Google impossible."); setBusy(false); }
  };

  return (
    <main className={`lg-space-today min-h-dvh ${mode === "signup" ? "lg-discovery-signup" : ""}`} style={{ background: "var(--lg-cream)", color: "var(--lg-deep)", fontFamily: "var(--lg-sans)" }}>
      <form onSubmit={onSubmit} className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-[28px]">
        <header className="flex h-16 shrink-0 items-center">
          {mode === "signup" ? <span className="lg-mono">Votre espace</span> : <Link to="/start" className="flex min-h-11 items-center gap-[9px] text-[14px]"><ArrowLeft className="size-4" strokeWidth={1.4} /> Retour</Link>}
        </header>
        <h1 className="lg-title pt-6" style={{ fontSize: mode === "signup" ? 40 : 36 }}>{mode === "signin" ? <>Bon <em>retour.</em></> : <>Créer<br /><em>votre espace.</em></>}</h1>
        {mode === "signin" && <p className="lg-lead mt-3">Votre espace vous attend, tel que vous l'avez laissé.</p>}
        {mode === "signup" && <Field className="mt-[34px]" label="Votre prénom" required autoComplete="given-name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Victor" />}
        <Field className="mt-[34px]" label="Adresse e-mail" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="victor@exemple.fr" />
        <Field className="mt-5" label="Mot de passe" type="password" required minLength={6} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" />
        <div className="min-h-8 flex-1" />
        {info && <p role="status" className="lg-lead pb-5">{info}</p>}
        <div className="flex flex-col items-center gap-4 pb-[34px]">
          <PrimaryButton space="support" full type="submit" disabled={busy}>{busy ? "Un instant…" : mode === "signin" ? "Se connecter" : "Créer mon espace"}</PrimaryButton>
          {mode === "signup" && <TextLink onClick={() => setMode("signin")}>J'ai déjà un compte</TextLink>}
          {mode === "signin" && <TextLink onClick={onForgot}>Mot de passe oublié</TextLink>}
          {/* Hors maquette — conservés en attendant ta décision */}
          <details className="text-[12px]" style={{ color: "var(--lg-sub)" }}><summary>Autres options</summary><div className="flex gap-4 pt-2">
            <button type="button" onClick={onGoogle} className="underline underline-offset-4">Continuer avec Google</button>
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="underline underline-offset-4">
              {mode === "signin" ? "Créer un compte" : "Se connecter"}
            </button>
          </div></details>
        </div>
      </form>
    </main>
  );
}
