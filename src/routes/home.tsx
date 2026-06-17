import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato } from "@/lib/legato-state";
import { getDailyFocus } from "@/lib/emotional.functions";
import { supabase } from "@/integrations/supabase/client";
import { RingProgress } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Accueil — Legato" },
      { name: "description", content: "Votre tableau de bord : ce qui compte aujourd'hui, votre humeur, vos démarches, votre cercle." },
    ],
  }),
  component: Home,
});

function Home() {
  const { name } = useLegato();
  // Avoid SSR hydration mismatch by computing the greeting client-side only.
  const [greeting, setGreeting] = useState("Bonjour");
  useEffect(() => setGreeting(greetingForHour()), []);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);
  const focusFn = useServerFn(getDailyFocus);
  const { data: focus } = useQuery({
    queryKey: ["daily-focus"],
    queryFn: () => focusFn({}),
    enabled: signedIn,
  });
  // Démarches : valeurs maquettes (à brancher Vague 3).
  const tasksDone = 6;
  const tasksTotal = 14;
  const tasksPct = Math.round((tasksDone / tasksTotal) * 100);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        {/* Page header — mono date + logo + bell */}
        <header className="px-6 pt-7 pb-2 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <span className="mono-label">{new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long" }).format(new Date())}</span>
        </header>

        {/* HERO — accueil sensible */}
        <section className="px-6 pt-12 pb-2">
          <p className="mono-label">{greeting}{name ? `, ${name}` : ""}</p>
          <h1 className="mt-5 font-serif font-normal text-[38px] leading-[1.05] tracking-[-0.01em] text-dusk">
            Comment allez-vous
            <br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>aujourd'hui&nbsp;?</span>
          </h1>
        </section>

        {/* Tableau du jour — carte butter pleine (style INSPI3) */}
        <section className="px-5 pt-9">
          <Link
            to="/presence"
            className="block rounded-[20px] px-6 pt-7 pb-6"
            style={{ background: "var(--sun)", color: "var(--dusk)" }}
          >
            <p className="mono-label">Tableau du jour</p>
            <h2 className="mt-5 font-serif font-normal text-[28px] leading-[1.1] max-w-[14ch]">
              Ce qui compte,
              <br />
              <span className="italic">aujourd'hui.</span>
            </h2>
            <p className="mt-4 text-[13px] leading-[1.55] text-dusk/65 max-w-[28ch]">
              Prenez un moment pour vous recentrer.
            </p>
            <div className="mt-6 flex items-center justify-end">
              <span
                className="h-10 w-10 rounded-full grid place-items-center text-paper text-[16px]"
                style={{ background: "var(--terracotta)" }}
              >→</span>
            </div>
          </Link>
        </section>

        {/* Deux raccourcis — IvoryCards (style INSPI3 Check-in / Mon cercle) */}
        <section className="px-5 pt-3 grid grid-cols-2 gap-3">
          <Link to="/journal" className="rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 pt-5 pb-4 flex flex-col justify-between min-h-[120px]">
            <div>
              <p className="mono-label">Check-in</p>
              <p className="mt-3 font-serif text-[20px] leading-[1.1]">Écoutez-vous<br/>en 1 minute</p>
            </div>
            <span className="self-end text-dusk/55 text-[16px]">→</span>
          </Link>
          <Link to="/community" className="rounded-[18px] px-5 pt-5 pb-4 flex flex-col justify-between min-h-[120px]"
            style={{ background: "var(--blush)" }}>
            <div>
              <p className="mono-label">Mon cercle</p>
              <p className="mt-3 font-serif text-[20px] leading-[1.1]">Vous n'êtes<br/>pas seul·e</p>
            </div>
            <span className="self-end text-dusk/55 text-[16px]">→</span>
          </Link>
        </section>

        {/* Démarches — anneau de progression (style INSPI2 "68%") */}
        <section className="px-6 pt-14">
          <p className="mono-label">Démarches</p>
          <div className="mt-2 h-px bg-dusk/12" />
          <Link to="/practical" className="mt-7 flex items-center gap-6">
            <RingProgress value={tasksPct} size={118} stroke={10}
              label={<span className="font-serif text-[26px] leading-none text-dusk">{tasksPct}%</span>}
            />
            <div className="min-w-0">
              <p className="font-serif text-[22px] leading-[1.15] text-dusk">Avancer à<br/><span className="italic">votre rythme.</span></p>
              <p className="mt-3 text-[12px] text-dusk/60">
                {tasksDone} / {tasksTotal} étapes
              </p>
              <p className="mt-4 mono-label" style={{ color: "var(--terracotta)" }}>Voir le plan →</p>
            </div>
          </Link>
        </section>

        {/* Suggestion serveur (si présente) */}
        {focus && (
          <section className="px-6 pt-14">
            <p className="mono-label">Suggestion du moment</p>
            <div className="mt-2 h-px bg-dusk/12" />
            <Link to={focus.cta.to} className="mt-6 block">
              <p className="font-serif italic text-[20px] leading-[1.2] text-dusk max-w-[22ch]">
                « {focus.title} »
              </p>
              <p className="mt-3 text-[12.5px] text-dusk/65 leading-[1.55] max-w-[34ch]">{focus.body}</p>
              <p className="mt-5 mono-label" style={{ color: "var(--terracotta)" }}>{focus.cta.label} →</p>
            </Link>
          </section>
        )}

        {/* Aide — discret en pied de page */}
        <section className="px-6 pt-16 text-center">
          <Link to="/crisis" className="mono-label tracking-[0.18em] text-dusk/55 hover:text-dusk">
            Si aujourd'hui pèse trop →
          </Link>
        </section>

      </div>
    </Shell>
  );
}

function greetingForHour() {
  const h = new Date().getHours();
  if (h < 5) return "Bonne nuit";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}
