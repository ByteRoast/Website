---
sidebar_position: 5
title: Whitelists
description: Einen Reverse Proxy oder eine Site auf eine Liste von IP-Adressen beschränken.
---

# Whitelists

Eine Whitelist ist eine Datei mit `allow`-Zeilen im Whitelist-Verzeichnis (standardmäßig `/etc/nginx/whitelists`):

```nginx title="/etc/nginx/whitelists/office.conf"
allow 203.0.113.10;     # front desk
allow 2001:db8::/32;
```

Allein bewirkt sie nichts: Sie gilt überall dort, wo eine Konfiguration sie **einbindet**, gefolgt von `deny all;`.

## Eine Whitelist erstellen

Klicke unter **Whitelists** auf **New whitelist**.

![Der Whitelist-Editor mit drei Adressen und ihren Kommentaren](@site/docs/roastgate/img/whitelist-edit.png)

- **Name**: zum Beispiel `alice`; die Endung `.conf` wird ergänzt.
- **Allowed addresses**: eine Adresse und ein optionaler Kommentar pro Zeile. Klicke auf **Add address** für eine neue Zeile.
- **Add my address**: fügt die Adresse hinzu, von der aus du verbunden bist, so wie Roastgate sie sieht.
- **Paste several addresses**: eine pro Zeile oder durch Leerzeichen und Kommas getrennt. Zeilen wie `allow 1.2.3.4;` funktionieren auch. Klicke auf **Add them to the list**.

Jede Adresse wird während der Eingabe geprüft: IPv4, IPv6 und CIDR-Bereiche. Die Prüfung ist streng: `1.2`, `0x7f.0.0.1` oder `10.0.0.5/24` (gesetzte Host-Bits, die nginx stillschweigend ignoriert) werden markiert statt geschrieben.

:::caution[Hinter einem Reverse Proxy]
Wenn du über einen Proxy auf Roastgate zugreifst, zeigt **Add my address** möglicherweise die Adresse des Proxys. Aktiviere `ROASTGATE_TRUST_FORWARDED_HEADERS` nur, wenn Roastgate ausschließlich über deinen eigenen Proxy erreichbar ist (siehe [Umgebungsvariablen](./settings-and-configuration.md#environment-variables)).
:::

## Eine Whitelist verwenden

Am einfachsten geht es über den Tab **Access** des [Assistenten](./reverse-proxies-and-sites.md#access): Whitelist ankreuzen und speichern.

In einer handgeschriebenen Konfiguration gibt dir die Whitelist-Seite die Zeilen zum Kopieren (**How to use it**). Füge sie in den einzuschränkenden `server` oder die `location` ein:

```nginx
include /etc/nginx/whitelists/office.conf;
deny all;
```

:::warning[`return` kommt zuerst]
nginx wertet `return` vor `allow` und `deny` aus: Eine `location`, die nur `return 200;` macht, ignoriert die Whitelist.
:::

Eine leere Whitelist lässt niemanden zu, sobald sie mit `deny all;` verwendet wird.

## Wo wird sie verwendet?

Die Seite **Whitelists** zeigt für jede Whitelist die Anzahl der Adressen und die Dateien, die sie verwenden.

![Die Liste der Whitelists, mit der Anzahl der Adressen und den Dateien, die jede Whitelist verwenden](@site/docs/roastgate/img/whitelist-used-by.png)

Auf der Seite einer Whitelist listet der Bereich **Used by** jeden Proxy und jede Site auf, die die Whitelist einbinden, mit Zeilennummer. Er versteht relative und absolute Pfade, mit oder ohne Anführungszeichen, sowie Includes mit Wildcards. Eine Verwendung in einer deaktivierten Datei wird als inaktiv markiert.

Eine noch eingebundene Whitelist **kann nicht gelöscht werden**. Für Includes in Dateien, die Roastgate nicht liest (wie `nginx.conf`), bleibt `nginx -t` das letzte Sicherheitsnetz.

## Rohtext-Bearbeitung

Der Link **edit as raw text** öffnet die Whitelist im Rohtext-Editor. Eine Datei, die etwas anderes als `allow`-Zeilen enthält (ein `deny`, einen Kommentar zwischen Zeilen …), wird vom Listeneditor nie neu geschrieben: Roastgate öffnet sie stattdessen als Rohtext, damit nichts, was du geschrieben hast, verloren geht.
