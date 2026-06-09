import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { SpaceSwitcher } from "@/components/legato/SpaceSwitcher";
import { useLegato } from "@/lib/legato-state";
import { useEffect } from "react";

export const Route = createFileRoute("/accompany")({
  head: () => ({
    meta: [
      { title: "Être accompagné·e — Legato" },
      { name: "description", content: "Parler, respirer, écrire — un peu de bien, maintenant." },
    ],
  }),
  component: Accompany,
});

type Door = { to: string; eyebrow: string; title: string; body: string };
const DOORS: Door[] = [
  { to: "/presence", eyebrow: "Présence",  title: "Parler à une présence", body: "Une oreille calme, à toute heure. Vous racontez, ou pas." },
  { to: "/no-words", eyebrow: "Respirer",  title: "Respirer",              body: "Quelques minutes pour reprendre un peu d'air." },
  { to: "/journal",  eyebrow: "Journal",   title: "Écrire",                body: "Déposer une pensée, sans relire." },
  { to: "/no-words", eyebrow: "Sans mots", title: "Sans mots",             body: "Des sons, des lumières, du silence accompagné." },
];

function Accompany() {
  const { space, setSpace } = useLegato();
  // Si l'utilisateur arrive ici, on est dans l'espace psy.
  useEffect(() => {
    if (space !== "psy") setSpace("psy");
  }, [space, setSpace]);
  return (
    <Shell>
      <div className="px-7 pt-10 flex items-center justify-between">
        <Link
          to="/home"
          className="text-[10px] uppercase tracking-[0.3em] text-dusk/55 hover:text-dusk"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← Accueil
        </Link>
        <SpaceSwitcher />
      </div>

      <ScreenHeader
        eyebrow="Être accompagné·e"
        title={<>Choisissez ce qui pourrait vous <span className="italic">faire un peu de bien.</span></>}
        subtitle="Quatre portes, jamais plus. Vous pouvez revenir quand vous voulez."
      />

      <Section className="mt-10 space-y-3">
        {DOORS.map((d, i) => (
          <Link
            key={d.title + i}
            to={d.to}
            className="block rounded-[16px] border border-dusk/12 bg-paper p-5 flex items-baseline gap-4 group hover:bg-dusk/[0.02] transition-colors"
          >
            <span
              className="text-[11px] tracking-[0.18em] text-dusk/45 leading-none w-7 shrink-0"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              0{i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.26em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>
                {d.eyebrow}
              </p>
              <h3 className="mt-1.5 font-serif text-[19px] italic text-dusk leading-snug">{d.title}</h3>
              <p className="mt-2 text-[13px] leading-[1.55] text-dusk/65">{d.body}</p>
            </div>
            <span className="text-dusk/40 group-hover:text-dusk transition">→</span>
          </Link>
        ))}
      </Section>

      <Section className="mt-8">
        <Link
          to="/resources"
          className="block border-t border-dusk/15 pt-5 flex items-baseline justify-between"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-dusk/55" style={{ fontFamily: "var(--font-mono)" }}>
              Découvrir d'autres ressources
            </p>
            <p className="mt-1 font-serif italic text-[17px] text-dusk">
              Groupes, professionnels, rituels, lectures.
            </p>
          </div>
          <span className="text-dusk/55 text-sm">→</span>
        </Link>
      </Section>

      <Section className="mt-10">
        <Link to="/crisis" className="block border-t border-dusk/15 pt-5 flex items-baseline justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--terracotta)]" style={{ fontFamily: "var(--font-mono)" }}>
              Si aujourd'hui pèse trop
            </p>
            <p className="mt-1 font-serif italic text-[17px] text-dusk">Une porte calme, ouverte.</p>
          </div>
          <span className="text-dusk/55 text-sm">→</span>
        </Link>
      </Section>
    </Shell>
  );
}