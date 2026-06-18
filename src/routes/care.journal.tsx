import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/care/journal")({
  beforeLoad: () => { throw redirect({ to: "/journal" }); },
  component: () => null,
});