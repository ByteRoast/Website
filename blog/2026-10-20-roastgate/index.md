---
slug: roastgate-0.2.0
title: Roastgate 0.2.0
authors: [sikelio]
tags: [release, roastgate, nginx, docker, dotnet, self_hosted]
---

**Roastgate 0.2.0** is out: you can now choose what visitors outside your whitelists get, instead of nginx's default 403.

<!-- truncate -->

## Choose how refused visitors are answered

Until now, a proxy or a site restricted by a whitelist answered everyone else with nginx's own **403 Forbidden**. It works, but it also tells the world that something lives behind that domain.

The **Access** tab of the wizard now has a **Visitors outside the whitelists** setting, for reverse proxies and hosted sites alike:

| Choice | Answer | When to use it |
|---|---|---|
| **Forbidden** (default) | `403` | nginx's usual behaviour, nothing changes for existing configs |
| **Not found** | `404` | hides that the site exists |
| **Close the connection** | `444` | nginx drops the connection without sending anything |
| **Redirect** | `302` to an address of your choice | send visitors to your main website, for example |

As always, the preview tab shows exactly what will be written. With a 404, the whitelist part of the config looks like this:

```nginx
include /etc/nginx/whitelists/office.conf;
deny all;

error_page 403 = @rg_denied;

location @rg_denied {
    allow all;
    return 404;
}
```

:::info
The answer replaces **every** 403 of the server, not only the whitelist ones: other refusals, such as blocked dotfiles, get the same answer.
:::

A few safeguards come with it:

- The setting needs **at least one whitelist**: without one, nobody is refused and the wizard tells you so.
- The redirect address is validated before it reaches the file: `http://` or `https://`, a host, an optional port, path and query string, and nothing that could break out of the `return` line.
- The Let's Encrypt challenge stays reachable for everyone, so certificate renewals keep working whatever you choose.

### Reopening and importing

The setting is read back from the file: reopening a config in the wizard, or [importing a hand-written one](/blog/roastgate-0.1.0#importing-hand-written-configs), restores the choice and the redirect address. If the `error_page 403 = @rg_denied;` line or its `location @rg_denied` block was edited by hand into something the wizard cannot reproduce, the import is refused with the line number and the reason, and the file stays editable as raw text.

## For contributors

The project also got what it needed to welcome contributions:

- A [Contributing Guide](https://github.com/ByteRoast/Roastgate/blob/main/CONTRIBUTING.md) covering the code style, tests, commits and the contributor license agreement.
- A [security policy](https://github.com/ByteRoast/Roastgate/blob/main/SECURITY.md) to report vulnerabilities privately.
- Issue forms and a pull request template.

The image on `ghcr.io/byteroast/roastgate` is now public: no `docker login` is needed to pull it anymore.

## How can I get Roastgate 0.2.0?

### Update

From the folder that holds `docker-compose.yml`:

```bash
docker compose pull
docker compose up -d
```

The compose file only lost two comments in this release: there is no need to download it again.

:::warning Alpha
Roastgate is still in its `0.x` alpha releases. Back up the `roastgate-data` volume before updating:

```bash
docker run --rm -v roastgate-data:/data -v "$PWD":/backup alpine tar czf /backup/roastgate-data.tgz -C /data .
```
:::

To stay on this version, use the `0.2.0` tag instead of `latest` in `docker-compose.yml`.

### New installation

Follow the [installation guide](/docs/roastgate/installation), or the [Introducing Roastgate 0.1.0](/blog/roastgate-0.1.0#how-can-i-get-roastgate) post: the steps are the same.

---

- [Roastgate on GitHub](https://github.com/ByteRoast/Roastgate)
- [Release 0.2.0](https://github.com/ByteRoast/Roastgate/releases/tag/v0.2.0)
- [Report issues](https://github.com/ByteRoast/Roastgate/issues)
