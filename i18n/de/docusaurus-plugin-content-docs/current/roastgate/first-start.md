---
sidebar_position: 3
title: Erster Start
description: Der Einrichtungsassistent, die Anmeldung und das Dashboard.
---

# Erster Start

## Der Einrichtungsassistent

Der erste Besuch von Roastgate öffnet `/setup`. Die Einrichtung hat fünf Schritte.

### 1. Setup-Token

Gib das Token ein, das `docker logs roastgate` ausgibt (oder das, das du in `ROASTGATE_SETUP_TOKEN` festgelegt hast). Es beweist, dass du Zugriff auf den Server hast.

![Einrichtungsschritt 1: das Setup-Token](@site/docs/roastgate/img/setup-1-token.png)

### 2. Administratorkonto

Lege den Administrator an: Er ist das **einzige Konto** von Roastgate.

- **Benutzername**: 3 bis 32 Zeichen, Kleinbuchstaben, Ziffern, Punkte, Bindestriche oder Unterstriche.
- **Passwort**: mindestens 12 Zeichen, mit mindestens 3 der folgenden Arten: Kleinbuchstaben, Großbuchstaben, Ziffern, Symbole. Eine Passphrase mit 20 oder mehr Zeichen braucht keine Mischung. Es darf weder den Benutzernamen enthalten noch zu repetitiv sein.

Probleme werden während der Eingabe unter dem Feld aufgelistet.

![Einrichtungsschritt 2: das Administratorkonto](@site/docs/roastgate/img/setup-2-account.png)

### 3. Pfade und Optionen {/* #3-paths-and-options */}

Teile Roastgate mit, wo nginx liegt. Das sind die Pfade **innerhalb des Containers**: Mit der mitgelieferten Compose-Datei sind sie dieselben wie auf dem Host.

| Feld                                         | Standard                |
|----------------------------------------------|-------------------------|
| nginx-Verzeichnis                            | `/etc/nginx`            |
| Whitelist-Verzeichnis                        | `/etc/nginx/whitelists` |
| ACME-Webroot (Let's-Encrypt-Challenges)      | `/var/www/certbot`      |
| Let's-Encrypt-Verzeichnis (Zertifikate)      | `/etc/letsencrypt`      |
| Zertifikatsverwaltung                        | Eingebetteter certbot   |
| Let's-Encrypt-E-Mail (optional)              | keine                   |

Die **Zertifikatsverwaltung** bietet drei Optionen:

- **Eingebetteter certbot**: der mit Roastgate ausgelieferte. Roastgate erneuert die Zertifikate selbst, zweimal täglich.
- **Auf dem Host installierter certbot**: Roastgate steuert ihn, und der certbot-Timer des Hosts erneuert die Zertifikate.
- **Zertifikate nicht verwalten**: Roastgate listet nur die Zertifikate auf, die es findet.

:::tip
Wenn certbot bereits auf dem Host installiert ist und deine Zertifikate erneuert, wähle **Auf dem Host installierter certbot**. Lass niemals beide gleichzeitig erneuern.
:::

![Einrichtungsschritt 3: Pfade und Optionen](@site/docs/roastgate/img/setup-3-paths.png)

### 4. Host-Diagnose {/* #4-host-diagnostics */}

Roastgate prüft den Host mit den eingegebenen Werten:

| Prüfung                 | Bedeutung                                                                              |
|-------------------------|----------------------------------------------------------------------------------------|
| host access             | Befehle können in den Namespaces des Hosts laufen (erfordert `privileged: true` und `pid: host`) |
| nginx                   | nginx wurde gefunden, samt Version                                                     |
| nginx configuration     | die aktuelle Konfiguration besteht `nginx -t`                                          |
| conf.d, sites-available, sites-enabled | die Verzeichnisse sind für Roastgate sichtbar                           |
| whitelists              | das Whitelist-Verzeichnis existiert (sonst wird es mit der ersten Whitelist angelegt)  |
| ACME webroot            | der Webroot existiert (ohne ihn können keine Zertifikate ausgestellt werden)           |
| Let's Encrypt directory | das Zertifikatsverzeichnis ist sichtbar                                                |
| certbot                 | der Zertifikatsmodus kann funktionieren, mit Warnung, falls zwei certbots gleichzeitig erneuern könnten |

Fehler blockieren die Einrichtung nicht, müssen aber behoben werden, bevor Konfigurationen verwaltet werden können. Korrigiere die Compose-Datei oder die Pfade und klicke dann auf **Check again**.

![Einrichtungsschritt 4: die Host-Diagnose](@site/docs/roastgate/img/setup-4-diagnostics.png)

### 5. Abschließen

Prüfe die Zusammenfassung und klicke auf **Finish setup**. Du wirst automatisch angemeldet, und `/setup` existiert nicht mehr.

![Einrichtungsschritt 5: die Zusammenfassung vor dem Abschluss](@site/docs/roastgate/img/setup-5-summary.png)

## Anmeldung

Melde dich mit Benutzername und Passwort oder mit einem [Passkey](./account-security.md#passkeys) an. Wenn Zwei-Faktor-Authentifizierung oder ein Passkey eingerichtet ist, fragt ein zweiter Schritt nach einem Code oder dem Passkey.

![Die Anmeldeseite](@site/docs/roastgate/img/login.png)

Die Anmeldung ist rate-limitiert: Nach 5 Fehlversuchen in 15 Minuten wird die Client-Adresse eine Weile gesperrt. Jede Anmeldung und jeder Fehlversuch wird ins [Audit-Log](./backups-and-audit-log.md#audit-log) geschrieben.

## Das Dashboard

Das Dashboard zeigt, ob nginx erreichbar ist, und seine Version. Drei Buttons wirken direkt auf nginx:

- **Check again**: prüft nginx erneut.
- **Test configuration**: führt `nginx -t` aus und zeigt die Ausgabe.
- **Reload nginx**: lädt nginx neu (nach einem erfolgreichen `nginx -t`).

Die Karte **Runtime** zeigt, wie Host-Befehle ausgeführt werden (`Nsenter` in Produktion, `Direct` in einem Entwicklungs- oder Testcontainer) und wo die Daten liegen.

![Das Dashboard: nginx 1.24.0 ist erreichbar, mit den Buttons Check again, Test configuration und Reload nginx](@site/docs/roastgate/img/dashboard.png)

Das Menü links führt zu allen Bereichen: **Reverse proxies**, **Sites**, **Whitelists**, **Certificates**, **Backups**, **Audit log** und **Settings**.
