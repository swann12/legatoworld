import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useRef, useState } from "react";
import { StandardLayout, PageTitle, Lead, Field, TextArea, PrimaryButton } from "@/components/legato/ds";
import { MemoryExtras } from "@/components/legato/MemoryUI";
import { addMemory, type MemoryType } from "@/lib/memories-store";
import { canonicalZone } from "@/lib/memory-garden";
import { legatoHead } from "@/lib/legato-head";
const LegacyCompose = lazy(() => import("@/components/legato/legacy/Step11Compose").then(m => ({ default: m.LegacyMemoryCompose })));
export const Route = createFileRoute("/compose/$zone")({ head: ({ params }) => legatoHead(`Composer un souvenir · ${canonicalZone(params.zone)}`, "Une image, un son, une phrase ou un lieu, accompagné de quelques mots."), component: ComposeMemory });
function ComposeMemory() {
  const { zone } = Route.useParams(); const id = canonicalZone(zone); const navigate = useNavigate(); const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(""); const [when, setWhen] = useState(""); const [body, setBody] = useState(""); const [place, setPlace] = useState(""); const [media, setMedia] = useState(""); const [duration, setDuration] = useState<number>(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const photo = id === "photo" || id === "objet"; const audio = id === "voix" || id === "musique";
  const type: MemoryType = photo ? "photo" : audio ? id === "voix" ? "voice" : "sound" : id === "citation" ? "sentence" : "text";
  const read = (file?: File) => { if (!file) return; setError(""); if (file.size > 2_000_000) { setError("Choisissez un fichier de moins de 2 Mo pour le garder sur cet appareil."); return; } setLoading(true); const reader = new FileReader(); reader.onerror = () => { setLoading(false); setError("Le fichier n’a pas pu être ouvert."); }; reader.onload = () => { setMedia(typeof reader.result === "string" ? reader.result : ""); setLoading(false); }; reader.readAsDataURL(file); };
  const save = () => { try { const memory = addMemory({ zone: id, type, title: title.trim() || undefined, when: when.trim() || undefined, body: body.trim() || undefined, place: place.trim() || undefined, ...(photo ? { imageDataUrl: media } : audio ? { audioDataUrl: media, durationSec: duration } : {}) }); navigate({ to: "/care/garden/$zone/$id", params: { zone: id, id: memory.id } }); } catch (e) { setError(e instanceof Error ? e.message : "Ce souvenir n’a pas pu être gardé."); } };
  const ready = photo || audio ? !!media : id === "lieu" ? !!title.trim() : !!body.trim();
  return <StandardLayout space="memory" back="/care/garden/depot" backLabel="Ajouter un souvenir" activeTab="/care/garden">
    <PageTitle space="memory" className="mt-8">{photo ? <>Une <em>{id === "objet" ? "trace." : "photo."}</em></> : audio ? <>Sa <em>{id === "voix" ? "voix." : "musique."}</em></> : id === "lieu" ? <>Un <em>lieu.</em></> : <>Quelques <em>mots.</em>}</PageTitle>
    <form onSubmit={e => { e.preventDefault(); if (ready) save(); }} className="mt-7 space-y-6">
      {(photo || audio) && <><div className="lg-memory-upload">{photo && media ? <img src={media} alt="La photo choisie" /> : audio && media ? <audio controls src={media} onLoadedMetadata={e => { if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration); }} /> : null}<PrimaryButton space="memory" onClick={() => fileRef.current?.click()} className="lg-memory-upload-button" disabled={loading}><span aria-hidden>＋</span>{loading ? "Ouverture…" : photo ? "Choisir une photo" : "Choisir un enregistrement"}</PrimaryButton></div><input ref={fileRef} aria-label={photo ? "Importer une photo" : "Importer un enregistrement"} type="file" accept={photo ? "image/*" : "audio/*"} className="hidden" onChange={e => read(e.target.files?.[0])} /></>}
      <Field space="memory" label={id === "lieu" ? "Le nom du lieu" : "Un titre"} value={title} onChange={e => setTitle(e.target.value)} placeholder={photo ? "Le dimanche à Cassis" : id === "lieu" ? "La calanque de Port-Miou" : "Un titre, si vous le souhaitez"} />
      <Field space="memory" label="Quand" value={when} onChange={e => setWhen(e.target.value)} placeholder="Juillet 2024" />
      {id === "lieu" && <Field space="memory" label="La ville ou l’adresse · facultatif" value={place} onChange={e => setPlace(e.target.value)} placeholder="Cassis" />}
      <TextArea space="memory" label={photo || audio || id === "lieu" ? "Quelques mots · facultatif" : "Ses mots, les vôtres"} rows={photo ? 2 : 4} value={body} onChange={e => setBody(e.target.value)} placeholder="Ce que vous voulez garder de ce moment…" />
      {error && <p role="alert">{error}</p>}<PrimaryButton type="submit" space="memory" disabled={!ready || loading}>Garder ce souvenir</PrimaryButton>
    </form>
    <MemoryExtras><Suspense fallback={<Lead>Un instant…</Lead>}><div className="lg-memory-legacy-compose"><LegacyCompose zone={id} /></div></Suspense></MemoryExtras>
  </StandardLayout>;
}
