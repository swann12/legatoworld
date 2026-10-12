import { createFileRoute, notFound } from "@tanstack/react-router";
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
    <StandardLayout space="support" back="/care/resources" backLabel="Lire, écouter" activeTab="/care">
      <p className="lg-mono mt-10">{[item.type, item.length, item.year].filter(Boolean).join(" · ")}</p>
      <PageTitle space="support" className="mt-3">{item.title}{item.titleEnd && <><br /><em>{item.titleEnd}</em></>}</PageTitle>
      <p className="mt-3 text-[14.5px]" style={{ color: "var(--sp-sub)" }}>{item.author}</p>
      <section className="mt-8 p-6" style={{ background: "var(--sp-block)", fontFamily: "var(--lg-serif)", fontSize: 19, lineHeight: 1.35 }}>{item.summary}</section>
      <Spec space="support" className="mt-6" items={[{ label: "Pour qui", value: item.forWho }, { label: "Quand", value: item.when }, { label: "Comment", value: item.how }]} />
      <div className="mt-7 flex items-center gap-6">
        <PrimaryButton space="support" onClick={() => toggleSaved(item.id)}>{saved ? "Gardé ✓" : "Garder pour plus tard"}</PrimaryButton>
        <a href={item.where} target="_blank" rel="noreferrer" className="text-[13.5px] underline underline-offset-4" style={{ color: "var(--sp-stroke)" }}>Où le trouver</a>
      </div>
    </StandardLayout>
  );
}
