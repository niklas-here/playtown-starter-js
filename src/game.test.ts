import { describe, expect, it } from "vitest";
import { mergeProgress, newRound, placeStar, ROUND_MS, SIZE, step, tick, towards, type Round } from "./game";

// A fixed sequence instead of Math.random, so every run is the same.
const sequence = (...values: number[]) => () => values.shift() ?? 0;

describe("Star Hunt", () => {
  it("starts in the middle with a star somewhere else", () => {
    const round = newRound(sequence(0, 0));
    expect(round.player).toEqual({ x: 3, y: 3 });
    expect(round.star).toEqual({ x: 0, y: 0 });
    expect(round.leftMs).toBe(ROUND_MS);
  });

  it("never puts the star on the player", () => {
    const middle = 3 / SIZE + 0.01;
    expect(placeStar({ x: 3, y: 3 }, sequence(middle, middle, 0, 0))).toEqual({ x: 0, y: 0 });
  });

  it("scores when the player reaches the star", () => {
    const round: Round = { player: { x: 3, y: 3 }, star: { x: 4, y: 3 }, score: 0, leftMs: 1000 };
    const next = step(round, "right", sequence(0, 0));
    expect(next.score).toBe(1);
    expect(next.star).toEqual({ x: 0, y: 0 });
  });

  it("stays inside the board and stops when time is up", () => {
    const corner: Round = { player: { x: 0, y: 0 }, star: { x: 6, y: 6 }, score: 0, leftMs: 1000 };
    expect(step(corner, "up").player).toEqual({ x: 0, y: 0 });
    const over = tick(corner, 5000);
    expect(over.leftMs).toBe(0);
    expect(step(over, "right").player).toEqual({ x: 0, y: 0 });
  });

  it("steps towards a tapped cell along the longer distance", () => {
    expect(towards({ x: 3, y: 3 }, { x: 6, y: 4 })).toBe("right");
    expect(towards({ x: 3, y: 3 }, { x: 3, y: 0 })).toBe("up");
    expect(towards({ x: 3, y: 3 }, { x: 3, y: 3 })).toBeUndefined();
  });

  it("keeps the best of two saves", () => {
    expect(mergeProgress({ best: 9, rounds: 2 }, { best: 4, rounds: 5 })).toEqual({ best: 9, rounds: 5 });
  });
});
