import { PageHeader } from "@/components/legato/EditorialUI";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/practical/vault")({
  head: () => ({
    meta: [
      { title: "Coffre de documents — Legato" },
      { name: "description", content: "Tous vos documents au même endroit : acte de décès, identité, succession, contrats…" },
    ],
  }),
  component: Vault,
});

const CATEGORIES: { id: string; label: string; hint: string }[] = [
  { id: "id",         label: "Identité",          hint: "Pièces d'identité, livret de famille" },
  { id: "death",      label: "Acte de décès",     hint: "Original et copies" },
  { id: "finance",    label: "Finances",          hint: "Banques, relevés, avoirs" },
  { id: "insurance",  label: "Assurances",        hint: "Vie, habitation, mutuelle" },
  { id: "health",     label: "Santé",             hint: "Dossiers, CPAM, retraite" },
  { id: "housing",    label: "Logement",          hint: "Bail, propriété, charges" },
  { id: "succession", label: "Succession",        hint: "Notaire, héritiers" },
  { id: "wishes",     label: "Volontés",          hint: "Directives, testaments" },
  { id: "contracts",  label: "Contrats",          hint: "Abonnements, fournisseurs" },
  { id: "other",      label: "Autres",            hint: "Documents libres" },
];

/* Couleurs calmes : tout reste dans les crèmes, aucune rupture de teinte. */


function Vault() {
  const { primaryNeed, lovedOneRelation, hydrated } = useLegato();
  const [open, setOpen] = useState<string | null>(null);
  const hidden = hydrated && (primaryNeed === "emotional" || lovedOneRelation === "animal");
  if (hidden) {
    return (
      <Shell livingBg={false}><div className="wash-butter min-h-dvh text-dusk p-6"><Link to="/practical" className="mono-label">← Démarches</Link><h1 className="mt-10 ed-page-title">Coffre non nécessaire pour ce parcours.</h1><p className="mt-5 text-[13px] text-dusk/60">Il restera accessible si une tâche concrète en a besoin.</p></div></Shell>
    );
  }
  return (
    <Shell livingBg={false}>
      <div className="wash-butter min-h-dvh text-dusk pb-32">
        <PageHeader back="/practical" title="LE COFFRE" />
        <section className="px-6 pt-10">
          <p className="mono-label">Coffre</p>
          <h1 className="mt-5 ed-page-title">
            Tout au <span className="italic" style={{ color: "var(--terracotta)" }}>même endroit</span>
          </h1>
          <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Glissez vos documents par catégorie. Ils restent privés, accessibles à tout moment.
          </p>
        </section>

        <section className="px-5 pt-8 grid grid-cols-2 gap-3">
          {CATEGORIES.map((c, i) => (
            <button key={c.id} type="button" onClick={() => setOpen(open === c.id ? null : c.id)} className={`${i % 3 === 1 ? "surf-pearl" : "surf-cream"} rounded-[18px] border border-dusk/10 px-4 py-4 min-h-[124px] flex flex-col justify-between text-left transition-transform active:scale-[0.99]`}>
              <div>
                <p className="font-serif text-[16px] leading-[1.15]">{c.label}</p>
                <p className="mt-1 text-[11.5px] surf-sub">{c.hint}</p>
              </div>
              <p className="mt-3 mono-label opacity-70">{open === c.id ? "Ajouter bientôt" : "0 fichier"}</p>
            </button>
          ))}
        </section>


        <section className="px-5 pt-8">
          <button
            className="block w-full rounded-[999px] px-6 py-5 text-center transition-transform active:scale-[0.99]"
            style={{ background: "var(--terracotta)", color: "var(--paper)" }}
          >
            <span className="font-serif text-[20px]">Ajouter un document →</span>
          </button>
          <p className="mt-4 text-center text-[11.5px] italic text-dusk/45">
            Le stockage chiffré sera activé bientôt. Vos données restent vôtres.
          </p>
        </section>
      </div>
    </Shell>
  );
}