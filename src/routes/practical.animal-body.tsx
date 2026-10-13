import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/practical/animal-body")({ component: () => <Outlet /> });
