import { createFileRoute } from "@tanstack/react-router";
import { CoffreDocument } from "@/components/legato/CoffrePages";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/coffre/$id")({
  head: () => legatoHead("Un document du coffre", "Pour qui, quand le lire, et le rappel de mise à jour."),
  component: Page,
});
function Page() {
  const { id } = Route.useParams();
  return <CoffreDocument id={id} />;
}
