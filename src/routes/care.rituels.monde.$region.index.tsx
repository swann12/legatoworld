import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageTitle } from "@/components/legato/ds";
import { RitualsLayout } from "@/components/legato/RitualsUI";
import { WORLD_REGIONS, WORLD_TRADITIONS } from "@/lib/rituals-catalog";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/monde/$region/")({
  loader: ({ params }) => { const r = WORLD_REGIONS.find((x) => x.id === params.region); if (!r) throw notFound(); return r; },
  head: ({ loaderData }) => loaderData ? legatoHead(`Rituels du monde · ${loaderData.label}`, `${loaderData.title.join(" ")} Traditions : ${loaderData.countries}.`) : { meta: [{ title: "Rituels du monde" }, { name: "robots", content: "noindex" }] },
  component: Region,
});

/** B104–B108 · Une région */
function Region() {
  const r = Route.useLoaderData();
  const list = WORLD_TRADITIONS.filter((t) => t.region === r.id);
  return (
    <RitualsLayout back="/care/rituels/monde" backLabel="Rituels du monde">
      <PageTitle className="pt-8">{r.title[0]}<br /><em>{r.title[1]}</em></PageTitle>
      <div className="mt-6">
        {list.map((t, i) => (
          <Link key={t.id} to="/care/rituels/monde/$region/$id" params={{ region: r.id, id: t.id }} className="block py-5" style={{ borderBottom: i < list.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
            <p className="lg-mono" style={{ color: "var(--sp-accent)" }}>{t.period ? [t.place.split(" · ")[0], t.period].join(" · ") : t.place}</p>
            <p className="lg-title mt-2" style={{ fontSize: 22 }}>{t.title}</p>
            <p className="mt-1 text-[14px]" style={{ color: "var(--sp-sub)" }}>{t.description}</p>
          </Link>
        ))}
      </div>
    </RitualsLayout>
  );
}
