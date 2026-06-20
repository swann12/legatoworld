import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { LegatoMark } from "@/components/legato/LegatoMark";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Legato — A quiet companion through grief" },
      {
        name: "description",
        content:
          "Un compagnon premium, doux et sensible, pour le deuil, la perte et la peur de perdre quelqu'un.",
      },
    ],
  }),
  component: Start,
});

type Mode = "choice" | "signin" | "signup";

const emailSchema = z.string().trim().email({ message: "Adresse e-mail invalide" }).max(255);
const passwordSchema = z
  .string()
  .min(8, { message: "8 caractères minimum" })
  .max(72, { message: "Trop long" });
const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Indiquez un prénom ou un nom" })
  .max(60, { message: "Trop long" });

function Start() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("choice");
  const [showQuote, setShowQuote] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const goNext = () => navigate({ to: "/onboarding" });

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/onboarding",
      });
      if (result.error) {
        setError("Connexion impossible avec Google. Réessayez.");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      goNext();
    } catch {
      setError("Connexion impossible avec Google.");
      setLoading(false);
    }
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const emailParsed = emailSchema.safeParse(email);
    if (!emailParsed.success) return setError(emailParsed.error.issues[0].message);
    if (!password) return setError("Mot de passe requis");
    setLoading(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: emailParsed.data,
      password,
    });
    setLoading(false);
    if (signErr) {
      setError("Identifiants incorrects.");
      return;
    }
    setShowQuote(true);
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const nameParsed = nameSchema.safeParse(displayName);
    if (!nameParsed.success) return setError(nameParsed.error.issues[0].message);
    const emailParsed = emailSchema.safeParse(email);
    if (!emailParsed.success) return setError(emailParsed.error.issues[0].message);
    const passwordParsed = passwordSchema.safeParse(password);
    if (!passwordParsed.success) return setError(passwordParsed.error.issues[0].message);
    setLoading(true);
    const { data, error: signErr } = await supabase.auth.signUp({
      email: emailParsed.data,
      password: passwordParsed.data,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: { display_name: nameParsed.data },
      },
    });
    setLoading(false);
    if (signErr) {
      setError(signErr.message);
      return;
    }
    if (data.session) {
      setShowQuote(true);
    } else {
      setInfo("Vérifiez votre boîte mail pour confirmer votre inscription.");
    }
  };

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      {showQuote && (
        <button
          type="button"
          onClick={goNext}
          className="fixed inset-0 z-50 flex flex-col px-8 py-12 text-left animate-fade-in"
          style={{ background: "var(--sun)", color: "var(--dusk)" }}
          aria-label="Entrer dans Legato"
        >
          <div className="flex w-full items-center justify-between border-b border-dusk/20 pb-4">
            <span className="mono-label text-dusk/70">Souvenir</span>
            <span className="mono-label text-dusk/55">Legato</span>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <p className="max-w-[8ch] font-serif text-[58px] leading-[0.96] text-[color:var(--terracotta)]">
              Vous n'avez pas à faire cela seul·e.
            </p>
          </div>
          <div>
            <div className="mb-6 h-px w-12 bg-dusk/35" />
            <p className="max-w-[24ch] text-[13px] leading-[1.55] text-dusk/70">
              On avance avec ce qui est possible aujourd'hui. Rien de plus.
            </p>
          </div>
          <p className="mono-label text-dusk/65">Toucher pour continuer →</p>
        </button>
      )}
      <div
        className="mobile-frame relative flex min-h-dvh flex-col"
        style={{ background: mode === "choice" ? "var(--bordeaux)" : "var(--paper)" }}
      >
        <header className="grid grid-cols-3 items-center px-6 pt-10">
          <div className="justify-self-start">
            {mode !== "choice" ? (
              <button
                type="button"
                onClick={() => { setMode("choice"); setError(null); setInfo(null); }}
                className="mono-label hover:text-dusk"
              >
                ← Retour
              </button>
            ) : (
              <LegatoMark to="/start" variant="paper" size={36} />
            )}
          </div>
          <div className="justify-self-center" />
          <div className="justify-self-end">
            <span className={mode === "choice" ? "mono-label text-[color:var(--paper)]/55" : "mono-label text-dusk/45"}>2026</span>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 flex-col px-8 pb-12 pt-12">
          <p className={mode === "choice" ? "mono-label text-[color:var(--paper)]/65" : "mono-label text-dusk/55"}>
            {mode === "signin" ? "Se reconnecter" : mode === "signup" ? "Créer un espace" : "Bienvenue"}
          </p>
          <h1 className={mode === "choice" ? "mt-10 font-serif text-[58px] leading-[0.98] text-[color:var(--paper)] text-balance" : "mt-6 font-serif text-[44px] leading-[1.03] text-dusk text-balance"}>
            {mode === "signin" ? (
              <>Ravi de vous<br />revoir.</>
            ) : mode === "signup" ? (
              <>Votre espace,<br />en quelques mots.</>
            ) : (
              <>Préparer<br />un adieu,<br />garder une<br />présence.</>
            )}
          </h1>
          {mode === "choice" && (
            <>
              <div className="mt-8 h-px w-14 bg-[color:var(--paper)]/35" />
              <p className="mt-6 max-w-[33ch] text-[15px] leading-[1.55] text-[color:var(--paper)]/72">
                Composer une cérémonie, écrire ce qui compte, faire vivre le souvenir. À votre rythme.
              </p>
            </>
          )}

          <div className="mt-auto pt-12 flex flex-col gap-3">
            {mode === "choice" && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(null); setInfo(null); }}
                  className="block rounded-[999px] text-center px-6 py-5 transition-transform active:scale-[0.99]"
                  style={{ background: "var(--paper)", color: "var(--bordeaux)" }}
                >
                  <span className="block mono-label">Créer son espace</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(null); setInfo(null); }}
                  className="rounded-[999px] border px-6 py-4 text-center transition-colors"
                  style={{ borderColor: "color-mix(in oklab, var(--paper) 70%, transparent)", color: "var(--paper)" }}
                >
                  <span className="block mono-label">Se reconnecter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuote(true)}
                  className="mt-4 text-center py-2"
                >
                  <span className="block mono-label text-[color:var(--paper)]/78">Continuer en tant qu'invité·e</span>
                </button>
                <p className="mx-auto max-w-[28ch] text-center text-[11px] leading-[1.45] text-[color:var(--paper)]/50">
                  En mode invité·e, rien n'est conservé d'une session à l'autre.
                </p>
              </div>
            )}

            {mode !== "choice" && (
              <form
                onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
                className="flex flex-col gap-3.5 animate-fade-in"
              >
                {mode === "signup" && (
                  <SoftInput
                    label="Prénom"
                    type="text"
                    autoComplete="given-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                )}
                <SoftInput
                  label="Adresse e-mail"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <SoftInput
                  label="Mot de passe"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                  <p className="text-[12px] text-rose/90 italic">{error}</p>
                )}
                {info && (
                  <p className="text-[12px] text-dusk/60 italic">{info}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="block rounded-[999px] text-[color:var(--paper)] px-6 py-4 text-center disabled:opacity-50 transition-transform active:scale-[0.99]"
                  style={{ background: "var(--terracotta)" }}
                >
                  <span className="block font-serif text-[18px]">
                    {loading
                      ? "Un instant…"
                      : mode === "signin"
                        ? "Entrer"
                        : "Créer mon espace"}
                  </span>
                </button>

                <div className="flex items-center gap-3 py-1">
                  <span className="h-px flex-1 bg-dusk/15" />
                  <span className="mono-label text-dusk/45">ou</span>
                  <span className="h-px flex-1 bg-dusk/15" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="rounded-full border border-dusk/20 bg-paper px-7 py-3.5 text-center mono-label text-dusk/75 hover:bg-dusk/5 transition-colors disabled:opacity-50"
                >
                  Continuer avec Google
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function SoftInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span
        className="mb-1.5 block text-[10px] uppercase tracking-[0.24em] text-dusk/50"
        
      >
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[14px] text-dusk placeholder:text-dusk/30 outline-none transition-colors focus:border-dusk/40"
      />
    </label>
  );
}