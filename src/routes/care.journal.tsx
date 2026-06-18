import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { IvoryCard } from "@/components/legato/EditorialUI";
import { useLegato } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";

export const Route = createFileRoute("/care/journal")({
  head: () => ({ meta: [{ title: "Journal — Soutien Legato" }] }),
  component: CareJournal,
});

function CareJournal() {
  const { journal, addJournalEntry } = useLegato();
  const lovedName = useLovedName();
  const [body, setBody] = useState("");
  const save = () => { if (!body.trim()) return; addJournalEntry({ body: body.trim(), to: "them" }); setBody(""); };
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-center"><LegatoMark to="/care" size={22} /></header>
        <section className="px-6 pt-8"><p className="mono-label">Journal</p><h1 className="mt-5 ed-page-title">Écrire à <span className="italic" style={{ color: "var(--terracotta)" }}>{lovedName}</span></h1></section>
        <section className="px-5 pt-6"><IvoryCard><textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} placeholder="Laissez les mots venir, sans relire…" className="w-full bg-transparent resize-none outline-none px-5 py-5 font-serif italic text-[17px] leading-[28px] text-dusk placeholder:text-dusk/30" /></IvoryCard><button onClick={save} disabled={!body.trim()} className="mt-4 w-full rounded-full px-6 py-4 disabled:opacity-40" style={{ background: "var(--terracotta)", color: "var(--paper)" }}>Garder →</button></section>
        <section className="px-6 pt-8 space-y-3">{journal.slice(0, 5).map((e) => <IvoryCard key={e.id} className="p-4"><p className="text-[13px] leading-relaxed text-dusk/70">{e.body}</p></IvoryCard>)}</section>
      </div>
    </Shell>
  );
}