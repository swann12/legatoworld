import type { ReactNode } from "react";

/** Hors maquette : reste accessible en attendant l'accord de suppression. */
export function Step10Extras({ children }: { children: ReactNode }) {
  return <details className="lg-step10-extras"><summary>Autres options</summary><div className="pt-4">{children}</div></details>;
}