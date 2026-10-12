import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StandardLayout, PageTitle, Lead, Spec, SectionLabel, PrimaryButton } from "@/components/legato/ds";
import { getCategory, getProvider } from "@/lib/resources-data";
import { addAppointment } from "@/lib/appointments-store";
import { FuneralProvider } from "@/components/legato/FuneralProviders";

export const Route = createFileRoute("/resources/$category/$providerId")({
  head: () => ({
    meta: [
      { title: "Fiche professionnel — Legato" },
      { name: "description", content: "Adresse, tarif, séance et créneaux disponibles." },
      { property: "og:title", content: "Fiche professionnel — Legato" },
      { property: "og:description", content: "Choisir un créneau et réserver." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  notFoundComponent: () => <StandardLayout space="support" back="/care/help" backLabel="Résultats"><p className="mt-12">Cette personne n'est plus disponible.</p></StandardLayout>,
  component: Fiche,
});

type Slot = { iso: string; day: string; hour: string };

function buildSlots(): Slot[][] {
  const mk = (days: number, hours: [number, number][]) => hours.map(([h, m]) => {
    const d = new Date(); d.setDate(d.getDate() + days); d.setHours(h, m, 0, 0);
    return { iso: d.toISOString(), day: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }), hour: `${h} h${m ? ` ${m}` : ""}` };
  });
  return [mk(3, [[10, 0], [11, 0], [14, 30]]), mk(5, [[9, 0], [17, 0]])];
}

function Fiche() {
  const { providerId, category } = Route.useParams();
  const found = getProvider(providerId);
  if (!found || found.category !== category) throw notFound();
  const p = found;
  const navigate = useNavigate();
  const practical = getCategory(p.category)?.space === "practical";
  const [days, setDays] = useState<Slot[][]>([]);
  const [sel, setSel] = useState<Slot | null>(null);
  useEffect(() => { const s = buildSlots(); setDays(s); setSel(s[0][0]); }, []);

  const book = () => {
    if (!sel) return;
    const id = addAppointment({
      who: `${p.firstName} ${p.lastName}${p.category === "therapeutes" ? ", psychologue" : ""}`,
      place: p.address ?? p.city, date: sel.iso, importance: "reporter", providerId: p.id,
    });
    navigate({ to: "/resources/confirm/$providerId", params: { providerId: p.id }, search: { id } });
  };
  if (p.category === "pompes") return <FuneralProvider provider={p} />;
  const space = practical ? "practical" : "support";

  return (
    <StandardLayout space={space} back={practical ? "/practical/pros" : "/care/help"} backLabel="Résultats" activeTab={practical ? "/practical" : "/care"}>
      <PageTitle space={space} className="mt-12">{p.firstName} <em>{p.lastName}</em></PageTitle>
      <Lead space={space} className="mt-3">{p.bio ?? `${p.speciality}. ${p.approach[0] ?? ""}`}</Lead>
      <Spec space={space} className="mt-7" items={[
        { label: "Adresse", value: p.address ?? p.city },
        { label: "Tarif", value: p.price ?? p.offers[0]?.price ?? "Sur demande" },
        { label: "Séance", value: p.session ?? p.offers[0]?.detail ?? p.modes.join(", ") },
      ]} />
      <SectionLabel space={space} className="mt-8">Choisir un créneau</SectionLabel>
      {days.map((d) => (
        <div key={d[0].day} className="mt-4">
          <p className="lg-mono" style={{ color: "var(--sp-ink)" }}>{d[0].day}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {d.map((s) => {
              const on = sel?.iso === s.iso;
              return (
                <button key={s.iso} type="button" onClick={() => setSel(s)} aria-pressed={on} className="h-10 min-w-[80px] rounded-full px-4 text-[14px]"
                  style={{ background: on ? "var(--sp-btn-bg)" : "transparent", border: on ? "1.5px solid var(--sp-ink)" : "1px solid var(--sp-line-2)", color: "var(--sp-ink)" }}>
                  {s.hour}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <PrimaryButton space={space} full className="mt-7" onClick={book} disabled={!sel}>
        {sel ? `Réserver ${sel.day.split(" ")[0]} à ${sel.hour}` : "Réserver"}
      </PrimaryButton>
    </StandardLayout>
  );
}
