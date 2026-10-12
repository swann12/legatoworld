import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/resources/$category")({
  component: () => <Outlet />,
});
