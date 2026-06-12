import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { SpaceHeader } from "@/components/legato/SpaceHeader";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Prendre soin de soi — Legato" },
      { name: "description", content: "Un lieu calme pour souffler, parler, écrire ou se souvenir." },
    ],
  }),
  component: Home,
});

/* ─── Accueil ÊTRE ACCOMPAGNÉ·E ───
 * Cinq actions principales. Une rubrique secondaire « Pour aller plus loin ».
 * Aucune démarche, aucun pro funéraire, aucun budget. */

const ACTIONS = [
  { to: "/presence",  title: "Parler à une présence", sub: "Une oreille calme, sans jugement.", tint: "var(--terracotta)", fg: "var(--paper)" },
  { to: "/journal",   title: "Écrire quelques mots",  sub: "Une page intime.",                  tint: "var(--blush)",       fg: "var(--dusk)" },
  { to: "/garden",    title: "Entrer dans le jardin", sub: "Ceux qui comptent.",                tint: "var(--sage)",        fg: "var(--dusk)" },
  { to: "/no-words",  title: "Respirer un instant",   sub: "Souffle guidé.",                    tint: "var(--mist)",        fg: "var(--dusk)" },
  { to: "/community", title: "Un soutien humain",     sub: "Proches, groupes, pros.",           tint: "var(--sun)",         fg: "var(--dusk)" },
];

const FURTHER: { to: string; params?: Record<string, string>; search?: Record<string, string>; label: string }[] = [
  { to: "/library/$kind", params: { kind: "rituels" },  label: "Rituels" },
  { to: "/library/$kind", params: { kind: "lectures" }, label: "Lectures" },
  { to: "/library/$kind", params: { kind: "films" },    label: "Films" },
  { to: "/library/$kind", params: { kind: "podcasts" }, label: "Podcasts" },
  { to: "/community",     label: "Groupes d'entraide" },
  { to: "/resources",     search: { space: "care" }, label: "Accompagnants" },
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
            Un lieu calme pour <span className="italic" style={{ color: "var(--terracotta)" }}>souffler.</span>
          </h1>
          <p className="mt-3 text-[13.5px] text-dusk/60 max-w-[36ch]">
            Choisissez ce qui vous ferait le plus de bien maintenant.
          </p>
        </section>

        {/* Carte vedette */}
        <section className="mt-8 px-5">
          <Link
            to={ACTIONS[0].to}
            className="block rounded-[24px] px-6 py-7 transition-transform hover:scale-[0.995]"
            style={{ background: ACTIONS[0].tint, color: ACTIONS[0].fg }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.26em] opacity-70"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Aujourd'hui
            </p>
            <p className="mt-3 font-serif text-[26px] leading-[1.1] font-light">
              Parler à une <span className="italic">présence.</span>
            </p>
            <p className="mt-2 text-[13px] leading-relaxed opacity-85 max-w-[32ch]">
              {ACTIONS[0].sub}
            </p>
          </Link>
        </section>

        {/* Mosaïque douce — 2 colonnes, hauteurs variées */}
        <section className="mt-3 px-5">
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS.slice(1).map((a, i) => (
              <Link
                key={a.to}
                to={a.to}
                className={`rounded-[20px] px-5 py-5 flex flex-col justify-between transition-transform hover:scale-[0.99] ${
                  i === 0 ? "min-h-[140px]" : i === 1 ? "min-h-[170px]" : i === 2 ? "min-h-[170px]" : "min-h-[140px]"
                }`}
                style={{ background: a.tint, color: a.fg }}
              >
                <p className="font-serif text-[20px] leading-[1.1]">{a.title.replace("Entrer dans le ", "").replace("Écrire quelques ", "")}</p>
                <p className="mt-2 text-[11.5px] opacity-75">{a.sub}</p>
              </Link>
            ))}
          </div>
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
                to={f.to as "/library/$kind"}
                params={f.params as { kind: string }}
                search={f.search as { space: "care" }}
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