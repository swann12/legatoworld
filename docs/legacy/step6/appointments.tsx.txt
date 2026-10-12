import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/appointments")({
  beforeLoad: () => { throw redirect({ to: "/practical/tasks" }); },
  component: () => null,
});
