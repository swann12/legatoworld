import { createFileRoute } from "@tanstack/react-router";
import { SelfTestament } from "@/components/legato/SelfSpace";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/testament")({ head: () => legatoHead('Mon testament', 'Seul ou avec un notaire : deux façons de faire un testament.'), component: SelfTestament });
