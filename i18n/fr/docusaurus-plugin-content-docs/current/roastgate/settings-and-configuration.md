---
sidebar_position: 9
title: Réglages et configuration
description: La page Settings et les variables d'environnement du conteneur.
---

# Réglages et configuration

## La page Settings

![La page des réglages](@site/docs/roastgate/img/settings.png)

### Chemins et options

Les chemins et options choisis pendant l'[installation](./first-start.md#3-paths-and-options) : répertoire nginx, répertoire des listes blanches, webroot ACME, répertoire Let's Encrypt, mode de gestion des certificats et e-mail Let's Encrypt.

Ce sont les chemins **que voit Roastgate** : ils doivent être montés dans son conteneur, au même emplacement que sur l'hôte, afin que les chemins écrits dans vos configurations aient le même sens pour nginx.

- **Check the host with these values** lance les [diagnostics de l'hôte](./first-start.md#4-host-diagnostics) avec ce que vous avez saisi, avant d'enregistrer.
- **Save settings** valide les valeurs de la même façon que l'installation.

### Changer le mot de passe

Nécessite le mot de passe actuel. Toutes les sessions ouvertes, sur tous les appareils, sont terminées : vous vous reconnectez avec le nouveau mot de passe.

### Authentification à deux facteurs et passkeys

Voir [Compte et sécurité](./account-security.md).

### À propos de cette instance

Affiche le compte avec lequel vous êtes connecté, la version de Roastgate, la façon dont les commandes de l'hôte sont exécutées, le répertoire de données, et si les en-têtes de transfert et les cookies sécurisés sont activés.

## Variables d'environnement {/* #environment-variables */}

Définissez-les dans la section `environment` de `docker-compose.yml`, puis lancez `docker compose up -d`. Toutes sont optionnelles.

| Variable                            | Valeur par défaut    | Rôle                                                                                         |
|-------------------------------------|----------------------|----------------------------------------------------------------------------------------------|
| `ROASTGATE_SETUP_TOKEN`             | aléatoire à chaque démarrage | jeton d'installation fixe, 16 caractères ou plus                                     |
| `ROASTGATE_SECURE_COOKIES`          | `false`              | marque le cookie de session `Secure` : activez-le lorsque vous accédez à Roastgate en HTTPS  |
| `ROASTGATE_TRUST_FORWARDED_HEADERS` | `false`              | lit l'adresse du client depuis `X-Forwarded-For` / `-Proto` : uniquement derrière votre propre reverse proxy |
| `ROASTGATE_DATA_DIR`                | `/data`              | emplacement de `roastgate.db` (montez-y un volume)                                           |
| `ROASTGATE_HOST_EXEC`               | `nsenter`            | `nsenter` exécute les commandes dans les namespaces de l'hôte, `direct` les exécute dans le conteneur (développement) |
| `TZ`                                | `Europe/Paris` dans le fichier compose | fuseau horaire des dates affichées dans l'interface                        |

Voir [Accéder à Roastgate via nginx](./account-security.md#reach-roastgate-through-nginx) pour savoir quand activer les options de cookie et d'en-têtes.
