---
slug: roastgate-0.2.0
title: Roastgate 0.2.0
authors: [sikelio]
tags: [release, roastgate, nginx, docker, dotnet, self_hosted]
---

**Roastgate 0.2.0** ist da: Du kannst jetzt wählen, was Besucher außerhalb deiner Whitelists bekommen, statt des standardmäßigen 403 von nginx.

{/* truncate */}

## Wähle, wie abgewiesene Besucher beantwortet werden

Bisher hat ein durch eine Whitelist eingeschränkter Proxy oder eine Site allen anderen mit dem nginx-eigenen **403 Forbidden** geantwortet. Das funktioniert, verrät der Welt aber auch, dass hinter dieser Domain etwas läuft.

Der Tab **Access** des Assistenten hat jetzt eine Einstellung **Visitors outside the whitelists**, für Reverse Proxies und gehostete Sites gleichermaßen:

| Auswahl | Antwort | Wann verwenden |
|---|---|---|
| **Forbidden** (Standard) | `403` | das übliche Verhalten von nginx, für bestehende Konfigurationen ändert sich nichts |
| **Not found** | `404` | verbirgt, dass die Site existiert |
| **Close the connection** | `444` | nginx bricht die Verbindung ab, ohne etwas zu senden |
| **Redirect** | `302` zu einer Adresse deiner Wahl | Besucher zum Beispiel auf deine Hauptwebsite schicken |

Wie immer zeigt der Vorschau-Tab genau, was geschrieben wird. Mit einem 404 sieht der Whitelist-Teil der Konfiguration so aus:

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
Die Antwort ersetzt **jedes** 403 des Servers, nicht nur die der Whitelists: Andere Ablehnungen, etwa blockierte Dotfiles, erhalten dieselbe Antwort.
:::

Einige Schutzmechanismen kommen dazu:

- Die Einstellung erfordert **mindestens eine Whitelist**: Ohne sie wird niemand abgewiesen, und der Assistent weist dich darauf hin.
- Die Weiterleitungsadresse wird geprüft, bevor sie in die Datei gelangt: `http://` oder `https://`, ein Host, optional Port, Pfad und Query-String, und nichts, was aus der `return`-Zeile ausbrechen könnte.
- Die Let's-Encrypt-Challenge bleibt für alle erreichbar, damit Zertifikatserneuerungen unabhängig von deiner Wahl weiter funktionieren.

### Wieder öffnen und importieren

Die Einstellung wird aus der Datei zurückgelesen: Das erneute Öffnen einer Konfiguration im Assistenten oder der [Import einer handgeschriebenen Konfiguration](/blog/roastgate-0.1.0#importing-hand-written-configs) stellt die Auswahl und die Weiterleitungsadresse wieder her. Wenn die Zeile `error_page 403 = @rg_denied;` oder ihr Block `location @rg_denied` von Hand so verändert wurde, dass der Assistent sie nicht reproduzieren kann, wird der Import mit Zeilennummer und Begründung abgelehnt, und die Datei bleibt als Rohtext bearbeitbar.

## Für Mitwirkende

Das Projekt hat außerdem bekommen, was es braucht, um Beiträge willkommen zu heißen:

- Einen [Leitfaden für Beiträge](https://github.com/ByteRoast/Roastgate/blob/main/CONTRIBUTING.md) zu Codestil, Tests, Commits und der Lizenzvereinbarung für Mitwirkende.
- Eine [Sicherheitsrichtlinie](https://github.com/ByteRoast/Roastgate/blob/main/SECURITY.md), um Sicherheitslücken vertraulich zu melden.
- Issue-Formulare und eine Vorlage für Pull Requests.

Das Image unter `ghcr.io/byteroast/roastgate` ist jetzt öffentlich: Zum Herunterladen ist kein `docker login` mehr nötig.

## Wie bekomme ich Roastgate 0.2.0?

### Update

Aus dem Ordner, der `docker-compose.yml` enthält:

```bash
docker compose pull
docker compose up -d
```

Die Compose-Datei hat in diesem Release nur zwei Kommentare verloren: Du musst sie nicht erneut herunterladen.

:::warning[Alpha]
Roastgate befindet sich noch in den Alpha-Versionen `0.x`. Sichere das Volume `roastgate-data` vor dem Update:

```bash
docker run --rm -v roastgate-data:/data -v "$PWD":/backup alpine tar czf /backup/roastgate-data.tgz -C /data .
```
:::

Um bei dieser Version zu bleiben, verwende in `docker-compose.yml` den Tag `0.2.0` statt `latest`.

### Neuinstallation

Folge der [Installationsanleitung](/docs/roastgate/installation) oder dem Beitrag [Vorstellung von Roastgate 0.1.0](/blog/roastgate-0.1.0#how-can-i-get-roastgate): Die Schritte sind dieselben.

---

- [Roastgate auf GitHub](https://github.com/ByteRoast/Roastgate)
- [Release 0.2.0](https://github.com/ByteRoast/Roastgate/releases/tag/v0.2.0)
- [Probleme melden](https://github.com/ByteRoast/Roastgate/issues)
