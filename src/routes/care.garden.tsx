import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/care/garden")({
  beforeLoad: () => { throw redirect({ to: "/garden" }); },
  component: () => null,
});