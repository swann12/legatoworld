import { createFileRoute } from "@tanstack/react-router";
import { Shell, ScreenHeader, Section, NavCard, NavLine } from "@/components/legato/Shell";
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

const DOORS = [
  { to: "/presence", eyebrow: "Présence",  title: "Parler à une présence", body: "Une oreille calme, à toute heure. Vous racontez, ou pas." },
  { to: "/no-words", eyebrow: "Respirer",  title: "Respirer, sans mots",   body: "Quelques minutes pour reprendre un peu d'air." },
  { to: "/journal",  eyebrow: "Journal",   title: "Écrire ce qui pèse",    body: "Déposer une pensée, sans relire." },
] as const;

function Accompany() {
  const { space, setSpace } = useLegato();
  useEffect(() => {
    if (space !== "psy") setSpace("psy");
  }, [space, setSpace]);
  return (
    <Shell>
      <ScreenHeader
        back={{ to: "/home", label: "Aujourd'hui" }}
        eyebrow="Être accompagné·e"
        title="Ce qui pourrait vous faire du bien."
        subtitle="Trois portes, jamais plus. Vous pouvez revenir quand vous voulez."
      />

      <Section className="mt-10 space-y-3">
        {DOORS.map((d) => (
          <NavCard key={d.to} to={d.to} eyebrow={d.eyebrow} title={d.title} body={d.body} />
        ))}
      </Section>

      <Section className="mt-10">
        <NavLine to="/resources" eyebrow="Aller plus loin" title="Thérapeutes, groupes, lectures" />
      </Section>

      <Section className="mt-8 mb-10">
        <NavLine to="/crisis" tone="alert" eyebrow="Si aujourd'hui pèse trop" title="Une porte calme, ouverte." />
      </Section>
    </Shell>
  );
}