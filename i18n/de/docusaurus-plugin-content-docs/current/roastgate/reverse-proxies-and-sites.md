---
sidebar_position: 4
title: Reverse Proxies und Sites
description: Reverse Proxies und statische Sites mit dem Assistenten oder als Rohtext erstellen, bearbeiten, aktivieren und deaktivieren.
---

# Reverse Proxies und Sites

Beide Seiten funktionieren gleich. Sie unterscheiden sich nur darin, was sie enthalten und wie eine Datei aktiviert wird:

| Seite               | Enthält                                       | Dateien            | Deaktivieren …                                     |
|---------------------|-----------------------------------------------|--------------------|----------------------------------------------------|
| **Reverse proxies** | Domains, die an eine Anwendung weitergeleitet werden | `conf.d/*.conf` | benennt die Datei in `.conf.disabled` um        |
| **Sites**           | von nginx ausgelieferte statische Dateien     | `sites-available/` | entfernt den Symlink in `sites-enabled/`           |

## Die Liste

![Die Liste der Reverse Proxies, mit einer vom Assistenten erstellten Datei](@site/docs/roastgate/img/reverse-proxies-list.png)

Jede Zeile zeigt den Dateinamen, einen Schalter **Enabled**, die Größe und die letzte Änderung. Vom Assistenten erstellte Dateien tragen ein **wizard**-Label.

- Schalter **Enabled**: aktiviert oder deaktiviert die Datei mit einem Klick. Bei Sites rührt Roastgate nur Symlinks an, die auf die Site selbst zeigen, relativ oder absolut (die Standard-Site von Debian verwendet einen absoluten).
- ✏️ **Edit**: öffnet die Datei im Assistenten, wenn der Assistent sie erstellt hat, sonst im Rohtext-Editor.
- `</>` **Edit as raw text** (nur Assistenten-Dateien): öffnet den Rohtext-Editor statt des Formulars.
- 🗑️ **Delete**: löscht die Datei nach einer Bestätigung. Ein Backup wird aufbewahrt.

Die Buttons oben:

- **Test nginx**: führt `nginx -t` aus.
- **Reload nginx**: testet und lädt nginx dann neu.
- **New from raw text**: erstellt eine Datei im Rohtext-Editor.
- **New reverse proxy** / **New site**: öffnet den Erstellungsassistenten.

## Der Erstellungsassistent {/* #the-creation-wizard */}

Beschreibe den Proxy oder die Site in einem Formular und Roastgate schreibt die nginx-Konfiguration. Das Formular hat fünf Tabs.

![Der Assistent: Tab Essentials eines neuen Reverse Proxys](@site/docs/roastgate/img/wizard-essentials.png)

### Essentials

| Feld                        | Reverse Proxy | Site | Hinweise                                                                                  |
|-----------------------------|:-------------:|:----:|-------------------------------------------------------------------------------------------|
| File name                   | ✓             | ✓    | Optional: Bleibt es leer, wird die erste Domain verwendet. Proxies erhalten die Endung `.conf`. |
| Domain names                | ✓             | ✓    | Eine pro Zeile oder durch Leerzeichen getrennt: `app.example.com www.example.com *.example.com` |
| Forward to                  | ✓             |      | Die Anwendung, zum Beispiel `http://127.0.0.1:3000`. Verwende `https://`, wenn sie TLS spricht. |
| Support WebSockets          | ✓             |      | Fügt die Header `Upgrade` und `Connection` hinzu.                                         |
| Timeout (seconds)           | ✓             |      | Leer behält die 60 s von nginx.                                                           |
| Root directory              |               | ✓    | Der Ordner mit deinen Dateien, **so wie nginx ihn auf dem Host sieht**.                   |
| Single page application     |               | ✓    | Unbekannte Pfade liefern `index.html` aus (React, Vue, Angular …).                        |
| Cache static assets         |               | ✓    | Browser cachen statische Ressourcen 30 Tage lang.                                         |
| Maximum upload size         | ✓             | ✓    | Leer behält das `1m` von nginx. `0` hebt das Limit auf.                                   |

