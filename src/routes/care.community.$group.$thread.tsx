import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead } from "@/components/legato/EditorialUI";
import { groupById, threadById, TAG_TONE } from "@/lib/community-data";
import { useCommunity } from "@/lib/community-store";

export const Route = createFileRoute("/care/community/$group/$thread")({
  head: () => ({
    meta: [
      { title: "Discussion — Communauté Legato" },
      { name: "description", content: "Une discussion du groupe : témoignages, réponses et soutien." },
      { property: "og:title", content: "Discussion — Communauté Legato" },
      { property: "og:description", content: "Une discussion du groupe : témoignages, réponses et soutien." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ThreadPage,
});

function ThreadPage() {
  const { group, thread } = useParams({ from: "/care/community/$group/$thread" });
  const t = threadById(thread);
  const g = groupById(group);
  const { replies, care, hydrated, addReply, toggleCare } = useCommunity();
  const [draft, setDraft] = useState("");

  if (!t) {
    return (
      <Shell livingBg={false}>
        <div className="min-h-dvh bg-[color:var(--paper)] text-dusk pb-36">
          <PageHeader back="/care/community" title="DISCUSSION" />
          <p className="px-6 text-[14px] text-dusk/60">Cette discussion n'existe plus.</p>
        </div>
      </Shell>
    );
  }

  const mine = hydrated ? (replies[t.id] ?? []) : [];
  const all = [...t.replies, ...mine];
  const supported = hydrated && !!care[t.id];

  const send = () => {
    if (!draft.trim()) return;
    addReply(t.id, draft.trim());
    setDraft("");
  };

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-[color:var(--paper)] text-dusk pb-40">
        <PageHeader back={`/care/community/${group}`} title="DISCUSSION" />

        {/* Message d'ouverture */}
        <section className="px-5">
          <div className="craft px-5 py-5">
            <p className="flex items-center gap-2">
              <span aria-hidden className="inline-block size-[7px] rounded-full" style={{ background: TAG_TONE[t.tag] }} />
              <span className="mono-label">{t.tag}</span>
              <span className="ml-auto text-[11px] text-dusk/40">{g?.label}</span>
            </p>
            <h1 className="mt-3 font-serif text-[24px] leading-[1.2]">{t.title}</h1>
            <p className="mt-4 text-[14.5px] leading-[1.65] text-dusk/80">{t.body}</p>
            <p className="mt-4 text-[11.5px] tabular-nums text-dusk/45">
              {t.author} · {t.when}
            </p>
            <div
              className="mt-4 flex items-center gap-3 border-t border-dashed pt-4"
              style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
            >
              <button
                type="button"
                onClick={() => toggleCare(t.id)}
                aria-pressed={supported}
                className="rounded-full px-4 py-2 text-[12.5px] transition-colors"
                style={{
                  background: supported ? "var(--terracotta)" : "transparent",
                  color: supported ? "var(--paper)" : "var(--dusk)",
                  border: supported ? "none" : "1px solid color-mix(in oklab, var(--dusk) 22%, transparent)",
                }}
              >
                {supported ? "Soutien envoyé" : "Envoyer un soutien"}
              </button>
              <span className="text-[11.5px] tabular-nums text-dusk/45">{t.care + (supported ? 1 : 0)} soutiens</span>
            </div>
          </div>
        </section>

        {/* Réponses */}
        <section className="px-5 pt-9">
          <SectionHead label="Réponses" meta={String(all.length).padStart(2, "0")} />
          <ul className="mt-3">
            {all.map((r) => {
              const moderator = r.author.startsWith("Modération");
              return (
                <li
                  key={r.id}
                  className="border-b border-dashed py-5 last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 13%, transparent)" }}
                >
                  <p className="flex items-center gap-2 text-[11.5px] tabular-nums text-dusk/45">
                    <span
                      aria-hidden
                      className="grid size-[22px] shrink-0 place-items-center rounded-full text-[10px]"
                      style={{
                        background: moderator ? "var(--sky)" : "color-mix(in oklab, var(--clay) 80%, var(--paper))",
                        color: "var(--dusk)",
                      }}
                    >
                      {r.author.slice(0, 1)}
                    </span>
                    <span style={{ color: moderator ? "var(--bordeaux)" : undefined }}>{r.author}</span>
                    <span className="ml-auto">{r.when}</span>
                  </p>
                  <p className="mt-2.5 pl-[30px] text-[14px] leading-[1.65] text-dusk/80">{r.body}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Répondre */}
        <section className="px-5 pt-8">
          <div className="craft px-5 py-5">
            <p className="mono-label">Répondre</p>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder="Une phrase suffit. Vous pouvez aussi ne rien écrire."
              className="mt-3 w-full resize-none bg-transparent text-[14px] leading-[1.6] outline-none placeholder:text-dusk/30"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={send}
                className="rounded-full px-5 py-2.5 text-[13px]"
                style={{ background: "var(--terracotta)", color: "var(--paper)" }}
              >
                Envoyer
              </button>
              <span className="text-[11px] text-dusk/40">Publié sous pseudonyme, modéré avant diffusion.</span>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
