import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Se connecter — Legato" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/home" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin + "/home",
            data: { display_name: name || email },
          },
        });
        if (error) throw error;
        toast.success("Compte créé. Bienvenue.");
        navigate({ to: "/home" });
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

  const onGoogle = async () => {
    if (busy) return;
    setBusy(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/home" });
    if (res.error) {
      toast.error("Connexion Google impossible.");
      setBusy(false);
    }
  };

  return (
    <main className="min-h-dvh bg-paper text-dusk flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-[400px]">
        <Link to="/" className="mono-label inline-block mb-8">← Legato</Link>
        <h1 className="ed-page-title">{mode === "signin" ? "Bon retour." : "Bienvenue."}</h1>
        <p className="mt-4 body-meta max-w-[34ch]">
          {mode === "signin"
            ? "Reprenez là où vous en étiez, retrouvez votre cercle."
            : "Créez votre espace, invitez vos proches quand vous voulez."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-3">
          {mode === "signup" && (
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Votre prénom" autoComplete="name"
              className="w-full px-4 py-3 rounded-[14px] border border-dusk/10 bg-paper text-dusk placeholder:text-dusk/40 outline-none focus-visible:ring-1 focus-visible:ring-dusk/40"
            />
          )}
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@email.fr" autoComplete="email"
            className="w-full px-4 py-3 rounded-[14px] border border-dusk/10 bg-paper text-dusk placeholder:text-dusk/40 outline-none focus-visible:ring-1 focus-visible:ring-dusk/40"
          />
          <input
            type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe" autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full px-4 py-3 rounded-[14px] border border-dusk/10 bg-paper text-dusk placeholder:text-dusk/40 outline-none focus-visible:ring-1 focus-visible:ring-dusk/40"
          />
          <button type="submit" disabled={busy} className="btn-dark w-full py-3 mt-2 disabled:opacity-50">
            {busy ? "Un instant…" : mode === "signin" ? "Se connecter" : "Créer mon espace"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-dusk/12" />
          <span className="mono-label">ou</span>
          <div className="flex-1 h-px bg-dusk/12" />
        </div>

        <button onClick={onGoogle} disabled={busy} className="w-full py-3 rounded-[14px] border border-dusk/10 text-[14px] text-dusk hover:bg-dusk/[0.03] disabled:opacity-50">
          Continuer avec Google
        </button>

        <p className="mt-8 text-[13px] text-dusk/70 text-center">
          {mode === "signin" ? "Pas encore de compte ?" : "Déjà inscrit·e ?"}{" "}
          <button type="button" className="underline font-serif" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Créer un espace" : "Se connecter"}
          </button>
        </p>
      </div>
    </main>
  );
}
