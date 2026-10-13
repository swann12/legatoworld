import { useRouter } from "@tanstack/react-router";
import type { MouseEvent } from "react";

/** Retour réel : revient à la page précédente de la visite ; sinon le lien suit sa cible prévue. */
export function useSmartBack() {
  const router = useRouter();
  return (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const h = router.history as unknown as { canGoBack?: () => boolean };
    const idx = (typeof window !== "undefined" ? (window.history.state as { __TSR_index?: number } | null)?.__TSR_index : 0) ?? 0;
    const can = h.canGoBack ? h.canGoBack() : idx > 0;
    if (can) { e.preventDefault(); router.history.back(); }
  };
}
