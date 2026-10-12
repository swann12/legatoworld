import { createFileRoute, redirect } from "@tanstack/react-router";

// Les étapes vivent dans les démarches, classées par moment.
export const Route = createFileRoute("/practical/steps")({
  beforeLoad: () => { throw redirect({ to: "/practical/tasks" }); },
  component: () => null,
});
