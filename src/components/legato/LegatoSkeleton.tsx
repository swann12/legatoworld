import { cn } from "@/lib/utils";

export function LegatoSkeleton({
  variant = "line",
  className,
  count = 3,
}: {
  variant?: "line" | "card" | "grid";
  className?: string;
  count?: number;
}) {
  if (variant === "card") {
    return (
      <div className={cn("paper-card p-5 animate-pulse motion-reduce:animate-none", className)}>
        <div className="h-3 w-20 rounded-full bg-dusk/10 mb-4" />
        <div className="h-4 w-3/4 rounded-full bg-dusk/10 mb-2" />
        <div className="h-4 w-2/3 rounded-full bg-dusk/10" />
      </div>
    );
  }
  if (variant === "grid") {
    return (
      <div className={cn("grid grid-cols-2 gap-3", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="paper-card p-4 animate-pulse motion-reduce:animate-none">
            <div className="h-3 w-16 rounded-full bg-dusk/10 mb-3" />
            <div className="h-4 w-full rounded-full bg-dusk/10" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={cn("space-y-2.5 animate-pulse motion-reduce:animate-none", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-4 rounded-full bg-dusk/10" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}