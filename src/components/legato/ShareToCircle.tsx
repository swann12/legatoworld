import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { listMyCircles, shareItem } from "@/lib/circle.functions";

type Props = {
  kind: "memory" | "text" | "wish" | "note" | "doc";
  title: string;
  payload?: Record<string, unknown>;
  label?: string;
};

export function ShareToCircle({ kind, title, payload, label = "Partager au cercle" }: Props) {
  const list = useServerFn(listMyCircles);
  const share = useServerFn(shareItem);
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["my-circles"],
    queryFn: () => list({}),
    enabled: open,
  });

  async function send(circleId: string) {
    try {
      await share({ data: { circleId, kind, title, payload } });
      toast.success("Partagé au cercle.");
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Partage impossible.");
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost px-4 py-2 rounded-[12px] text-[12px] min-h-11"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-2 paper-card p-3 min-w-[220px]">
          <p className="eyebrow mb-2">Vos cercles</p>
          {isLoading && <p className="text-[13px] text-dusk/65">Chargement…</p>}
          {!isLoading && (data?.circles?.length ?? 0) === 0 && (
            <p className="text-[13px] text-dusk/65">Aucun cercle. Créez-en un dans l'espace Cercle.</p>
          )}
          <ul className="space-y-1">
            {data?.circles?.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => send(c.id)}
                  className="w-full text-left text-[14px] text-dusk hover:bg-dusk/[0.04] rounded-[10px] px-3 py-2 min-h-11"
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}