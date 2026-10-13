import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, SectionLabel } from "@/components/legato/ds";
import { VoiceRecorder } from "@/components/legato/VoiceRecorder";
import { useMemories } from "@/lib/memories-store";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/garden/histoires")({
  head: () => legatoHead("Ses histoires", "Enregistrer un proche quand il raconte, avec une question pour lancer la conversation."),
  component: Histoires,
});

const QUESTIONS = ["Comment as-tu rencontré papa ?", "Quel est ton plus beau souvenir d'enfance ?", "Quelle maison as-tu le plus aimée ?", "Qu'est-ce qui te faisait rire, petite ?", "Quel voyage t'a marquée ?", "Qu'aimerais-tu qu'on retienne de toi ?", "Quel était ton premier travail ?"];

/** B064 · Ses histoires */
function Histoires() {
  const list = useMemories("histoire");
  const q = QUESTIONS[Math.floor(Date.now() / 86_400_000) % QUESTIONS.length];
  return (
    <StandardLayout space="memory" back="/care/garden/space" backLabel="Souvenirs" activeTab="/care/garden">
      <PageTitle className="pt-8">Ses histoires.</PageTitle>
      <Lead className="mt-3">Enregistrez-la quand elle raconte. Legato vous propose une question pour lancer la conversation.</Lead>
      <div className="mt-7 p-6" style={{ background: "var(--sp-block)" }}>
        <SectionLabel>Question du jour</SectionLabel>
        <p className="lg-title mt-3" style={{ fontSize: 24 }}>{q}</p>
        <p className="mt-1 text-[13px]" style={{ color: "var(--sp-sub)" }}>Cinq minutes suffisent</p>
        <div className="mt-5"><VoiceRecorder zone="histoire" title={q} /></div>
      </div>
      <div className="mt-6">
        {list.map((m, i) => (
          <div key={m.id} className="py-4" style={{ borderBottom: i < list.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
            <p className="lg-row-title">{m.title || "Une histoire"}</p>
            <p className="lg-row-sub mt-1">enregistré le {new Date(m.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}{m.durationSec ? ` · ${Math.max(1, Math.round(m.durationSec / 60))} min` : ""}</p>
            {m.audioDataUrl && <audio className="mt-3 w-full" controls src={m.audioDataUrl} />}
          </div>
        ))}
      </div>
    </StandardLayout>
  );
}
