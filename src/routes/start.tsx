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

type Stage = "splash" | "choice" | "quote" | "signin" | "signup";

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

  const goNext = () => setStage("quote");
  const enterApp = () => navigate({ to: "/onboarding" });

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
    goNext();
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
      goNext();
    } else {
      setInfo("Vérifiez votre boîte mail pour confirmer votre inscription.");
    }
  };

  if (stage === "splash") {
    return (
      <main className="min-h-dvh" style={{ background: "var(--paper)", color: "var(--dusk)" }}>
        <div
          className="mobile-frame relative flex min-h-dvh flex-col items-center justify-center animate-fade-in"
          style={{ background: "var(--paper)", padding: "0 46px 53px" }}
        >
          <div className="flex flex-1 items-center justify-center">
            <LegatoMark to="/start" variant="ink" size={112} stacked />
          </div>
          <button
            type="button"
            onClick={() => setStage("choice")}
            className="rounded-full border transition-colors"
            style={{
              borderColor: "color-mix(in oklab, var(--dusk) 28%, transparent)",
              height: 29,
              width: 94,
            }}
          >
            <span className="mono-label" style={{ color: "var(--dusk)", letterSpacing: "0.22em", fontSize: 7 }}>Entrer</span>
          </button>
        </div>
      </main>
    );
  }

  if (stage === "quote") {
    return (
      <main className="min-h-dvh" style={{ background: "var(--bordeaux)", color: "var(--blush)" }}>
        <div
          className="mobile-frame relative flex min-h-dvh flex-col items-center text-center animate-fade-in"
          style={{ background: "var(--bordeaux)", padding: "70px 34px 49px" }}
          onClick={enterApp}
        >
          <p className="font-serif" style={{ fontSize: 48, lineHeight: 0.94, color: "var(--blush)", fontWeight: 400 }}>
            Rien ne peut<br />ramener<br />l’heure passée,<br />mais nous<br />pouvons<br />trouver de<br />la force dans<br />ce qui<br />demeure.
          </p>
          <p className="mono-label mt-auto" style={{ color: "var(--blush)", fontSize: 6, letterSpacing: "0.14em", lineHeight: 1.55 }}>
            William Wordsworth,<br />Ode: Intimations of Immortality
          </p>
        </div>
      </main>
    );
  }

  if (stage === "choice") {
    return (
      <main className="min-h-dvh" style={{ background: "var(--paper)", color: "var(--dusk)" }}>
        <div className="mobile-frame relative flex min-h-dvh flex-col items-center animate-fade-in" style={{ background: "var(--paper)", padding: "25px 38px 47px" }}>
          <LegatoMark to="/start" variant="ink" size={39} stacked />
          <h1 className="font-serif text-center" style={{ marginTop: 78, fontSize: 52, lineHeight: 0.91, color: "var(--dusk)", fontWeight: 400 }}>
            Préparer<br />un <span className="italic">adieu</span>,<br />garder une<br /><span className="italic">présence</span>.
          </h1>
          <div className="mt-auto flex w-full flex-col items-stretch gap-2">
            <button
              type="button"
              onClick={() => { setStage("signup"); setError(null); setInfo(null); }}
              className="text-center transition-transform active:scale-[0.99]"
              style={{ background: "var(--clay)", color: "var(--dusk)", height: 42, borderRadius: 2 }}
            >
              <span className="mono-label" style={{ color: "var(--dusk)", letterSpacing: "0.18em", fontSize: 9 }}>Créer son espace</span>
            </button>
            <button
              type="button"
              onClick={() => { setStage("signin"); setError(null); setInfo(null); }}
              className="border text-center transition-colors"
              style={{ borderColor: "color-mix(in oklab, var(--dusk) 22%, transparent)", color: "var(--dusk)", height: 42, borderRadius: 2 }}
            >
              <span className="mono-label" style={{ color: "var(--dusk)", letterSpacing: "0.18em", fontSize: 9 }}>Se reconnecter</span>
            </button>
            <button type="button" onClick={goNext} className="pt-2 text-center">
              <span className="mono-label block underline underline-offset-4" style={{ color: "var(--dusk)", letterSpacing: "0.16em", fontSize: 8 }}>Continuer en tant qu’invité</span>
              <span className="mt-2 block text-[10px] leading-[1.35]" style={{ color: "color-mix(in oklab, var(--dusk) 58%, transparent)" }}>
                En mode invité·e, rien n'est conservé d'une session à l'autre.
              </span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── AUTH ─── cream background, same reference proportions
  return (
    <main className="min-h-dvh" style={{ background: "var(--paper)", color: "var(--dusk)" }}>
      <div
        className="mobile-frame relative flex min-h-dvh flex-col"
        style={{ background: "var(--paper)", padding: "42px 46px 58px" }}
      >
        <header className="flex items-center justify-between">
          <LegatoMark to="/start" variant="ink" size={30} />
          <button
            type="button"
            onClick={() => { setStage("choice"); setError(null); setInfo(null); }}
            className="mono-label"
            style={{ color: "color-mix(in oklab, var(--dusk) 62%, transparent)", fontSize: 8.5, letterSpacing: "0.2em" }}
          >
            Retour
          </button>
        </header>

        <div className="relative z-10 flex flex-1 flex-col pt-[78px]">
          <h1 className="font-serif" style={{ fontSize: 38, lineHeight: 1.04, color: "var(--dusk)", fontWeight: 400 }}>
            {stage === "signin" ? (
              <>Ravi de vous<br />revoir.</>
            ) : (
              <>Votre espace,<br />en quelques mots.</>
            )}
          </h1>

          <div className="mt-auto pt-12 w-full flex flex-col gap-3">
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
                  className="block px-6 text-center disabled:opacity-50 transition-transform active:scale-[0.99]"
                  style={{ background: "var(--blush)", color: "var(--dusk)", borderRadius: 2, height: 42 }}
                >
                  <span className="mono-label" style={{ color: "var(--dusk)", letterSpacing: "0.28em", fontSize: 9 }}>
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