import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { PageHeader, IvoryCard, SectionLabel } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "Journal — Legato" }] }),
  component: Journal,
});

function Journal() {
  const { t, journal, addJournalEntry, lostName, lang } = useLegato();
  const [body, setBody] = useState("");
  const [to, setTo] = useState<"self" | "them" | "free">("free");
  const [openId, setOpenId] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(el.scrollHeight, 240) + "px";
  }, [body]);

  const save = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    addJournalEntry({ body: trimmed, to });
    setBody("");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const placeholder =
    to === "them"
      ? lang === "fr"
        ? `Écrire à ${lostName}…`
        : `Write to ${lostName}…`
      : t("journal.placeholder");

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="JOURNAL" />

        <section className="px-6 pt-4 pb-6">
          <p className="mono-label">Écrire pour libérer</p>
          <h1 className="mt-5 ed-page-title">
            {lang === "fr" ? (
              <>Une page <span className="italic" style={{ color: "var(--terracotta)" }}>rien qu'à vous</span>.</>
            ) : (
              <>A page <span className="italic" style={{ color: "var(--terracotta)" }}>just for you</span>.</>
            )}
          </h1>
        </section>

        {/* Address selector */}
        <div className="px-6 flex gap-2">
          {(["free", "self", "them"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTo(k)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.14em] font-medium border transition-colors ${
                to === k
                  ? "bg-dusk text-paper border-dusk"
                  : "border-dusk/15 text-dusk/65 hover:bg-dusk/5"
              }`}
            >
              {t(`journal.to.${k}`)}
            </button>
          ))}
        </div>

        {/* Writing surface */}
        <div className="px-6 mt-4">
          <IvoryCard>
            <textarea
              ref={taRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={placeholder}
              rows={6}
              className="relative w-full bg-transparent resize-none outline-none px-6 py-6 font-serif text-[18px] leading-[30px] text-dusk placeholder:text-dusk/30 overflow-hidden"
              style={{ minHeight: 240 }}
            />
          </IvoryCard>
        </div>

        <div className="px-6 mt-4">
          <button
            onClick={save}
            disabled={!body.trim()}
            className={`w-full rounded-[999px] px-6 py-4 text-center transition-opacity ${
              body.trim() ? "opacity-100" : "opacity-40"
            }`}
            style={{ background: "var(--terracotta)", color: "var(--paper)" }}
          >
            <span className="font-serif text-[19px]">{t("journal.save")} →</span>
          </button>
        </div>

        {/* Past entries */}
        <SectionLabel>{lang === "fr" ? "Pages précédentes" : "Previous pages"}</SectionLabel>

        <div className="px-6">
          {journal.length === 0 ? (
            <p className="font-serif text-[14px] italic text-dusk/60 max-w-[34ch]">
              {t("journal.empty")}
            </p>
          ) : (
            <div className="divide-y divide-dusk/10">
              {journal.map((e) => {
                const open = openId === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => setOpenId(open ? null : e.id)}
                    className="w-full text-left py-5 transition-all hover:bg-dusk/[0.02]"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="mono-label">{e.to ? t(`journal.to.${e.to}`) : ""}</p>
                      <p className="text-[11px] text-dusk/45">{formatDate(e.date)}</p>
                    </div>
                    <p
                      className={`mt-2 font-serif text-[16px] leading-[26px] text-dusk/85 ${
                        open ? "" : "line-clamp-3"
                      }`}
                    >
                      {e.body}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 mt-10 grid grid-cols-2 gap-3">
          <Link to="/presence" className="block rounded-[18px] px-5 py-5" style={{ background: "var(--bordeaux)", color: "var(--paper)" }}>
            <p className="mono-label" style={{ color: "color-mix(in oklab, var(--paper) 70%, transparent)" }}>Parler</p>
            <p className="mt-3 font-serif text-[20px] leading-tight">Une présence calme.</p>
          </Link>
          <Link to="/garden" className="block rounded-[18px] px-5 py-5" style={{ background: "var(--olive)", color: "var(--paper)" }}>
            <p className="mono-label" style={{ color: "color-mix(in oklab, var(--paper) 70%, transparent)" }}>Jardin</p>
            <p className="mt-3 font-serif text-[20px] leading-tight">Déposer un souvenir.</p>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
