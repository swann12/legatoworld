import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

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
    <Shell>
      <div className="relative pb-12">
        <div className="relative z-10">
          <header className="px-7 pt-12">
            <Link to="/home" className="eyebrow inline-block mb-6 hover:text-dusk">← Aujourd'hui</Link>
            <p className="eyebrow">{t("journal.title")}</p>
            <h1 className="mt-3 font-serif text-[30px] leading-[1.06] font-light text-dusk max-w-[22ch] text-balance">
              {lang === "fr" ? "Une page rien qu'à vous." : "A page just for you."}
            </h1>
            <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.6] text-dusk/65">
              {t("journal.subtitle")}
            </p>
          </header>

          {/* Address selector */}
          <div className="px-7 mt-10 flex gap-2">
            {(["free", "self", "them"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTo(k)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-colors ${
                  to === k
                    ? "bg-dusk text-paper border-dusk"
                    : "border-dusk/20 text-dusk/70 hover:bg-dusk/5"
                }`}
              >
                {t(`journal.to.${k}`)}
              </button>
            ))}
          </div>

          {/* Writing surface — soft notebook page, no lines, autosize */}
          <div className="px-7 mt-5">
            <div
              className="relative overflow-hidden rounded-[16px] border border-dusk/12"
              style={{ background: "var(--whisper)" }}
            >
              <textarea
                ref={taRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={placeholder}
                rows={6}
                className="relative w-full bg-transparent resize-none outline-none px-6 py-6 font-serif text-[18px] leading-[30px] text-dusk placeholder:text-dusk/30 overflow-hidden"
                style={{ minHeight: 240 }}
              />
            </div>
          </div>

          <div className="px-7 mt-4">
            <button
              onClick={save}
              disabled={!body.trim()}
              className="w-full btn-primary py-4"
            >
              {t("journal.save")}
            </button>
          </div>

          {/* Past entries */}
          <div className="px-7 mt-12">
            <p className="eyebrow mb-5">
              {lang === "fr" ? "Pages précédentes" : "Previous pages"}
            </p>

            {journal.length === 0 ? (
              <p className="text-[14px] text-dusk/60 max-w-[34ch]">
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
                        <p className="eyebrow-sm">{e.to ? t(`journal.to.${e.to}`) : ""}</p>
                        <p className="eyebrow-sm" style={{ letterSpacing: "0.06em" }}>
                          {formatDate(e.date)}
                        </p>
                      </div>
                      <p className={`mt-3 font-serif text-[16px] leading-[26px] text-dusk/85 ${open ? "" : "line-clamp-3"}`}>
                        {e.body}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-7 mt-12">
            <Link to="/presence" className="block border-t border-dusk/10 pt-6 text-center group">
              <p className="eyebrow">
                {lang === "fr" ? "Si vous voulez en parler" : "If you want to talk about it"}
              </p>
              <p className="mt-2 text-[15px] text-dusk">
                {lang === "fr" ? "Ouvrir la Présence →" : "Open the Presence →"}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
