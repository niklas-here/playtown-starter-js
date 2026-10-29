// Star Hunt, PlayTown's starter game: collect as many stars as you can in 30 seconds.
// Everything that talks to PlayTown is in this file. The rules are in game.ts and the texts in texts.ts.
import { connect, createInput, PlayTownError, type InputAction, type InputMethod, type PlayTownClient } from "@playtown/sdk";
import { isProgress, mergeProgress, newRound, SIZE, step, tick, towards, type Direction, type Progress, type Round } from "./game";
import { textsFor } from "./texts";
import "./style.css";

const SLOT = "progress";
/** Must match saveSchemaVersion in playtown.json. */
const SAVE_FORMAT = 1;
const STICK_STEP_MS = 160;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const board = $<HTMLDivElement>("board");

let playtown: PlayTownClient | undefined;
let t = textsFor(navigator.language);
let mode: InputMethod = matchMedia("(pointer: coarse)").matches ? "touch" : "mouse";
let progress: Progress = { best: 0, rounds: 0 };
/** The save's revision as last read or written. PlayTown refuses a write based on an older one. */
let revision = 0;
let round: Round | undefined;
let message = "";
let paused = false;
let ended = false;
let stick = { x: 0, y: 0 };
let lastStickStep = 0;

async function main() {
  try {
    playtown = await connect();
  } catch {
    // Not launched by PlayTown, for example `npm run dev` in an ordinary tab. Playable, but nothing is saved.
    message = t.offline;
  }
  if (playtown) {
    t = textsFor(playtown.context.locale);
    mode = playtown.context.inputMode;
    playtown.on("session.suspend", () => setPaused(true));
    playtown.on("session.resume", () => setPaused(false));
    playtown.on("session.end", () => end());
    playtown.on("input.mode", (event) => setMode(event.mode));
    await load();
  }
  document.documentElement.lang = t.lang;
  document.title = t.title;
  createInput({ onAction, onModeChange: setMode });
  board.addEventListener("pointerdown", onPointer);
  render();
  // The game is ready to play. Until this call PlayTown shows "Starting the game…".
  await playtown?.lifecycle.running();
  requestAnimationFrame(frame);
}

// ---------- Saves ----------

async function load() {
  try {
    const save = await playtown!.saves.get(SLOT);
    if (save) {
      // Keep the revision even if the data is not recognised, or the next write would conflict.
      revision = save.revision;
      if (isProgress(save.data)) progress = save.data;
    }
  } catch (error) {
    console.error("saves.get", error);
  }
}

/** PlayTown takes one write to a save slot at a time: each save waits for the one before. */
let saving = Promise.resolve();
function save(): Promise<void> {
  saving = saving.then(() => write());
  return saving;
}

async function write(attempt = 1): Promise<void> {
  if (!playtown || ended) return;
  try {
    const saved = await playtown.saves.put({ slot: SLOT, expectedRevision: revision, schemaVersion: SAVE_FORMAT, data: progress });
    revision = saved.revision;
  } catch (error) {
    if (error instanceof PlayTownError && error.code === "SAVE_CONFLICT" && attempt < 3) {
      // The player saved on another device since we read. Read again, keep the best of both, and retry.
      const current = await playtown.saves.get(SLOT);
      if (current && isProgress(current.data)) progress = mergeProgress(progress, current.data);
      revision = current?.revision ?? 0;
      return write(attempt + 1);
    }
    console.error("saves.put", error);
    message = t.saveFailed;
    render();
  }
}

// ---------- Input ----------

function onAction(action: InputAction) {
  if (action.action === "menu") {
    // The platform menu pauses the game through session.suspend. Without PlayTown there is no menu.
    if (action.pressed) void playtown?.ui.openMenu();
    return;
  }
  if (paused || ended) return;
  if (action.action === "confirm" && action.pressed && !playing()) begin();
  else if (action.action === "navigate") move(action.direction);
  else if (action.action === "move") stick = { x: action.x, y: action.y };
}

function onPointer(event: PointerEvent) {
  if (paused || ended) return;
  if (!playing()) return begin();
  const rect = board.getBoundingClientRect();
  const cell = { x: Math.floor(((event.clientX - rect.left) / rect.width) * SIZE), y: Math.floor(((event.clientY - rect.top) / rect.height) * SIZE) };
  const direction = towards(round!.player, cell);
  if (direction) move(direction);
}

function setMode(next: InputMethod) {
  mode = next;
  render();
}

// ---------- The round ----------

const playing = () => round !== undefined && round.leftMs > 0;

function begin() {
  round = newRound();
  message = "";
  render();
}

function move(direction: Direction) {
  if (!playing()) return;
  round = step(round!, direction);
  render();
}

function finish() {
  const score = round!.score;
  const record = score > progress.best;
  progress = { best: Math.max(progress.best, score), rounds: progress.rounds + 1 };
  message = `${t.roundOver(score)}${record ? ` ${t.newBest}` : ""} ${t.start[mode]}.`;
  render();
  void save();
}

let last = performance.now();
function frame(now: number) {
  const elapsed = now - last;
  last = now;
  if (playing() && !paused && !ended) {
    if (Math.hypot(stick.x, stick.y) > 0.5 && now - lastStickStep > STICK_STEP_MS) {
      lastStickStep = now;
      move(Math.abs(stick.x) > Math.abs(stick.y) ? (stick.x > 0 ? "right" : "left") : stick.y > 0 ? "down" : "up");
    }
    round = tick(round!, elapsed);
    if (round.leftMs === 0) finish();
    else render();
  }
  if (!ended) requestAnimationFrame(frame);
}

function setPaused(value: boolean) {
  // Stop time, sound and input while PlayTown's menu or a dialog is open, or the tab is hidden.
  paused = value;
  stick = { x: 0, y: 0 };
  render();
}

function end() {
  // The session is over: saving no longer works, and PlayTown closes the game and tells the player why.
  // The game only stops.
  ended = true;
  render();
}

// ---------- Drawing ----------

function render() {
  $("title").textContent = t.title;
  $("score").textContent = t.score(round?.score ?? 0);
  $("time").textContent = t.time(Math.ceil((round?.leftMs ?? 0) / 1000));
  $("best").textContent = t.best(progress.best);
  $("status").textContent = message || (playing() ? "" : t.start[mode]);
  $("help").textContent = t.help[mode];
  const cells = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (round?.player.x === x && round.player.y === y) cell.classList.add("player");
      else if (playing() && round?.star.x === x && round.star.y === y) cell.classList.add("star");
      cells.push(cell);
    }
  }
  board.replaceChildren(...cells);
  const overlay = $("overlay");
  overlay.hidden = !paused || ended;
  overlay.textContent = t.paused;
}

void main();
