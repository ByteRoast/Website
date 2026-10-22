---
slug: music-sharity-1.1.0
title: Music Sharity 1.1.0
authors: [sikelio]
tags: [release, music_sharity, android, windows, linux, flutter, pwa]
---

Neues Update für **Music Sharity**: SoundCloud-Unterstützung, Splashscreens, bessere Erkennung von Tidal-Links und Kopieren in die Zwischenablage auf Desktop/Web

{/* truncate */}

## Was ist neu?


### SoundCloud-Unterstützung

[Music Sharity](https://github.com/ByteRoast/music-sharity) unterstützt jetzt SoundCloud!

:::warning
Da SoundCloud nicht alle der populärsten Künstler enthält, wird die Umwandlung von einer großen Streamingplattform zu SoundCloud fast sicher nicht funktionieren.

Von SoundCloud zu anderen Plattformen hast du vielleicht mehr Glück (das hoffe ich zumindest).
:::

### Splashscreens
**Music Sharity** hat jetzt Splashscreens. Diese Funktion wurde ursprünglich für die Web-App hinzugefügt, damit Nutzer nicht denken, die App würde nicht funktionieren. Es ist nicht wirklich eine Funktion, aber jetzt ist sie integriert.

Die Splashscreens erscheinen nur unter Android, iOS (wenn du es selbst baust) und im Web.

### Bessere Erkennung von Tidal-Links

Ich hatte übersehen, dass Tidal noch andere Links zum Teilen von Musik verwendet. Jetzt sollte es richtig funktionieren (hoffe ich).

### Verbessertes Teilen auf Desktop und Web

In den Desktop- und Web-Versionen wurde der Teilen-Button im letzten Schritt durch eine Funktion zum **Kopieren in die Zwischenablage** ersetzt. So lässt sich der umgewandelte Link einfacher und schneller teilen.

## Fehlerbehebungen und Verbesserungen

- Regulären Ausdruck (RegEx) für Tidal korrigiert, um Links besser zu erkennen
- Code-Refactoring für bessere Wartbarkeit

## Wie bekomme ich Music Sharity?

### Android
- **Google Play Store**: [Bei Google Play herunterladen](https://play.google.com/store/apps/details?id=fr.byteroast.music_sharity)
- **Direkte APK**: [Herunterladen](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0+5.apk)

### Linux
- **DEB-Paket**: [Herunterladen](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0+1-amd64.deb) für Debian/Ubuntu-basierte Distributionen
- **RPM-Paket**: [Herunterladen](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0-1.x86_64.rpm) für Fedora/RHEL-basierte Distributionen

### Web (PWA)
Probiere es direkt in deinem Browser aus unter **[music-sharity.byteroast.fr](https://music-sharity.byteroast.fr)**

### Windows
- **Installer**: [Herunterladen](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0+1-windows-x64.msi)

Das vollständige Release findest du auf der [Release-Seite](https://github.com/ByteRoast/music-sharity/releases/tag/v1.1.0).
