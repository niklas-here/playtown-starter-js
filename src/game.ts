// The rules of Star Hunt, without PlayTown or the page, so they can be tested on their own (npm test).

export const SIZE = 7;
export const ROUND_MS = 30_000;

export type Point = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";
export type Round = { player: Point; star: Point; score: number; leftMs: number };

/** What is saved between sessions. Change its shape only together with saveSchemaVersion in playtown.json. */
export type Progress = { best: number; rounds: number };

const STEPS: Record<Direction, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const clamp = (value: number) => Math.min(SIZE - 1, Math.max(0, value));

export function placeStar(player: Point, random = Math.random): Point {
  for (;;) {
    const star = { x: Math.floor(random() * SIZE), y: Math.floor(random() * SIZE) };
    if (star.x !== player.x || star.y !== player.y) return star;
  }
}

export function newRound(random = Math.random): Round {
  const player = { x: Math.floor(SIZE / 2), y: Math.floor(SIZE / 2) };
  return { player, star: placeStar(player, random), score: 0, leftMs: ROUND_MS };
}

export function step(round: Round, direction: Direction, random = Math.random): Round {
  if (round.leftMs <= 0) return round;
  const player = { x: clamp(round.player.x + STEPS[direction].x), y: clamp(round.player.y + STEPS[direction].y) };
  if (player.x === round.star.x && player.y === round.star.y) {
    return { ...round, player, score: round.score + 1, star: placeStar(player, random) };
  }
  return { ...round, player };
}

export function tick(round: Round, elapsedMs: number): Round {
  return { ...round, leftMs: Math.max(0, round.leftMs - elapsedMs) };
}

/** The step that brings `from` closer to `to`, along the longer distance. */
export function towards(from: Point, to: Point): Direction | undefined {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return undefined;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? "right" : "left";
  return dy > 0 ? "down" : "up";
}

export function isProgress(value: unknown): value is Progress {
  const progress = value as Progress;
  return typeof value === "object" && value !== null && Number.isInteger(progress.best) && Number.isInteger(progress.rounds);
}

/** The same player saved on two devices: keep the best of both. */
export function mergeProgress(a: Progress, b: Progress): Progress {
  return { best: Math.max(a.best, b.best), rounds: Math.max(a.rounds, b.rounds) };
}
