import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/practical")({
  component: PracticalLayout,
});

function PracticalLayout() {
  return <Outlet />;
}
