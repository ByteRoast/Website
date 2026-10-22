---
sidebar_position: 10
title: Wartung und Fehlerbehebung
description: Aktualisieren, sichern, Zugang wiederherstellen, deinstallieren und häufige Probleme beheben.
---

# Wartung und Fehlerbehebung

Alle folgenden Befehle laufen auf dem Server, aus dem Ordner, der `docker-compose.yml` enthält.

## Update

```bash
docker compose pull
docker compose up -d
```

Lade die Compose-Datei nur dann erneut herunter (siehe [Installieren](./installation.md#install)), wenn die Release Notes sagen, dass sie sich geändert hat. Sie überschreibt deine Kopie, also wiederhole danach deine eigenen Anpassungen (Ports, Mounts, Umgebungsvariablen …).

Wenn du aus dem Quellcode gebaut hast: `git pull`, dann `docker compose up -d --build`.

:::warning[Alpha]
Sichere das Datenvolume vor jedem Update: Das Datenbankschema kann sich zwischen `0.x`-Versionen ändern.
:::

## Die Daten sichern {/* #back-up-the-data */}

Die Datenbank liegt im Volume `roastgate-data`: Dein Konto, deine Einstellungen, die Datei-Backups und das Audit-Log überstehen Updates und `docker compose down`. Nur `docker compose down --volumes` (oder `docker volume rm roastgate-data`) löscht es.

Um es als `roastgate-data.tgz` im aktuellen Ordner zu sichern:

```bash
docker run --rm -v roastgate-data:/data -v "$PWD":/backup alpine tar czf /backup/roastgate-data.tgz -C /data .
```

Um es wiederherzustellen (der Container muss gestoppt sein):

```bash
docker compose stop
docker run --rm -v roastgate-data:/data -v "$PWD":/backup alpine sh -c "rm -rf /data/* && tar xzf /backup/roastgate-data.tgz -C /data"
docker compose up -d
```

Deine nginx-Dateien liegen nicht in diesem Volume: Sichere `/etc/nginx` und `/etc/letsencrypt` wie gewohnt.

## Passwort vergessen? {/* #forgot-the-password */}

```bash
docker exec -it roastgate roastgate reset-password
```

Der Befehl fragt nach einem neuen Passwort und beendet alle offenen Sitzungen.

## Durch Zwei-Faktor-Authentifizierung ausgesperrt {/* #locked-out-of-two-factor */}

Authenticator-App, Wiederherstellungscodes und Passkeys verloren:

```bash
docker exec roastgate roastgate disable-2fa
```

Der Befehl schaltet die Zwei-Faktor-Authentifizierung ab, entfernt alle Passkeys und beendet alle Sitzungen, sodass du dich wieder nur mit dem Passwort anmelden kannst. Richte die Zwei-Faktor-Authentifizierung danach erneut ein.

## Deinstallation

```bash
docker compose down            # behält das Datenvolume
docker compose down --volumes  # löscht auch Konto, Einstellungen und Backup-Verlauf
```

Lösche dann den Ordner, der `docker-compose.yml` enthält, und das Image:

```bash
docker image rm ghcr.io/byteroast/roastgate:latest   # oder der Tag, den du verwendet hast
```

Deine nginx-Dateien bleiben, wo sie sind: Roastgate verschiebt sie nie.

## Fehlerbehebung

### Wo ist das Setup-Token?

```bash
docker logs roastgate
```

Bei jedem Start wird ein neues Token erzeugt, bis die Einrichtung abgeschlossen ist. Um es selbst festzulegen, setze `ROASTGATE_SETUP_TOKEN` (16 Zeichen oder mehr).

### „nginx is not reachable from Roastgate“

- Der Container braucht `privileged: true` und `pid: host`: Prüfe die Zeile **host access** der Diagnose (**Settings → Check the host with these values**).
- nginx muss **auf dem Host** installiert sein, nicht in einem anderen Container.

### „The directory … does not exist or is not visible to Roastgate“

Der Pfad in den Einstellungen ist nicht in den Container eingehängt. Füge den Mount in `docker-compose.yml` hinzu (auf beiden Seiten derselbe Pfad) oder korrigiere den Pfad in den Einstellungen.

### Meine Änderung wurde zurückgesetzt

`nginx -t` hat sie abgelehnt: Der über dem Editor angezeigte Fehler stammt von nginx selbst. Betrifft der Fehler eine andere Datei, schlug `nginx -t` bereits vor deiner Änderung fehl: Korrigiere zuerst diese Datei (**Dashboard → Test configuration** zeigt den Fehler).

### Das Zertifikat kann nicht ausgestellt werden

Führe zuerst einen **Dry Run** aus. Die meisten Fehler kommen daher, dass:

- die Domain nicht auf diesen Server zeigt;
- nginx auf Port 80 nicht für die Domain antwortet;
- der Server-Block den ACME-Webroot nicht ausliefert: Kreuze im Assistenten **Let the Let's Encrypt validation through** an;
- eine Whitelist oder ein `return` in einer handgeschriebenen Konfiguration `/.well-known/acme-challenge/` blockiert.

### Die Seite reagiert nicht mehr

Die Oberfläche hält eine aktive Verbindung zum Server (WebSockets). Stelle hinter einem Proxy sicher, dass WebSockets weitergeleitet werden (**Support WebSockets** im Assistenten), und lade die Seite dann neu.

### Mein Passkey wird nicht angeboten

Ein Passkey funktioniert nur auf der Adresse, auf der er erstellt wurde. `http://127.0.0.1:8181` und `https://roastgate.example.com` brauchen jeweils einen eigenen Passkey.

## Hilfe bekommen

- [Issues auf GitHub](https://github.com/ByteRoast/Roastgate/issues/new/choose) für Fehler und Ideen.
- [Sicherheitsrichtlinie](https://github.com/ByteRoast/Roastgate/blob/main/SECURITY.md) für Sicherheitslücken.
