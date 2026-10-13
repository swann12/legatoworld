import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useCarnet } from "@/lib/carnet";
import { StandardLayout, PageTitle, Lead, PrimaryButton, Field } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/home/equipe/demande")({
  validateSearch: z.object({ tache: z.string().optional() }),
  head: () => legatoHead("Demander un coup de main", "Demander à un proche de prendre en charge une tâche."),
  component: Demande,
});

/** B053 · Demander un coup de main */
function Demande() {
  const navigate = useNavigate();
  const { tache } = Route.useSearch();
  const { tasks, members, addTask, askTask, shared } = useCarnet();
  const existing = tasks.find((t) => t.id === tache);
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");
  const [to, setTo] = useState<string[]>([]);
  const [free, setFree] = useState("");
  useEffect(() => { if (existing) { setWhat(existing.what); setWhen(existing.when); } }, [existing?.id]);
  const names = [...to, ...free.split(",").map((s) => s.trim()).filter(Boolean)];

  const send = async () => {
    if (!what.trim()) return;
    try { if (existing) await askTask(existing.id, names); else await addTask(what.trim(), when.trim(), names); }
    catch { toast.error("La demande n'a pas pu être envoyée. Réessayez."); return; }
    navigate({ to: "/home/equipe" });
  };

  return (
    <StandardLayout back="/home/equipe" backLabel="Qui fait quoi" activeTab="/home">
      <PageTitle className="pt-8">Demander<br /><em>un coup de main.</em></PageTitle>
      <div className="mt-7 flex flex-col gap-5">
        <Field label="Quoi" placeholder="Lui rendre visite" value={what} onChange={(e) => setWhat(e.target.value)} maxLength={120} disabled={!!existing} />
        <Field label="Quand" placeholder="Dimanche après-midi" value={when} onChange={(e) => setWhen(e.target.value)} maxLength={60} disabled={!!existing} />
        <div>
          <span className="lg-mono block" style={{ color: "var(--sp-sub)" }}>À qui</span>
          {members.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{members.map((m) => {
            const on = to.includes(m.name);
            return <button key={m.id} type="button" aria-pressed={on} onClick={() => setTo((l) => on ? l.filter((x) => x !== m.name) : [...l, m.name])}
              className="h-9 rounded-full px-4 text-[13.5px]" style={{ border: "1px solid var(--sp-stroke)", background: on ? "var(--sp-stroke)" : "transparent", color: on ? "var(--sp-bg)" : "var(--sp-stroke)" }}>{m.name}</button>;
          })}</div>}
          <input value={free} onChange={(e) => setFree(e.target.value)} placeholder="Paul, Jeanne" maxLength={120} aria-label="À qui"
            className="mt-3 w-full bg-transparent pb-2 text-[17px] outline-none placeholder:opacity-40" style={{ borderBottom: "1px solid var(--sp-line-2)" }} />
        </div>
      </div>
      <Lead className="mt-5">{shared ? "Ils reçoivent un message simple. Le premier qui accepte s'en charge." : "La demande reste sur ce téléphone tant que vous n'avez pas de compte."}</Lead>
      <div className="mt-8"><PrimaryButton onClick={() => void send()} disabled={!what.trim()}>Envoyer la demande</PrimaryButton></div>
    </StandardLayout>
  );
}
