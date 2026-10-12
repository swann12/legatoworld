import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/help/corps/soin")({
  component: () => <Outlet />,
});
