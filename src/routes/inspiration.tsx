import { createFileRoute, redirect } from "@tanstack/react-router";

// Ancienne adresse : tout passe désormais par Soutien.
export const Route = createFileRoute("/inspiration")({
  beforeLoad: () => { throw redirect({ to: "/care/resources" }); },
  component: () => null,
});
