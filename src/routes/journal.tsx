import { createFileRoute, redirect } from "@tanstack/react-router";

// Ancienne adresse : tout passe désormais par Soutien.
export const Route = createFileRoute("/journal")({
  beforeLoad: () => { throw redirect({ to: "/care/journal" }); },
  component: () => null,
});
