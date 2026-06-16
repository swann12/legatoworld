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

/* ─── Accueil ÊTRE ACCOMPAGNÉ·E ───
 * Cinq actions principales. Une rubrique secondaire « Pour aller plus loin ».
 * Aucune démarche, aucun pro funéraire, aucun budget. */

const ACTIONS = [
  { to: "/presence",  title: "Parler à une présence", sub: "Une oreille calme, sans jugement.", tint: "var(--terracotta)", fg: "var(--paper)" },
  { to: "/journal",   title: "Écrire quelques mots",  sub: "Une page intime.",                  tint: "var(--sun)",         fg: "var(--dusk)" },
  { to: "/garden",    title: "Entrer dans le jardin", sub: "Ceux qui comptent.",                tint: "var(--olive)",       fg: "var(--paper)" },
  { to: "/no-words",  title: "Respirer un instant",   sub: "Souffle guidé.",                    tint: "var(--mist)",        fg: "var(--dusk)" },
  { to: "/community", title: "Un soutien humain",     sub: "Proches, groupes, pros.",           tint: "var(--rose)",        fg: "var(--dusk)" },
];

const FURTHER: { to: string; params?: Record<string, string>; search?: Record<string, string>; label: string; sub: string; tint: string }[] = [
  { to: "/library/$kind", params: { kind: "rituels" },  label: "Rituels",            sub: "Gestes simples",     tint: "var(--rose)" },
  { to: "/library/$kind", params: { kind: "lectures" }, label: "Lectures",           sub: "Livres choisis",     tint: "var(--mist)" },
  { to: "/library/$kind", params: { kind: "films" },    label: "Films",              sub: "À voir doucement",   tint: "var(--mist)" },
  { to: "/library/$kind", params: { kind: "podcasts" }, label: "Podcasts",           sub: "Voix qui apaisent",  tint: "var(--sun)" },
  { to: "/community",     label: "Groupes d'entraide", sub: "Petits cercles",        tint: "var(--olive)" },
  { to: "/resources",     search: { space: "care" },   label: "Accompagnants",       sub: "Thérapeutes proches", tint: "var(--bordeaux)" },
];

