import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useLegato } from "@/lib/legato-state";
import { talkToPresence } from "@/lib/presence.functions";
import { usePortrait, portraitSentence } from "@/lib/portrait-store";
import { usePresenceHistory, savePresenceHistory, type PresenceMsg } from "@/lib/presence-history";
import { useDictation } from "@/lib/use-dictation";
import { StandardLayout, PageTitle, ChatBubble, ChatInput, TextLink, OutlineButton } from "@/components/legato/ds";
import { useActiveSpace } from "@/lib/use-active-space";
import { getDiscovery } from "@/lib/discovery";
import { scopedKey } from "@/lib/active-space";

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
  const { space, kind } = useActiveSpace();
  const callPresence = useServerFn(talkToPresence);
  const { portrait } = usePortrait();
  const portraitLine = portraitSentence(portrait, lostName);
  const stored = usePresenceHistory();
  const [hello, setHello] = useState("");
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const { listening, toggle } = useDictation(setDraft);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => setHello(greeting()), []);
  useEffect(() => { if (getDiscovery().active) setDraft(localStorage.getItem(scopedKey("legato.presence-draft.v1")) || ""); }, []);
  useEffect(() => { if (getDiscovery().active) localStorage.setItem(scopedKey("legato.presence-draft.v1"), draft); }, [draft]);
  const history: PresenceMsg[] = [{ role: "presence", text: hello }, ...stored];
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [stored.length, pending]);

  const send = async () => {
    const t = draft.trim();
    if (!t || pending) return;
    if (getDiscovery().active) { setNotice("Présence nécessite un compte pour vous répondre. Votre texte reste sur ce téléphone."); return; }
    const next = [...stored, { role: "you" as const, text: t }];
    savePresenceHistory(next);
    setDraft("");
    setPending(true);
    try {
      const { reply } = await callPresence({
        data: {
          branch: kind === "animal" ? "animal" : kind === "malade" ? "fear" : kind === "questions" ? "anxiety" : branch,
          mode, name, lostName: space?.name ?? lostName, portrait: portraitLine,
          history: [{ role: "presence" as const, text: hello }, ...next].filter(m => m.text).slice(-40).map((m) => ({ role: m.role === "you" ? ("user" as const) : ("assistant" as const), content: m.text })),
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
    <StandardLayout space="support" back="/care/parler" backLabel="Parler à quelqu'un" nav={false} className="lg-presence-page">
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
        <PageTitle size={32}>Présence</PageTitle>
        <p className="lg-mono">Intelligence artificielle</p>
      </div>

      <div className="mt-7 space-y-[22px]" aria-live="polite" aria-busy={pending}>
        {history.filter((m) => m.text).map((m, i) => (
          <ChatBubble key={i} space="support" from={m.role === "you" ? "user" : "presence"}>{m.text}</ChatBubble>
        ))}
        {pending && <ChatBubble space="support" from="presence"><span style={{ opacity: 0.6 }}>…</span></ChatBubble>}
        <div ref={endRef} />
      </div>

      <div className="mt-[22px] flex flex-wrap gap-2">
        <OutlineButton onClick={() => { setDraft(`J'aimerais parler de ${space?.name ?? lostName}.`); document.querySelector<HTMLInputElement>('input[aria-label="Écrire à Présence"]')?.focus(); }}>Lui parler d'elle</OutlineButton>
        <OutlineButton to="/care/respirer">M'apaiser</OutlineButton>
      </div>

      <form className="sticky bottom-0 mt-auto pt-8 pb-6" style={{ background: "var(--sp-bg)" }} onSubmit={(e) => { e.preventDefault(); void send(); }}>
        {notice && <p role="status" className="lg-lead mb-4">{notice} <TextLink to="/start/garder">Créer mon espace</TextLink></p>}
        <ChatInput value={draft} onChange={setDraft} onMic={toggle} pending={pending} listening={listening} />
        <div className="mt-[10px] flex flex-wrap items-center justify-between gap-2 text-[11px]" style={{ color: "var(--sp-sub)" }}>
          <span>{listening ? "Je vous écoute…" : "Vos échanges restent privés."}</span>
          <TextLink to="/presence/about">Ce qu'elle peut faire</TextLink>
        </div>
      </form>
    </StandardLayout>
  );
}
