import { createFileRoute } from "@tanstack/react-router";
import { PresenceInfos } from "@/components/legato/PresenceInfos";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/presence/infos")({
  head: () => legatoHead("Ce que Présence peut faire", "Elle écoute, ouvre la bonne page et prépare un message. Elle ne remplace ni un médecin ni un notaire."),
  component: PresenceInfos,
});
