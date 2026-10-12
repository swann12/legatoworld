import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/practical/tasks/$id")({
  component: () => <Outlet />,
});