function Home() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <SpaceHeader space="care" />

        <section className="px-7 pt-12 pb-7 editorial-hero">
          <p className="editorial-kicker">
            Accueil
          </p>
          <h1 className="mt-4 max-w-[8ch] editorial-display">
            Avancer sans porter <span className="italic" style={{ color: "var(--terracotta)" }}>tout seul·e.</span>
          </h1>
          <div className="mt-6 grid grid-cols-[1.15fr_0.85fr] gap-3">
            <div className="editorial-tint-card min-h-[168px] px-5 py-5" style={{ background: "color-mix(in oklab, var(--sun) 72%, white)" }}>
              <p className="editorial-kicker">Aujourd'hui</p>
              <p className="mt-3 font-serif text-[30px] leading-[0.96]">Ce qui compte, <span className="italic">maintenant.</span></p>
              <p className="mt-4 max-w-[22ch] text-[13px] leading-relaxed text-dusk/65">
                Un point d'entrée plus net, plus calme, plus structuré pour choisir le bon geste.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="editorial-stat-card px-4 py-4 min-h-[78px]" style={{ background: "color-mix(in oklab, var(--mist) 34%, white)" }}>
                <p className="editorial-kicker">Rythme</p>
                <p className="mt-2 font-serif text-[22px] leading-none">Un pas suffit.</p>
              </div>
              <div className="editorial-stat-card px-4 py-4 min-h-[78px]" style={{ background: "color-mix(in oklab, var(--rose) 26%, white)" }}>
                <p className="editorial-kicker">Intention</p>
                <p className="mt-2 text-[13px] leading-relaxed text-dusk/70">Entrer par la présence, l'écriture, le souffle ou le lien.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7 px-5">
          <div className="grid grid-cols-[1.18fr_0.82fr] gap-3">
            <Link
              to={ACTIONS[0].to}
              className="block rounded-[24px] px-6 py-7 transition-transform hover:scale-[0.995] min-h-[236px] editorial-tint-card"
              style={{ background: ACTIONS[0].tint, color: ACTIONS[0].fg }}
            >
              <p className="editorial-kicker" style={{ color: "color-mix(in oklab, currentColor 72%, transparent)" }}>
                Entrée principale
              </p>
              <p className="mt-4 max-w-[8ch] font-serif text-[36px] leading-[0.95] font-normal">
                Parler à une <span className="italic">présence.</span>
              </p>
              <p className="mt-4 text-[13px] leading-relaxed opacity-85 max-w-[24ch]">
                {ACTIONS[0].sub}
              </p>
              <div className="mt-7 flex items-end justify-between gap-3">
                <span className="text-[11px] uppercase tracking-[0.18em] opacity-70" style={{ fontFamily: "var(--font-mono)" }}>
                  Ouvrir
                </span>
                <span className="font-serif text-[22px] leading-none">→</span>
              </div>
            </Link>

            <div className="grid gap-3">
              <Link
                to="/journal"
                className="rounded-[22px] px-5 py-5 min-h-[112px] editorial-tint-card"
                style={{ background: "color-mix(in oklab, var(--sun) 80%, white)", color: "var(--dusk)" }}
              >
                <p className="editorial-kicker">Journal</p>
                <p className="font-serif text-[24px] leading-[1.02]">Écrire</p>
                <p className="mt-2 text-[11.5px] text-dusk/65">Une phrase suffit.</p>
              </Link>
              <Link
                to="/no-words"
                className="rounded-[22px] px-5 py-5 min-h-[112px] editorial-tint-card"
                style={{ background: "color-mix(in oklab, var(--mist) 86%, white)", color: "var(--dusk)" }}
              >
                <p className="editorial-kicker">Souffle</p>
                <p className="font-serif text-[24px] leading-[1.02]">Respirer</p>
                <p className="mt-2 text-[11.5px] text-dusk/65">Sans trouver les mots.</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-4 px-5">
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS.slice(2).map((a, i) => (
              <Link
                key={a.to}
                to={a.to}
                className={`rounded-[20px] px-5 py-5 flex flex-col justify-between transition-transform hover:scale-[0.99] ${
                  i === 0 ? "min-h-[152px]" : i === 1 ? "min-h-[172px]" : "min-h-[152px]"
                } editorial-tint-card`}
                style={{ background: a.tint, color: a.fg }}
              >
                <p className="editorial-kicker" style={{ color: "color-mix(in oklab, currentColor 72%, transparent)" }}>
                  {i === 0 ? "Jardin" : i === 1 ? "Lien" : "Soutien"}
                </p>
                <p className="font-serif text-[22px] leading-[1.06]">{a.title.replace("Entrer dans le ", "")}</p>
                <p className="mt-2 text-[11.5px] opacity-75 max-w-[14ch]">{a.sub}</p>
              </Link>
            ))}
            <Link
              to="/community"
              className="rounded-[20px] px-5 py-5 flex flex-col justify-between min-h-[172px] editorial-tint-card"
              style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
            >
              <p className="editorial-kicker" style={{ color: "color-mix(in oklab, currentColor 72%, transparent)" }}>Communauté</p>
              <p className="font-serif text-[24px] leading-[1.02]">Ne pas rester seule.</p>
              <p className="mt-2 text-[11.5px] opacity-75 max-w-[15ch]">Des personnes et des cercles si vous en ressentez le besoin.</p>
            </Link>
          </div>
        </section>

        <section className="mt-10 px-5">
          <p className="px-2 editorial-kicker">
            Pour aller plus loin
          </p>
          <div className="mt-3 editorial-list">
            {FURTHER.map((f) => (
              <Link
                key={f.label}
                to={f.to as "/library/$kind"}
                params={f.params as { kind: string }}
                search={f.search as { space: "care" }}
                className="px-4 py-4 flex items-center gap-3 border-b last:border-b-0 border-dusk/8 hover:bg-dusk/[0.02] transition-colors"
                style={{ background: "transparent" }}
              >
                <span
                  aria-hidden
                  className="size-9 rounded-full shrink-0 flex items-center justify-center"
                  style={{ background: f.tint }}
                >
                  <span className="text-paper text-[11px]" style={{ color: "color-mix(in oklab, var(--paper) 92%, white)" }}>•</span>
                </span>
                <div className="min-w-0">
                  <p className="font-serif text-[18px] text-dusk leading-tight">{f.label}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-dusk/55 truncate" style={{ fontFamily: "var(--font-mono)" }}>
                    {f.sub}
                  </p>
                </div>
                <span className="ml-auto text-dusk/35">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 px-7">
          <Link
            to="/crisis"
            className="text-[12px] underline underline-offset-4"
            style={{ color: "var(--ember)" }}
          >
            Si ça déborde, appeler à l'aide →
          </Link>
          <div className="mt-3">
            <Link
              to="/help"
              className="text-[12px] text-dusk/60 underline underline-offset-4 hover:text-dusk"
            >
              Besoin d'aide concrète aujourd'hui ?
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}