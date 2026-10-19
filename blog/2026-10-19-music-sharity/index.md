---
slug: music-sharity-discontinued
title: Music Sharity is discontinued
authors: [sikelio]
tags: [music_sharity, discontinued]
---

**Music Sharity** is officially discontinued. The repository is now archived and the project is no longer maintained.

<!-- truncate -->

## Why?

From day one, [Music Sharity](https://github.com/ByteRoast/music-sharity) relied entirely on the [Odesli API](https://odesli.co) (also known as song.link) to convert links between streaming platforms. Odesli did all the heavy lifting: matching tracks and albums across services and returning the corresponding links.

That API has been shut down. Without it, Music Sharity simply cannot convert anything anymore.

:::danger
Since the conversion feature depended entirely on Odesli, existing versions of Music Sharity (Android, Windows, Linux and Web) are no longer able to convert links.
:::

## Why not rebuild it?

The only realistic way to replace Odesli would be to rebuild the conversion engine on top of web scraping of each streaming platform. That's fragile, hard to maintain, and not something I want to pursue for this project.

So rather than keeping a broken app alive, I've decided to stop development and archive the repository.

## Looking for a replacement?

If you need to share music across streaming platforms, check out **[SongPort](https://songport.link)**. It does everything Music Sharity did, and does it much better.

## What happens to the code?

The code remains available on [GitHub](https://github.com/ByteRoast/music-sharity) for reference, under the **GPL v3** license. Feel free to browse it, fork it or learn from it.

Some work done after the [1.1.1 release](/blog/music-sharity-1.1.1) never made it into an official build, like the conversion history page with a bottom navigation bar. It's all in the repository if you're curious.

## Thank you

Thanks to everyone who tried Music Sharity, reported issues, or shared feedback. It was a fun project to build, and I learned a lot along the way.

---

- [Music Sharity on GitHub](https://github.com/ByteRoast/music-sharity) (archived)
- [SongPort](https://songport.link)
