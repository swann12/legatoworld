import { createFileRoute, redirect } from "@tanstack/react-router";

// La page "Space" n'est plus une destination : tout part de Soutien ou Démarches.
export const Route = createFileRoute("/space")({
  beforeLoad: () => { throw redirect({ to: "/home" }); },
  component: () => null,
});
