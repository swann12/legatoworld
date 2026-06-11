import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { SpaceHeader } from "@/components/legato/SpaceHeader";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Être accompagné·e — Legato" },
      { name: "description", content: "Un lieu calme pour souffler, parler, écrire ou se souvenir." },
    ],
  }),
  component: Home,
});

/* ─── Accueil ÊTRE ACCOMPAGNÉ·E ───
 * Cinq actions principales. Une rubrique secondaire « Pour aller plus loin ».
 * Aucune démarche, aucun pro funéraire, aucun budget. */

const ACTIONS = [
  { to: "/presence",  title: "Parler à une présence",  sub: "Une oreille calme.",          tint: "var(--terracotta)" },
  { to: "/journal",   title: "Écrire quelques mots",   sub: "Une page intime.",            tint: "var(--blush)" },
  { to: "/garden",    title: "Entrer dans le jardin",  sub: "Ceux qui comptent.",          tint: "var(--sage)" },
  { to: "/no-words",  title: "Respirer un instant",    sub: "Souffle guidé.",              tint: "var(--mist)" },
  { to: "/community", title: "Un soutien humain",      sub: "Proches, groupes, pros.",     tint: "var(--peach)" },
];

const FURTHER = [
  { to: "/inspiration", label: "Rituels" },
  { to: "/inspiration", label: "Lectures" },
  { to: "/inspiration", label: "Films" },
  { to: "/inspiration", label: "Podcasts" },
  { to: "/community",   label: "Groupes d'entraide" },
  { to: "/resources",   label: "Ressources utiles" },
];

function Home() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <SpaceHeader space="care" />

        <section className="px-7 pt-12">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Accueil
          </p>
          <h1 className="mt-4 font-serif text-[34px] leading-[1.05] font-light text-balance">
            Un lieu pour <span className="italic" style={{ color: "var(--terracotta)" }}>souffler.</span>
          </h1>
        </section>

        <section className="mt-8 px-5">
          <ol className="space-y-2.5">
            {ACTIONS.map((a, i) => (
              <li key={a.to + a.title}>
                <Link
                  to={a.to}
                  className="group flex items-start gap-4 rounded-[18px] bg-paper border border-dusk/10 hover:border-dusk/25 px-5 py-4 transition-colors"
                >
                  <span
                    className="mt-1 size-10 rounded-[10px] shrink-0 flex items-center justify-center font-serif italic text-[16px] text-dusk/70"
                    style={{ background: a.tint }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-[19px] leading-snug text-dusk">{a.title}</p>
                    <p className="mt-0.5 text-[12.5px] text-dusk/55">{a.sub}</p>
                  </div>
                  <span className="text-dusk/30 group-hover:text-[color:var(--terracotta)] mt-2">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-9 px-7">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Pour aller plus loin
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {FURTHER.map((f) => (
              <Link
                key={f.label}
                to={f.to}
                className="rounded-full border border-dusk/15 px-3.5 py-1.5 text-[12.5px] text-dusk/75 hover:bg-dusk/5"
              >
                {f.label}
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
        </section>
      </div>
    </Shell>
  );
}