import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/aide/$article")({ component: () => <Outlet /> });
