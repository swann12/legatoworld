import { test, expect } from "bun:test";
import { vigilCalendar, VIGIL } from "./community-vigil";
import { groupById } from "./community-data";
test("l’agenda conserve la date et la durée de la veillée d’exemple",()=>{const ics=vigilCalendar();expect(ics).toContain("DTSTART:20261001T180000Z");expect(ics).toContain("DTEND:20261001T190000Z");expect(ics).toContain("exemple non confirmé");expect(VIGIL.remaining).toBe(7);});
test("les nouveaux groupes ne remplacent pas les anciens identifiants",()=>{expect(groupById("suicide")?.id).toBe("suicide");expect(groupById("aidants")?.id).toBe("aidants");expect(groupById("conjoint")?.id).toBe("conjoint");});
