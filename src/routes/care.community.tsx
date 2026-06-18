import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/care/community")({
  beforeLoad: () => { throw redirect({ to: "/community" }); },
  component: () => null,
});