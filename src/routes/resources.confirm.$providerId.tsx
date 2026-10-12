import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { StandardLayout, PageTitle, Lead, Spec, PrimaryButton, TextLink } from "@/components/legato/ds";
import { getProvider } from "@/lib/resources-data";
import { useAppointments, removeAppointment, fmtWhen, IMPORTANCE } from "@/lib/appointments-store";

export const Route = createFileRoute("/resources/confirm/$providerId")({
  validateSearch: z.object({ id: z.string().optional() }),
  loader: ({ params }) => {
    const p = getProvider(params.providerId);
    if (!p) throw notFound();
    return { p };
  },
  head: () => ({
    meta: [
      { title: "C'est réservé — Legato" },
      { name: "description", content: "Votre rendez-vous est réservé." },
      { property: "og:title", content: "C'est réservé — Legato" },
      { property: "og:description", content: "Votre rendez-vous est réservé." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => <StandardLayout space="support" back="/appointments" backLabel="Vos rendez-vous"><p className="mt-12">Rendez-vous introuvable.</p></StandardLayout>,
  component: Confirm,
});

function Confirm() {
  const { p } = Route.useLoaderData();
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const list = useAppointments();
  const a = list?.find((x) => x.id === id);
  const name = `${p.firstName} ${p.lastName}`;
  const when = a ? fmtWhen(a.date) : null;

  const cancel = () => {
    if (a) removeAppointment(a.id);
    navigate({ to: "/resources/$category/$providerId", params: { category: p.category, providerId: p.id } });
  };

  return (
    <StandardLayout space="support" back={`/resources/${p.category}/${p.id}`} backLabel={name} activeTab="/care">
      <PageTitle space="support" className="mt-12">C'est <em>réservé.</em></PageTitle>
      <Lead space="support" className="mt-4">{name} vous attend {when ? when.day.split(" ")[0].toLowerCase() : "bientôt"}. Vous recevrez un rappel doux la veille.</Lead>
      {list && !a && <p className="mt-6 text-[14px]" style={{ color: "var(--sp-sub)" }}>Ce rendez-vous a été annulé.</p>}
      {a && when && (
        <Spec space="support" className="mt-7" items={[
          { label: "Quand", value: when.full },
          { label: "Où", value: a.place ?? p.city },
          { label: "Importance", value: IMPORTANCE[a.importance].label },
        ]} />
      )}
      <section className="mt-6 p-5 text-[14.5px] leading-[1.55]" style={{ background: "var(--sp-block)" }}>
        Premier rendez-vous ? Vous pouvez simplement dire que vous traversez un deuil. Le reste viendra.
      </section>
      <div className="mt-7 flex items-center gap-6">
        <PrimaryButton space="support" to="/appointments">Voir mes rendez-vous</PrimaryButton>
        {a && <TextLink space="support" onClick={cancel}>Annuler</TextLink>}
      </div>
    </StandardLayout>
  );
}
