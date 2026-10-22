---
sidebar_position: 6
title: Certificats
description: Obtenir, renouveler et supprimer des certificats Let's Encrypt.
---

# Certificats

La page **Certificates** gère les certificats Let's Encrypt avec certbot. Les certificats sont lus depuis les fichiers que maintient certbot (`/etc/letsencrypt/live` par défaut), et non depuis sa sortie texte.

![La page des certificats : un certificat avec ses domaines, son expiration et le proxy qui l'utilise, et le formulaire « Get a certificate »](@site/docs/roastgate/img/certificates.png)

## Modes de certificats

Le mode est choisi pendant l'[installation](./first-start.md#3-paths-and-options) et peut être modifié dans les [réglages](./settings-and-configuration.md) :

| Mode                              | Qui exécute certbot                                    | Qui renouvelle                                 |
|-----------------------------------|--------------------------------------------------------|------------------------------------------------|
| **certbot intégré**               | le certbot livré dans l'image Roastgate                | Roastgate, deux fois par jour                  |
| **certbot installé sur l'hôte**   | le certbot de l'hôte, piloté via `nsenter`             | le timer certbot de l'hôte                     |
| **Ne pas gérer les certificats**  | personne : Roastgate se contente de lister ce qu'elle trouve | —                                        |

En mode intégré, la page affiche l'heure et le résultat de la dernière vérification automatique.

:::warning[Un seul renouveleur]
Si vous utilisez le certbot intégré alors que certbot est aussi installé sur l'hôte, désactivez le timer certbot de l'hôte, ou passez en mode hôte. Les diagnostics d'installation vous en avertissent.
:::

## La liste

Chaque certificat affiche son nom, ses domaines, sa date d'expiration et **les configurations qui l'utilisent** (une configuration désactivée est signalée). Les certificats issus du serveur de staging sont signalés : les navigateurs ne leur font pas confiance.

- **Renew now** : renouvelle ce certificat, même s'il n'arrive pas encore à échéance.
- **Renew what is due** (en haut de la page) : renouvelle tous les certificats proches de leur expiration.
- **Delete** : supprime le certificat. Un certificat encore utilisé par une configuration **ne peut pas être supprimé**.

nginx n'est rechargé que lorsqu'un certificat a réellement changé (le fichier est comparé avant et après), afin qu'il ne continue jamais à servir un ancien certificat. Un échec de rechargement est signalé.

## Obtenir un certificat {/* #get-a-certificate */}

Let's Encrypt valide chaque domaine en récupérant un fichier depuis `http://<domain>/.well-known/acme-challenge/`. Avant de commencer :

1. Le domaine pointe vers votre serveur (enregistrements DNS `A` / `AAAA`).
2. nginx répond sur le port **80** pour ce domaine.
3. Ce bloc server sert le webroot ACME : cochez **Let the Let's Encrypt validation through** dans l'[assistant](./reverse-proxies-and-sites.md#https).

Remplissez ensuite le formulaire **Get a certificate** :

- **Domain names** : un par ligne ou séparés par des espaces.
- **Certificate name** (optionnel) : par défaut, le premier domaine.
- **E-mail for expiry notices** : par défaut, celui des réglages.
- **Use the staging server** : certificats non reconnus, avec des limites de débit généreuses. Utile pour les tests.

Cliquez sur **Test first (dry run)** : tout est vérifié auprès du serveur de staging de Let's Encrypt sans rien émettre. Si le test passe, cliquez sur **Get the certificate**.

Utilisez ensuite le certificat dans l'onglet **HTTPS** de l'assistant : choisissez-le dans **Use a Let's Encrypt certificate** et les chemins sont remplis.

:::info
Les certificats wildcard (`*.example.com`) nécessitent un challenge DNS et ne sont pas pris en charge.
:::
