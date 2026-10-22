---
slug: music-sharity-1.1.0
title: Music Sharity 1.1.0
authors: [sikelio]
tags: [release, music_sharity, android, windows, linux, flutter, pwa]
---

New update for **Music Sharity** - SoundCloud support, Splashscreens, Better Tidal link recognition & Copy-to-clipboard on Desktop/Web

{/* truncate */}

## What's new?


### SoundCloud support

[Music Sharity](https://github.com/ByteRoast/music-sharity) now supports SoundCloud!

:::warning
Because SoundCloud does not contain all the most popular artists, it's almost certain that trying to convert from a mainstream streaming platform to SoundCloud will not work.

You may have more luck converting from SoundCloud to other platforms (I hope at least).
:::

### Splashscreens
**Music Sharity** now has splashscreens. This feature was initially added for the web app, so users don't think the app is not working. It's not really a feature but now it's integrated. 

The splashscreens only appear on Android, iOS (if you build it yourself), and Web.

### Better Tidal link recognition

I had overlooked that Tidal has other links to share music. So it should work properly (I hope).

### Improved share flow on Desktop & Web

On Desktop and Web versions, the share button at the final step has been replaced with a **copy-to-clipboard** function. This makes it easier and faster to share the converted link.

## Bug fixes & Improvements

- Fixed Tidal regular expression (RegEx) for better link recognition
- Code refactoring for improved maintainability

## How can I get Music Sharity?

### Android
- **Google Play Store**: [Download on Google Play](https://play.google.com/store/apps/details?id=fr.byteroast.music_sharity)
- **Direct APK**: [Download](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0+5.apk)

### Linux
- **DEB package**: [Download](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0+1-amd64.deb) for Debian/Ubuntu-based distributions
- **RPM package**: [Download](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0-1.x86_64.rpm) for Fedora/RHEL-based distributions

### Web (PWA)
Try it instantly in your browser at **[music-sharity.byteroast.fr](https://music-sharity.byteroast.fr)**

### Windows
- **Installer**: [Download](https://github.com/ByteRoast/music-sharity/releases/download/v1.1.0/music-sharity-1.1.0+1-windows-x64.msi)

See the full release on the [release page](https://github.com/ByteRoast/music-sharity/releases/tag/v1.1.0).
