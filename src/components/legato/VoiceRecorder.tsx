import { useRef, useState } from "react";
import { toast } from "sonner";
import { addMemory } from "@/lib/memories-store";
import { PrimaryButton } from "@/components/legato/ds";

/** Enregistre la voix sur le téléphone et la garde comme souvenir (zone donnée). */
export function VoiceRecorder({ zone, title, label = "Enregistrer", onSaved }: { zone: string; title: string; label?: string; onSaved?: () => void }) {
  const [rec, setRec] = useState(false);
  const mr = useRef<MediaRecorder | null>(null);
  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream); const chunks: Blob[] = []; const t0 = Date.now();
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const fr = new FileReader();
        fr.onload = () => {
          try { addMemory({ zone, type: "voice", title, audioDataUrl: String(fr.result), durationSec: Math.round((Date.now() - t0) / 1000) }); toast.success("Enregistrement gardé."); onSaved?.(); }
          catch (e) { toast.error((e as Error).message); }
        };
        fr.readAsDataURL(new Blob(chunks, { type: r.mimeType }));
      };
      r.start(); mr.current = r; setRec(true);
    } catch { toast.error("Le micro n'est pas accessible. Autorisez-le dans votre navigateur."); }
  };
  const stop = () => { mr.current?.stop(); setRec(false); };
  return <PrimaryButton onClick={() => (rec ? stop() : void start())}>{rec ? "Arrêter et garder" : label}</PrimaryButton>;
}
