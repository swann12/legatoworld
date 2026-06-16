import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { useLegato } from "@/lib/legato-state";
import { loadPractical, savePractical } from "@/lib/practical-store";

export const Route = createFileRoute("/practical/booklet")({
  head: () => ({ meta: [{ title: "Livret de cérémonie — Legato" }] }),
  component: Booklet,
});

function Booklet() {
  const { mode } = useLegato();
  const [d, setD] = useState(loadPractical().bookletDraft);
  useEffect(() => { setD(loadPractical().bookletDraft); }, []);
  const update = (patch: Partial<typeof d>) => {
    const next = { ...d, ...patch };
    setD(next);
    savePractical({ bookletDraft: next });
  };

  return (
    <Shell hideNav>
      <div className="relative pb-12">
        
        <div className="relative z-10">
          <div className="px-7 pt-10 flex items-center justify-between no-print">
            <Link to="/practical/ceremony" className="eyebrow">← Cérémonie</Link>
            <span className="eyebrow">Livret</span>
          </div>
          <header className="px-7 pt-12 no-print">
            <p className="eyebrow">Livret de cérémonie</p>
            <h1 className="mt-3 display-xl text-dusk">
              Une mise en page <span className="italic">simple, élégante.</span>
            </h1>
            <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/65">
              Remplissez les champs. Aperçu en bas. Imprimez ou enregistrez en PDF.
            </p>
          </header>

          <div className="px-5 mt-8 space-y-3 no-print">
            {([
              ["name", "Prénom et nom", false],
              ["dates", "Dates (1947 — 2025)", false],
              ["photoUrl", "URL d'une photo (optionnel)", false],
              ["intro", "Introduction (quelques mots d'accueil)", true],
              ["program", "Programme de la cérémonie", true],
              ["closing", "Mot de clôture, remerciements", true],
            ] as const).map(([k, label, multi]) => (
              <div key={k} className="card-plain p-5">
                <p className="eyebrow">{label}</p>
                {multi ? (
                  <textarea
                    value={d[k]}
                    onChange={(e) => update({ [k]: e.target.value })}
                    rows={4}
                    className="mt-2 w-full bg-transparent outline-none resize-none font-serif italic text-[15px] leading-[24px] text-dusk placeholder:text-dusk/25"
                    placeholder="…"
                  />
                ) : (
                  <input
                    value={d[k]}
                    onChange={(e) => update({ [k]: e.target.value })}
                    className="mt-2 w-full bg-transparent outline-none border-b border-dusk/15 pb-2 font-serif italic text-[15px] text-dusk placeholder:text-dusk/30"
                    placeholder="…"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="px-5 mt-8 no-print">
            <button onClick={() => window.print()} className="w-full ceramic organic-radius-3 px-5 py-4 font-serif italic text-[15px] text-dusk">
              Imprimer ou enregistrer en PDF →
            </button>
          </div>

          {/* Aperçu / version imprimable */}
          <div className="px-5 mt-10 print-booklet">
            <div className="page card-plain p-10 text-center" style={{ minHeight: 480 }}>
              {d.photoUrl && (
                <img src={d.photoUrl} alt="" className="w-32 h-32 object-cover rounded-full mx-auto mb-6 grayscale" />
              )}
              <h2 className="font-serif text-[28px] italic text-dusk leading-tight">{d.name || "Prénom Nom"}</h2>
              <p className="mt-2 text-[13px] uppercase tracking-[0.22em] text-dusk/55">{d.dates || "1947 — 2025"}</p>
              <p className="mt-8 font-serif italic text-[15px] text-dusk/75 leading-relaxed whitespace-pre-line">{d.intro || "Bienvenue. Merci d'être là."}</p>
            </div>
            <div className="page card-plain p-10 mt-6" style={{ minHeight: 480 }}>
              <p className="eyebrow text-center">Programme</p>
              <p className="mt-4 font-serif text-[15px] text-dusk leading-relaxed whitespace-pre-line">{d.program || "1. Accueil\n2. Mots d'un proche\n3. Lecture\n4. Musique\n5. Recueillement"}</p>
            </div>
            <div className="page card-plain p-10 mt-6 text-center" style={{ minHeight: 320 }}>
              <p className="font-serif italic text-[15px] text-dusk/75 leading-relaxed whitespace-pre-line">{d.closing || "Merci d'avoir partagé ce moment."}</p>
            </div>
          </div>
        </div>
      </div>
      <ConfideDock step="livret" />
    </Shell>
  );
}
