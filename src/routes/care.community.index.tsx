import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead } from "@/components/legato/EditorialUI";
import { GROUPS, THREADS, TAG_TONE, groupById } from "@/lib/community-data";

export const Route = createFileRoute("/care/community/")({
  head: () => ({
    meta: [
      { title: "Communauté — Legato" },
      { name: "description", content: "Des groupes de parole modérés : lire, répondre, ou rester silencieux·se." },
      { property: "og:title", content: "Communauté — Legato" },
      { property: "og:description", content: "Des groupes de parole modérés, segmentés par situation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CommunityIndex,
});

function CommunityIndex() {
  const recent = THREADS.slice(0, 3);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-[color:var(--paper)] text-dusk pb-36">
        <PageHeader back="/care" title="COMMUNAUTÉ" />

        <section className="px-6">
          <h1 className="ed-page-title text-[30px]">
            Lire, répondre, ou rester{" "}
            <span className="italic" style={{ color: "var(--terracotta)" }}>
              silencieux·se
            </span>
            .
          </h1>
        </section>

        {/* Groupes */}
        <section className="px-5 pt-9">
          <SectionHead label="Groupes" meta={String(GROUPS.length).padStart(2, "0")} />
          <ul className="craft mt-3 px-5">
            {GROUPS.map((g) => (
              <li
                key={g.id}
                className="border-b border-dashed last:border-0"
                style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
              >
                <Link
                  to="/care/community/$group"
                  params={{ group: g.id }}
                  className="flex items-start gap-4 py-4 transition-opacity active:opacity-70"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[17.5px] leading-[1.2]">{g.label}</span>
                    <span className="mt-1 block text-[12.5px] surf-sub">{g.hint}</span>
                  </span>
                  <span className="shrink-0 pt-1 text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/35">
                    {g.members.toLocaleString("fr-FR")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Derniers échanges */}
        <section className="px-5 pt-9">
          <SectionHead label="Derniers échanges" />
          <ul className="mt-3 space-y-3">
            {recent.map((t) => (
              <li key={t.id}>
                <Link
                  to="/care/community/$group/$thread"
                  params={{ group: t.group, thread: t.id }}
                  className="craft block px-5 py-4 transition-opacity active:opacity-70"
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="inline-block size-[7px] rounded-full" style={{ background: TAG_TONE[t.tag] }} />
                    <span className="mono-label">{groupById(t.group)?.label}</span>
                  </span>
                  <span className="mt-2 block font-serif text-[17px] leading-[1.25]">{t.title}</span>
                  <span className="mt-2 flex items-center gap-3 text-[11.5px] tabular-nums text-dusk/45">
                    <span>{t.author}</span>
                    <span aria-hidden>·</span>
                    <span>{t.replies.length} réponses</span>
                    <span className="ml-auto">{t.when}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="px-5 pt-9">
          <Link
            to="/care/community/regles"
            className="flex items-center justify-between gap-4 rounded-[18px] px-5 py-4"
            style={{ background: "color-mix(in oklab, var(--sky) 46%, var(--whisper))" }}
          >
            <span>
              <span className="mono-label block">Règles et sécurité</span>
              <span className="mt-1.5 block font-serif text-[17px] leading-[1.2]">
                Charte, pseudonyme, signalement
              </span>
            </span>
            <span aria-hidden className="text-dusk/40">→</span>
          </Link>
          <p className="mt-3 px-1 text-[12px] leading-[1.6] text-dusk/50">
            Chaque groupe est modéré par des humains. Vous pouvez écrire sous pseudonyme, ou seulement lire.
          </p>
        </section>
      </div>
    </Shell>
  );
}
