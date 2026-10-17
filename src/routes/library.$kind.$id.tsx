import { ArrowLeft } from "lucide-react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Spec, PrimaryButton } from "@/components/legato/ds";
import { getLibItem, toggleSaved, useSaved } from "@/lib/library-data";

export const Route = createFileRoute("/library/$kind/$id")({
  loader: ({ params }) => {
    const item = getLibItem(params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.item.title} ${loaderData.item.titleEnd ?? ""} — Legato` },
          { name: "description", content: loaderData.item.summary },
          { property: "og:title", content: `${loaderData.item.title} ${loaderData.item.titleEnd ?? ""}` },
          { property: "og:description", content: loaderData.item.summary },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary" },
        ]
      : [{ title: "Ressource introuvable — Legato" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => <StandardLayout space="support" back="/care/resources" backLabel="Lire, écouter"><p className="mt-12">Cette ressource n'existe plus.</p></StandardLayout>,
  component: Ressource,
});

function Ressource() {
  const { item } = Route.useLoaderData();
  const saved = useSaved().includes(item.id);
  return (
    <StandardLayout space="support" headerLeft={<Link to="/care/resources" search={{ tab: item.kind }} className="lg-library-back"><ArrowLeft className="size-4" strokeWidth={1} />{item.kind === "voir" ? "Voir" : "Lire, écouter, voir"}</Link>} activeTab="/care" className="lg-library">
      <p className="lg-mono pt-[30px]">{[item.type, item.country, item.year, item.length].filter(Boolean).join(" · ")}</p>
      <PageTitle size={item.kind === "voir" ? 38 : 34} className="mt-[10px]">{item.title}{item.kind === "voir" ? "." : item.titleEnd && <><br /><em>{item.titleEnd}</em></>}</PageTitle>
      <p className="lg-library-sub mt-2">{item.author}</p>
      <section className="lg-library-summary mt-6">{item.summary}</section>
      <Spec space="support" className="mt-6" items={[{ label: "Pour qui", value: item.forWho }, { label: item.kind === "voir" ? "Moment" : "Quand", value: item.when }, { label: item.kind === "voir" ? "Ton" : "Comment", value: item.tone ?? item.how }]} />
      <div className="mt-6 flex flex-wrap items-center gap-[22px]">
        <PrimaryButton space="support" onClick={() => toggleSaved(item.id)}>{saved ? "Gardé pour plus tard" : "Garder pour plus tard"}</PrimaryButton>
        <a href={item.where} target="_blank" rel="noreferrer" className="text-[13.5px] underline underline-offset-4" style={{ color: "var(--sp-stroke)" }}>{item.kind === "voir" ? "Où le voir" : "Où le trouver"}</a>
      </div>
    </StandardLayout>
  );
}
