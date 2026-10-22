# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
pnpm install
```

## Local Development

```bash
pnpm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Working on a translation

The site is available in English (default), French (`fr`) and German (`de`). The development server only serves **one locale at a time**, so switching language with the locale dropdown leads to a "Page not found". To work on a translation, start the server with its locale:

```bash
pnpm run start --locale fr   # or --locale de
```

To try the locale dropdown with all languages, build the site and serve it:

```bash
pnpm run build
pnpm run serve
```

## Translations

Translations live in `i18n/<locale>/` (`i18n/fr/`, `i18n/de/`):

| Path                                          | Content                                            |
|-----------------------------------------------|----------------------------------------------------|
| `docusaurus-plugin-content-blog/`             | blog posts and `tags.yml`                          |
| `docusaurus-plugin-content-docs/current/`     | documentation pages                                |
| `docusaurus-theme-classic/*.json`             | navbar and footer labels                           |
| `docusaurus-plugin-content-*.json`, `code.json` | sidebar, blog and theme labels                   |

- A translated page mirrors the path of the English one (`docs/roastgate/installation.md` → `i18n/fr/docusaurus-plugin-content-docs/current/roastgate/installation.md`). A page without translation falls back to English.
- Keep the same `slug` in the front matter, so `/blog/roastgate-0.1.0` becomes `/fr/blog/roastgate-0.1.0`.
- Do not copy images into `i18n/`: reference the English ones with the `@site/` prefix, for example `![Dashboard](@site/docs/roastgate/img/dashboard.png)` or `require('@site/blog/2026-01-10-music-sharity/home-page.png')`. All locales then share a single copy.
- When a translated heading is the target of a link (`./maintenance.md#back-up-the-data`), keep the English anchor with `## Sauvegarder les données {/* #back-up-the-data */}`. The `{#id}` syntax breaks the build with the `future.v4` flag.
- After adding labels to the config (navbar, footer, sidebar categories), run `pnpm run write-translations --locale fr` (and `--locale de`) to add them to the JSON files.

## Build

```bash
pnpm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true pnpm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> pnpm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
