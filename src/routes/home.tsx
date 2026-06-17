import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato } from "@/lib/legato-state";
import { getDailyFocus } from "@/lib/emotional.functions";
import { supabase } from "@/integrations/supabase/client";
import { LinearProgress, RingProgress, SupportCircle } from "@/components/legato/EditorialUI";

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
        <section className="px-6 pt-10 pb-2">
          <p className="mono-label">{greeting}{name ? `, ${name}` : ""}</p>
          <h1 className="mt-4 ed-page-title text-[40px]">
            Comment allez-vous
            <br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>aujourd'hui&nbsp;?</span>
          </h1>
        </section>

        {/* Tableau du jour — carte butter pleine (style INSPI3) */}
        <section className="px-5 pt-7">
          <Link
            to="/presence"
            className="block rounded-[20px] px-6 pt-6 pb-5"
            style={{ background: "var(--sun)", color: "var(--dusk)" }}
          >
            <p className="mono-label">Tableau du jour</p>
            <h2 className="mt-4 ed-section-title text-[30px] max-w-[14ch]">
              Ce qui compte,
              <br />
              <span className="italic">aujourd'hui.</span>
            </h2>
            <p className="mt-3 text-[13.5px] leading-[1.55] text-dusk/70 max-w-[28ch]">
              Prenez un moment pour vous recentrer.
            </p>
            <div className="mt-5 flex items-center justify-end">
              <span
                className="h-11 w-11 rounded-full grid place-items-center text-paper text-[18px]"
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
        <section className="px-6 pt-12">
          <p className="mono-label">Démarches</p>
          <div className="mt-2 h-px bg-dusk/12" />
          <Link to="/practical" className="mt-6 flex items-center gap-6">
            <RingProgress value={tasksPct} size={132} stroke={11}
              label={<span className="font-serif text-[30px] leading-none text-dusk">{tasksPct}%</span>}
            />
            <div className="min-w-0">
              <p className="font-serif text-[24px] leading-[1.1] text-dusk">Avancer à<br/><span className="italic">votre rythme.</span></p>
              <p className="mt-3 text-[12.5px] text-dusk/65">
                {tasksDone} étapes terminées · {tasksTotal - tasksDone} à venir
              </p>
              <p className="mt-3 mono-label" style={{ color: "var(--terracotta)" }}>Voir le plan →</p>
            </div>
          </Link>
        </section>

        {/* Cercle de soutien — schéma sobre (style INSPI2) */}
        <section className="px-6 pt-12">
          <p className="mono-label">Cercle de soutien</p>
          <div className="mt-2 h-px bg-dusk/12" />
          <div className="mt-4 flex justify-center">
            <SupportCircle
              size={240}
              members={[
                { initial: "J", name: "Jordan", color: "var(--sun)" },
                { initial: "R", name: "Riley",  color: "var(--sky)" },
                { initial: "A", name: "Alex",   color: "var(--olive)" },
                { initial: "S", name: "Sam",    color: "var(--blush)" },
              ]}
            />
          </div>
          <Link to="/community" className="mt-4 block text-center mono-label hover:text-dusk" style={{ color: "var(--terracotta)" }}>
            Voir votre cercle →
          </Link>
        </section>

        {/* Suggestion serveur (si présente) */}
        {focus && (
          <section className="px-6 pt-12">
            <p className="mono-label">Suggestion du moment</p>
            <div className="mt-2 h-px bg-dusk/12" />
            <Link to={focus.cta.to} className="mt-5 block">
              <p className="font-serif italic text-[22px] leading-[1.15] text-dusk max-w-[20ch]">
                « {focus.title} »
              </p>
              <p className="mt-3 text-[13px] text-dusk/70 leading-[1.55] max-w-[34ch]">{focus.body}</p>
              <p className="mt-4 mono-label" style={{ color: "var(--terracotta)" }}>{focus.cta.label} →</p>
            </Link>
          </section>
        )}

        {/* Aide */}
        <section className="px-6 pt-12">
          <p className="mono-label">Si aujourd'hui pèse trop</p>
          <div className="mt-2 h-px bg-dusk/12" />
          <Link to="/crisis" className="mt-4 inline-block font-serif italic text-[18px]"
            style={{ color: "var(--terracotta)" }}>
            Demander de l'aide →
          </Link>
        </section>

        <LinearProgress value={tasksPct} color="transparent" />
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
