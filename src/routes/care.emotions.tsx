import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/care/emotions")({
  beforeLoad: () => { throw redirect({ to: "/checkin" }); },
  component: () => null,
});