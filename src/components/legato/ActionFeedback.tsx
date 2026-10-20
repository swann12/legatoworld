import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * D004 · Les boutons sans page : quand un bouton n'ouvre pas d'écran,
 * l'application répond toujours de l'une de ces trois façons —
 * 1. un message bref (SavedToast), 2. une confirmation (ConfirmSheet),
 * 3. la sélection qui change (les puces et cartes existantes).
 */

/** 1 · Message bref « C'est gardé. » avec « Annuler », en bas de l'écran. */
export function useSavedToast() {
  const [message, setMessage] = useState<string | null>(null);
  const undoRef = useRef<(() => void) | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const hide = useCallback(() => {
    window.clearTimeout(timer.current);
    setMessage(null);
    undoRef.current = null;
  }, []);

  const show = useCallback((text = "C'est gardé.", onUndo?: () => void) => {
    window.clearTimeout(timer.current);
    undoRef.current = onUndo ?? null;
    setMessage(text);
    timer.current = window.setTimeout(() => setMessage(null), 4000);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const toast = message ? (
    <p role="status" className="lg-toast">
      <span>{message}</span>
      {undoRef.current && (
        <button type="button" onClick={() => { undoRef.current?.(); hide(); }}>Annuler</button>
      )}
    </p>
  ) : null;

  return { show, hide, toast };
}

/** 2 · Confirmation en bas d'écran (« Appeler le 15 ? ») avant d'appeler ou de quitter. */
export function ConfirmSheet({ open, title, subtitle, confirmLabel = "Confirmer", onConfirm, onCancel }: {
  open: boolean;
  title: ReactNode;
  subtitle?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="lg-sheet-backdrop" role="presentation" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined} className="lg-sheet" onClick={(e) => e.stopPropagation()}>
        <p style={{ fontFamily: "var(--lg-serif)", fontSize: 22, lineHeight: 1.2 }}>{title}</p>
        {subtitle && <p className="mt-[6px] text-[13px]" style={{ color: "var(--lg-sub)" }}>{subtitle}</p>}
        <div className="mt-[14px] flex gap-[10px]">
          <button type="button" onClick={onConfirm} className="flex h-11 flex-1 items-center justify-center rounded-full text-[14px]"
            style={{ background: "var(--lg-deep)", color: "var(--lg-mint)" }}>
            {confirmLabel}
          </button>
          <button type="button" onClick={onCancel} className="flex h-11 flex-1 items-center justify-center rounded-full text-[14px]"
            style={{ border: "1px solid var(--lg-line-2)" }}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

/** Lien d'appel téléphonique précédé d'une confirmation (D004, réponse 2). */
export function ConfirmedCall({ href, number, label, subtitle, className = "", style }: {
  href: string; number: string; label: string; subtitle: string; className?: string; style?: React.CSSProperties;
}) {
  const [ask, setAsk] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setAsk(true)} className={className} style={style}>{label}</button>
      <ConfirmSheet
        open={ask}
        title={`Appeler le ${number} ?`}
        subtitle={subtitle}
        confirmLabel="Appeler"
        onConfirm={() => { setAsk(false); window.location.href = href; }}
        onCancel={() => setAsk(false)}
      />
    </>
  );
}
