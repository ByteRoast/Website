---
slug: music-sharity-1.1.0
title: Music Sharity 1.1.0
authors: [sikelio]
tags: [release, music_sharity, android, windows, linux, flutter, pwa]
---

Nouvelle mise à jour de **Music Sharity** : prise en charge de SoundCloud, écrans de démarrage, meilleure reconnaissance des liens Tidal et copie dans le presse-papiers sur Desktop/Web

{/* truncate */}

## Quoi de neuf ?


### Prise en charge de SoundCloud

[Music Sharity](https://github.com/ByteRoast/music-sharity) prend désormais en charge SoundCloud !

:::warning
Comme SoundCloud ne contient pas tous les artistes les plus populaires, il est presque certain qu'une conversion depuis une plateforme de streaming grand public vers SoundCloud ne fonctionnera pas.

Vous aurez peut-être plus de chance en convertissant depuis SoundCloud vers les autres plateformes (du moins je l'espère).
:::

### Écrans de démarrage
**Music Sharity** dispose maintenant d'écrans de démarrage. Cette fonctionnalité a d'abord été ajoutée pour l'application web, afin que les utilisateurs ne pensent pas que l'application ne fonctionne pas. Ce n'est pas vraiment une fonctionnalité, mais c'est désormais intégré.

Les écrans de démarrage n'apparaissent que sur Android, iOS (si vous le compilez vous-même) et le Web.

### Meilleure reconnaissance des liens Tidal

J'avais oublié que Tidal propose d'autres formats de liens pour partager de la musique. Ça devrait donc fonctionner correctement (je l'espère).

### Partage amélioré sur Desktop et Web

Sur les versions Desktop et Web, le bouton de partage de la dernière étape a été remplacé par une fonction de **copie dans le presse-papiers**. Partager le lien converti est ainsi plus simple et plus rapide.

## Corrections de bugs et améliorations

- Correction de l'expression régulière (RegEx) Tidal pour une meilleure reconnaissance des liens
- Refactorisation du code pour une meilleure maintenabilité

## Comment obtenir Music Sharity ?

### Android
- **Google Play Store** : [Télécharger sur Google Play](https://play.google.com/store/apps/details?id=fr.byteroast.music_sharity)
- **APK direct** : [Télécharger](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0+5.apk)

### Linux
- **Paquet DEB** : [Télécharger](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0+1-amd64.deb) pour les distributions basées sur Debian/Ubuntu
- **Paquet RPM** : [Télécharger](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0-1.x86_64.rpm) pour les distributions basées sur Fedora/RHEL

### Web (PWA)
Essayez-la directement dans votre navigateur sur **[music-sharity.byteroast.fr](https://music-sharity.byteroast.fr)**

### Windows
- **Installeur** : [Télécharger](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0+1-windows-x64.msi)

Retrouvez la release complète sur la [page de release](https://github.com/ByteRoast/music-sharity/releases/tag/v1.1.0).
