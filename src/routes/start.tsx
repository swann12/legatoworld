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
          className="fixed inset-0 z-50 flex flex-col px-8 pt-10 pb-10 text-left animate-fade-in"
          style={{ background: "var(--blush)", color: "var(--olive)" }}
          aria-label="Entrer dans Legato"
        >
          <div className="mobile-frame relative flex min-h-dvh flex-col px-2" style={{ background: "transparent" }}>
            <header className="pt-2">
              <LegatoMark to="/start" variant="olive" size={24} />
            </header>
            <div className="flex flex-1 items-start pt-[54px]">
              <p className="legato-ref-quote" style={{ color: "var(--olive)" }}>
                Rien ne peut<br />ramener<br />l'heure passée,<br />mais nous<br />pouvons<br />trouver de<br />la force dans<br />ce qui<br />demeure.
              </p>
            </div>
            <div className="flex items-end justify-between pb-2 pt-8">
              <div className="text-[13px] leading-[1.45]" style={{ color: "var(--olive)" }}>
                <p style={{ fontWeight: 500 }}>William Wordsworth,</p>
                <p className="italic" style={{ fontWeight: 600 }}>Ode: Intimations of Immortality</p>
              </div>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full border"
                style={{ borderColor: "color-mix(in oklab, var(--olive) 55%, transparent)", color: "var(--olive)" }}
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </div>
        </button>
      )}
      <div
        className="mobile-frame relative flex min-h-dvh flex-col"
        style={{ background: mode === "choice" ? "var(--bordeaux)" : "var(--paper)" }}
      >
        <header className="flex items-center justify-between px-8 pt-10">
          <div>
            {mode !== "choice" ? (
              <button
                type="button"
                onClick={() => { setMode("choice"); setError(null); setInfo(null); }}
                className="mono-label hover:text-dusk"
              >
                ← Retour
              </button>
            ) : (
              <LegatoMark to="/start" variant="paper" size={24} />
            )}
          </div>
        </header>

        <div className="relative z-10 flex flex-1 flex-col px-8 pb-12 pt-12">
          {mode !== "choice" && (
            <p className="mono-label">
              {mode === "signin" ? "Se reconnecter" : "Créer un espace"}
            </p>
          )}
          <h1 className={mode === "choice" ? "legato-ref-display text-[color:var(--paper)]" : "mt-6 font-serif text-[48px] leading-[0.98] text-dusk text-balance"} style={{ fontWeight: 400, letterSpacing: 0 }}>
            {mode === "signin" ? (
              <>Ravi de vous<br />revoir.</>
            ) : mode === "signup" ? (
              <>Votre espace,<br />en quelques mots.</>
            ) : (
              <>Préparer<br />un <span className="italic" style={{ color: "var(--rose)" }}>adieu</span>,<br />garder une<br /><span className="italic" style={{ color: "var(--rose)" }}>présence</span>.</>
            )}
          </h1>

          <div className="mt-auto pt-12 flex flex-col gap-3">
            {mode === "choice" && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(null); setInfo(null); }}
                  className="block rounded-[6px] text-center px-6 py-4 transition-transform active:scale-[0.99]"
                  style={{ background: "var(--paper)", color: "var(--bordeaux)" }}
                >
                  <span className="block mono-label" style={{ color: "var(--bordeaux)", letterSpacing: "0.22em" }}>Créer son espace</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(null); setInfo(null); }}
                  className="rounded-[6px] border px-6 py-4 text-center transition-colors"
                  style={{ borderColor: "color-mix(in oklab, var(--paper) 70%, transparent)", color: "var(--paper)" }}
                >
                  <span className="block mono-label" style={{ color: "var(--paper)", letterSpacing: "0.22em" }}>Se reconnecter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuote(true)}
                  className="mt-2 text-center py-2"
                >
                  <span className="block mono-label" style={{ color: "color-mix(in oklab, var(--paper) 80%, transparent)", letterSpacing: "0.22em" }}>Continuer en tant qu'invité</span>
                </button>
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