---
sidebar_position: 8
title: Traffic
description: Sieh, woher die Anfragen an deinen Server kommen, gelesen aus den nginx-Access-Logs und auf einer Weltkarte dargestellt.
---

# Traffic

Die Seite **Traffic** zeigt, woher die Anfragen an deinen Server kommen. Roastgate liest die nginx-Access-Logs, schlägt jede Adresse in der kostenlosen Städtedatenbank von [DB-IP](https://db-ip.com) nach und stellt sie auf einer Weltkarte dar.

Es wird nichts gespeichert: Die Seite liest die Logs jedes Mal neu, wenn du sie öffnest oder den Zeitraum änderst.

![Die Seite Traffic: die Kennzahlen, die Weltkarte mit dem Vereinigten Königreich und den USA eingefärbt, und die Orte](@site/docs/roastgate/img/traffic.png)

## Was benötigt wird {/* #what-it-needs */}

- **Die nginx-Logs im Container eingehängt.** Die Compose-Datei hängt `/var/log/nginx` seit Roastgate 0.4.0 schreibgeschützt ein. Wenn du eine frühere Version installiert hast, füge den Mount hinzu (siehe [Installation](./installation.md#what-the-compose-file-does)):

  ```yaml
  volumes:
    - /var/log/nginx:/var/log/nginx:ro
  ```

- **Die Datenbank DB-IP City Lite**, `dbip-city-lite.mmdb` im Datenvolume. Ohne sie zählt die Seite die Anfragen trotzdem, aber keine kann auf der Karte platziert werden. Siehe [Die GeoIP-Datenbank](#the-geoip-database).

## Die Seite {/* #the-page */}

- **Zeitraum**: die letzte Stunde, 24 Stunden (Standard), 7 Tage oder 30 Tage, oder **Since** ab einem Datum deiner Wahl (ab Mitternacht, in der Zeitzone des Containers, `TZ`). Wählst du einen anderen Zeitraum, während einer noch lädt, wird der erste abgebrochen.
- **Kennzahlen**: die Anzahl der Anfragen, der verschiedenen Adressen, der Länder und die **nicht lokalisierten Anfragen** (siehe unten).
- **Die Karte**:
  - jedes Land wird nach seiner Anzahl an Anfragen eingefärbt, auf einer logarithmischen Skala, damit ein sehr aktives Land nicht alle anderen überdeckt;
  - jede Stadt ist ein Punkt, der größer wird, je mehr Anfragen sie sendet;
  - beim Überfahren eines Landes oder einer Stadt erscheinen Flagge, Name und Anzahl der Anfragen (bei einer Stadt auch der Adressen);
  - zoome mit dem Mausrad oder den Schaltflächen **+** und **−**, ziehe zum Verschieben und setze die Ansicht mit der mittleren Schaltfläche zurück;
  - die letzte Schaltfläche zeigt die Karte im Vollbild (nicht auf dem iPhone verfügbar, wo Safari Vollbild nur für Videos erlaubt).
- **Top places**: die zehn Städte mit den meisten Anfragen, jede mit einem Balken relativ zur ersten.
- **All places**: jede Stadt mit ihrem Land, ihren Anfragen und Adressen, 10 bis 100 Zeilen pro Seite oder alle.

![Die Karte mit dem Tooltip von London: 6 Anfragen von 2 Adressen](@site/docs/roastgate/img/traffic-tooltip.png)

### Nicht lokalisierte Anfragen {/* #unlocated-requests */}

Eine Anfrage ist nicht lokalisiert, wenn ihre Adresse nicht auf der Karte platziert werden kann:

- eine private oder lokale Adresse (`127.0.0.1`, `192.168.x.x`, `10.x.x.x`, dein Docker-Netzwerk …), etwa dein eigenes Monitoring oder ein Container, der einen anderen aufruft;
- eine Adresse, die die Datenbank nicht kennt;
- alle Adressen, wenn die Datenbank fehlt.

Sie werden in **Requests** gezählt, aber nicht auf der Karte, in den Orten oder in **Addresses**.

## Welche Logs gelesen werden {/* #which-logs-are-read */}

Roastgate liest die Dateien namens `access.log*` im Log-Verzeichnis (`/var/log/nginx` oder `ROASTGATE_NGINX_LOG_DIR`):

- die aktuelle `access.log`;
- die rotierten Dateien (`access.log.1` …);
- die komprimierten Archive (`access.log.2.gz` …).

Dateien, die zuletzt vor Beginn des Zeitraums geschrieben wurden, werden übersprungen, ohne sie zu öffnen: Ein kurzer Zeitraum bleibt auch mit monatelangen Archiven schnell.

Jede Zeile muss mit der Client-Adresse beginnen und das Datum in eckigen Klammern enthalten, wie im Standardformat `combined` von nginx:

```text
203.0.113.42 - - [18/Nov/2026:10:12:01 +0100] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0"
```

Zeilen in einem anderen Format werden ignoriert.

:::info[Logs pro Site]
Nur Dateien, deren Name mit `access.log` beginnt, werden gelesen. Eine Site, die woanders hin loggt (`access_log /var/log/nginx/app.access.log;`), erscheint nicht auf der Karte.
:::

:::caution[Hinter einem CDN oder Proxy]
Die gelesene Adresse ist das erste Feld der Zeile, nginx' `$remote_addr`. Wenn dein nginx hinter einem CDN oder einem anderen Proxy steht, ist das die Adresse des Proxys, nicht die des Besuchers. Konfiguriere das [`real_ip`-Modul](https://nginx.org/en/docs/http/ngx_http_realip_module.html) von nginx, damit das Log die echte Adresse enthält.
:::

## Die GeoIP-Datenbank {/* #the-geoip-database */}

Roastgate verwendet [DB-IP City Lite](https://db-ip.com/db/download/ip-to-city-lite), eine kostenlose Datenbank, die jeden Monat unter der Lizenz [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) veröffentlicht wird. Sie wird unter der Karte genannt. Sie ist nicht im Image enthalten: Lade sie automatisch herunter oder kopiere sie von Hand.

### Automatische Updates {/* #automatic-updates */}

Setze `ROASTGATE_GEOIP_AUTO_UPDATE` in `docker-compose.yml` und führe dann `docker compose up -d` aus:

```yaml
environment:
  ROASTGATE_GEOIP_AUTO_UPDATE: "true"
```

Fünf Minuten nach dem Start des Containers und danach einmal am Tag prüft Roastgate den Monat der vorhandenen Datenbank. Ist sie älter als der aktuelle Monat, lädt es die neue herunter (ein Archiv von etwa 60 MB von `download.db-ip.com`):

- der Download wird geprüft, bevor er die aktuelle Datenbank ersetzt, sodass eine beschädigte Datei nie ihren Platz einnimmt;
- die neue Datenbank wird sofort verwendet, ohne Neustart;
- solange DB-IP die Datenbank des Monats noch nicht veröffentlicht hat, wird der Vormonat heruntergeladen, wenn noch gar keine Datenbank vorhanden ist. Sonst behält Roastgate die vorhandene und versucht es am nächsten Tag erneut.

### Von Hand {/* #by-hand */}

Ohne automatische Updates lade die **MMDB**-Datei von [db-ip.com](https://db-ip.com/db/download/ip-to-city-lite) herunter und kopiere sie dann ins Datenvolume:

```bash
gunzip dbip-city-lite-2026-11.mmdb.gz
docker cp dbip-city-lite-2026-11.mmdb roastgate:/data/dbip-city-lite.mmdb
docker restart roastgate
```

Die Datei muss `dbip-city-lite.mmdb` heißen. Eine von Hand kopierte Datenbank wird beim Start gelesen: Starte den Container nach jedem Kopieren neu.
