import { createFileRoute, Link } from "@tanstack/react-router";
import { categoriesBySpace, type ResourceSpace } from "@/lib/resources-data";
import { z } from "zod";
import { StandardLayout, PageTitle, Lead, Row } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/resources/")({
  validateSearch: (s) =>
    z.object({ space: z.enum(["care", "practical"]).optional() }).parse(s),
  head: () => legatoHead("Ressources et accompagnement", "Des professionnels et des repères pour vous accompagner."),
  component: ResourcesIndex,
});

function ResourcesIndex() {
  const { space } = Route.useSearch();
  const activeSpace: ResourceSpace = space ?? "care";
  const cats = categoriesBySpace(activeSpace);
  const eyebrow = activeSpace === "care" ? "Ressources · Soi" : "Ressources · Démarches";
  const title = activeSpace === "care" ? (
    <>Des appuis <em>pour vous</em>.</>
  ) : (
    <>Les bonnes <em>personnes</em>, au bon moment.</>
  );
  const subtitle = activeSpace === "care"
    ? "Thérapeutes, lignes d'écoute, groupes et guides — choisis avec soin."
    : "Professionnels, aides administratives et repères utiles pour avancer sans surcharge.";
  return (
    <StandardLayout space={activeSpace === "care" ? "support" : "practical"} back={activeSpace === "care" ? "/care/help" : "/practical/pros"} backLabel="Ressources" activeTab={activeSpace === "care" ? "/care" : "/practical"}>
        <section className="pt-8 pb-6">
          <p className="mono-label">{eyebrow}</p>
          <PageTitle className="mt-3">{title}</PageTitle>
          <Lead className="mt-3">{subtitle}</Lead>

        </section>

        <section>
          {cats.map(({ id, label, intent }) => <Row key={id} title={label} subtitle={intent} to="/resources/$category" params={{ category: id }} icon="arrow" />)}
        </section>
    </StandardLayout>
  );
}
