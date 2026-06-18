import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/care/dates")({
  beforeLoad: () => { throw redirect({ to: "/dates" }); },
  component: () => null,
});