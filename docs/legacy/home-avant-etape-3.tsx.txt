import { createFileRoute, redirect } from "@tanstack/react-router";

// /home n'existe plus comme page distincte : la page d'accueil est l'espace lui-même.
// On redirige vers /care par défaut ; les utilisateurs purement "pratique" partent vers /practical.
export const Route = createFileRoute("/home")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("lg.primaryNeed");
        if (raw && raw.replace(/"/g, "") === "practical") {
          throw redirect({ to: "/practical" });
        }
      } catch (e) {
        if (e && typeof e === "object" && "to" in (e as object)) throw e;
      }
    }
    throw redirect({ to: "/care" });
  },
  component: () => null,
});
