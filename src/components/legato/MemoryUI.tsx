import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Play, Pause } from "lucide-react";
import { PrimaryButton, OutlineButton, Field, TextArea, TextLink } from "./ds";
import { useSpaces } from "@/lib/spaces-store";
import { useActiveSpaceId } from "@/lib/active-space";
import { useLovedName } from "@/lib/loved-name";
import { updateMemory, type Memory } from "@/lib/memories-store";
import { memoryKind, memoryDate } from "@/lib/memory-garden";
import { getElementById } from "@/lib/elements";

export function useMemoryPerson() {
  const { spaces, updateSpace } = useSpaces();
  const id = useActiveSpaceId();
  const fallback = useLovedName();
  const person = spaces.find(s => s.id === id);
  return { person, name: person?.name || fallback, updateSpace };
}
export function MemoryExtras({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <details className="lg-memory-extras" onToggle={e => setOpen(e.currentTarget.open)}><summary>Autres options</summary>{open && <div className="pt-5">{children}</div>}</details>;
}
export function AddMemoryButton({ zone, children = "Ajouter un souvenir" }: { zone?: string; children?: ReactNode }) {
  return zone ? <Link to="/compose/$zone" params={{ zone }} className="lg-memory-cta"><span aria-hidden>＋</span>{children}</Link> : <PrimaryButton space="memory" plus to="/care/garden/depot">{children}</PrimaryButton>;
}
export function MemoryListRow({ memory }: { memory: Memory }) {
  return <Link to="/care/garden/$zone/$id" params={{ zone: memory.zone, id: memory.id }} className="lg-memory-list-row">
    {memory.imageDataUrl ? <img src={memory.imageDataUrl} alt="" /> : <span className="lg-memory-thumbnail" aria-hidden>{memory.type === "voice" ? "▷" : memory.type === "sound" ? "♪" : "“"}</span>}
    <span className="min-w-0 flex-1"><span className="lg-row-title block">{memory.title || memory.body?.slice(0, 70) || memoryKind(memory)}</span><span className="lg-row-sub block mt-1">{memoryKind(memory)} · {memoryDate(memory)}</span></span><span aria-hidden>›</span>
  </Link>;
}
export function MemoryVisual({ memory }: { memory: Memory }) {
  return <>{memory.imageDataUrl && <img className="lg-memory-photo" src={memory.imageDataUrl} alt={memory.title || "Un souvenir"} />}
    {!!memory.composition?.length && <div className="lg-memory-composition">{memory.composition.map(item => {
      const element = item.elementId ? getElementById(item.elementId) : undefined;
      return element ? <img key={item.id} src={element.src} alt={element.label} style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.width ?? item.size ?? 20}%`, transform: `translate(-50%,-50%) rotate(${item.rotation}deg) scale(${item.flipX ? -1 : 1},${item.flipY ? -1 : 1})`, opacity: item.opacity, zIndex: item.z }} /> : null;
    })}</div>}</>;
}
export function AudioMemory({ memory }: { memory: Memory }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(memory.durationSec ?? 0);
  const [error, setError] = useState("");
  useEffect(() => { setPlaying(false); setPosition(0); setDuration(memory.durationSec ?? 0); }, [memory.id, memory.durationSec]);
  const clock = (n: number) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
  const toggle = async () => { if (!ref.current) return; try { if (playing) ref.current.pause(); else await ref.current.play(); } catch { setError("Cet enregistrement ne peut pas être lu sur cet appareil."); } };
  return <><div className="lg-memory-audio">
    <PrimaryButton space="memory" disabled={!memory.audioDataUrl} onClick={toggle} className="lg-memory-play">{playing ? <Pause aria-label="Mettre en pause" /> : <Play aria-label="Écouter" />}</PrimaryButton>
    <div className="min-w-0 flex-1"><input aria-label="Position dans l’enregistrement" type="range" min={0} max={duration || 1} step="0.1" value={position} disabled={!memory.audioDataUrl} onChange={e => { if (ref.current) ref.current.currentTime = Number(e.target.value); setPosition(Number(e.target.value)); }} /><div className="lg-mono flex justify-between mt-2"><span>{clock(position)}</span><span>{clock(duration)}</span></div></div>
    {memory.audioDataUrl && <audio ref={ref} src={memory.audioDataUrl} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onTimeUpdate={e => setPosition(e.currentTarget.currentTime)} onLoadedMetadata={e => { if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration); }} />}
  </div>{!memory.audioDataUrl && <p className="lg-row-sub mt-3">Le fichier de cet ancien enregistrement n’a pas été conservé. Vous pouvez importer sa voix à nouveau.</p>}{error && <p role="alert" className="mt-3">{error}</p>}</>;
}
export function MemoryEditor({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  const [title, setTitle] = useState(memory.title ?? ""); const [when, setWhen] = useState(memory.when ?? ""); const [place, setPlace] = useState(memory.place ?? ""); const [body, setBody] = useState(memory.body ?? ""); const [error, setError] = useState("");
  return <form className="space-y-5 mt-7" onSubmit={e => { e.preventDefault(); try { updateMemory(memory.id, { title, when, place, body }); onClose(); } catch (e) { setError(e instanceof Error ? e.message : "Le souvenir n’a pas pu être enregistré."); } }}>
    <Field space="memory" label="Un titre" value={title} onChange={e => setTitle(e.target.value)} />
    <Field space="memory" label="Quand" value={when} onChange={e => setWhen(e.target.value)} placeholder="Juillet 2024" />
    <Field space="memory" label="Le lieu · facultatif" value={place} onChange={e => setPlace(e.target.value)} />
    <TextArea space="memory" label="Quelques mots" value={body} onChange={e => setBody(e.target.value)} />
    {error && <p role="alert">{error}</p>}<div className="flex gap-4 flex-wrap"><PrimaryButton space="memory" type="submit">Garder ces mots</PrimaryButton><OutlineButton space="memory" onClick={onClose}>Annuler</OutlineButton></div>
  </form>;
}
export function MemoryActions({ memory }: { memory: Memory }) {
  const [edit, setEdit] = useState(false); const [notice, setNotice] = useState("");
  const share = async () => { const text = [memory.title, memory.when, memory.place, memory.body].filter(Boolean).join("\n\n"); try { if (navigator.share) await navigator.share({ title: memory.title || "Un souvenir", text }); else { await navigator.clipboard.writeText(text); setNotice("Les mots du souvenir sont copiés, prêts à être partagés."); } } catch (e) { if (!(e instanceof Error && e.name === "AbortError")) setNotice("Le partage n’a pas abouti. Vous pouvez réessayer."); } };
  const offline = () => { const a = document.createElement("a"); a.href = memory.audioDataUrl || ""; a.download = `${memory.title || "sa-voix"}.${memory.audioDataUrl?.startsWith("data:audio/wav") ? "wav" : "webm"}`; a.click(); };
  return <><div className="flex flex-wrap gap-4 mt-7"><OutlineButton space="memory" onClick={() => setEdit(!edit)}>Ajouter un mot</OutlineButton>{memory.type === "voice" || memory.type === "sound" ? <OutlineButton space="memory" disabled={!memory.audioDataUrl} onClick={offline}>Garder hors connexion</OutlineButton> : <OutlineButton space="memory" onClick={share}>Partager avec un proche</OutlineButton>}</div>{edit && <MemoryEditor memory={memory} onClose={() => setEdit(false)} />}{notice && <p role="status" className="lg-row-sub mt-4">{notice}</p>}</>;
}