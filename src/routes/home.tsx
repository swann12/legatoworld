import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato } from "@/lib/legato-state";

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
  const greeting = greetingForHour();
  // Démarches : valeurs maquettes (à brancher Vague 3).
  const tasksDone = 6;
  const tasksTotal = 14;
  const tasksPct = Math.round((tasksDone / tasksTotal) * 100);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        {/* Header simple : logo + label espace */}
        <header className="px-6 pt-9 pb-6 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <span className="eyebrow">Aujourd'hui</span>
        </header>

        {/* HERO — phrase éditoriale */}
        <section className="px-6 pb-10">
          <p className="eyebrow">{greeting}, {name}</p>
          <h1 className="mt-5 display-xl">
            Vous n'avez pas à porter ça <span className="italic" style={{ color: "var(--terracotta)" }}>seul·e</span>.
          </h1>
          <p className="mt-5 body-meta max-w-[34ch]">
            Voici ce qui compte aujourd'hui — sans urgence inutile, à votre rythme.
          </p>
        </section>

        {/* PRIORITÉ DU JOUR — carte tomato pleine */}
        <section className="px-5">
          <Link
            to="/parcours/$taskId"
            params={{ taskId: "pf" }}
            className="block card-tomato px-6 py-7 transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <span className="eyebrow-on-dark">À faire maintenant</span>
              <span className="chip" style={{ background: "color-mix(in oklab, var(--paper) 22%, transparent)", color: "var(--paper)" }}>
                48 h
              </span>
            </div>
            <p className="mt-5 font-serif text-[32px] leading-[0.98] font-normal max-w-[14ch]">
              Contacter les pompes funèbres.
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed opacity-85 max-w-[28ch]">
              On vous guide étape par étape. Vous pouvez aussi déléguer cette tâche.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-[12px] font-medium tracking-[0.14em] uppercase opacity-90">Commencer</span>
              <span className="font-serif text-[22px]">→</span>
            </div>
          </Link>
        </section>

        {/* HUMEUR + DÉMARCHES — 2 colonnes égales */}
        <section className="mt-4 px-5 grid grid-cols-2 gap-3">
          <Link to="/journal" className="card-sardine px-5 py-5 flex flex-col justify-between min-h-[164px]">
            <div>
              <p className="eyebrow">Comment ça va</p>
              <p className="h-section mt-3">Faire le point.</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              {[ "var(--terracotta)", "var(--sun)", "var(--bordeaux)", "var(--blush)", "var(--olive)" ].map((c, i) => (
                <span key={i} className="h-2 w-2 rounded-full" style={{ background: c, opacity: i === 0 ? 1 : 0.35 }} />
              ))}
            </div>
          </Link>

          <Link to="/practical" className="card-butter px-5 py-5 flex flex-col justify-between min-h-[164px]">
            <div>
              <p className="eyebrow">Mes démarches</p>
              <p className="h-section mt-3">{tasksDone} / {tasksTotal}</p>
            </div>
            <div className="mt-4">
              <div className="h-1.5 w-full rounded-full" style={{ background: "color-mix(in oklab, var(--dusk) 12%, transparent)" }}>
                <div className="h-full rounded-full" style={{ width: `${tasksPct}%`, background: "var(--bordeaux)" }} />
              </div>
              <p className="mt-2 text-[11px] tracking-[0.04em] text-dusk/65">{tasksPct}% du chemin parcouru</p>
            </div>
          </Link>
        </section>

        {/* CERCLE + IA — 2 colonnes */}
        <section className="mt-3 px-5 grid grid-cols-2 gap-3">
          <Link to="/community" className="card-blush px-5 py-5 flex flex-col justify-between min-h-[140px]">
            <p className="eyebrow">Mon cercle</p>
            <div>
              <div className="flex -space-x-2">
                {["M", "J", "A", "+"].map((l) => (
                  <span
                    key={l}
                    className="size-8 rounded-full grid place-items-center text-[12px] font-medium border-2 border-blush"
                    style={{ background: "var(--paper)", color: "var(--dusk)" }}
                  >
                    {l}
                  </span>
                ))}
              </div>
              <p className="h-section mt-3">3 proches</p>
            </div>
          </Link>

          <Link to="/presence" className="card-oven px-5 py-5 flex flex-col justify-between min-h-[140px]">
            <p className="eyebrow-on-dark">Parler maintenant</p>
            <div>
              <p className="font-serif text-[22px] leading-[1.05] max-w-[10ch]">Une présence calme.</p>
              <p className="mt-2 text-[11px] tracking-[0.04em] opacity-75">Disponible à toute heure</p>
            </div>
          </Link>
        </section>

        {/* MÉMOIRE — entrée éditoriale */}
        <section className="mt-3 px-5">
          <Link to="/garden" className="card-olive block px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="eyebrow-on-dark">Le jardin</span>
              <span className="font-serif text-[20px] opacity-80">→</span>
            </div>
            <p className="mt-3 font-serif text-[26px] leading-[1.02] max-w-[16ch]">
              Garder <span className="italic">vivant</span> ce qui compte.
            </p>
            <p className="mt-2 text-[12.5px] opacity-80 max-w-[34ch]">
              Une parcelle pour chaque être aimé. Photos, sons, fleurs, rituels.
            </p>
          </Link>
        </section>

        {/* Aide en cas de besoin */}
        <section className="mt-8 px-7">
          <Link
            to="/crisis"
            className="text-[12.5px] underline underline-offset-4"
            style={{ color: "var(--terracotta)" }}
          >
            Si aujourd'hui pèse trop — appel d'aide →
          </Link>
        </section>
      </div>
    </Shell>
  );
}

function greetingForHour() {
  if (typeof window === "undefined") return "Bonjour";
  const h = new Date().getHours();
  if (h < 5) return "Bonne nuit";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}
