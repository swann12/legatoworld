import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { PageTitle, Lead, TextLink } from "@/components/legato/ds";
import { CommunityLayout, CommunityExtras } from "@/components/legato/CommunityUI";
import { groupById, threadById } from "@/lib/community-data";
import { useCommunity } from "@/lib/community-store";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/community/$group/$thread")({
  head: () => legatoHead("Une conversation", "Lire une conversation et y déposer une réponse sur Legato."),
  component: Conversation,
});

function Avatar({ name }: { name: string }) {
  return (
    <span aria-hidden className="flex size-[38px] shrink-0 items-center justify-center rounded-full"
      style={{ background: "var(--lg-blush)", color: "var(--lg-bordeaux)", fontFamily: "var(--lg-serif)", fontSize: 18 }}>
      {name.charAt(0)}
    </span>
  );
}

/** D002 · Une conversation : le message d'ouverture, les réponses, « Je pense à vous ». */
function Conversation() {
  const { group, thread } = Route.useParams();
  const c = useCommunity();
  const fixed = threadById(thread);
  const own = c.own.find((t) => t.id === thread && t.group === group);
  const t = fixed?.group === group ? fixed : own ? { ...own, author: c.pseudo, care: 0, replies: [] } : undefined;
  const [body, setBody] = useState("");
  const all = t ? [...t.replies, ...(c.replies[t.id] || [])] : [];
  const cared = t ? !!c.care[t.id] : false;
  const careCount = t ? t.care + (cared ? 1 : 0) : 0;

  return (
    <CommunityLayout group={group} backLabel={groupById(group)?.label}>
      {t ? (
        <>
          <article className="pt-[22px]">
            <div className="flex items-center gap-3">
              <Avatar name={t.author} />
              <span className="flex items-baseline gap-2">
                <span className="text-[14px] font-medium">{t.author}</span>
                <span className="text-[12.5px]" style={{ color: "var(--sp-sub)" }}>{t.when}</span>
              </span>
            </div>
            <h1 className="lg-title mt-4 text-[25px] leading-[1.2]">{t.body || t.title}</h1>
            <div className="mt-4 flex items-center gap-[14px] pb-[18px]" style={{ borderBottom: "1px solid var(--sp-line-2)" }}>
              <button type="button" onClick={() => c.toggleCare(t.id)} aria-pressed={cared}
                className="inline-flex h-9 items-center gap-2 rounded-full px-[14px] text-[13.5px] transition-colors"
                style={cared
                  ? { background: "var(--lg-bordeaux)", color: "var(--lg-blush)", border: "1px solid var(--lg-bordeaux)" }
                  : { border: "1px solid var(--lg-bordeaux)", color: "var(--lg-bordeaux)" }}>
                <Heart className="size-4" strokeWidth={1.3} fill={cared ? "currentColor" : "none"} />
                Je pense à vous · {careCount}
              </button>
              <span className="text-[13px]" style={{ color: "var(--sp-sub)" }}>
                {all.length} réponse{all.length > 1 ? "s" : ""}
              </span>
            </div>
          </article>

          <section className="pt-1">
            {all.map((r) => (
              <article key={r.id} className="grid grid-cols-[38px_1fr] gap-3 py-4" style={{ borderBottom: "1px solid var(--sp-line)" }}>
                <Avatar name={r.author} />
                <div>
                  <span className="flex items-baseline gap-2">
                    <span className="text-[14px] font-medium">{r.author}</span>
                    <span className="text-[12.5px]" style={{ color: "var(--sp-sub)" }}>{r.when}</span>
                  </span>
                  <p className="mt-[5px]" style={{ fontFamily: "var(--lg-serif)", fontSize: 18, lineHeight: 1.4 }}>{r.body}</p>
                </div>
              </article>
            ))}
          </section>

          <form className="mt-6" onSubmit={(e) => { e.preventDefault(); if (body.trim()) { c.addReply(t.id, body.trim()); setBody(""); } }}>
            <div className="flex items-center gap-2 rounded-full py-[5px] pl-[18px] pr-[5px]" style={{ border: "1px solid var(--sp-line-2)" }}>
              <input
                aria-label={`Répondre à ${t.author}`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`Répondre à ${t.author}…`}
                className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:opacity-60"
              />
              <button type="submit" disabled={!body.trim()} aria-label="Envoyer"
                className="flex size-10 shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-40"
                style={{ background: "var(--sp-btn-bg)", color: "var(--sp-btn-fg)" }}>
                <Send className="size-4" strokeWidth={1.4} />
              </button>
            </div>
            <p className="lg-mono mt-5 text-center">Groupe modéré · chacun parle de son expérience</p>
          </form>

          <CommunityExtras>
            {all.filter((r) => !r.author.startsWith("Modération")).map((r) => (
              <div key={r.id} className="mt-4">
                <TextLink space="community" onClick={() => c.report(r.id, "message signalé")}>
                  {c.reports[r.id] ? "Signalement gardé localement" : `Signaler le message de ${r.author}`}
                </TextLink>
              </div>
            ))}
            <Lead className="mt-4">Vos réponses restent sur cet appareil.</Lead>
          </CommunityExtras>
        </>
      ) : (
        <>
          <PageTitle space="community" className="mt-8">Conversation introuvable.</PageTitle>
          <Lead className="mt-4">Revenez au groupe pour retrouver ses messages.</Lead>
        </>
      )}
    </CommunityLayout>
  );
}
