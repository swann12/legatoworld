import { createFileRoute, redirect } from "@tanstack/react-router";

// Ancienne adresse : tout passe désormais par Soutien.
export const Route = createFileRoute("/community")({
  beforeLoad: () => { throw redirect({ to: "/care/community" }); },
  component: () => null,
});
