import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, PrimaryButton, Row, TextLink } from "@/components/legato/ds";
import { PROVIDERS, type CategoryId } from "@/lib/resources-data";

export const Route = createFileRoute("/care/help")({
  head: () => ({
    meta: [
      { title: "Trouver un professionnel — Legato" },
      { name: "description", content: "Psychologues, médecines douces et associations d'écoute près de chez vous." },
      { property: "og:title", content: "Trouver un professionnel — Legato" },
      { property: "og:description", content: "Psychologues, associations, près de chez vous." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Annuaire,
});

const WHO: { id: CategoryId; label: string }[] = [
  { id: "therapeutes", label: "Un psychologue" },
  { id: "medecines-douces", label: "Une médecine douce" },
  { id: "ecoute", label: "Une association d'écoute" },
];

function Choice({ label, value, onChange }: { label: string; value: React.ReactNode; onChange: () => void }) {
  return (
    <div className="flex items-end justify-between gap-4 py-4" style={{ borderBottom: "1px solid var(--sp-line)" }}>
      <div><p className="lg-mono">{label}</p><div className="mt-2" style={{ fontFamily: "var(--lg-serif)", fontSize: 21 }}>{value}</div></div>
      <TextLink space="support" onClick={onChange}>Changer</TextLink>
    </div>
  );
}

function Annuaire() {
  const [who, setWho] = useState(0);
  const [city, setCity] = useState("Marseille");
  const [editCity, setEditCity] = useState(false);
  const [more, setMore] = useState(false);

  const cat = WHO[who].id;
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const list = PROVIDERS.filter((p) => p.category === cat)
    .sort((a, b) => Number(norm(b.city).includes(norm(city)) || (b.zip ?? "").startsWith(city)) - Number(norm(a.city).includes(norm(city)) || (a.zip ?? "").startsWith(city)));
  const [first, ...others] = list;

  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" className="mt-12">Trouver<br /><em>un professionnel.</em></PageTitle>
      <div className="mt-8" style={{ borderTop: "1px solid var(--sp-line-2)" }}>
        <Choice label="Qui" value={WHO[who].label} onChange={() => { setWho((w) => (w + 1) % WHO.length); setMore(false); }} />
        <Choice label="Où" onChange={() => setEditCity((e) => !e)}
          value={editCity
            ? <input autoFocus value={city} onChange={(e) => setCity(e.target.value)} onBlur={() => setEditCity(false)} onKeyDown={(e) => e.key === "Enter" && setEditCity(false)}
                placeholder="Ville ou code postal" className="w-full bg-transparent text-[16px] outline-none" style={{ fontFamily: "var(--lg-serif)", fontSize: 21 }} />
            : `${city || "Partout"}, moins de 5 km`} />
      </div>

      {first ? (
        <section className="mt-6 p-6" style={{ background: "var(--sp-block)" }}>
          <p className="lg-section">Le plus proche —</p>
          <h2 className="lg-ds-title mt-3" style={{ fontFamily: "var(--lg-serif)", fontSize: 25 }}>{first.firstName} {first.lastName}</h2>
          <p className="mt-3 text-[14px] leading-[1.5]" style={{ color: "var(--sp-sub)" }}>
            {first.speciality}{first.distance ? ` · ${first.distance}` : ` · ${first.city}`}<br />Prochain rendez-vous : {first.nextSlot}
          </p>
          <PrimaryButton space="support" className="mt-5" to={`/resources/${first.category}/${first.id}`}>Voir ses disponibilités</PrimaryButton>
        </section>
      ) : <p className="mt-8 text-[14.5px]" style={{ color: "var(--sp-sub)" }}>Personne pour l'instant dans ce domaine.</p>}

      {others.length > 0 && !more && <Row space="support" className="mt-2" title={`Voir les ${others.length} autres résultats`} onClick={() => setMore(true)} last />}
      {more && others.map((p, i) => (
        <Row key={p.id} space="support" title={`${p.firstName} ${p.lastName}`} subtitle={`${p.speciality} · ${p.city}`} to={`/resources/${p.category}/${p.id}`} last={i === others.length - 1} />
      ))}
    </StandardLayout>
  );
}
