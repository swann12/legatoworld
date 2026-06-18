import { createFileRoute, redirect } from "@tanstack/react-router";

// La mémoire EST le jardin. On évite la page anecdotique : redirection nette.
export const Route = createFileRoute("/care/memory")({
  beforeLoad: () => { throw redirect({ to: "/care/garden" }); },
  component: () => null,
});