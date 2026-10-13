import { describe, expect, it } from "bun:test";
import { taskState, upcoming, hour } from "./carnet-model";

describe("carnet", () => {
  it("ne garde que les rendez-vous à venir, dans l'ordre", () => {
    const r = upcoming([
      { id: "a", date: "2026-10-16", who: "Chimio", questions: [] },
      { id: "b", date: "2026-10-09", time: "10:00", who: "Oncologue", questions: [] },
      { id: "c", date: "2026-10-02", who: "Passé", questions: [] },
    ], "2026-10-05");
    expect(r.map((x) => x.id)).toEqual(["b", "a"]);
  });
  it("une tâche acceptée est ACCEPTÉ, demandée EN ATTENTE, sinon personne", () => {
    expect(taskState({ id: "1", what: "", when: "", askedTo: ["Claire"], accepted: true })).toBe("accepte");
    expect(taskState({ id: "2", what: "", when: "", askedTo: ["Paul"], accepted: false })).toBe("attente");
    expect(taskState({ id: "3", what: "", when: "", askedTo: [], accepted: false })).toBe("personne");
  });
  it("écrit l'heure à la française", () => { expect(hour("10:00")).toBe("10 h"); expect(hour("14:30")).toBe("14 h30"); });
});
