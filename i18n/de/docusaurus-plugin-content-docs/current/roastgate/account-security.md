---
sidebar_position: 8
title: Konto und Sicherheit
description: Zwei-Faktor-Authentifizierung, Passkeys, Sitzungen und wie du sicher auf Roastgate zugreifst.
---

# Konto und Sicherheit

Roastgate steuert deinen Webserver, und sein Container ist privilegiert mit `pid: host`: **Wer Roastgate kontrolliert, ist in der Praxis root auf dem Host.** Schütze es entsprechend.

## Passwort

Verwende ein langes, einzigartiges Passwort. Es wird unter **Settings → Change the password** geändert (das aktuelle Passwort ist erforderlich).

**Eine Passwortänderung beendet alle offenen Sitzungen** auf allen Geräten innerhalb von 30 Sekunden. Das ist auch die Antwort auf eine gestohlene Sitzung.

Vergessen? Siehe [Passwort vergessen](./maintenance.md#forgot-the-password).

## Zwei-Faktor-Authentifizierung

Klicke unter **Settings → Two-factor authentication** auf **Set up two-factor authentication**.

![Einrichtung der Zwei-Faktor-Authentifizierung: der QR-Code, der Schlüssel und das Codefeld](@site/docs/roastgate/img/2fa-setup.png)

1. Scanne den QR-Code mit einer Authenticator-App ([Aegis](https://github.com/beemdevelopment/Aegis), [Google Authenticator](https://support.google.com/accounts/answer/1066447), [1Password](https://1password.com), [Bitwarden](https://bitwarden.com) …). Scannen nicht möglich? Gib den darunter angezeigten Schlüssel ein.
2. Gib den 6-stelligen Code aus der App ein und klicke auf **Turn on two-factor authentication**.
3. **Speichere jetzt die zehn Wiederherstellungscodes**: Sie werden nur einmal angezeigt. Jeder davon meldet dich einmal an, falls du dein Handy verlierst.

![Die zehn Wiederherstellungscodes, nur einmal angezeigt](@site/docs/roastgate/img/2fa-recovery-codes.png)

Die Anmeldung hat dann zwei Schritte: Der Code wird erst nach einem korrekten Passwort abgefragt.

- Ein Code kann nur einmal verwendet werden, und eine Zeitabweichung von einem Schritt (30 s) wird toleriert.
- Fünf falsche Codes beenden den Versuch, und die Client-Adresse wird nach fünf Fehlversuchen gesperrt.
- **Get new recovery codes** ersetzt die alten Codes (mit einem Code aus der App bestätigen).
- **Turn it off** erfordert dein Passwort und einen Code (oder einen Wiederherstellungscode).

Das Ein- oder Ausschalten der Zwei-Faktor-Authentifizierung beendet alle Sitzungen, auch die aktuelle: Du meldest dich mit dem neuen Schritt erneut an.

## Passkeys {/* #passkeys */}

Ein Passkey meldet dich per Fingerabdruck, Gesicht, Geräte-PIN oder Sicherheitsschlüssel an. Klicke unter **Settings → Passkeys** auf **Add a passkey**, gib ihm einen Namen (`laptop`, `phone` …), bestätige mit deinem Passwort und folge deinem Browser.

![Der Passkey-Bereich der Einstellungen, mit einem Passkey](@site/docs/roastgate/img/passkeys.png)

Ein Passkey funktioniert auf zwei Arten:

- **Allein**: Klicke auf der Anmeldeseite auf **Sign in with a passkey**, ganz ohne Passwort.
- **Als zweiter Schritt** nach dem Passwort, anstelle des Authentifizierungscodes.

:::warning[Sobald ein Passkey existiert, reicht das Passwort allein nicht mehr]
Nach dem Passwort fragt Roastgate immer nach einem Passkey (oder einem Code, wenn die Zwei-Faktor-Authentifizierung aktiv ist).
:::

- Ein Passkey funktioniert nur auf der **Adresse, auf der er erstellt wurde**: `127.0.0.1` oder die Domain deines HTTPS-Server-Blocks. Browser erlauben Passkeys nur auf `localhost` / `127.0.0.1` oder über HTTPS, eine reine `http://`-Domain funktioniert also nicht.
- Die Liste zeigt, wann jeder Passkey hinzugefügt und zuletzt verwendet wurde.
- **Remove** fragt nach deinem Passwort und beendet alle offenen Sitzungen.

Handy, Wiederherstellungscodes und Passkeys verloren? Siehe [Durch Zwei-Faktor-Authentifizierung ausgesperrt](./maintenance.md#locked-out-of-two-factor).

## Zugriff auf Roastgate über nginx {/* #reach-roastgate-through-nginx */}

Standardmäßig ist Roastgate nur über einen SSH-Tunnel erreichbar. Um es ohne Tunnel im Browser zu öffnen, stelle es hinter dein nginx, mit Roastgate selbst:

1. Erstelle eine [Whitelist](./whitelists.md) mit deinen eigenen Adressen.
2. Erstelle einen [Reverse Proxy](./reverse-proxies-and-sites.md#the-creation-wizard), zum Beispiel `roastgate.example.com`:
   - **Forward to**: `http://127.0.0.1:8181`
   - **Support WebSockets**: an (die Oberfläche braucht sie)
   - **Access**: deine Whitelist ankreuzen
   - **Let the Let's Encrypt validation through**: an
3. [Beziehe ein Zertifikat](./certificates.md#get-a-certificate) für die Domain, öffne dann den Proxy erneut und schalte **HTTPS** und **Redirect HTTP to HTTPS** ein.
4. Aktiviere in `docker-compose.yml` beide Variablen und starte mit `docker compose up -d` neu:

```yaml
    environment:
      ROASTGATE_SECURE_COOKIES: "true"
      ROASTGATE_TRUST_FORWARDED_HEADERS: "true"
```

Lass das Port-Mapping auf `127.0.0.1:8181`: Dann kann nur dein nginx die Forwarded-Header senden, und die Anmeldebegrenzung sowie die Whitelists sehen deine echte Adresse.

:::danger
Aktiviere `ROASTGATE_TRUST_FORWARDED_HEADERS` niemals, wenn Port `8181` direkt von anderen erreichbar ist: Sie könnten ihre Adresse fälschen.
:::

## Sitzungen und Daten

- Das Sitzungscookie ist `HttpOnly` und `SameSite=Strict`, und mit `ROASTGATE_SECURE_COOKIES=true` auch `Secure`.
- Offene Browser-Tabs werden alle 30 Sekunden erneut geprüft, sodass eine beendete Sitzung schnell endet.
- Das Volume `/data` enthält die Datenbank **und die Schlüssel, die die Sitzungscookies verschlüsseln**. Unter Linux werden diese Schlüssel unverschlüsselt gespeichert: Mach das Volume nur für root lesbar.

## Eine Sicherheitslücke melden

Eröffne kein öffentliches Issue. Melde sie vertraulich über [GitHubs private Meldung von Sicherheitslücken](https://github.com/ByteRoast/Roastgate/security/advisories/new), wie in der [Sicherheitsrichtlinie](https://github.com/ByteRoast/Roastgate/blob/main/SECURITY.md) beschrieben.
