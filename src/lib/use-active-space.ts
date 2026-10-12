import { useSpaces, spaceKind, type Space, type SpaceKind } from "./spaces-store";
import { useActiveSpaceId } from "./active-space";

/** Espace actif (ou premier espace vivant) et son type. */
export function useActiveSpace(): { space: Space | undefined; kind: SpaceKind; spaces: Space[]; hydrated: boolean } {
  const { spaces, hydrated } = useSpaces();
  const id = useActiveSpaceId();
  const space = spaces.find((s) => s.id === id && !s.archived) ?? spaces.find((s) => !s.archived);
  return { space, kind: space ? spaceKind(space) : "deuil", spaces, hydrated };
}
