import { createFileRoute } from "@tanstack/react-router";
import { SelfCafe } from "@/components/legato/SelfSpace";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/community/cafe-mortel")({ head: () => legatoHead('Un café mortel', 'Une heure pour parler de la mort librement, en visio.'), component: SelfCafe });
