import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/care/help")({
  beforeLoad: () => { throw redirect({ to: "/help" }); },
  component: () => null,
});