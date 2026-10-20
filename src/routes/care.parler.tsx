import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/care/parler")({ component: () => <Outlet /> });
