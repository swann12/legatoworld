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

type Stage = "splash" | "choice" | "signin" | "signup" | "quote";

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
  const [stage, setStage] = useState<Stage>("splash");
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
    setStage("quote");
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
      setStage("quote");
    } else {
      setInfo("Vérifiez votre boîte mail pour confirmer votre inscription.");
    }
  };

  // ─── SPLASH ─── centered logo + ENTRER
  if (stage === "splash") {
    return (
      <main className="min-h-dvh" style={{ background: "var(--paper)", color: "var(--dusk)" }}>
        <div className="mobile-frame relative flex min-h-dvh flex-col items-center" style={{ background: "var(--paper)", padding: "60px 40px 72px" }}>
          <div className="flex flex-1 items-center justify-center">
            <LegatoMark to="/start" variant="ink" size={120} stacked />
          </div>
          <button
            type="button"
            onClick={() => setStage("choice")}
            className="rounded-full border transition-colors"
            style={{ borderColor: "color-mix(in oklab, var(--dusk) 30%, transparent)", padding: "12px 38px" }}
          >
            <span className="mono-label" style={{ color: "var(--dusk)", letterSpacing: "0.32em", fontSize: 10 }}>Entrer</span>
          </button>
        </div>
      </main>
    );
  }

  // ─── QUOTE ─── bordeaux full-bleed
  if (stage === "quote") {
    return (
      <main className="min-h-dvh" style={{ background: "var(--bordeaux)" }}>
        <button
          type="button"
          onClick={goNext}
          className="mobile-frame relative flex min-h-dvh w-full flex-col text-center animate-fade-in"
          style={{ background: "var(--bordeaux)", color: "var(--paper)", padding: "60px 40px 56px" }}
          aria-label="Entrer dans Legato"
        >
          <div className="flex flex-1 items-center justify-center">
            <p className="font-serif" style={{ fontSize: 34, lineHeight: 1.15, color: "var(--paper)" }}>
              Rien ne peut<br />ramener<br />l'heure passée,<br />mais nous<br />pouvons<br />trouver de<br />la force dans<br />ce qui<br />demeure.
            </p>
          </div>
          <div className="pt-8">
            <p className="mono-label" style={{ color: "color-mix(in oklab, var(--paper) 78%, transparent)", letterSpacing: "0.24em", fontSize: 9.5, lineHeight: 1.7 }}>
              WILLIAM WORDSWORTH,<br />ODE: INTIMATIONS OF IMMORTALITY
            </p>
          </div>
        </button>
      </main>
    );
  }

  // ─── CHOICE / AUTH ─── cream background
  return (
    <main className="min-h-dvh" style={{ background: "var(--paper)", color: "var(--dusk)" }}>
      <div
        className="mobile-frame relative flex min-h-dvh flex-col"
        style={{ background: "var(--paper)", padding: "38px 40px 60px" }}
      >
        <header className="flex items-center justify-center relative">
          {stage !== "choice" && (
            <button
              type="button"
              onClick={() => { setStage("choice"); setError(null); setInfo(null); }}
              className="mono-label absolute left-0"
              style={{ color: "var(--dusk)" }}
            >
              ← Retour
            </button>
          )}
          <LegatoMark to="/start" variant="ink" size={30} stacked />
        </header>

        <div className="relative z-10 flex flex-1 flex-col items-center text-center pt-16">
          <h1 className="font-serif" style={{ fontSize: 40, lineHeight: 1.08, color: "var(--dusk)", fontWeight: 400 }}>
            {stage === "signin" ? (
              <>Ravi de vous<br />revoir.</>
            ) : stage === "signup" ? (
              <>Votre espace,<br />en quelques mots.</>
            ) : (
              <>Préparer<br />un <span className="italic">adieu</span>,<br />garder une<br /><span className="italic">présence</span>.</>
            )}
          </h1>

          <div className="mt-auto pt-14 w-full flex flex-col gap-3 items-center">
            {stage === "choice" && (
              <div className="flex flex-col gap-3 animate-fade-in w-full items-center">
                <button
                  type="button"
                  onClick={() => { setStage("signup"); setError(null); setInfo(null); }}
                  className="block rounded-full text-center transition-transform active:scale-[0.99]"
                  style={{ background: "var(--blush)", color: "var(--dusk)", padding: "13px 44px", minWidth: 240 }}
                >
                  <span className="mono-label" style={{ letterSpacing: "0.28em", fontSize: 10 }}>Créer son espace</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setStage("signin"); setError(null); setInfo(null); }}
                  className="block rounded-full text-center transition-colors"
                  style={{ background: "color-mix(in oklab, var(--blush) 55%, var(--paper))", color: "var(--dusk)", padding: "13px 44px", minWidth: 240 }}
                >
                  <span className="mono-label" style={{ letterSpacing: "0.28em", fontSize: 10 }}>Se reconnecter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage("quote")}
                  className="mt-1 text-center py-2"
                >
                  <span className="mono-label underline underline-offset-4" style={{ color: "var(--dusk)", letterSpacing: "0.28em", fontSize: 10 }}>Continuer en tant qu'invité</span>
                </button>
                <p className="mt-1 text-center text-[10.5px] leading-relaxed" style={{ color: "color-mix(in oklab, var(--dusk) 55%, transparent)" }}>
                  En mode invité·e, rien n'est conservé d'une session à l'autre.
                </p>
              </div>
            )}

            {stage !== "choice" && (
              <form
                onSubmit={stage === "signin" ? handleSignIn : handleSignUp}
                className="flex flex-col gap-3.5 animate-fade-in w-full text-left"
              >
                {stage === "signup" && (
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
                  autoComplete={stage === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                  <p className="text-[12px] italic" style={{ color: "var(--terracotta)" }}>{error}</p>
                )}
                {info && (
                  <p className="text-[12px] text-dusk/60 italic">{info}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="block rounded-full px-6 py-4 text-center disabled:opacity-50 transition-transform active:scale-[0.99]"
                  style={{ background: "var(--blush)", color: "var(--dusk)" }}
                >
                  <span className="mono-label" style={{ letterSpacing: "0.28em" }}>
                    {loading
                      ? "Un instant…"
                      : stage === "signin"
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