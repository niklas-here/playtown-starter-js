# PlayTown-startkit för JavaScript och TypeScript

[English](README.md) · Svenska

Ett litet färdigt spel, *Stjärnjakt*, som visar allt ett spel behöver för att fungera i PlayTown:

- att ansluta till plattformen,
- att säga till när spelet är redo,
- att pausa när plattformen ber om det,
- touch, handkontroll och tangentbord,
- sparningar som klarar två enheter,
- två språk.

Byt ut spelet mot ditt eget och behåll resten.

Hela guiden finns i [PlayTowns utvecklardokumentation](https://playtown-docs-staging.niklas-2d1.workers.dev/sv/getting-started/).

## Kom igång

Du behöver Node 22 eller senare.

```bash
npm install
npm run playtown        # bygger spelet och öppnar det i en lokal PlayTown-värd
```

Medan du utvecklar kan du köra Vite med snabb omladdning och lägga PlayTown-värden runt den:

```bash
npm run dev             # i en terminal
npm run playtown:dev    # i en annan
```

| Kommando | Gör |
|---|---|
| `npm run dev` | Vite på http://localhost:5173. Utan PlayTown sparas ingenting |
| `npm run playtown` | Bygger och kör exporten i `playtown dev`, med PlayTowns säkerhetsregler |
| `npm run playtown:dev` | Kör din Vite-server i `playtown dev` |
| `npm test` | Testar spelets regler i `src/game.test.ts` |
| `npm run validate` | Samma kontroller som PlayTowns import, på den byggda exporten |

## Filerna

| Fil | Vad den är |
|---|---|
| `playtown.json` | Manifestet: spelets id, namn, språk, styrning och vad det behöver |
| `src/main.ts` | Allt som pratar med PlayTown |
| `src/game.ts` | Spelets regler, utan PlayTown |
| `src/texts.ts` | Alla texter, per språk |
| `public/cover.png` | Omslagsbilden i katalogen |
| `CHANGELOG.md` | Nyheter i varje version |
| `.github/workflows/release.yml` | Bygger spelet och lägger exporten på en GitHub Release när du taggar |
| `vendor/` | PlayTowns SDK och CLI, tills de finns på npm |

## Skicka in till PlayTown

1. Be PlayTown lägga upp ditt spel. Du får ett spel-id, till exempel `star-hunt`. Skriv det som `gameId` i `playtown.json`.
2. Installera PlayTowns GitHub-app på repot och koppla repot i PlayTown Studio.
3. Skriv vad som är nytt i `CHANGELOG.md` under en rubrik med versionens namn, till exempel `## v0.1.0`. Committa, pusha och tagga versionen:

   ```bash
   git commit -am "Version 0.1.0"
   git push
   git tag v0.1.0
   git push origin v0.1.0
   ```

4. Vänta tills arbetsflödet *Release* är klart i GitHub. Importera sedan taggen `v0.1.0` i Studio.
5. Prova spelet i preview och skicka det till granskning.
