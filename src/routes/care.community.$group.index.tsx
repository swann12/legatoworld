import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead } from "@/components/legato/EditorialUI";
import { groupById, threadsOf, TAG_TONE } from "@/lib/community-data";
import { useCommunity } from "@/lib/community-store";

export const Route = createFileRoute("/care/community/$group/")({
  head: () => ({
    meta: [
      { title: "Groupe — Communauté Legato" },
      { name: "description", content: "Les discussions du groupe, modérées et sans jugement." },
      { property: "og:title", content: "Groupe — Communauté Legato" },
      { property: "og:description", content: "Les discussions du groupe, modérées et sans jugement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GroupPage,
});

function GroupPage() {
  const { group } = useParams({ from: "/care/community/$group/" });
  const navigate = useNavigate();
  const g = groupById(group);
  const threads = threadsOf(group);
  const { own, hydrated, openThread } = useCommunity();
  const mine = hydrated ? own.filter((o) => o.group === group) : [];

  const [writing, setWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (!g) {
    return (
      <Shell livingBg={false}>
        <div className="min-h-dvh bg-[color:var(--paper)] text-dusk pb-36">
          <PageHeader back="/care/community" title="GROUPE" />
          <p className="px-6 text-[14px] text-dusk/60">Ce groupe n'existe pas.</p>
        </div>
      </Shell>
    );
  }

  const publish = () => {
    if (!title.trim()) return;
    openThread(group, title.trim(), body.trim());
    setTitle("");
    setBody("");
    setWriting(false);
  };

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-[color:var(--paper)] text-dusk pb-36">
        <PageHeader back="/care/community" title="GROUPE" />

        <section className="px-6">
          <h1 className="ed-page-title text-[28px]">{g.label}</h1>
          <p className="mt-3 text-[13px] text-dusk/60">{g.hint}</p>
          <p className="mt-2 text-[11.5px] tabular-nums tracking-[0.1em] text-dusk/40">
            {g.members.toLocaleString("fr-FR")} membres · modéré
          </p>
        </section>

        {/* Ouvrir une discussion */}
        <section className="px-5 pt-8">
          {!writing ? (
            <button
              type="button"
              onClick={() => setWriting(true)}
              className="w-full rounded-full py-3.5 text-[13.5px] tracking-[0.02em] transition-opacity active:opacity-80"
              style={{ background: "var(--terracotta)", color: "var(--paper)" }}
            >
              Écrire dans ce groupe
            </button>
          ) : (
            <div className="craft px-5 py-5">
              <p className="mono-label">Nouvelle discussion</p>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="En une phrase…"
                className="mt-3 w-full bg-transparent font-serif text-[18px] outline-none placeholder:text-dusk/30"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="Ce que vous avez envie de dire. Rien n'est obligatoire."
                className="mt-3 w-full resize-none bg-transparent text-[14px] leading-[1.6] outline-none placeholder:text-dusk/30"
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={publish}
                  className="rounded-full px-5 py-2.5 text-[13px]"
                  style={{ background: "var(--terracotta)", color: "var(--paper)" }}
                >
                  Publier
                </button>
                <button type="button" onClick={() => setWriting(false)} className="text-[13px] text-dusk/50">
                  Annuler
                </button>
                <span className="ml-auto text-[11px] text-dusk/40">Pseudonyme</span>
              </div>
            </div>
          )}
        </section>

        {mine.length > 0 && (
          <section className="px-5 pt-9">
            <SectionHead label="Vos discussions" meta={String(mine.length).padStart(2, "0")} />
            <ul className="mt-3 space-y-3">
              {mine.map((o) => (
                <li key={o.id} className="craft px-5 py-4">
                  <p className="font-serif text-[17px] leading-[1.25]">{o.title}</p>
                  {o.body && <p className="mt-2 text-[13.5px] leading-[1.6] text-dusk/70">{o.body}</p>}
                  <p className="mt-2 text-[11.5px] text-dusk/40">Vous · {o.when} · en attente de réponses</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="px-5 pt-9">
          <SectionHead label="Discussions" meta={String(threads.length).padStart(2, "0")} />
          {threads.length === 0 ? (
            <p className="craft mt-3 px-5 py-6 text-center text-[13px] italic text-dusk/55">
              Personne n'a encore écrit ici. Vous pouvez être la première voix.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {threads.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/care/community/$group/$thread", params: { group, thread: t.id } })}
                    className="craft block w-full px-5 py-4 text-left transition-opacity active:opacity-70"
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden className="inline-block size-[7px] rounded-full" style={{ background: TAG_TONE[t.tag] }} />
                      <span className="mono-label">{t.tag}</span>
                      <span className="ml-auto text-[11px] text-dusk/40">{t.when}</span>
                    </span>
                    <span className="mt-2 block font-serif text-[17.5px] leading-[1.25]">{t.title}</span>
                    <span className="mt-2 block line-clamp-2 text-[13px] leading-[1.55] text-dusk/60">{t.body}</span>
                    <span className="mt-3 flex items-center gap-4 text-[11.5px] tabular-nums text-dusk/45">
                      <span>{t.author}</span>
                      <span>{t.replies.length} réponses</span>
                      <span>{t.care} soutiens</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Link to="/care/community" className="mx-5 mt-9 block text-[12.5px] text-dusk/50 underline underline-offset-4">
          Voir les autres groupes
        </Link>
      </div>
    </Shell>
  );
}
