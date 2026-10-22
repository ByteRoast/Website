---
sidebar_position: 7
title: Backups und Audit-Log
description: Frühere Versionen deiner Dateien vergleichen und wiederherstellen und sehen, wer was getan hat.
---

# Backups und Audit-Log

## Backups

Jedes Überschreiben und jedes Löschen über Roastgate bewahrt den vorherigen Inhalt der Datei in der Datenbank von Roastgate auf. Die **30 neuesten Backups jeder Datei** werden aufbewahrt.

Eine von nginx abgelehnte Änderung hinterlässt kein Backup, da es nur die aktuelle Datei wiederholen würde.

![Die Liste der Backups](@site/docs/roastgate/img/backups.png)

Öffne **Backups** über das Menü oder über den Link **history** einer beliebigen Datei. Filtere nach **Area** (Reverse Proxies, Sites, Whitelists) und **File name** und klicke dann auf **Show**.

Jedes Backup zeigt, wann es erstellt wurde, die Datei, vor welcher Änderung es erstellt wurde, und seine Größe.

### Vergleichen und wiederherstellen

Klicke auf **Compare**, um die Version Zeile für Zeile neben der aktuellen Datei zu sehen: was die Wiederherstellung **hinzufügen** und **entfernen** würde.

![Ein Backup im zeilenweisen Vergleich mit der aktuellen Datei](@site/docs/roastgate/img/backup-compare.png)

- Wurde die Datei inzwischen gelöscht, legt die Wiederherstellung sie neu an.
- Ist die Version identisch mit der aktuellen Datei, ändert die Wiederherstellung nichts.

Klicke auf **Restore this version**. Eine Wiederherstellung durchläuft denselben Zyklus wie ein Speichern: Backup der aktuellen Datei, Schreiben, `nginx -t`, Rollback bei Ungültigkeit, Neuladen bei Gültigkeit. Eine Wiederherstellung kann also selbst rückgängig gemacht werden.

## Audit-Log {/* #audit-log */}

Die Seite **Audit log** listet die 200 neuesten Aktionen auf, die neueste zuerst: Zeitpunkt, Akteur, Aktion, Ziel, Ergebnis und Details.

![Das Audit-Log](@site/docs/roastgate/img/audit-log.png)

Es zeichnet Anmeldungen und Fehlversuche auf, Änderungen an Passwort, Zwei-Faktor-Authentifizierung und Passkeys, Änderungen an den Einstellungen, jede Änderung an deinen Dateien (Speichern, Aktivieren, Deaktivieren, Löschen, Wiederherstellen), nginx-Tests und -Neuladevorgänge sowie Zertifikatsoperationen.
