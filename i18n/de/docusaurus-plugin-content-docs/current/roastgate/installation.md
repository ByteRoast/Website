---
sidebar_position: 2
title: Installation
description: Roastgate mit Docker Compose neben dem nginx deines Servers installieren.
---

# Installation

## Voraussetzungen

- Ein Linux-Server mit **auf dem Host installiertem nginx**. Roastgate steuert es, liefert aber selbst keins mit.
- **Docker** mit dem Compose-Plugin und `root` (oder die Gruppe `docker`) auf diesem Server.
- Optional: `certbot` auf dem Host. Ohne ihn verwendet Roastgate den in seinem Image enthaltenen.

## Installieren {/* #install */}

Du brauchst nur die Compose-Datei, nicht das ganze Repository. In einem Ordner deiner Wahl:

```bash
mkdir roastgate && cd roastgate
curl -fsSL -o docker-compose.yml https://raw.githubusercontent.com/ByteRoast/Roastgate/refs/heads/main/docker-compose.yml
docker compose up -d
docker logs roastgate        # gibt das Setup-Token aus
```

Oder mit PowerShell (`pwsh`):

```powershell
New-Item -ItemType Directory roastgate | Set-Location
Invoke-WebRequest -Uri https://raw.githubusercontent.com/ByteRoast/Roastgate/refs/heads/main/docker-compose.yml -OutFile docker-compose.yml
docker compose up -d
docker logs roastgate        # gibt das Setup-Token aus
```

Bewahre das in den Logs ausgegebene **Setup-Token** auf: Du brauchst es für den [ersten Start](./first-start.md). Bei jedem Start des Containers wird ein neues erzeugt, bis die Einrichtung abgeschlossen ist.

## Was die Compose-Datei macht

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

- **`privileged: true` und `pid: host`** erlauben Roastgate, `nginx` (und den `certbot` des Hosts) über `nsenter` in den Namespaces des Hosts auszuführen. Befehle werden nie über eine Shell ausgeführt.
- **Der Port ist an `127.0.0.1` gebunden**: Roastgate ist aus dem Internet nicht erreichbar. Lass es so, siehe [Zugriff auf Roastgate](#reaching-roastgate).
- **Die Volumes**:

| Pfad auf dem Host                        | Zweck                                                          |
|------------------------------------------|----------------------------------------------------------------|
| `/etc/nginx`                             | die nginx-Konfiguration, die Roastgate liest und schreibt      |
| `/etc/letsencrypt`                       | Zertifikate (gelesen, und vom eingebetteten certbot geschrieben) |
| `/var/www/certbot`                       | ACME-Webroot für die Let's-Encrypt-Challenge                   |
| `roastgate-data` (benanntes Volume, `/data`) | die SQLite-Datenbank und die Schlüssel, die die Sitzungscookies verschlüsseln |

Wenn dein nginx oder dein Webroot woanders liegen, ändere die **linke Seite** dieser Mounts und gib während der Einrichtung dieselben Pfade an.

Die auskommentierten Umgebungsvariablen der Compose-Datei werden unter [Einstellungen und Konfiguration](./settings-and-configuration.md#environment-variables) beschrieben.

## Image-Tags

Das Image wird unter `ghcr.io/byteroast/roastgate` mit diesen Tags veröffentlicht:

| Tag                       | Folgt                                                                                         |
|---------------------------|-----------------------------------------------------------------------------------------------|
| `latest`                  | dem Branch `main`                                                                             |
| `0.1.0`, `0.1.0-alpha.1`… | einem Release                                                                                 |
| `0.1`, `1.2`…             | dem neuesten stabilen Release dieser Minor-Version (Pre-Releases wie Alphas verschieben ihn nicht) |
| `dev`                     | jedem Push auf den Branch `dev` (instabil)                                                    |

Um bei einer Version zu bleiben, ersetze `latest` in `docker-compose.yml` durch einen Release-Tag.

## Zugriff auf Roastgate {/* #reaching-roastgate */}

Roastgate lauscht auf `127.0.0.1:8181` des Servers. Öffne von deinem eigenen Rechner aus einen SSH-Tunnel:

```bash
ssh -L 8181:127.0.0.1:8181 user@server
```

Öffne dann [http://127.0.0.1:8181](http://127.0.0.1:8181) in deinem Browser.

:::danger[Halte es privat]
Roastgate steuert deinen Webserver: Wer Roastgate kontrolliert, ist in der Praxis root auf dem Host. Veröffentliche Port `8181` niemals auf einer öffentlichen Adresse. Um ohne Tunnel darauf zuzugreifen, nutze ein VPN oder [stelle es hinter nginx](./account-security.md#reach-roastgate-through-nginx), mit HTTPS und einer Whitelist.
:::

## Aus dem Quellcode bauen

Um das Image selbst zu bauen, klone das Repository und baue es dort:

```bash
git clone https://github.com/ByteRoast/Roastgate.git
cd Roastgate
docker compose up -d --build
```

## Entwicklungs-Image

Du willst die neuesten Änderungen zuerst? `docker-compose.dev.yml` ist dieselbe Compose-Datei, festgelegt auf das `dev`-Image. Lade sie **als `docker-compose.yml`** herunter, alle anderen Befehle bleiben gleich:

```bash
curl -fsSL -o docker-compose.yml https://raw.githubusercontent.com/ByteRoast/Roastgate/refs/heads/dev/docker-compose.dev.yml
docker compose pull
docker compose up -d
```

:::warning[Instabil]
Das `dev`-Image bekommt Änderungen zuerst und kann kaputtgehen. Beide Dateien nutzen denselben Container und dasselbe `roastgate-data`-Volume, ein Wechsel behält also dein Konto. Der Weg zurück von `dev` zu `latest` funktioniert nicht garantiert: `dev` hat die Datenbank womöglich bereits auf ein Schema aktualisiert, das `latest` nicht kennt. **[Sichere das Volume](./maintenance.md#back-up-the-data), bevor du `dev` ausprobierst.**
:::

## Nächster Schritt

Öffne Roastgate und führe die [Ersteinrichtung](./first-start.md) durch.
