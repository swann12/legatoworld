import { describe, expect, it } from "bun:test";
import { splitRituals, type MyRitual } from "./my-rituals";
import { nextWorldDate, WORLD_TRADITIONS, WORLD_REGIONS } from "./rituals-catalog";

const r = (p: Partial<MyRitual>): MyRitual => ({ id: Math.random().toString(), title: "x", done: false, createdAt: 0, ...p });

describe("vos rituels", () => {
  it("sépare prévus et faits ; un geste fait chaque année reste aussi prévu", () => {
    const { planned, done } = splitRituals([r({ title: "a", date: "2026-10-03" }), r({ title: "b", done: true, date: "2026-09-21" }), r({ title: "c", done: true, yearly: true, date: "2026-09-08" })]);
    expect(planned.map((x) => x.title)).toEqual(["c", "a"]);
    expect(done.map((x) => x.title)).toEqual(["b", "c"]);
  });
});

describe("rituels du monde", () => {
  it("compte 21 traditions réparties 5, 4, 4, 5, 3", () => {
    expect(WORLD_TRADITIONS.length).toBe(21);
    expect(WORLD_REGIONS.map((g) => WORLD_TRADITIONS.filter((t) => t.region === g.id).length)).toEqual([5, 4, 4, 5, 3]);
  });
  it("le 13 octobre, la prochaine date est Samhain ; le 1er novembre, la Toussaint", () => {
    expect(nextWorldDate(new Date(2026, 9, 13)).d.title).toBe("Samhain");
    expect(nextWorldDate(new Date(2026, 10, 1)).d.title).toBe("Toussaint · Jour des morts");
  });
});
