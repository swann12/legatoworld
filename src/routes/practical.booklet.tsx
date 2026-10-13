import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { StandardLayout, PageTitle, Lead, Row, PrimaryButton, TextLink, Field, TextArea } from "@/components/legato/ds";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCeremonyPlan } from "@/lib/ceremony-flow";
import { loadPractical, savePractical } from "@/lib/practical-store";
import { getAllMemories, type Memory } from "@/lib/memories-store";
import { useLegato } from "@/lib/legato-state";
import { legatoHead } from "@/lib/legato-head";
import { Step10Extras } from "@/components/legato/Step10Extras";
import { LegacyBooklet } from "@/components/legato/legacy/Step10Booklet";

export const Route = createFileRoute("/practical/booklet")({
  head: () => legatoHead("Le livret de la cérémonie", "Une feuille pliée avec sa photo, le déroulé et un texte, à télécharger ou à imprimer."),
  component: Booklet,
});
function Booklet() {
  const { state } = useCeremonyPlan();
  const d = state.bookletDraft;
  const { lovedOneName } = useLegato();
  const [editor, setEditor] = useState<"photo" | "program" | null>(null);
  const [photos, setPhotos] = useState<Memory[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editor === "photo") setPhotos(getAllMemories().filter(m => m.type === "photo" && m.imageDataUrl)); }, [editor]);
  const update = (patch: Partial<typeof d>) => { try { savePractical({ bookletDraft: { ...loadPractical().bookletDraft, ...patch } }); } catch { setError("La photo est trop volumineuse pour être conservée sur cet appareil."); } };
  const download = async () => { setBusy(true); setError(""); try { const { downloadBooklet } = await import("@/lib/booklet-pdf"); await downloadBooklet({ ...d, name: d.name || lovedOneName }, state.selectedTexts, state.selectedMusic); } catch (e) { setError(e instanceof Error ? e.message : "Le livret n’a pas pu être téléchargé."); } finally { setBusy(false); } };
  return <StandardLayout space="practical" back="/practical/atmosphere" backLabel="Les détails" activeTab="/practical">
    <div className="lg-booklet-screen">
      <PageTitle space="practical" size={36} className="mt-[30px]">Le livret<br /><em>de la cérémonie.</em></PageTitle>
      <Lead space="practical" className="mt-3">Une feuille pliée avec sa photo, le déroulé et un texte. À imprimer ou à envoyer.</Lead>
      <div className="lg-booklet-preview mt-6" aria-label="Aperçu du livret">
        <div className="lg-booklet-sheet lg-booklet-cover">{d.photoUrl && <img src={d.photoUrl} alt="Photo du livret" />}<span>{d.name || lovedOneName || "En souvenir"}</span><small>{d.dates}</small></div>
        <div className="lg-booklet-sheet lg-booklet-lines">{Array.from({ length: 6 }, (_, i) => <span key={i} />)}</div>
      </div>
      <div className="mt-[10px]">
        <Row space="practical" title="La photo" subtitle={d.photoUrl ? "Choisie dans ses souvenirs" : "Choisir dans ses souvenirs"} status={d.photoUrl ? "choisie" : undefined} onClick={() => setEditor("photo")} />
        <Row space="practical" title="Le déroulé" subtitle="Accueil, textes, musique, hommage" onClick={() => setEditor("program")} last />
      </div>
      <div className="mt-[18px] flex flex-wrap items-center gap-[22px]"><PrimaryButton space="practical" onClick={download} disabled={busy}>{busy ? "Préparation…" : "Télécharger le livret"}</PrimaryButton><TextLink space="practical" onClick={() => window.print()}>Imprimer</TextLink></div>
      {error && <p role="alert" className="lg-row-sub mt-3">{error}</p>}
      <Step10Extras><LegacyBooklet /></Step10Extras>
    </div>
    <article className="lg-booklet-print"><h1>{d.name || lovedOneName || "En souvenir"}</h1><p>{d.dates}</p>{d.photoUrl && <img src={d.photoUrl} alt="" />}<p>{d.intro}</p><h2>Le déroulé</h2><p>{d.program || "Accueil\nTextes et musique\nHommage\nRecueillement"}</p><p>{state.selectedTexts.join("\n")}</p><p>{state.selectedMusic.join("\n")}</p><p>{d.closing}</p></article>
    <Dialog open={editor !== null} onOpenChange={v => { if (!v) setEditor(null); }}><DialogContent className="lg-space-practical lg-step10-dialog"><DialogTitle>{editor === "photo" ? "La photo" : "Le déroulé"}</DialogTitle><DialogDescription>Vos choix restent modifiables.</DialogDescription>
      {editor === "photo" ? <>
        {photos.map(p => <div key={p.id} className="flex items-center gap-4">{p.imageDataUrl && <img src={p.imageDataUrl} alt={p.title || "Souvenir"} className="size-16 object-cover" />}<TextLink space="practical" onClick={() => { update({ photoUrl: p.imageDataUrl ?? "" }); setEditor(null); }}>{p.title || "Choisir cette photo"}</TextLink></div>)}
        <input ref={file} type="file" accept="image/*" className="hidden" onChange={e => { const selected = e.target.files?.[0]; if (!selected) return; const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === "string") { update({ photoUrl: reader.result }); setEditor(null); } }; reader.readAsDataURL(selected); }} />
        <TextLink space="practical" onClick={() => file.current?.click()}>Choisir une photo</TextLink>
        <Field space="practical" label="Adresse d’une photo · facultatif" value={d.photoUrl} onChange={e => update({ photoUrl: e.target.value })} />
      </> : <>
        <Field space="practical" label="Prénom et nom" value={d.name} placeholder={lovedOneName || "Prénom et nom"} onChange={e => update({ name: e.target.value })} />
        <Field space="practical" label="Dates" value={d.dates} onChange={e => update({ dates: e.target.value })} />
        <TextArea space="practical" label="Introduction" rows={2} value={d.intro} onChange={e => update({ intro: e.target.value })} />
        <TextArea space="practical" label="Programme" rows={4} value={d.program} placeholder="Accueil, textes, musique, hommage" onChange={e => update({ program: e.target.value })} />
        <TextArea space="practical" label="Remerciements" rows={2} value={d.closing} onChange={e => update({ closing: e.target.value })} />
      </>}
      <PrimaryButton space="practical" onClick={() => setEditor(null)}>Terminer</PrimaryButton>
    </DialogContent></Dialog>
  </StandardLayout>;
}
