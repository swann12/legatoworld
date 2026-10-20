import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { legatoHead } from "@/lib/legato-head";

/** D013 · x-mot-de-passe : recevoir un lien pour choisir un nouveau mot de passe. */
export const Route = createFileRoute("/auth_/mot-de-passe")({
  head: () => legatoHead("Mot de passe oublié", "Recevoir un lien par e-mail pour choisir un nouveau mot de passe."),
  component: Page,
});

function Page() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + "/auth" });
    setBusy(false);
    if (error) toast.error("Envoi impossible pour le moment.");
    else toast.success("Un lien vous a été envoyé par e-mail. Il reste valable une heure.");
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-7" style={{ background: "var(--lg-cream)", color: "var(--lg-deep)" }}>
      <p className="lg-mono pt-6">Connexion</p>
      <h1 className="lg-title mt-10 text-[38px] leading-[1.1]">Mot de passe<br /><em>oublié.</em></h1>
      <p className="mt-4 max-w-[310px] text-[14px] leading-[1.55]" style={{ color: "var(--lg-sub)" }}>
        Nous vous envoyons un lien pour en choisir un nouveau. Il reste valable une heure.
      </p>
      <form onSubmit={send} className="mt-10">
        <label htmlFor="mdp-email" className="lg-mono">Adresse e-mail</label>
        <input
          id="mdp-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="victor@exemple.fr"
          className="mt-3 w-full bg-transparent py-3 text-[16px] outline-none"
          style={{ borderBottom: "1px solid var(--lg-line-2)", fontFamily: "var(--lg-sans)" }}
        />
        <button type="submit" disabled={busy || !email.trim()}
          className="mt-8 flex h-[52px] w-full items-center justify-center rounded-full text-[15px] transition-opacity disabled:opacity-40"
          style={{ background: "var(--lg-deep)", color: "var(--lg-mint)" }}>
          Recevoir le lien
        </button>
      </form>
      <div className="mt-6 text-center">
        <Link to="/auth" className="text-[14px] underline underline-offset-4">Retour à la connexion</Link>
      </div>
    </div>
  );
}
