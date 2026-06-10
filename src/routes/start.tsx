import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

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

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col bg-paper">
        <header className="flex items-center justify-between px-8 pt-8 pb-5">
          <span
            className="font-serif text-[24px] italic leading-none text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            L
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.24em] text-dusk/45"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {mode === "signin" ? "Connexion" : mode === "signup" ? "Inscription" : "Entrer"}
          </span>
        </header>

        <div className="relative z-10 flex flex-1 flex-col px-8 pt-12 pb-8">
          <section className="max-w-[300px]">
            <p
              className="mb-6 text-[10px] uppercase tracking-[0.24em] text-dusk/45"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Legato
            </p>
            <h1 className="font-serif text-[39px] font-light leading-[1.02] text-dusk text-balance">
              Préparer un adieu,
              <br />
              garder une présence.
            </h1>
          </section>

          <section className="mt-12 border-t border-dusk/10 pt-7">
            <p className="font-serif text-[20px] font-light leading-[1.35] text-dusk max-w-[27ch]">
              Composer une cérémonie, écrire ce qui compte, faire vivre le souvenir.
              <span className="mt-3 block italic text-dusk/62">À votre rythme.</span>
            </p>
          </section>

          <section className="mt-auto grid grid-cols-[1fr_92px] gap-3 pt-12">
            <div className="bg-[color-mix(in_oklab,var(--sky-soft)_58%,var(--paper))] px-4 py-4">
              <p className="font-serif text-[18px] leading-[1.15] text-dusk">Un espace simple, privé, sans urgence.</p>
            </div>
            <div className="bg-[color-mix(in_oklab,var(--sage)_72%,var(--paper))]" aria-hidden />
          </section>
        </div>

        <footer className="px-8 pt-6 pb-10 border-t border-dusk/10 space-y-3 bg-paper">
          <div className="flex flex-col gap-3">
            {mode === "choice" && (
              <div className="flex flex-col gap-3 animate-fade-in">
                {/* CTA principal — surface bordeaux pleine, ancrée */}
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(null); setInfo(null); }}
                  className="group w-full rounded-full px-7 py-4 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
                  style={{ background: "var(--ink)", color: "var(--paper)" }}
                >
                  <span
                    className="text-[11px] uppercase tracking-[0.28em]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Créer mon espace
                  </span>
                </button>
                {/* Lien secondaire — filet ghost */}
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(null); setInfo(null); }}
                  className="w-full rounded-full border border-dusk/20 bg-transparent px-7 py-3.5 text-[10.5px] uppercase tracking-[0.22em] text-dusk/80 hover:bg-dusk/[0.04] transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Me reconnecter
                </button>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={goNext}
                    className="block w-full text-[10px] uppercase tracking-[0.22em] text-dusk/60 hover:text-dusk transition-colors mb-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Continuer en invité·e
                  </button>
                  <p className="text-[11px] text-dusk/45 italic">
                    Ce que vous écrivez ne sera pas conservé.
                  </p>
                </div>
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
                  className="block rounded-full text-[color:var(--paper)] px-6 py-4 text-center disabled:opacity-50 transition-opacity hover:opacity-95"
                  style={{ background: "var(--ink)" }}
                >
                  <span className="block eyebrow text-[color:var(--paper)] tracking-[0.24em]">
                    {loading
                      ? "Un instant…"
                      : mode === "signin"
                        ? "Entrer"
                        : "Créer mon espace"}
                  </span>
                </button>

                <div className="flex items-center gap-3 py-1">
                  <span className="h-px flex-1 bg-dusk/15" />
                  <span
                    className="text-[9.5px] uppercase tracking-[0.28em] text-dusk/40"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    ou
                  </span>
                  <span className="h-px flex-1 bg-dusk/15" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="rounded-full border border-dusk/20 bg-paper px-7 py-3.5 text-center text-[11px] uppercase tracking-[0.24em] text-dusk/75 hover:bg-dusk/5 transition-colors disabled:opacity-50"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Continuer avec Google
                </button>

                <button
                  type="button"
                  onClick={() => { setMode("choice"); setError(null); setInfo(null); }}
                  className="mt-1 text-center text-[10px] uppercase tracking-[0.24em] text-dusk/45 hover:text-dusk transition-colors py-1"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Retour
                </button>
              </form>
            )}
          </div>
        </footer>
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
        style={{ fontFamily: "var(--font-mono)" }}
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