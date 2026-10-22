import { createFileRoute, redirect } from "@tanstack/react-router";

// Les anciennes entrées mémoire ouvrent l'espace personnel, pas les parcelles.
export const Route = createFileRoute("/care/memory")({
  beforeLoad: () => { throw redirect({ to: "/care/garden/space" }); },
  component: () => null,
});