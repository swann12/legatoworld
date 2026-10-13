import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useCarnet } from "@/lib/carnet";
import { upcoming, dayNum, monthShort, hour } from "@/lib/carnet-model";
import { StandardLayout, PageTitle, Lead, SectionLabel, PrimaryButton, TextLink, Field, OutlineButton } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/home/carnet/")({
  head: () => legatoHead("Le carnet", "Ses rendez-vous, ce qui a été dit, ce qu'il faut retenir, partagé avec les proches choisis."),
  component: Carnet,
});

/** B049 · Le carnet */
function Carnet() {
  const { rdvs, notes, space, addRdv, ready, shared } = useCarnet();
  const list = upcoming(rdvs);
  const last = notes[0];
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ who: "", date: "", time: "", place: "", with: "" });
  const save = async () => {
    if (!f.who.trim() || !f.date) return;
    try { await addRdv({ who: f.who.trim(), date: f.date, time: f.time || undefined, place: f.place.trim() || undefined, with: f.with.trim() || undefined, questions: [] }); }
    catch { toast.error("Le rendez-vous n'a pas pu être ajouté. Réessayez."); return; }
    setF({ who: "", date: "", time: "", place: "", with: "" }); setAdding(false);
  };
  const name = space?.name ?? "votre proche";

  return (
    <StandardLayout back="/home" backLabel="Aujourd'hui" activeTab="/home">
      <PageTitle className="pt-8">Le carnet<br /><em>de {name}.</em></PageTitle>
      <Lead className="mt-3">Ses rendez-vous, ce qui a été dit, ce qu'il faut retenir. {shared ? "Partagé avec les proches que vous choisissez." : "Gardé sur ce téléphone pour l'instant."}</Lead>
      <SectionLabel className="mt-7">À venir</SectionLabel>
      {ready && !list.length && <p className="mt-3 text-[14px]" style={{ color: "var(--sp-sub)" }}>Aucun rendez-vous noté.</p>}
      {list.map((r) => (
        <Link key={r.id} to="/home/carnet/$id" params={{ id: r.id }} className="flex items-center gap-5 py-4" style={{ borderBottom: "1px solid var(--sp-line)" }}>
          <span className="w-10 shrink-0 text-center"><span className="block lg-title" style={{ fontSize: 26, lineHeight: 1 }}>{dayNum(r.date)}</span><span className="lg-mono block mt-1">{monthShort(r.date)}</span></span>
          <span className="min-w-0"><span className="lg-row-title block">{r.who}</span><span className="lg-row-sub block mt-1">{[hour(r.time), r.place, r.with ? `${r.with} l'accompagne` : ""].filter(Boolean).join(" · ") || "Toute la journée"}</span></span>
        </Link>
      ))}
      {adding ? (
        <div className="mt-5 flex flex-col gap-4">
          <Field label="Quel rendez-vous" placeholder="Oncologue, Dr Martin" value={f.who} onChange={(e) => setF({ ...f, who: e.target.value })} maxLength={120} />
          <Field label="Le jour" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
          <Field label="L'heure · facultatif" type="time" value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} />
          <Field label="Où · facultatif" placeholder="Hôpital de la Timone" value={f.place} onChange={(e) => setF({ ...f, place: e.target.value })} maxLength={120} />
          <Field label="Qui l'accompagne · facultatif" placeholder="Claire" value={f.with} onChange={(e) => setF({ ...f, with: e.target.value })} maxLength={60} />
          <div className="flex gap-4 items-center"><OutlineButton onClick={() => void save()} disabled={!f.who.trim() || !f.date}>Ajouter au carnet</OutlineButton><TextLink onClick={() => setAdding(false)}>Annuler</TextLink></div>
        </div>
      ) : <div className="mt-4"><TextLink onClick={() => setAdding(true)}>Ajouter un rendez-vous</TextLink></div>}
      {last && <>
        <SectionLabel className="mt-8">La dernière fois</SectionLabel>
        <p className="lg-mono mt-3">{new Date(`${last.date}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}{last.label ? ` · ${last.label}` : ""}</p>
        <p className="mt-2" style={{ fontFamily: "var(--lg-serif)", fontSize: 19, lineHeight: 1.4 }}>{last.text}</p>
      </>}
      <div className="mt-8"><PrimaryButton to="/home/carnet/note" plus>Ajouter une note</PrimaryButton></div>
    </StandardLayout>
  );
}
