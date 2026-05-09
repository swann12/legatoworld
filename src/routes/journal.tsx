import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "Journal — Legato" }] }),
  component: Journal,
});

function Journal() {
  const { mode, t, journal, addJournalEntry, lostName, lang } = useLegato();
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
    <Shell>
      <div className="relative pb-12">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              {t("journal.title")}
            </p>
            <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.05] font-light text-dusk text-balance">
              {lang === "fr" ? (
                <>Une page à <span className="italic">vous.</span></>
              ) : (
                <>A page that is <span className="italic">yours.</span></>
              )}
            </h1>
            <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-dusk/60">
              {t("journal.subtitle")}
            </p>
          </header>

          {/* Address selector */}
          <div className="px-7 mt-8 flex gap-2">
            {(["free", "self", "them"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTo(k)}
                className={`px-4 py-1.5 rounded-full text-[11px] tracking-[0.06em] transition-all ${
                  to === k ? "bg-dusk text-paper" : "paper-card text-dusk/60"
                }`}
              >
                {t(`journal.to.${k}`)}
              </button>
            ))}
          </div>

          {/* Writing surface — soft notebook page, no lines, autosize */}
          <div className="px-5 mt-5">
            <div
              className="paper-card relative overflow-hidden"
              style={{
                borderRadius: 28,
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--paper) 97%, white) 0%, color-mix(in oklab, var(--clay) 22%, var(--paper)) 100%)",
              }}
            >
              <textarea
                ref={taRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={placeholder}
                rows={6}
                className="relative w-full bg-transparent resize-none outline-none px-7 py-7 font-serif italic text-[18px] leading-[30px] text-dusk placeholder:text-dusk/30 overflow-hidden"
                style={{ minHeight: 240 }}
              />
            </div>
          </div>

          <div className="px-5 mt-4">
            <button
              onClick={save}
              disabled={!body.trim()}
              className={`ceramic organic-radius-3 w-full px-7 py-5 text-center transition-opacity ${
                body.trim() ? "opacity-100" : "opacity-40"
              }`}
            >
              <span className="font-serif text-xl italic text-dusk">{t("journal.save")}</span>
            </button>
          </div>

          {/* Past entries */}
          <div className="px-7 mt-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40 mb-4">
              {lang === "fr" ? "Pages précédentes" : "Previous pages"}
            </p>

            {journal.length === 0 ? (
              <p className="text-[13.5px] italic text-dusk/55 max-w-[34ch]">
                {t("journal.empty")}
              </p>
            ) : (
              <div className="space-y-3">
                {journal.map((e) => {
                  const open = openId === e.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => setOpenId(open ? null : e.id)}
                      className="w-full text-left paper-card p-5 transition-all"
                      style={{ borderRadius: 22 }}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/45">
                          {e.to ? t(`journal.to.${e.to}`) : ""}
                        </p>
                        <p className="text-[10px] tracking-[0.06em] text-dusk/45">
                          {formatDate(e.date)}
                        </p>
                      </div>
                      <p
                        className={`mt-2 font-serif italic text-[15.5px] leading-[26px] text-dusk ${
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

          <div className="px-7 mt-12">
            <Link to="/presence" className="block border-t border-dusk/10 pt-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
                {lang === "fr" ? "Si vous voulez en parler" : "If you want to talk about it"}
              </p>
              <p className="mt-1 font-serif text-base italic text-dusk">
                {lang === "fr" ? "Ouvrir la Présence →" : "Open the Presence →"}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
