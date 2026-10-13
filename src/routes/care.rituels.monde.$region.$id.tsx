import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageTitle, Lead, SectionLabel, PrimaryButton } from "@/components/legato/ds";
import { RitualsLayout, NumberedSteps } from "@/components/legato/RitualsUI";
import { WORLD_REGIONS, WORLD_TRADITIONS } from "@/lib/rituals-catalog";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/monde/$region/$id")({
  loader: ({ params }) => {
    const t = WORLD_TRADITIONS.find((x) => x.id === params.id && x.region === params.region);
    const r = WORLD_REGIONS.find((x) => x.id === params.region);
    if (!t || !r) throw notFound();
    return { t, r };
  },
  head: ({ loaderData }) => loaderData ? legatoHead(`${loaderData.t.title} · ${loaderData.t.place}`, loaderData.t.description) : { meta: [{ title: "Une tradition" }, { name: "robots", content: "noindex" }] },
  component: TraditionSheet,
});

/** B109 · Une tradition expliquée (modèle des 21 fiches) */
function TraditionSheet() {
  const { t, r } = Route.useLoaderData();
  const words = t.title.split(" ");
  const cut = Math.max(1, Math.ceil(words.length / 2));
  return (
    <RitualsLayout back="/care/rituels/monde/$region" backLabel={r.label}>
      <p className="lg-mono pt-8">{[t.place, t.period].filter(Boolean).join(" · ")}</p>
      <PageTitle className="mt-3">{words.slice(0, cut).join(" ")}{words.length > cut && <><br /><em>{words.slice(cut).join(" ")}.</em></>}</PageTitle>
      <Lead className="mt-3">{t.long}</Lead>
      <SectionLabel accent className="mt-8">Ce que cela dit de la mort</SectionLabel>
      <p className="mt-2" style={{ fontFamily: "var(--lg-serif)", fontSize: 19, lineHeight: 1.4 }}>{t.meaning}</p>
      <NumberedSteps title="Ce que l'on peut en garder" items={[...t.keep]} />
      {t.id === "dia-de-muertos" && <div className="mt-8"><PrimaryButton to="/care/rituels/monde/ameriques/ofrenda">Faire une ofrenda chez vous</PrimaryButton></div>}
    </RitualsLayout>
  );
}
