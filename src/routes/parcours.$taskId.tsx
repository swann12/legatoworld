import { createFileRoute, redirect } from "@tanstack/react-router";

// Les parcours sont désormais les démarches elles-mêmes.
export const Route = createFileRoute("/parcours/$taskId")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/practical/tasks/$id", params: { id: params.taskId } });
  },
  component: () => null,
});
