import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/space/settings")({ component: () => <Outlet /> });
