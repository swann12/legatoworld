import { Sun, Moon, Monitor } from "lucide-react";
import { useLegato, type ThemeMode } from "@/lib/legato-state";

const OPTIONS: { id: ThemeMode; Icon: typeof Sun; label: string }[] = [
  { id: "auto",  Icon: Monitor, label: "Auto" },
  { id: "light", Icon: Sun,     label: "Jour" },
  { id: "dark",  Icon: Moon,    label: "Nuit" },
];

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useLegato();
  return (
    <div
      role="radiogroup"
      aria-label="Apparence"
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur ${className}`}
    >
      {OPTIONS.map(({ id, Icon, label }) => {
        const active = theme === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={13} strokeWidth={1.7} />
            {label}
          </button>
        );
      })}
    </div>
  );
}