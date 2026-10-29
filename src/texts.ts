import type { InputMethod } from "@playtown/sdk";

// Every text the player sees, per language in `locales` in playtown.json. PlayTown tells the game which
// one the player uses (context.locale); the reviewer checks that each listed language is complete.
const sv = {
  title: "Stjärnjakt",
  score: (n: number) => `${n} ★`,
  time: (seconds: number) => `${seconds} s`,
  best: (n: number) => `Bäst: ${n}`,
  start: { touch: "Tryck för att börja", mouse: "Klicka för att börja", gamepad: "Tryck A för att börja", keyboard: "Tryck Enter för att börja" },
  help: {
    touch: "Tryck på en ruta för att gå åt det hållet.",
    mouse: "Klicka på en ruta för att gå åt det hållet.",
    gamepad: "Styrspaken eller styrkorset flyttar. Start öppnar menyn.",
    keyboard: "Piltangenterna eller WASD flyttar. Esc öppnar menyn.",
  },
  roundOver: (score: number) => `Tiden är slut: ${score} ${score === 1 ? "stjärna" : "stjärnor"}.`,
  newBest: "Nytt rekord!",
  paused: "Pausat",
  offline: "Körs utan PlayTown: inget sparas. Starta med npm run playtown.",
  saveFailed: "Det gick inte att spara.",
} satisfies Texts;

const en: Texts = {
  title: "Star Hunt",
  score: (n) => `${n} ★`,
  time: (seconds) => `${seconds} s`,
  best: (n) => `Best: ${n}`,
  start: { touch: "Tap to start", mouse: "Click to start", gamepad: "Press A to start", keyboard: "Press Enter to start" },
  help: {
    touch: "Tap a square to walk that way.",
    mouse: "Click a square to walk that way.",
    gamepad: "The stick or the d-pad moves. Start opens the menu.",
    keyboard: "Arrow keys or WASD move. Esc opens the menu.",
  },
  roundOver: (score) => `Time's up: ${score} ${score === 1 ? "star" : "stars"}.`,
  newBest: "New record!",
  paused: "Paused",
  offline: "Running without PlayTown: nothing is saved. Start with npm run playtown.",
  saveFailed: "Could not save.",
};

type Texts = {
  title: string;
  score(n: number): string;
  time(seconds: number): string;
  best(n: number): string;
  start: Record<InputMethod, string>;
  help: Record<InputMethod, string>;
  roundOver(score: number): string;
  newBest: string;
  paused: string;
  offline: string;
  saveFailed: string;
};

const languages: Record<string, Texts> = { sv, en };

/** Texts for a locale such as `en-GB` or `sv`, in English when the language is missing. */
export function textsFor(locale: string): Texts & { lang: string } {
  const lang = locale.split("-")[0]!;
  return languages[lang] ? { ...languages[lang], lang } : { ...en, lang: "en" };
}
