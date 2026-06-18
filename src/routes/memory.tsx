import { createFileRoute, redirect } from "@tanstack/react-router";

// La mémoire vit dans le Soutien — on redirige toute URL legacy.
export const Route = createFileRoute("/memory")({
  beforeLoad: () => { throw redirect({ to: "/care/memory" }); },
  component: () => null,
});