import { createFileRoute, redirect } from "@tanstack/react-router";

// Ancienne adresse : tout passe désormais par Soutien.
export const Route = createFileRoute("/dates")({
  beforeLoad: () => { throw redirect({ to: "/care/dates" }); },
  component: () => null,
});
