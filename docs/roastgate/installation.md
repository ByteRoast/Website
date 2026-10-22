---
sidebar_position: 2
title: Installation
description: Install Roastgate with Docker Compose next to the nginx of your server.
---

# Installation

## Requirements

- A Linux server with **nginx installed on the host**. Roastgate drives it, it does not ship one.
- **Docker** with the Compose plugin, and `root` (or the `docker` group) on that server.
- Optional: `certbot` on the host. Without it, Roastgate uses the one embedded in its image.

## Install

You only need the compose file, not the whole repository. In a folder of your choice:

```bash
mkdir roastgate && cd roastgate
curl -fsSL -o docker-compose.yml https://raw.githubusercontent.com/ByteRoast/Roastgate/refs/heads/main/docker-compose.yml
docker compose up -d
docker logs roastgate        # prints the setup token
```

Or with PowerShell (`pwsh`):

```powershell
New-Item -ItemType Directory roastgate | Set-Location
Invoke-WebRequest -Uri https://raw.githubusercontent.com/ByteRoast/Roastgate/refs/heads/main/docker-compose.yml -OutFile docker-compose.yml
docker compose up -d
docker logs roastgate        # prints the setup token
```

Keep the **setup token** printed in the logs: you need it for the [first start](./first-start.md). A new one is generated at each start of the container until the setup is done.

## What the compose file does

```yaml title="docker-compose.yml"
name: roastgate

services:
  roastgate:
    image: ghcr.io/byteroast/roastgate:latest
    container_name: roastgate
    restart: unless-stopped
    privileged: true
    pid: host
    ports:
      - "127.0.0.1:8181:8181"
    environment:
      TZ: Europe/Paris
    volumes:
      - /etc/nginx:/etc/nginx
      - /etc/letsencrypt:/etc/letsencrypt
      - /var/www/certbot:/var/www/certbot
      - roastgate-data:/data

volumes:
  roastgate-data:
    name: roastgate-data
```

- **`privileged: true` and `pid: host`** let Roastgate run `nginx` (and the host's `certbot`) in the host namespaces, through `nsenter`. Commands are never run through a shell.
- **The port is bound to `127.0.0.1`**: Roastgate is not reachable from the internet. Keep it that way, see [Reaching Roastgate](#reaching-roastgate).
- **The volumes**:

| Host path                                | Purpose                                                        |
|------------------------------------------|----------------------------------------------------------------|
| `/etc/nginx`                             | the nginx configuration Roastgate reads and writes             |
| `/etc/letsencrypt`                       | certificates (read, and written by the embedded certbot)       |
| `/var/www/certbot`                       | ACME webroot used by the Let's Encrypt challenge               |
| `roastgate-data` (named volume, `/data`) | the SQLite database and the keys that encrypt session cookies  |

If your nginx or webroot live elsewhere, change the **left side** of these mounts and enter the same paths during the setup.

The commented environment variables of the compose file are described in [Settings and configuration](./settings-and-configuration.md#environment-variables).

## Image tags

The image is published on `ghcr.io/byteroast/roastgate` with these tags:

| Tag                       | Follows                                                                                       |
|---------------------------|-----------------------------------------------------------------------------------------------|
| `latest`                  | the `main` branch                                                                             |
| `0.1.0`, `0.1.0-alpha.1`… | a release                                                                                     |
| `0.1`, `1.2`…             | the latest stable release of that minor version (pre-releases such as alphas don't move it)   |
| `dev`                     | every push to the `dev` branch (unstable)                                                     |

To stay on one version, replace `latest` with a release tag in `docker-compose.yml`.

## Reaching Roastgate

Roastgate listens on `127.0.0.1:8181` of the server. From your own machine, open an SSH tunnel:

```bash
ssh -L 8181:127.0.0.1:8181 user@server
```

Then open [http://127.0.0.1:8181](http://127.0.0.1:8181) in your browser.

:::danger[Keep it private]
Roastgate controls your web server: whoever controls Roastgate is, in practice, root on the host. Never publish port `8181` on a public address. To reach it without a tunnel, use a VPN, or [put it behind nginx](./account-security.md#reach-roastgate-through-nginx) with HTTPS and a whitelist.
:::

## Build from source

To build the image yourself, clone the repository and build it there:

```bash
git clone https://github.com/ByteRoast/Roastgate.git
cd Roastgate
docker compose up -d --build
```

## Development image

Want the latest changes first? `docker-compose.dev.yml` is the same compose file, pinned on the `dev` image. Download it **as `docker-compose.yml`** and every other command stays the same:

```bash
curl -fsSL -o docker-compose.yml https://raw.githubusercontent.com/ByteRoast/Roastgate/refs/heads/dev/docker-compose.dev.yml
docker compose pull
docker compose up -d
```

:::warning[Unstable]
The `dev` image gets the changes first and can break. Both files use the same container and the same `roastgate-data` volume, so switching keeps your account. Going back from `dev` to `latest` is not guaranteed to work: `dev` may already have upgraded the database to a schema that `latest` does not know. **[Back up the volume](./maintenance.md#back-up-the-data) before you try `dev`.**
:::

## Next step

Open Roastgate and run the [first setup](./first-start.md).
