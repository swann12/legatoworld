import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useLegato } from "@/lib/legato-state";
import { talkToPresence } from "@/lib/presence.functions";
import { usePortrait, portraitSentence } from "@/lib/portrait-store";
import { usePresenceHistory, savePresenceHistory, type PresenceMsg } from "@/lib/presence-history";
import { useDictation } from "@/lib/use-dictation";
import { StandardLayout, PageTitle, Lead, ChatBubble, ChatInput, TextLink } from "@/components/legato/ds";

export const Route = createFileRoute("/presence/")({
  head: () => ({
    meta: [
      { title: "Présence — Legato" },
      { name: "description", content: "Une écoute à toute heure, par une intelligence artificielle. Elle ne remplace ni vos proches ni un professionnel." },
      { property: "og:title", content: "Présence — Legato" },
      { property: "og:description", content: "Une écoute à toute heure · intelligence artificielle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Presence,
});

function greeting() {
  const h = new Date().getHours();
  const when = h >= 18 || h < 5 ? "ce soir" : "aujourd'hui";
  return `Je suis là. De quoi avez-vous envie de parler ${when} ?`;
}

function Presence() {
  const { mode, name, branch, lostName } = useLegato();
  const callPresence = useServerFn(talkToPresence);
  const { portrait } = usePortrait();
  const portraitLine = portraitSentence(portrait, lostName);
  const stored = usePresenceHistory();
  const [hello, setHello] = useState("");
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const { listening, toggle } = useDictation(setDraft);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => setHello(greeting()), []);
  const history: PresenceMsg[] = [{ role: "presence", text: hello }, ...stored];
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [stored.length, pending]);

  const send = async () => {
    const t = draft.trim();
    if (!t || pending) return;
    const next = [...stored, { role: "you" as const, text: t }];
    savePresenceHistory(next);
    setDraft("");
    setPending(true);
    try {
      const { reply } = await callPresence({
        data: {
          branch, mode, name, lostName, portrait: portraitLine,
          history: [{ role: "presence" as const, text: hello }, ...next].map((m) => ({ role: m.role === "you" ? ("user" as const) : ("assistant" as const), content: m.text })),
        },
      });
      savePresenceHistory([...next, { role: "presence", text: reply }]);
    } catch {
      savePresenceHistory([...next, { role: "presence", text: "Je suis là, en silence. Reprenons quand vous voulez." }]);
    } finally {
      setPending(false);
    }
  };

  return (
    <StandardLayout space="support" back="/care/aide" backLabel="Se confier" activeTab="/care">
      <PageTitle space="support" className="mt-12">Présence</PageTitle>
      <Lead space="support" className="mt-3">Une écoute à toute heure · intelligence artificielle. Elle ne remplace ni vos proches ni un professionnel.</Lead>

      <div className="mt-8 space-y-3">
        {history.filter((m) => m.text).map((m, i) => (
          <ChatBubble key={i} space="support" from={m.role === "you" ? "user" : "presence"}>{m.text}</ChatBubble>
        ))}
        {pending && <ChatBubble space="support" from="presence"><span style={{ opacity: 0.6 }}>…</span></ChatBubble>}
        <div ref={endRef} />
      </div>

      <form className="sticky bottom-[104px] mt-10 pt-4" style={{ background: "var(--sp-bg)" }} onSubmit={(e) => { e.preventDefault(); void send(); }}>
        <ChatInput space="support" value={draft} onChange={setDraft} onMic={toggle} />
        <div className="mt-3 flex items-center justify-between gap-3 text-[13px]" style={{ color: "var(--sp-sub)" }}>
          <span>{listening ? "Je vous écoute… touchez le micro pour finir." : "Vos conversations restent privées."}</span>
          <TextLink space="support" to="/presence/about">Ce qu'elle peut faire</TextLink>
        </div>
      </form>
    </StandardLayout>
  );
}
