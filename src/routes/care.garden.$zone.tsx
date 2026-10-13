import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/care/garden/$zone")({ component: () => <Outlet /> });
