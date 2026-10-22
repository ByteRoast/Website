---
sidebar_position: 2
title: Installation
description: Installer Roastgate avec Docker Compose à côté du nginx de votre serveur.
---

# Installation

## Prérequis

- Un serveur Linux avec **nginx installé sur l'hôte**. Roastgate le pilote, elle n'en fournit pas.
- **Docker** avec le plugin Compose, et un accès `root` (ou au groupe `docker`) sur ce serveur.
- Optionnel : `certbot` sur l'hôte. Sans lui, Roastgate utilise celui intégré à son image.

## Installer {/* #install */}

Vous n'avez besoin que du fichier compose, pas du dépôt entier. Dans le dossier de votre choix :

```bash
mkdir roastgate && cd roastgate
curl -fsSL -o docker-compose.yml https://raw.githubusercontent.com/ByteRoast/Roastgate/refs/heads/main/docker-compose.yml
docker compose up -d
docker logs roastgate        # affiche le jeton d'installation
```

Ou avec PowerShell (`pwsh`) :

```powershell
New-Item -ItemType Directory roastgate | Set-Location
Invoke-WebRequest -Uri https://raw.githubusercontent.com/ByteRoast/Roastgate/refs/heads/main/docker-compose.yml -OutFile docker-compose.yml
docker compose up -d
docker logs roastgate        # affiche le jeton d'installation
```

Conservez le **jeton d'installation** affiché dans les logs : vous en aurez besoin au [premier démarrage](./first-start.md). Un nouveau jeton est généré à chaque démarrage du conteneur tant que l'installation n'est pas terminée.

## Ce que fait le fichier compose

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

- **`privileged: true` et `pid: host`** permettent à Roastgate d'exécuter `nginx` (et le `certbot` de l'hôte) dans les namespaces de l'hôte, via `nsenter`. Les commandes ne passent jamais par un shell.
- **Le port est lié à `127.0.0.1`** : Roastgate n'est pas joignable depuis Internet. Gardez-le ainsi, voir [Accéder à Roastgate](#reaching-roastgate).
- **Les volumes** :

| Chemin sur l'hôte                        | Rôle                                                           |
|------------------------------------------|----------------------------------------------------------------|
| `/etc/nginx`                             | la configuration nginx que Roastgate lit et écrit              |
| `/etc/letsencrypt`                       | les certificats (lus, et écrits par le certbot intégré)        |
| `/var/www/certbot`                       | le webroot ACME utilisé par le challenge Let's Encrypt         |
| `roastgate-data` (volume nommé, `/data`) | la base SQLite et les clés qui chiffrent les cookies de session |

Si votre nginx ou votre webroot se trouvent ailleurs, modifiez la **partie gauche** de ces montages et saisissez les mêmes chemins pendant l'installation.

Les variables d'environnement commentées du fichier compose sont décrites dans [Réglages et configuration](./settings-and-configuration.md#environment-variables).

## Tags de l'image

L'image est publiée sur `ghcr.io/byteroast/roastgate` avec ces tags :

| Tag                       | Suit                                                                                          |
|---------------------------|-----------------------------------------------------------------------------------------------|
| `latest`                  | la branche `main`                                                                             |
| `0.1.0`, `0.1.0-alpha.1`… | une release                                                                                   |
| `0.1`, `1.2`…             | la dernière release stable de cette version mineure (les pré-releases comme les alphas ne le déplacent pas) |
| `dev`                     | chaque push sur la branche `dev` (instable)                                                   |

Pour rester sur une version, remplacez `latest` par un tag de release dans `docker-compose.yml`.

## Accéder à Roastgate {/* #reaching-roastgate */}

Roastgate écoute sur `127.0.0.1:8181` du serveur. Depuis votre propre machine, ouvrez un tunnel SSH :

```bash
ssh -L 8181:127.0.0.1:8181 user@server
```

Puis ouvrez [http://127.0.0.1:8181](http://127.0.0.1:8181) dans votre navigateur.

:::danger[Gardez-la privée]
Roastgate contrôle votre serveur web : quiconque contrôle Roastgate est, en pratique, root sur l'hôte. Ne publiez jamais le port `8181` sur une adresse publique. Pour y accéder sans tunnel, utilisez un VPN, ou [placez-la derrière nginx](./account-security.md#reach-roastgate-through-nginx) avec HTTPS et une liste blanche.
:::

## Compiler depuis les sources

Pour construire l'image vous-même, clonez le dépôt et construisez-la depuis celui-ci :

```bash
git clone https://github.com/ByteRoast/Roastgate.git
cd Roastgate
docker compose up -d --build
```

## Image de développement

Vous voulez les dernières nouveautés en avant-première ? `docker-compose.dev.yml` est le même fichier compose, épinglé sur l'image `dev`. Téléchargez-le **sous le nom `docker-compose.yml`** et toutes les autres commandes restent identiques :

```bash
curl -fsSL -o docker-compose.yml https://raw.githubusercontent.com/ByteRoast/Roastgate/refs/heads/dev/docker-compose.dev.yml
docker compose pull
docker compose up -d
```

:::warning[Instable]
L'image `dev` reçoit les changements en premier et peut casser. Les deux fichiers utilisent le même conteneur et le même volume `roastgate-data`, donc changer de l'un à l'autre conserve votre compte. Revenir de `dev` à `latest` n'est pas garanti : `dev` a peut-être déjà migré la base de données vers un schéma que `latest` ne connaît pas. **[Sauvegardez le volume](./maintenance.md#back-up-the-data) avant d'essayer `dev`.**
:::

## Étape suivante

Ouvrez Roastgate et lancez la [première configuration](./first-start.md).
