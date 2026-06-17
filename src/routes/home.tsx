import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato } from "@/lib/legato-state";
import { getDailyFocus } from "@/lib/emotional.functions";
import { supabase } from "@/integrations/supabase/client";

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
        {/* Folio header */}
        <header className="px-6 pt-8 pb-6">
          <div className="folio">
            <LegatoMark to="/space" size={22} />
            <span>Espace · Soi</span>
          </div>
        </header>

        {/* HERO — index marginal + titre éditorial */}
        <section className="px-6 pb-10">
          <p className="eyebrow">{greeting}, {name}</p>
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 items-start">
            <span className="index-num leading-none -mt-1">№</span>
            <h1 className="ed-title text-[46px]">
              Vous n'avez pas à
              <br />
              porter ça
              <br />
              <span className="italic" style={{ color: "var(--terracotta)" }}>seul·e</span>.
            </h1>
          </div>
          <p className="mt-7 body-meta max-w-[32ch] pl-[3.25rem]">
            Voici ce qui compte aujourd'hui — sans urgence inutile, à votre rythme.
          </p>
        </section>

        {focus && (
          <section className="px-6 pb-8">
            <div className="rule-label mb-5"><span>Suggestion du moment</span></div>
            <Link to={focus.cta.to} className="block py-1">
              <p className="font-serif italic text-[26px] leading-[1.05] text-dusk max-w-[18ch]">
                « {focus.title} »
              </p>
              <p className="mt-3 text-[13px] text-dusk/70 leading-[1.55] max-w-[34ch]">{focus.body}</p>
              <p className="mt-4 eyebrow text-dusk">{focus.cta.label} <span aria-hidden>→</span></p>
            </Link>
          </section>
        )}

        {/* Rule */}
        <div className="px-6 pb-5">
          <div className="rule-label"><span>Aujourd'hui</span></div>
        </div>

        {/* PRIORITÉ DU JOUR — carte tomato pleine */}
        <section className="px-5">
          <Link
            to="/parcours/$taskId"
            params={{ taskId: "pf" }}
            className="plate card-tomato px-6 pt-7 pb-6 transition-transform active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="eyebrow-on-dark">À faire maintenant</span>
              <span className="index-num-sm opacity-80">01</span>
            </div>
            <p className="mt-5 font-serif text-[34px] leading-[0.96] tracking-[-0.01em] font-normal max-w-[13ch]">
              Contacter les <span className="italic">pompes funèbres</span>.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed opacity-85 max-w-[30ch]">
              On vous guide étape par étape. Vous pouvez aussi déléguer cette tâche.
            </p>
            <div className="plate-caption">
              <span>Sous 48 h</span>
              <span>Commencer →</span>
            </div>
          </Link>
        </section>

        {/* HUMEUR + DÉMARCHES — split asymétrique 60/40 */}
        <section className="mt-4 px-5 grid grid-cols-5 gap-3">
          <Link to="/journal" className="plate card-sardine col-span-3 px-5 pt-5 pb-4 flex flex-col justify-between min-h-[180px]">
            <div>
              <div className="flex items-start justify-between">
                <p className="eyebrow">Comment ça va</p>
                <span className="index-num-sm opacity-75">02</span>
              </div>
              <p className="mt-4 font-serif text-[26px] leading-[1.02] max-w-[10ch]">
                Faire le <span className="italic">point</span>.
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {[ "var(--terracotta)", "var(--sun)", "var(--bordeaux)", "var(--blush)", "var(--olive)" ].map((c, i) => (
                <span key={i} className="h-2 w-2 rounded-full" style={{ background: c, opacity: i === 0 ? 1 : 0.35 }} />
              ))}
            </div>
            <div className="plate-caption">
              <span>Journal</span>
              <span>→</span>
            </div>
          </Link>

          <Link to="/practical" className="plate card-butter col-span-2 px-4 pt-5 pb-4 flex flex-col justify-between min-h-[180px]">
            <div>
              <p className="eyebrow">Démarches</p>
              <p className="mt-4 font-serif italic text-[40px] leading-[0.95]">{tasksDone}<span className="not-italic text-dusk/45">/{tasksTotal}</span></p>
            </div>
            <div>
              <div className="h-1.5 w-full rounded-full" style={{ background: "color-mix(in oklab, var(--dusk) 12%, transparent)" }}>
                <div className="h-full rounded-full" style={{ width: `${tasksPct}%`, background: "var(--bordeaux)" }} />
              </div>
              <p className="mt-2 text-[10.5px] tracking-[0.12em] uppercase text-dusk/65">{tasksPct}% parcouru</p>
            </div>
          </Link>
        </section>

        {/* CERCLE + IA — split asymétrique inverse 40/60 */}
        <section className="mt-3 px-5 grid grid-cols-5 gap-3">
          <Link to="/community" className="plate card-blush col-span-2 px-4 pt-5 pb-4 flex flex-col justify-between min-h-[150px]">
            <p className="eyebrow">Le cercle</p>
            <div>
              <div className="flex -space-x-2">
                {["M", "J", "A", "+"].map((l) => (
                  <span
                    key={l}
                    className="size-7 rounded-full grid place-items-center text-[11px] font-medium border-2 border-blush"
                    style={{ background: "var(--paper)", color: "var(--dusk)" }}
                  >
                    {l}
                  </span>
                ))}
              </div>
              <p className="mt-3 font-serif text-[22px] leading-[1.05]"><span className="italic">trois</span> proches</p>
            </div>
          </Link>

          <Link to="/presence" className="plate card-oven col-span-3 px-5 pt-5 pb-4 flex flex-col justify-between min-h-[150px]">
            <div className="flex items-start justify-between">
              <p className="eyebrow-on-dark">Parler maintenant</p>
              <span className="index-num-sm opacity-70">03</span>
            </div>
            <div>
              <p className="font-serif text-[24px] leading-[1.02] max-w-[12ch]">Une présence <span className="italic">calme</span>.</p>
              <p className="mt-2 text-[10.5px] tracking-[0.14em] uppercase opacity-75">à toute heure</p>
            </div>
          </Link>
        </section>

        {/* MÉMOIRE — pleine carte avec caption */}
        <section className="mt-3 px-5">
          <Link to="/garden" className="plate card-olive px-6 pt-6 pb-5">
            <div className="flex items-start justify-between">
              <span className="eyebrow-on-dark">Le jardin</span>
              <span className="index-num-sm opacity-75">04</span>
            </div>
            <p className="mt-4 font-serif text-[28px] leading-[1.0] tracking-[-0.005em] max-w-[16ch]">
              Garder <span className="italic">vivant</span> ce qui compte.
            </p>
            <p className="mt-2 text-[12.5px] leading-[1.55] opacity-80 max-w-[34ch]">
              Une parcelle pour chaque être aimé. Photos, sons, fleurs, rituels.
            </p>
            <div className="plate-caption">
              <span>Mémoire</span>
              <span>Entrer →</span>
            </div>
          </Link>
        </section>

        {/* Aide en cas de besoin */}
        <section className="mt-10 px-6">
          <div className="rule-label mb-4"><span>Si aujourd'hui pèse trop</span></div>
          <Link
            to="/crisis"
            className="font-serif italic text-[18px]"
            style={{ color: "var(--terracotta)" }}
          >
            Demander de l'aide →
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
