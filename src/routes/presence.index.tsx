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
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { guide, type Card } from "@/lib/presence-guide";

const KIND_LABEL: Record<string, string> = { deuil: "deuil d'une personne", animal: "deuil d'un animal", malade: "un proche gravement malade", questions: "la personne pense beaucoup à la mort" };

/** Cartes d'action (D120, D121) : cadre fin, étiquette en capitales, flèche. */
function ActionCard({ c }: { c: Card }) {
  const inner = (<>
    <span className="min-w-0 flex-1">
      <span className="lg-mono block" style={{ color: "var(--sp-sub)" }}>{c.etiquette}</span>
      <span className="mt-1 block" style={{ fontFamily: "var(--lg-serif)", fontSize: 19, lineHeight: 1.2 }}>{c.titre}</span>
      {c.sous && <span className="mt-1 block text-[12.5px]" style={{ color: "var(--sp-sub)" }}>{c.sous}</span>}
      {c.source && <span className="mt-1 block text-[11.5px]" style={{ color: "var(--sp-sub)" }}>{c.source}</span>}
    </span>
    <ArrowUpRight className="size-4 shrink-0" strokeWidth={1.3} />
  </>);
  const cls = "flex items-center gap-3 px-4 py-[14px]";
  const style = { border: "1px solid var(--sp-line-2)", color: "var(--sp-ink)" };
  if (c.href) return <a href={c.href} className={cls} style={style}>{inner}</a>;
  return <Link to={c.to} params={c.params as never} className={cls} style={style}>{inner}</Link>;
}

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
  const [topic, setTopic] = useState<"soutien" | "demarches" | null>(null);
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
    const shown = stored.flatMap((m) => m.cards?.map((c) => c.to) ?? []);
    const g = guide(t, shown);
    // Règle 6 : sécurité avant tout, sans attendre le modèle et sans autre carte.
    if (g.safety) {
      const text = g.safety === "3114"
        ? "Ce que vous ressentez est très lourd, et vous n'avez pas à le porter seul. Vous pouvez appeler le 3114 maintenant : c'est gratuit, jour et nuit, quelqu'un vous écoutera."
        : "Cela peut être une urgence. Appelez le 15 maintenant, ou demandez à quelqu'un près de vous de le faire.";
      savePresenceHistory([...next, { role: "presence", text, cards: g.cards }]);
      return;
    }
    if (g.topic) setTopic(g.topic);
    setPending(true);
    try {
      const { reply } = await callPresence({
        data: {
          branch: kind === "animal" ? "animal" : kind === "malade" ? "fear" : kind === "questions" ? "anxiety" : branch,
          mode, name, lostName: space?.name ?? lostName, portrait: portraitLine,
          guided: true, fiches: g.fiches, cards: g.cards.map((c) => c.titre),
          context: [KIND_LABEL[kind ?? "deuil"] ?? "", (space?.name ?? lostName) ? `personne disparue ou concernée : ${space?.name ?? lostName}` : ""].filter(Boolean).join(" ; "),
          history: [{ role: "presence" as const, text: hello }, ...next].filter(m => m.text).slice(-40).map((m) => ({ role: m.role === "you" ? ("user" as const) : ("assistant" as const), content: m.text })),
        },
      });
      savePresenceHistory([...next, { role: "presence", text: reply, cards: g.cards }]);
    } catch {
      savePresenceHistory([...next, { role: "presence", text: "Je suis là, en silence. Reprenons quand vous voulez.", cards: g.cards }]);
    } finally {
      setPending(false);
    }
  };

  return (
    <StandardLayout space={topic === "demarches" ? "practical" : "support"} back={topic === "demarches" ? "/practical" : "/care"} backLabel={topic === "demarches" ? "Démarches" : "Soutien"} nav={false} className="lg-presence-page">
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
        <PageTitle size={32}>Présence</PageTitle>
        <p className="lg-mono">Intelligence artificielle</p>
      </div>

      <div className="mt-7 space-y-[22px]" aria-live="polite" aria-busy={pending}>
        {history.filter((m) => m.text).map((m, i) => (
          <div key={i}>
            <ChatBubble from={m.role === "you" ? "user" : "presence"}>{m.text}</ChatBubble>
            {m.cards?.length ? <div className="mt-3 space-y-2">{m.cards.slice(0, 2).map((c) => <ActionCard key={c.titre} c={c} />)}</div> : null}
          </div>
        ))}
        {pending && <ChatBubble from="presence"><span style={{ opacity: 0.6 }}>…</span></ChatBubble>}
        <div ref={endRef} />
      </div>

      {!stored.at(-1)?.cards?.length && <div className="mt-[22px] flex flex-wrap gap-2">
        <OutlineButton onClick={() => { setDraft(`J'aimerais parler de ${space?.name ?? lostName}.`); document.querySelector<HTMLInputElement>('input[aria-label="Écrire à Présence"]')?.focus(); }}>Lui parler d'elle</OutlineButton>
        <OutlineButton to="/care/sons/voix">M'apaiser</OutlineButton>
      </div>}

      <form className="sticky bottom-0 mt-auto pt-8 pb-6" style={{ background: "var(--sp-bg)" }} onSubmit={(e) => { e.preventDefault(); void send(); }}>
        {notice && <p role="status" className="lg-lead mb-4">{notice} <TextLink to="/start/garder">Créer mon espace</TextLink></p>}
        <ChatInput value={draft} onChange={setDraft} onMic={toggle} pending={pending} listening={listening} />
        <div className="mt-[10px] flex flex-wrap items-center justify-between gap-2 text-[11px]" style={{ color: "var(--sp-sub)" }}>
          <span>{listening ? "Je vous écoute…" : "Vos échanges restent privés."}</span>
          <TextLink to="/presence/infos">Ce qu'elle peut faire</TextLink>
        </div>
      </form>
    </StandardLayout>
  );
}
