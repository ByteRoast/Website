---
slug: music-sharity-1.0.0
title: Introducing Music Sharity 1.0.0
authors: [sikelio]
tags: [release, music_sharity, android, windows, linux, flutter, pwa]
---

I'm excited to announce the first release of **Music Sharity** - a cross-platform app that converts music links between different streaming services instantly!

{/* truncate */}

## What is Music Sharity?

[Music Sharity](https://github.com/ByteRoast/music-sharity) is a free and open-source app that lets you share music across different streaming platforms effortlessly. No more copy-pasting song titles or manually searching on different services!

## Why does this exist?

Picture this: You discover an amazing song on Spotify and want to share it with a friend. But they use Apple Music. Your options?

1. Send them just the title and artist (boring)
2. Open Apple Music, search manually, copy the link (exhausting)
3. **Use Music Sharity** – instant conversion!

## What can you share?

Currently, Music Sharity supports:
- **Tracks** (individual songs)
- **Albums** (including EPs and singles)

:::info
Playlists are not supported as they're platform-specific and don't convert well across services.
:::

## Supported Streaming Platforms

Music Sharity currently works with the **top 5 streaming platforms**:

| Platform | Market Share |
|----------|--------------|
| **Spotify** | 31% |
| **Apple Music** | 15% |
| **YouTube Music** | 8% |
| **Deezer** | 2% |
| **Tidal** | 1% |

For this first version, I focused on the most popular platforms. More platforms could be added in the future, depending on API availability and community interest!

## How can I get Music Sharity?

Music Sharity is available on multiple platforms:

### Web (PWA)
Try it instantly in your browser at **[music-sharity.byteroast.fr](https://music-sharity.byteroast.fr)**

You can also install it as a Progressive Web App (PWA) on Android:
1. Open the website in Chrome
2. Tap "Install" or "Add to Home Screen"
3. Music Sharity will appear in your share menu!

### Android
- **Google Play Store**: [Download on Google Play](https://play.google.com/store/apps/details?id=fr.byteroast.music_sharity)
- **Direct APK**: Download from the [GitHub Releases page](https://github.com/ByteRoast/music-sharity/releases)

### Windows
- **Installer**: Download from the [GitHub Releases page](https://github.com/ByteRoast/music-sharity/releases)

### Linux
- **DEB package**: For Debian/Ubuntu-based distributions
- **RPM package**: For Fedora/RHEL-based distributions

Download both from the [GitHub Releases page](https://github.com/ByteRoast/music-sharity/releases).

:::warning Platform Availability
iOS and macOS builds are functional but not officially maintained due to hardware limitations. Community contributions are welcome!
:::

## How does it work?

Music Sharity uses the [Odesli API](https://odesli.co) (also known as song.link) to convert links between platforms. Odesli maintains a database of music across all major streaming services and can match tracks using various identifiers like ISRC codes.

**The conversion process:**

1. Send the source link to Odesli API
2. Retrieve all available platform links
3. Display the converted link for your chosen platform

```mermaid
flowchart LR
    PLATFORM[Music streaming platform] -->|Share link| APP(Music Sharity)
    APP --> API[Odesli API]
    API --> MENU[Select destination platform]
    MENU --> FOUND{Found?}
    FOUND -->|Yes| DIALOG[Share converted link]
    FOUND -->|No| ERR[Content not available]
```

### Technical Details

Music Sharity is built with privacy and transparency as core principles:

**Native Apps (Android, Windows, Linux)**
- Direct API calls to Odesli
- Zero intermediaries
- No data collection

**Web App (PWA)**
- Privacy-first CORS proxy via [Cloudflare Workers](https://workers.cloudflare.com)
- Zero logging, zero tracking
- Stateless edge computing
- [Open source proxy code](https://github.com/ByteRoast/music-sharity-proxy)

**Common Features**
- No API keys required
- No user data collection
- No tracking or analytics
- Fully open source (GPL v3)

:::info Why a proxy for web?
Web browsers enforce CORS (Cross-Origin Resource Sharing) policies that prevent direct API calls to external services. The Cloudflare Worker proxy exists solely to bypass this browser limitation while maintaining our zero-logging privacy commitment.
:::

## Features

- Convert between 5 platforms (Spotify, Apple Music, YouTube Music, Deezer, Tidal)
- Support for tracks and albums
- Fast conversion powered by Odesli
- Native Android sharing (appears in the share menu)
- Progressive Web App support
- Modern dark theme with Material Design 3
- Privacy-focused (no tracking, no analytics, no data collection)
- Cross-platform (Web, Android, Windows, Linux)

## Why "Music Sharity"?

The name is a blend of:
- **Music** (obvious!)
- **Share** + **Charity** = **Sharity**

The idea is to *share* music across platforms in the spirit of generosity and openness.

## Screenshots

<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px'}}>
  <img src={require('./home-page.png').default} alt="Home page" style={{width: '32%'}} />
  <img src={require('./conversion-page.png').default} alt="Conversion page" style={{width: '32%'}} />
  <img src={require('./conversion-success.png').default} alt="Conversion success" style={{width: '32%'}} />
</div>

## What's Next?

Here's what's planned for future releases:

- Additional streaming platforms
- Conversion history
- Album artwork display
- Internationalization (French, German)
- iOS support (need Mac contributors)

## Privacy Commitment

Music Sharity is built with privacy as a core principle:

- **No user accounts** - Just open and use
- **No tracking** - Zero analytics or telemetry
- **No data storage** - Everything happens in real-time
- **Open source** - Audit the code yourself
- **Transparent infrastructure** - Even our web proxy is [open source](https://github.com/ByteRoast/music-sharity-proxy)

Read our complete [Privacy Policy](https://music-sharity.byteroast.fr/privacy.html) for details.

## Contributing

Music Sharity is **open source** (GPL v3). Contributions are welcome, especially for:

- iOS/macOS support (need Mac owners)
- Web optimizations
- New platform integrations
- Bug fixes and documentation

Check out the [Contributing Guide](https://github.com/ByteRoast/music-sharity/blob/main/CONTRIBUTING.md) to get started!

## Continuous Integration

Every push is automatically tested across all platforms:

[![CI Build Tests](https://github.com/ByteRoast/music-sharity/actions/workflows/build_tests.yml/badge.svg)](https://github.com/ByteRoast/music-sharity/actions/workflows/build_tests.yml)

Our CI pipeline ensures:
- Android APK builds successfully
- Web app compiles correctly
- Windows executable builds without errors
- Linux packages (DEB/RPM) build correctly
- Code passes static analysis

---

**Try Music Sharity today and make music sharing effortless!**

- [Try the Web App](https://music-sharity.byteroast.fr)
- [Download on GitHub](https://github.com/ByteRoast/music-sharity/releases)
- [Star the project](https://github.com/ByteRoast/music-sharity)
- [Report issues](https://github.com/ByteRoast/music-sharity/issues)
