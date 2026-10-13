import { useState, type ReactNode } from "react";

/** Hors maquette : reste accessible en attendant l'accord de suppression. */
export function Step10Extras({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <details className="lg-step10-extras" onToggle={e => setOpen(e.currentTarget.open)}><summary>Autres options</summary>{open && <div className="pt-4">{children}</div>}</details>;
}