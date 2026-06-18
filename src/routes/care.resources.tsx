import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/care/resources")({
  beforeLoad: () => { throw redirect({ to: "/resources" }); },
  component: () => null,
});