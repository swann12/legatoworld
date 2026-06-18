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
  const [intro, setIntro] = useState(true);
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
      {intro && mode === "choice" && (
        <button
          type="button"
          onClick={() => setIntro(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8 text-left animate-fade-in"
          style={{ background: "var(--blush)" }}
        >
          <div className="mobile-frame w-full">
            <LegatoMark size={22} />
            <p className="mt-10 font-serif italic text-[28px] leading-[1.25] text-dusk">
              « Ce qui a été aimé<br />ne se perd pas&nbsp;:<br />cela devient présence. »
            </p>
            <p className="mt-10 mono-label text-dusk/55">Toucher pour entrer</p>
          </div>
        </button>
      )}
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="px-6 pt-10 flex items-center justify-between">
          {mode !== "choice" ? (
            <button
              type="button"
              onClick={() => { setMode("choice"); setError(null); setInfo(null); }}
              className="mono-label hover:text-dusk"
            >
              ← Retour
            </button>
          ) : <span className="mono-label opacity-0">—</span>}
          <LegatoMark size={20} />
          <span className="mono-label opacity-0">—</span>
        </header>

        <div className="relative z-10 flex flex-1 flex-col px-6 pb-12 pt-10">
          <p className="mono-label">
            {mode === "signin" ? "Se reconnecter" : mode === "signup" ? "Créer un espace" : "Legato"}
          </p>
          <h1 className="mt-5 ed-page-title">
            {mode === "signin" ? (
              <>Ravi de vous <span className="italic" style={{ color: "var(--terracotta)" }}>revoir.</span></>
            ) : mode === "signup" ? (
              <>Votre espace,<br /><span className="italic" style={{ color: "var(--terracotta)" }}>en quelques mots.</span></>
            ) : (
              <>Préparer un adieu,<br /><span className="italic" style={{ color: "var(--terracotta)" }}>garder une présence.</span></>
            )}
          </h1>
          {mode === "choice" && (
            <p className="mt-5 text-[14px] leading-[1.55] text-dusk/65 max-w-[34ch]">
              Composer une cérémonie, écrire ce qui compte, faire vivre le souvenir. À votre rythme.
            </p>
          )}

          <div className="mt-10 flex flex-col gap-3">
            {mode === "choice" && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(null); setInfo(null); }}
                  className="block rounded-[999px] text-[color:var(--paper)] text-center px-6 py-5 transition-transform active:scale-[0.99]"
                  style={{ background: "var(--terracotta)" }}
                >
                  <span className="block font-serif text-[20px] leading-tight">Créer mon espace →</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(null); setInfo(null); }}
                  className="rounded-[999px] border border-dusk/15 bg-[color:var(--whisper)] px-6 py-4 text-center hover:bg-dusk/[0.03] transition-colors"
                >
                  <span className="block font-serif text-[18px] text-dusk">Me reconnecter</span>
                </button>
                <div className="mt-6 flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={goNext}
                    className="mono-label text-dusk/55 hover:text-dusk py-1"
                  >
                    Continuer en tant qu'invité·e
                  </button>
                  <p className="mt-1 text-[11.5px] text-dusk/45 text-center max-w-[28ch]">
                    En mode invité·e, rien n'est conservé d'une session à l'autre.
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