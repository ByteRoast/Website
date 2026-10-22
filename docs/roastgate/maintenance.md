---
sidebar_position: 10
title: Maintenance and troubleshooting
description: Update, back up, recover access, uninstall, and fix common problems.
---

# Maintenance and troubleshooting

All the commands below run on the server, from the folder that holds `docker-compose.yml`.

## Update

```bash
docker compose pull
docker compose up -d
```

Download the compose file again (see [Install](./installation.md#install)) only when the release notes say it changed. It overwrites your copy, so redo your own edits afterwards (ports, mounts, environment variables…).

If you built from source: `git pull`, then `docker compose up -d --build`.

:::warning[Alpha]
Back up the data volume before each update: the database schema can change between `0.x` versions.
:::

## Back up the data

The database lives in the `roastgate-data` volume: your account, settings, file backups and audit log survive updates and `docker compose down`. Only `docker compose down --volumes` (or `docker volume rm roastgate-data`) deletes it.

To back it up into `roastgate-data.tgz` in the current folder:

```bash
docker run --rm -v roastgate-data:/data -v "$PWD":/backup alpine tar czf /backup/roastgate-data.tgz -C /data .
```

To restore it (the container must be stopped):

```bash
docker compose stop
docker run --rm -v roastgate-data:/data -v "$PWD":/backup alpine sh -c "rm -rf /data/* && tar xzf /backup/roastgate-data.tgz -C /data"
docker compose up -d
```

Your nginx files are not in this volume: back up `/etc/nginx` and `/etc/letsencrypt` as usual.

## Forgot the password?

```bash
docker exec -it roastgate roastgate reset-password
```

It asks for a new password and ends every open session.

## Locked out of two-factor

Lost your authenticator app, the recovery codes and the passkeys:

```bash
docker exec roastgate roastgate disable-2fa
```

It turns two-factor off, removes every passkey and ends every session, so the password alone signs you in again. Set up two-factor again afterwards.

## Uninstall

```bash
docker compose down            # keeps the data volume
docker compose down --volumes  # also deletes the account, settings and backup history
```

Then delete the folder that holds `docker-compose.yml`, and the image:

```bash
docker image rm ghcr.io/byteroast/roastgate:latest   # or the tag you used
```

Your nginx files stay where they are: Roastgate never moves them.

## Troubleshooting

### Where is the setup token?

```bash
docker logs roastgate
```

A new token is generated at each start until the setup is done. To choose it, set `ROASTGATE_SETUP_TOKEN` (16 characters or more).

### "nginx is not reachable from Roastgate"

- The container needs `privileged: true` and `pid: host`: check the **host access** line of the diagnostics (**Settings → Check the host with these values**).
- nginx must be installed **on the host**, not in another container.

### "The directory … does not exist or is not visible to Roastgate"

The path in the settings is not mounted into the container. Add the mount to `docker-compose.yml` (same path on both sides), or fix the path in the settings.

### My change was rolled back

`nginx -t` refused it: the error shown above the editor is nginx's own. If the error is about another file, `nginx -t` was already failing before your change: fix that file first (**Dashboard → Test configuration** shows the error).

### The certificate cannot be issued

Run a **dry run** first. Most failures come from:

- the domain not pointing to this server;
- nginx not answering on port 80 for the domain;
- the server block not serving the ACME webroot: tick **Let the Let's Encrypt validation through** in the wizard;
- a whitelist or a `return` blocking `/.well-known/acme-challenge/` in a hand-written config.

### The page stops responding

The interface keeps a live connection with the server (WebSockets). Behind a proxy, make sure WebSockets are forwarded (**Support WebSockets** in the wizard), then reload the page.

### My passkey is not offered

A passkey only works on the address it was created on. `http://127.0.0.1:8181` and `https://roastgate.example.com` need a passkey each.

## Getting help

- [Issues on GitHub](https://github.com/ByteRoast/Roastgate/issues/new/choose) for bugs and ideas.
- [Security policy](https://github.com/ByteRoast/Roastgate/blob/main/SECURITY.md) for vulnerabilities.
