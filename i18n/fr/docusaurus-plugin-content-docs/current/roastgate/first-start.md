---
sidebar_position: 3
title: Premier démarrage
description: L'assistant d'installation, la connexion et le tableau de bord.
---

# Premier démarrage

## L'assistant d'installation

La première visite sur Roastgate ouvre `/setup`. L'installation comporte cinq étapes.

### 1. Jeton d'installation

Saisissez le jeton affiché par `docker logs roastgate` (ou celui que vous avez défini dans `ROASTGATE_SETUP_TOKEN`). Il prouve que vous avez accès au serveur.

![Étape 1 de l'installation : le jeton d'installation](@site/docs/roastgate/img/setup-1-token.png)

### 2. Compte administrateur

Créez l'administrateur : c'est le **seul compte** de Roastgate.

- **Nom d'utilisateur** : 3 à 32 caractères, lettres minuscules, chiffres, points, tirets ou underscores.
- **Mot de passe** : au moins 12 caractères, avec au moins 3 types parmi : minuscules, majuscules, chiffres, symboles. Une phrase de passe de 20 caractères ou plus n'a pas besoin de mélange. Il ne doit pas contenir le nom d'utilisateur ni être trop répétitif.

Les problèmes sont listés sous le champ pendant la saisie.

![Étape 2 de l'installation : le compte administrateur](@site/docs/roastgate/img/setup-2-account.png)

### 3. Chemins et options {/* #3-paths-and-options */}

Indiquez à Roastgate où se trouve nginx. Ce sont les chemins **à l'intérieur du conteneur** : avec le fichier compose fourni, ce sont les mêmes que sur l'hôte.

| Champ                                          | Valeur par défaut       |
|------------------------------------------------|-------------------------|
| Répertoire nginx                               | `/etc/nginx`            |
| Répertoire des listes blanches                 | `/etc/nginx/whitelists` |
| Webroot ACME (challenges Let's Encrypt)        | `/var/www/certbot`      |
| Répertoire Let's Encrypt (certificats)         | `/etc/letsencrypt`      |
| Gestion des certificats                        | certbot intégré         |
| E-mail Let's Encrypt (optionnel)               | aucun                   |

La **gestion des certificats** propose trois choix :

- **certbot intégré** : celui livré avec Roastgate. Roastgate renouvelle elle-même les certificats, deux fois par jour.
- **certbot installé sur l'hôte** : Roastgate le pilote, et le timer certbot de l'hôte renouvelle les certificats.
- **Ne pas gérer les certificats** : Roastgate se contente de lister les certificats qu'elle trouve.

:::tip
Si certbot est déjà installé sur l'hôte et renouvelle vos certificats, choisissez **certbot installé sur l'hôte**. Ne laissez jamais les deux renouveler en même temps.
:::

![Étape 3 de l'installation : chemins et options](@site/docs/roastgate/img/setup-3-paths.png)

### 4. Diagnostics de l'hôte {/* #4-host-diagnostics */}

Roastgate vérifie l'hôte avec les valeurs que vous avez saisies :

| Vérification            | Signification                                                                          |
|-------------------------|----------------------------------------------------------------------------------------|
| host access             | les commandes peuvent s'exécuter dans les namespaces de l'hôte (nécessite `privileged: true` et `pid: host`) |
| nginx                   | nginx a été trouvé, avec sa version                                                    |
| nginx configuration     | la configuration actuelle passe `nginx -t`                                             |
| conf.d, sites-available, sites-enabled | les répertoires sont visibles par Roastgate                             |
| whitelists              | le répertoire des listes blanches existe (sinon il est créé avec la première liste)    |
| ACME webroot            | le webroot existe (impossible d'émettre des certificats sans lui)                      |
| Let's Encrypt directory | le répertoire des certificats est visible                                              |
| certbot                 | le mode de certificats peut fonctionner, avec un avertissement si deux certbots risquent de renouveler en même temps |

Les erreurs ne bloquent pas l'installation, mais elles doivent être corrigées avant de pouvoir gérer des configurations. Corrigez le fichier compose ou les chemins, puis cliquez sur **Check again**.

![Étape 4 de l'installation : les diagnostics de l'hôte](@site/docs/roastgate/img/setup-4-diagnostics.png)

### 5. Terminer

Vérifiez le récapitulatif et cliquez sur **Finish setup**. Vous êtes connecté automatiquement, et `/setup` n'existe plus.

![Étape 5 de l'installation : le récapitulatif avant de terminer](@site/docs/roastgate/img/setup-5-summary.png)

## Connexion

Connectez-vous avec votre nom d'utilisateur et votre mot de passe, ou avec une [passkey](./account-security.md#passkeys). Lorsque l'authentification à deux facteurs ou une passkey est configurée, une seconde étape demande un code ou la passkey.

![La page de connexion](@site/docs/roastgate/img/login.png)

La connexion est limitée en débit : après 5 échecs en 15 minutes, l'adresse du client est bloquée pendant un moment. Chaque connexion et chaque échec sont inscrits dans le [journal d'audit](./backups-and-audit-log.md#audit-log).

## Le tableau de bord

Le tableau de bord indique si nginx est joignable, ainsi que sa version. Trois boutons agissent directement sur nginx :

- **Check again** : interroge à nouveau nginx.
- **Test configuration** : lance `nginx -t` et affiche sa sortie.
- **Reload nginx** : recharge nginx (après un `nginx -t` réussi).

La carte **Runtime** indique comment les commandes de l'hôte sont exécutées (`Nsenter` en production, `Direct` dans un conteneur de développement ou de test) et où se trouvent les données.

![Le tableau de bord : nginx 1.24.0 est joignable, avec les boutons Check again, Test configuration et Reload nginx](@site/docs/roastgate/img/dashboard.png)

Le menu de gauche mène à chaque section : **Reverse proxies**, **Sites**, **Whitelists**, **Certificates**, **Backups**, **Audit log** et **Settings**.
