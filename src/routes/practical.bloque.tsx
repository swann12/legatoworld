import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/practical/bloque")({ component: () => <Outlet /> });
