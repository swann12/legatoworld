import { createFileRoute, redirect } from "@tanstack/react-router";

/** Ancienne adresse : renvoie vers D122. */
export const Route = createFileRoute("/presence/about")({
  beforeLoad: () => { throw redirect({ to: "/presence/infos", statusCode: 301 }); },
});
