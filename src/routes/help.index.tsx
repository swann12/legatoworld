import { createFileRoute, redirect } from "@tanstack/react-router";

// L'espace corps commence directement par les trois questions.
export const Route = createFileRoute("/help/")({
  beforeLoad: () => { throw redirect({ to: "/help/corps" }); },
  component: () => null,
});
