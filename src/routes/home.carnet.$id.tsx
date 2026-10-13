import { createFileRoute } from "@tanstack/react-router";
import { useCarnet } from "@/lib/carnet";
import { longDate, hour } from "@/lib/carnet-model";
import { StandardLayout, PageTitle, Lead, SectionLabel, PrimaryButton } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/home/carnet/$id")({
  head: () => legatoHead("Un rendez-vous du carnet", "Le lieu, qui l'accompagne et vos questions pour ce rendez-vous."),
  component: RdvPage,
});

/** B050 · Un rendez-vous du carnet */
function RdvPage() {
  const { id } = Route.useParams();
  const { rdvs, ready } = useCarnet();
  const r = rdvs.find((x) => x.id === id);
  const [first, ...rest] = (r?.who ?? "").split(",");
  return (
    <StandardLayout back="/home/carnet" backLabel="Le carnet" activeTab="/home">
      {!r ? <><PageTitle className="pt-8">Ce rendez-vous<br /><em>n'est plus dans le carnet.</em></PageTitle>{ready && <Lead className="mt-3">Il a peut-être été retiré par un proche.</Lead>}</> : <>
        <p className="lg-mono pt-8">{[longDate(r.date), hour(r.time)].filter(Boolean).join(" · ")}</p>
        <PageTitle className="mt-3">{first.trim()}{rest.length ? "," : "."}{rest.length > 0 && <><br /><em>{rest.join(",").trim()}.</em></>}</PageTitle>
        <dl className="mt-6">
          {r.place && <div className="py-3" style={{ borderBottom: "1px solid var(--sp-line)" }}><dt className="lg-mono">Où</dt><dd className="mt-1 text-[15px]">{r.place}</dd></div>}
          {r.with && <div className="py-3" style={{ borderBottom: "1px solid var(--sp-line)" }}><dt className="lg-mono">Avec elle</dt><dd className="mt-1 text-[15px]">{r.with}</dd></div>}
        </dl>
        <SectionLabel className="mt-7">Vos questions</SectionLabel>
        {r.questions.length ? r.questions.map((q) => <p key={q} className="py-3 text-[15px]" style={{ borderBottom: "1px solid var(--sp-line)" }}>{q}</p>)
          : <p className="mt-3 text-[14px]" style={{ color: "var(--sp-sub)" }}>Aucune question gardée pour ce rendez-vous.</p>}
        <div className="mt-8"><PrimaryButton to="/home/carnet/note">Noter ce qui a été dit</PrimaryButton></div>
      </>}
    </StandardLayout>
  );
}
