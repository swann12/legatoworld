import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { StandardLayout, PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";
import { useAppointments, fmtWhen, IMPORTANCE } from "@/lib/appointments-store";

export const Route = createFileRoute("/appointments/")({
  head: () => ({
    meta: [
      { title: "Vos rendez-vous — Legato" },
      { name: "description", content: "Vos rendez-vous, et pour chacun s'il peut être reporté." },
      { property: "og:title", content: "Vos rendez-vous — Legato" },
      { property: "og:description", content: "Si un jour vous n'êtes pas en état, Legato vous aidera." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RendezVous,
});

function RendezVous() {
  const list = useAppointments() ?? [];
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" className="mt-12">Vos <em>rendez-vous.</em></PageTitle>
      <Lead space="support" className="mt-4">Pour chacun, indiquez s'il peut être reporté. Si un jour vous n'êtes pas en état, Legato vous aidera.</Lead>
      <ul className="mt-6">
        {list.map((a, i) => {
          const d = new Date(a.date);
          const w = fmtWhen(a.date);
          return (
            <li key={a.id}>
              <Link to="/appointments/$id" params={{ id: a.id }} className="flex items-center gap-4 py-5"
                style={{ borderBottom: i === list.length - 1 ? "none" : "1px solid var(--sp-line)", color: "var(--sp-ink)" }}>
                <span className="w-12 shrink-0">
                  <span className="block" style={{ fontFamily: "var(--lg-serif)", fontSize: 30, lineHeight: 1 }}>{d.getDate()}</span>
                  <span className="lg-mono mt-1 block">{d.toLocaleDateString("fr-FR", { month: "short" })}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="lg-row-title block">{a.who}</span>
                  <span className="lg-row-sub mt-1 block" style={{ color: "var(--sp-sub)" }}>{[w.hour, a.place ?? a.what].filter(Boolean).join(" · ")}</span>
                  <span className="lg-mono mt-1.5 block" style={{ color: "var(--sp-ink)" }}>{IMPORTANCE[a.importance].label}</span>
                </span>
                <ChevronRight className="size-4 shrink-0" strokeWidth={1.3} />
              </Link>
            </li>
          );
        })}
      </ul>
      {list.length === 0 && <p className="py-6 text-[14.5px]" style={{ color: "var(--sp-sub)" }}>Aucun rendez-vous pour l'instant.</p>}
      <PrimaryButton space="support" plus className="mt-6" to="/appointments/new">Ajouter un rendez-vous</PrimaryButton>
    </StandardLayout>
  );
}
