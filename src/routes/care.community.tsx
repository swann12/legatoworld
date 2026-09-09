import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/care/community")({
  component: () => <Outlet />,
});
