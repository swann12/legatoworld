import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead } from "@/components/legato/EditorialUI";
import { useCommunity } from "@/lib/community-store";

export const Route = createFileRoute("/care/community/regles")({
  head: () => ({
    meta: [
      { title: "Règles et sécurité — Communauté Legato" },
      { name: "description", content: "La charte de la communauté, le pseudonymat, le signalement et la modération." },
      { property: "og:title", content: "Règles et sécurité — Communauté Legato" },
      { property: "og:description", content: "Charte, pseudonymat, signalement et modération humaine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Regles,
});

const CHARTE = [
  "On parle de soi, jamais à la place des autres.",
  "Aucun conseil médical, aucun diagnostic, aucune vente.",
  "Pas de comparaison des douleurs : chaque perte est entière.",
  "Ce qui est écrit ici reste ici. Aucune capture, aucun partage.",
  "Un message inquiétant est relu par un modérateur humain.",
];

function Regles() {
  const { pseudo, reports, hydrated, setPseudo } = useCommunity();
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (hydrated) setDraft(pseudo);
  }, [hydrated, pseudo]);

  const nbReports = Object.keys(reports ?? {}).length;

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-[color:var(--paper)] text-dusk pb-36">
        <PageHeader back="/care/community" title="RÈGLES" />

        <section className="px-6">
          <h1 className="ed-page-title text-[28px]">
            Un espace <span className="italic" style={{ color: "var(--terracotta)" }}>protégé</span>.
          </h1>
          <p className="mt-3 max-w-[34ch] text-[13px] leading-[1.6] text-dusk/60">
            Ici, on s'entraide. Rien ne circule ailleurs, et personne n'est obligé de parler.
          </p>
        </section>

        {/* Pseudonyme */}
        <section className="px-5 pt-9">
          <SectionHead label="Votre nom affiché" />
          <div className="craft mt-3 px-5 py-5">
            <input
              value={draft}
              onChange={(e) => { setDraft(e.target.value); setSaved(false); }}
              placeholder="Anonyme"
              maxLength={24}
              className="w-full bg-transparent font-serif text-[19px] outline-none placeholder:text-dusk/30"
            />
            <div className="mt-3 flex items-center gap-3 border-t border-dashed pt-3"
              style={{ borderColor: "color-mix(in oklab, var(--dusk) 16%, transparent)" }}>
              <button
                type="button"
                onClick={() => { setPseudo(draft); setSaved(true); }}
                className="rounded-full px-5 py-2 text-[12.5px]"
                style={{ background: "var(--terracotta)", color: "var(--paper)" }}
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => { setDraft("Anonyme"); setPseudo("Anonyme"); setSaved(true); }}
                className="text-[12.5px] text-dusk/50 underline decoration-dotted underline-offset-4"
              >
                Rester anonyme
              </button>
              {saved && <span className="ml-auto text-[11.5px] text-dusk/45">Enregistré</span>}
            </div>
          </div>
          <p className="mt-3 px-1 text-[12px] leading-[1.6] text-dusk/50">
            Votre vrai nom n'est jamais affiché. Ce nom peut être changé à tout moment.
          </p>
        </section>

        {/* Charte */}
        <section className="px-5 pt-9">
          <SectionHead label="La charte" meta={String(CHARTE.length).padStart(2, "0")} />
          <ul className="craft mt-3 px-5">
            {CHARTE.map((c, i) => (
              <li key={c} className="flex gap-4 border-b border-dashed py-4 last:border-0"
                style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}>
                <span className="mt-[3px] text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-[16.5px] leading-[1.35]">{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Signalement */}
        <section className="px-5 pt-9">
          <SectionHead label="Signalement" />
          <div className="craft mt-3 px-5 py-5">
            <p className="text-[13.5px] leading-[1.65] text-dusk/75">
              Sur chaque message, « Signaler » prévient un modérateur humain. Le message est relu dans la journée,
              et vous n'avez pas à vous justifier.
            </p>
            <p className="mt-3 text-[11.5px] tabular-nums text-dusk/45">
              {nbReports > 0 ? `${nbReports} signalement${nbReports > 1 ? "s" : ""} envoyé${nbReports > 1 ? "s" : ""}` : "Aucun signalement envoyé"}
            </p>
          </div>
        </section>
      </div>
    </Shell>
  );
}
