import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout du Soutien psychologique. La mémoire vit ici (et nulle part ailleurs).
export const Route = createFileRoute("/care")({
  component: () => <Outlet />,
});