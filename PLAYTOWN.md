# PlayTown game requirements

PlayTown is a game platform for children. This file lists what every PlayTown game must do and should do. Keep it in your repository: it is the checklist you build against, and the brief to give an AI coding assistant working on the game. The full guide is in the [developer documentation](https://playtown-docs-staging.niklas-2d1.workers.dev/).

**Must** means the import or the review stops a release that does not do it. **Should** means the review asks about it and players notice.

## The game states its criteria

Every game describes itself in `playtown.json`. Players and parents see these facts in the catalog, and the catalog filters on them.

| Field | What to write |
|---|---|
| `catalog.title`, `catalog.summary` | The name (at most 60 characters) and a short description (at most 200), in every language in `locales`. |
| `catalog.genres` | One to three of: `action`, `adventure`, `casual`, `creative`, `learning`, `music`, `party`, `platformer`, `puzzle`, `racing`, `simulation`, `sports`, `strategy`. |
| `catalog.players` | How many can play at the same time, as `{ "min": 1, "max": 1 }` for a single-player game. |
| `catalog.ageRating` | The age the game suits: `3`, `7`, `12`, `16` or `18`. The reviewer decides the level players see, starting from yours. |
| `catalog.playMinutes` | About how long a normal session takes, in minutes. |
| `locales` | The languages all the game's texts exist in. |
| `input` | How the game can be played. `touch` and `gamepad` are always required. |
| `orientation` | `landscape`, `portrait` or `any`. |

## Languages

- **Should:** have all of PlayTown's player languages: today **English (`en`) and Swedish (`sv`)**. A player then always gets the game in their own language. `npm run validate` says when one is missing.
- **Must:** every language in `locales` is complete: the catalog title and summary, and every text in the game.
- **Should:** use `playtown.context.locale` to choose the language, and fall back to English.

## Play

- **Must:** work fully with **touch** and with a **gamepad**. Keyboard and mouse are welcome, never required.
- **Must:** connect with `connect()` from `@playtown/sdk` and call `lifecycle.running()` as soon as the game can be played.
- **Must:** pause time, sound and input on `session.suspend`, and continue on `session.resume`.
- **Must:** stop on `session.end`. Saving no longer works after it.
- **Must:** open PlayTown's menu with `ui.openMenu()` (the menu action, Start on a gamepad, Esc on a keyboard). The game has no exit button of its own and no sign-in of its own.
- **Should:** show button hints for the input mode in use (`onModeChange`, `input.mode`), with touch targets of at least 44 × 44 points.
- **Should:** be understandable without much reading, and playable in short sessions.

## Saving

- **Must:** save only through PlayTown (`saves.get`, `saves.put`), with the `saves` capability and `saveSchemaVersion` in `playtown.json`.
- **Must:** handle `SAVE_CONFLICT`: read again, merge, write again.
- **Must:** keep players' saves readable across versions: a new save format adds the old ones to `saveSchemaReads` and upgrades them.
- **Should:** save after important moments and on `session.suspend`, never every frame. One slot at most 256 KB.
- **Should:** expect `session.end` with `time_limit` when the family's play time is up. PlayTown warns the player first and gives about two minutes to finish, so a game that saves at natural stopping points loses nothing.

## Safety and privacy

- **Must:** load only the game's own files. No requests to other addresses, no links out, popups, forms or downloads.
- **Must:** never ask for or store names, ages, photos, addresses or other personal data. `gamePlayerId` is the only player id there is.
- **Must:** no advertising, tracking or analytics of your own.
- **Must:** no secrets in the code: no keys, passwords or tokens.

## Content

- **Must:** content fits the age level: texts, pictures and sounds.
- **Must:** no purchase prompts, countdowns to offers or anything else that pressures children. A time limit inside the game itself is fine.
- **Must:** not crash or get stuck during a normal play session.

## The export

- **Must:** a finished web export with an `.html` start file. PlayTown never builds the game or runs your code at import.
- **Must:** relative paths only (Vite: `base: "./"`), allowed file types only, no symbolic links, no hidden files.
- **Must:** at most 2,000 files, 95 MB per file and 300 MB in total.

## Before you submit

1. `npm test` and `npm run build`.
2. `npm run validate`: the last line says the export passes.
3. `npm run playtown`: open the platform menu, let an adult pause, make the next save conflict, switch the input mode, and try every language and the phone size.
4. Write what is new in `CHANGELOG.md`, tag the version and push the tag.
5. Import the tag in PlayTown Studio, play it in preview and send it for review.
