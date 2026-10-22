---
sidebar_position: 6
title: Zertifikate
description: Let's-Encrypt-Zertifikate beziehen, erneuern und löschen.
---

# Zertifikate

Die Seite **Certificates** verwaltet Let's-Encrypt-Zertifikate mit certbot. Die Zertifikate werden aus den Dateien gelesen, die certbot pflegt (standardmäßig `/etc/letsencrypt/live`), nicht aus seiner Textausgabe.

![Die Zertifikatsseite: ein Zertifikat mit seinen Domains, seinem Ablaufdatum und dem Proxy, der es verwendet, sowie das Formular „Get a certificate“](@site/docs/roastgate/img/certificates.png)

## Zertifikatsmodi

Der Modus wird während der [Einrichtung](./first-start.md#3-paths-and-options) gewählt und kann in den [Einstellungen](./settings-and-configuration.md) geändert werden:

| Modus                                    | Wer führt certbot aus                                  | Wer erneuert                                   |
|------------------------------------------|--------------------------------------------------------|------------------------------------------------|
| **Eingebetteter certbot**                | der im Roastgate-Image enthaltene certbot              | Roastgate, zweimal täglich                     |
| **Auf dem Host installierter certbot**   | der certbot des Hosts, gesteuert über `nsenter`        | der certbot-Timer des Hosts                    |
| **Zertifikate nicht verwalten**          | niemand: Roastgate listet nur auf, was es findet       | —                                              |

Im eingebetteten Modus zeigt die Seite Zeitpunkt und Ergebnis der letzten automatischen Prüfung.

:::warning[Nur ein Erneuerer]
Wenn du den eingebetteten certbot verwendest, während certbot auch auf dem Host installiert ist, deaktiviere den certbot-Timer des Hosts oder wechsle in den Host-Modus. Die Diagnose bei der Einrichtung warnt dich davor.
:::

## Die Liste

Jedes Zertifikat zeigt seinen Namen, seine Domains, sein Ablaufdatum und **welche Konfigurationen es verwenden** (eine deaktivierte Konfiguration wird markiert). Zertifikate vom Staging-Server werden markiert: Browser vertrauen ihnen nicht.

- **Renew now**: erneuert dieses Zertifikat, auch wenn es noch nicht fällig ist.
- **Renew what is due** (oben auf der Seite): erneuert alle Zertifikate, die kurz vor dem Ablauf stehen.
- **Delete**: löscht das Zertifikat. Ein Zertifikat, das noch von einer Konfiguration verwendet wird, **kann nicht gelöscht werden**.

nginx wird nur neu geladen, wenn sich ein Zertifikat wirklich geändert hat (die Datei wird vorher und nachher verglichen), damit es nie weiter ein altes ausliefert. Ein fehlgeschlagenes Neuladen wird gemeldet.

## Ein Zertifikat beziehen {/* #get-a-certificate */}

Let's Encrypt validiert jede Domain, indem es eine Datei von `http://<domain>/.well-known/acme-challenge/` abruft. Bevor du beginnst:

1. Die Domain zeigt auf deinen Server (DNS-Einträge `A` / `AAAA`).
2. nginx antwortet auf Port **80** für diese Domain.
3. Dieser Server-Block liefert den ACME-Webroot aus: Kreuze im [Assistenten](./reverse-proxies-and-sites.md#https) **Let the Let's Encrypt validation through** an.

Fülle dann das Formular **Get a certificate** aus:

- **Domain names**: eine pro Zeile oder durch Leerzeichen getrennt.
- **Certificate name** (optional): standardmäßig die erste Domain.
- **E-mail for expiry notices**: standardmäßig die aus den Einstellungen.
- **Use the staging server**: nicht vertrauenswürdige Zertifikate mit großzügigen Rate Limits. Nützlich für Tests.

Klicke auf **Test first (dry run)**: Es prüft alles gegen den Staging-Server von Let's Encrypt, ohne etwas auszustellen. Wenn der Test erfolgreich ist, klicke auf **Get the certificate**.

Verwende das Zertifikat dann im Tab **HTTPS** des Assistenten: Wähle es unter **Use a Let's Encrypt certificate** aus, und die Pfade werden ausgefüllt.

:::info
Wildcard-Zertifikate (`*.example.com`) benötigen eine DNS-Challenge und werden nicht unterstützt.
:::
