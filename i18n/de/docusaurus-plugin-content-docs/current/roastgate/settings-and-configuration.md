---
sidebar_position: 9
title: Einstellungen und Konfiguration
description: Die Seite Settings und die Umgebungsvariablen des Containers.
---

# Einstellungen und Konfiguration

## Die Seite Settings

![Die Einstellungsseite](@site/docs/roastgate/img/settings.png)

### Pfade und Optionen

Die während der [Einrichtung](./first-start.md#3-paths-and-options) gewählten Pfade und Optionen: nginx-Verzeichnis, Whitelist-Verzeichnis, ACME-Webroot, Let's-Encrypt-Verzeichnis, Modus der Zertifikatsverwaltung und Let's-Encrypt-E-Mail.

Das sind die Pfade, **die Roastgate sieht**: Sie müssen in seinen Container eingehängt werden, an derselben Stelle wie auf dem Host, damit die in deinen Konfigurationen geschriebenen Pfade für nginx dasselbe bedeuten.

- **Check the host with these values** führt die [Host-Diagnose](./first-start.md#4-host-diagnostics) mit deinen Eingaben aus, bevor du speicherst.
- **Save settings** prüft die Werte auf dieselbe Weise wie die Einrichtung.

### Passwort ändern

Erfordert das aktuelle Passwort. Alle offenen Sitzungen auf allen Geräten werden beendet: Du meldest dich mit dem neuen Passwort erneut an.

### Zwei-Faktor-Authentifizierung und Passkeys

Siehe [Konto und Sicherheit](./account-security.md).

### Über diese Instanz

Zeigt das Konto, mit dem du angemeldet bist, die Roastgate-Version, wie Host-Befehle ausgeführt werden, das Datenverzeichnis und ob Forwarded-Header und sichere Cookies aktiv sind.

## Umgebungsvariablen {/* #environment-variables */}

Lege sie im Abschnitt `environment` von `docker-compose.yml` fest und führe dann `docker compose up -d` aus. Alle sind optional.

| Variable                            | Standard             | Zweck                                                                                        |
|-------------------------------------|----------------------|----------------------------------------------------------------------------------------------|
| `ROASTGATE_SETUP_TOKEN`             | bei jedem Start zufällig | festes Setup-Token, 16 Zeichen oder mehr                                                 |
| `ROASTGATE_SECURE_COOKIES`          | `false`              | markiert das Sitzungscookie als `Secure`: aktiviere es, wenn du Roastgate über HTTPS erreichst |
| `ROASTGATE_TRUST_FORWARDED_HEADERS` | `false`              | liest die Client-Adresse aus `X-Forwarded-For` / `-Proto`: nur hinter deinem eigenen Reverse Proxy |
| `ROASTGATE_DATA_DIR`                | `/data`              | wo `roastgate.db` liegt (hänge dort ein Volume ein)                                          |
| `ROASTGATE_HOST_EXEC`               | `nsenter`            | `nsenter` führt Befehle in den Namespaces des Hosts aus, `direct` im Container (Entwicklung) |
| `TZ`                                | `Europe/Paris` in der Compose-Datei | Zeitzone der in der Oberfläche angezeigten Daten                              |

Unter [Zugriff auf Roastgate über nginx](./account-security.md#reach-roastgate-through-nginx) erfährst du, wann die Cookie- und Header-Optionen aktiviert werden sollten.
