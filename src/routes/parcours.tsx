import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/parcours")({
  beforeLoad: () => { throw redirect({ to: "/practical/tasks" }); },
  component: () => null,
});
