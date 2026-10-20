import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { findWord } from "@/lib/lexique";

/**
 * D005 · Le mot expliqué : un mot technique souligné en pointillés ;
 * en le touchant, une fenêtre s'ouvre avec la définition du lexique,
 * « Pour vous, maintenant » et un lien vers la page complète.
 */
export function MotExplique({ mot, pourVous, page, children }: {
  mot: string;
  pourVous?: string;
  page?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const entry = findWord(mot);
  return (
    <>
      <button type="button" className="lg-mot" onClick={() => setOpen(true)} aria-haspopup="dialog">
        {children ?? mot}
      </button>
      {open && (
        <div className="lg-sheet-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label={`Le mot expliqué : ${mot}`} className="lg-sheet" onClick={(e) => e.stopPropagation()}>
            <p className="lg-mono">Le mot expliqué</p>
            <p className="mt-3" style={{ fontFamily: "var(--lg-serif)", fontSize: 26, lineHeight: 1.15 }}>
              {mot.charAt(0).toUpperCase() + mot.slice(1)}
            </p>
            <p className="mt-3 text-[14px] leading-[1.55]" style={{ color: "var(--lg-sub)" }}>
              {entry?.definition ?? "Ce mot sera bientôt expliqué ici."}
            </p>
            {pourVous && (
              <>
                <p className="lg-mono mt-5">Pour vous, maintenant</p>
                <p className="mt-2 text-[14px] leading-[1.55]">{pourVous}</p>
              </>
            )}
            <div className="mt-6 flex items-center justify-between gap-4">
              {page ? (
                <Link to={page} className="text-[14px] underline underline-offset-4" onClick={() => setOpen(false)}>
                  Voir la page complète
                </Link>
              ) : <span />}
              <button type="button" className="text-[14px] underline underline-offset-4" onClick={() => setOpen(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
