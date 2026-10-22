---
slug: music-sharity-discontinued
title: Music Sharity est abandonné
authors: [sikelio]
tags: [music_sharity, discontinued]
---

**Music Sharity** est officiellement abandonné. Le dépôt est désormais archivé et le projet n'est plus maintenu.

{/* truncate */}

## Pourquoi ?

Dès le premier jour, [Music Sharity](https://github.com/ByteRoast/music-sharity) reposait entièrement sur l'[API Odesli](https://odesli.co) (aussi connue sous le nom de song.link) pour convertir les liens entre plateformes de streaming. Odesli faisait tout le gros du travail : faire correspondre les titres et les albums entre les services et renvoyer les liens correspondants.

Cette API a été fermée. Sans elle, Music Sharity ne peut tout simplement plus rien convertir.

:::danger
Comme la conversion dépendait entièrement d'Odesli, les versions existantes de Music Sharity (Android, Windows, Linux et Web) ne sont plus capables de convertir des liens.
:::

## Pourquoi ne pas le reconstruire ?

La seule façon réaliste de remplacer Odesli serait de reconstruire le moteur de conversion en faisant du web scraping sur chaque plateforme de streaming. C'est fragile, difficile à maintenir, et ce n'est pas une voie que je souhaite suivre pour ce projet.

Plutôt que de maintenir en vie une application cassée, j'ai donc décidé d'arrêter le développement et d'archiver le dépôt.

## Vous cherchez une alternative ?

Si vous avez besoin de partager de la musique entre plateformes de streaming, essayez **[SongPort](https://songport.link)**. Il fait tout ce que faisait Music Sharity, et bien mieux.

## Que devient le code ?

Le code reste disponible sur [GitHub](https://github.com/ByteRoast/music-sharity) à titre de référence, sous licence **GPL v3**. N'hésitez pas à le parcourir, le forker ou vous en inspirer.

Une partie du travail réalisé après la [version 1.1.1](/blog/music-sharity-1.1.1) n'a jamais été publiée dans une build officielle, comme la page d'historique des conversions avec une barre de navigation en bas. Tout est dans le dépôt si vous êtes curieux.

## Merci

Merci à toutes celles et ceux qui ont essayé Music Sharity, signalé des problèmes ou partagé leurs retours. C'était un projet amusant à construire, et j'ai beaucoup appris en chemin.

---

- [Music Sharity sur GitHub](https://github.com/ByteRoast/music-sharity) (archivé)
- [SongPort](https://songport.link)
