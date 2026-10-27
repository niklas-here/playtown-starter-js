# PlayTown starter kit for JavaScript and TypeScript

A small finished game, *Star Hunt*, that shows everything a game needs to work in PlayTown:

- connecting to the platform,
- saying when the game is ready,
- pausing when the platform asks it to,
- touch, gamepad and keyboard,
- saves that cope with two devices,
- two languages.

Replace the game with your own and keep the rest. **`PLAYTOWN.md` lists what every PlayTown game must and should do**: build against it, and give it to your AI coding assistant if you use one.

The full guide is in [PlayTown's developer documentation](https://playtown-docs-staging.niklas-2d1.workers.dev/getting-started/).

## Getting started

You need Node 22 or later.

```bash
npm install
npm run playtown        # builds the game and opens it in a local PlayTown host
```

While you develop, you can run Vite with hot reload and put the PlayTown host around it:

```bash
npm run dev             # in one terminal
npm run playtown:dev    # in another
```

| Command | What it does |
|---|---|
| `npm run dev` | Vite at http://localhost:5173. Without PlayTown nothing is saved |
| `npm run playtown` | Builds the export and runs it in `playtown dev`, with PlayTown's security rules |
| `npm run playtown:dev` | Runs your Vite server in `playtown dev` |
| `npm test` | Tests the game's rules in `src/game.test.ts` |
| `npm run validate` | The same checks as PlayTown's import, on the built export |

## The files

| File | What it is |
|---|---|
| `PLAYTOWN.md` | PlayTown's requirements for every game: keep it, build against it |
| `playtown.json` | The manifest: the game's id, name, criteria (kind of game, players, age, play time), languages, controls and what it needs |
| `src/main.ts` | Everything that talks to PlayTown |
| `src/game.ts` | The game's rules, without PlayTown |
| `src/texts.ts` | All texts, per language |
| `public/cover.png` | The cover image in the catalog |
| `CHANGELOG.md` | What is new in each version |
| `.github/workflows/release.yml` | Builds the game and attaches the export to a GitHub Release when you tag |
| `vendor/` | PlayTown's SDK and CLI, until they are on npm |

## Submitting to PlayTown

1. Ask PlayTown to create your game. You get a game id, for example `star-hunt`. Put it as `gameId` in `playtown.json`.
2. Install PlayTown's GitHub app on the repository and connect the repository in PlayTown Studio.
3. Write what is new in `CHANGELOG.md` under a heading with the version's name, for example `## v0.1.0`. Commit, push and tag the version:

   ```bash
   git commit -am "Version 0.1.0"
   git push
   git tag v0.1.0
   git push origin v0.1.0
   ```

4. Wait until the *Release* workflow has finished on GitHub. Then import the tag `v0.1.0` in Studio.
5. Try the game in preview and send it for review.
