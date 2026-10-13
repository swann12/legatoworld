import type { ReactNode } from "react";
import { useActiveSpace } from "@/lib/use-active-space";

export function JourneyTheme({ children }: { children: ReactNode }) {
  const { kind } = useActiveSpace();
  return <div data-journey={kind}>{children}</div>;
}