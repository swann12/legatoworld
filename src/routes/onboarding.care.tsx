import { createFileRoute, redirect } from "@tanstack/react-router";

/** Ancien flow — remplacé par /onboarding (flow unique). */
export const Route = createFileRoute("/onboarding/care")({
  beforeLoad: () => { throw redirect({ to: "/onboarding" }); },
  component: () => null,
});