:::caution[Pfad in „Forward to“]
Wenn das Ziel einen Pfad hat, muss er mit einem Schrägstrich enden: `http://backend/app/`. Ohne ihn hängt nginx den Pfad an die Anfrage an.
:::

### HTTPS {/* #https */}

![Der Assistent: Tab HTTPS eines neuen Reverse Proxys, mit durchgelassener Let's-Encrypt-Validierung](@site/docs/roastgate/img/wizard-https.png)

- **Serve the site over HTTPS**: schaltet den HTTPS-Server-Block ein.
- **Use a Let's Encrypt certificate**: Wähle eines deiner [Zertifikate](./certificates.md), um die beiden Pfade auszufüllen. Du kannst auch die Pfade jedes anderen Zertifikats eingeben. Der Assistent warnt dich, wenn das gewählte Zertifikat nicht alle Domains abdeckt.
- **Certificate (full chain)** und **Private key**: die Pfade der Zertifikatsdateien.
- **Redirect HTTP to HTTPS**.
- **Enable HTTP/2**: wird ab nginx 1.25.1 als `http2 on;` geschrieben, davor als `listen ... ssl http2;`, damit es mit deiner nginx-Version funktioniert.
- **HSTS**: Browser bestehen ein Jahr lang auf HTTPS. Schalte es erst ein, wenn HTTPS funktioniert.
- **Let the Let's Encrypt validation through**: liefert den ACME-Webroot unter `/.well-known/acme-challenge/` auf Port 80 aus. Nötig, um Zertifikate auszustellen und zu erneuern, und funktioniert auch hinter einer Whitelist weiter.

:::tip[Erstes Zertifikat für eine neue Domain]
Ein Zertifikat kann erst ausgestellt werden, wenn nginx auf Port 80 für die Domain antwortet. Erstelle den Proxy **ohne HTTPS**, aber mit angekreuztem **Let the Let's Encrypt validation through**, [beziehe das Zertifikat](./certificates.md#get-a-certificate), öffne den Proxy dann erneut und schalte HTTPS ein.
:::

### Access {/* #access */}

Beschränke den Proxy oder die Site auf die Adressen einer oder mehrerer [Whitelists](./whitelists.md). Alle anderen erhalten ein `403`. Kreuze die zu verwendenden Whitelists an; erstelle zuerst eine, wenn die Liste leer ist.

### Advanced

- **Security headers**: `X-Content-Type-Options: nosniff`, Frame- und Referrer-Richtlinien.
- **Block TRACE and dotfiles**: lehnt die Methode `TRACE` und Dateien ab, die mit einem Punkt beginnen (außer `/.well-known`).
- **HTTP port** und **HTTPS port**: standardmäßig 80 und 443.
- **Also listen on IPv6**: Schalte es aus, wenn nginx `listen [::]` auf deinem Host ablehnt.
- **Extra directives in the server block** und **in the main location**: rohes nginx für alles, was das Formular nicht abdeckt. Die geschweiften Klammern müssen ausgeglichen sein, damit der Text seinen Block nicht verlassen kann.

:::caution
Ein `add_header` in der Haupt-Location ersetzt für diese Location die Sicherheits-Header des Server-Blocks: So vererbt nginx Header.
:::

### Preview

![Der Assistent: Tab Preview mit der generierten Konfiguration](@site/docs/roastgate/img/wizard-preview.png)

Zeigt genau, was geschrieben wird und in welche Datei, für die auf deinem Host erkannte nginx-Version. Ist ein Feld ungültig, listet die Vorschau auf, was zu korrigieren ist.

Klicke auf **Save**, um die Datei zu schreiben. Mit aktiviertem **Reload nginx after saving** (Standard) wird nginx neu geladen, wenn `nginx -t` erfolgreich ist.

### Sicher durch Konstruktion

Jeder Wert wird anhand eines strengen Musters geprüft, bevor er in die Datei gelangt (Domains, URLs, Pfade, Größen). Ein ungültiges Feld zeigt seinen Fehler an und blockiert das Speichern.

### Eine Assistenten-Datei erneut öffnen

Die Einstellungen des Formulars werden in einem Kommentar am Anfang der generierten Datei gespeichert, zusammen mit einem Hash des Inhalts. Das erneute Öffnen der Datei stellt das Formular wieder her.

Wenn du die Datei seitdem von Hand bearbeitet hast, warnt dich der Assistent: Speichern aus dem Formular **ersetzt deine manuellen Änderungen**. Um sie zu behalten, verwende stattdessen **edit as raw text**.

## Eine handgeschriebene Konfiguration importieren

Eine Datei, die der Assistent nicht erstellt hat, kann trotzdem im Assistenten geöffnet werden: Klicke im Rohtext-Editor auf **import into the wizard** (oder öffne `/reverse-proxies/wizard?name=app.conf`).

Ihre Einstellungen werden **aus der Datei gelesen**: Namen, Ports, Upstream, Zertifikat, Whitelists, Upload-Limit, WebSocket-Header, Timeouts, Weiterleitung. Alles, wofür das Formular kein Feld hat (andere Locations, `gzip`, `proxy_buffering` …), bleibt in den Feldern **Extra directives** des Tabs Advanced erhalten, sodass nichts verloren geht. Der Assistent listet außerdem die Standardwerte auf, die er hinzufügt und die deine Datei nicht hatte (zum Beispiel die `X-Forwarded-*`-Header).

Das Speichern **generiert die ganze Datei neu** aus dem Formular (ein Backup wird aufbewahrt), prüfe also zuerst den Tab **Preview**. Kommentare zwischen Direktiven bleiben nicht erhalten.

![Der Assistent nach dem Import einer handgeschriebenen Datei: der Hinweis listet auf, was das Speichern ändern wird](@site/docs/roastgate/img/wizard-import.png)

Eine Datei wird **mit Begründung abgelehnt**, wenn der Assistent sie nicht originalgetreu reproduzieren kann:

- ein `upstream` oder `map` auf oberster Ebene;
- ein an eine Adresse gebundenes `listen` oder `default_server`;
- ein `server_name` als Regex;
- ein abweichendes `proxy_set_header Host`;
- ein HTTP-Server, der mehr als nur weiterleitet;
- mehr als zwei Server-Blöcke.

Diese Dateien bleiben als Rohtext bearbeitbar.

## Der Rohtext-Editor

![Der Rohtext-Editor mit nginx-Syntaxhervorhebung, bei einem handgeschriebenen Reverse Proxy](@site/docs/roastgate/img/raw-editor.png)

Jede Datei kann in einem [Monaco-Editor](https://github.com/microsoft/monaco-editor) (dem Editor von VS Code) mit nginx-Syntaxhervorhebung bearbeitet werden. Der Dateiname steht in der Adresse, zum Beispiel `/reverse-proxies/edit?name=app.conf`.

Die Links unter dem Titel führen zu:

- **history**: den [Backups](./backups-and-audit-log.md) dieser Datei;
- **open in the wizard** oder **import into the wizard**;
- dem Status der Datei (aktiviert oder deaktiviert).

Unten: **Reload nginx after saving**, **Enable** / **Disable**, **Delete** und **Save**. Eine neue Datei fragt nach einem Namen: `app.example.com.conf` für einen Proxy (`.conf` wird ergänzt, falls es fehlt), `example.com` für eine Site.

Wenn `nginx -t` deine Änderung ablehnt, wird die Datei zurückgesetzt und der nginx-Fehler über dem Editor angezeigt.
