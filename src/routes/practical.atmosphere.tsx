import { createFileRoute } from "@tanstack/react-router";
import { Shell, ScreenHeader, Section, NavCard, NavLine } from "@/components/legato/Shell";
import { PersonalSuggestions } from "@/components/legato/PersonalSuggestions";

export const Route = createFileRoute("/practical/atmosphere")({
  head: () => ({ meta: [{ title: "Atmosphère — Legato" }] }),
  component: Atmosphere,
});

const DOORS = [
  { to: "/practical/flowers", eyebrow: "Fleurs",   title: "Composer une ambiance florale", body: "Bouquet, couronne, palette." },
  { to: "/practical/ceremony", eyebrow: "Cérémonie", title: "Préparer le déroulé",         body: "Lieu, format, intervenants." },
  { to: "/practical/booklet", eyebrow: "Livret",   title: "Le livret de cérémonie",        body: "Mettre en page, exporter en PDF." },
];

function Atmosphere() {
  return (
    <Shell>
      <ScreenHeader
        back={{ to: "/practical", label: "Aide concrète" }}
        eyebrow="Atmosphère"
        title="Composer ce qui lui ressemble."
        subtitle="Trois portes simples. Vous pouvez tout sauter et revenir plus tard."
      />
      <Section className="mt-10 space-y-3">
        {DOORS.map((d) => (
          <NavCard key={d.to} to={d.to} eyebrow={d.eyebrow} title={d.title} body={d.body} />
        ))}
      </Section>

      <Section className="mt-10">
        <PersonalSuggestions
          topic="ceremony"
          eyebrow="Déléguer à Legato"
          cta="Composer une trame de cérémonie"
        />
      </Section>

      <Section className="mt-10 mb-10">
        <NavLine to="/circle" eyebrow="Proches" title="Confier une partie de l'atmosphère" />
      </Section>
    </Shell>
  );
}
