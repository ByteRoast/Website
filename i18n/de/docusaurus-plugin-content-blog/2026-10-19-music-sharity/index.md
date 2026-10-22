---
slug: music-sharity-discontinued
title: Music Sharity wird eingestellt
authors: [sikelio]
tags: [music_sharity, discontinued]
---

**Music Sharity** wird offiziell eingestellt. Das Repository ist jetzt archiviert und das Projekt wird nicht mehr gepflegt.

{/* truncate */}

## Warum?

Vom ersten Tag an war [Music Sharity](https://github.com/ByteRoast/music-sharity) vollständig von der [Odesli-API](https://odesli.co) (auch bekannt als song.link) abhängig, um Links zwischen Streamingplattformen umzuwandeln. Odesli hat die ganze Schwerarbeit erledigt: Titel und Alben zwischen den Diensten zuordnen und die passenden Links zurückgeben.

Diese API wurde abgeschaltet. Ohne sie kann Music Sharity schlicht nichts mehr umwandeln.

:::danger
Da die Umwandlung vollständig von Odesli abhing, können die bestehenden Versionen von Music Sharity (Android, Windows, Linux und Web) keine Links mehr umwandeln.
:::

## Warum nicht neu bauen?

Der einzige realistische Weg, Odesli zu ersetzen, wäre, die Umwandlung auf Web-Scraping jeder einzelnen Streamingplattform aufzubauen. Das ist fragil, schwer zu warten und nichts, was ich für dieses Projekt verfolgen möchte.

Anstatt eine kaputte App am Leben zu halten, habe ich mich daher entschieden, die Entwicklung einzustellen und das Repository zu archivieren.

## Auf der Suche nach einer Alternative?

Wenn du Musik zwischen Streamingplattformen teilen möchtest, schau dir **[SongPort](https://songport.link)** an. Es kann alles, was Music Sharity konnte, und das noch viel besser.

## Was passiert mit dem Code?

Der Code bleibt als Referenz auf [GitHub](https://github.com/ByteRoast/music-sharity) verfügbar, unter der **GPL v3**-Lizenz. Du kannst ihn gerne durchstöbern, forken oder daraus lernen.

Einige Arbeiten nach dem [Release 1.1.1](/blog/music-sharity-1.1.1) haben es nie in einen offiziellen Build geschafft, etwa die Seite mit dem Umwandlungsverlauf und einer unteren Navigationsleiste. Wenn du neugierig bist, findest du alles im Repository.

## Danke

Danke an alle, die Music Sharity ausprobiert, Probleme gemeldet oder Feedback gegeben haben. Es hat Spaß gemacht, dieses Projekt zu bauen, und ich habe dabei viel gelernt.

---

- [Music Sharity auf GitHub](https://github.com/ByteRoast/music-sharity) (archiviert)
- [SongPort](https://songport.link)
