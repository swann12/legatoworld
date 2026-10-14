import { createFileRoute } from "@tanstack/react-router";
import { SelfObseques } from "@/components/legato/SelfSpace";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/obseques")({ head: () => legatoHead('Mes souhaits pour mes obsèques', 'Cérémonie, musique, lieu : vos souhaits, modifiables à tout moment.'), component: SelfObseques });
