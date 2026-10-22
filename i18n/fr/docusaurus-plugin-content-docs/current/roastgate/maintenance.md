---
sidebar_position: 10
title: Maintenance et dépannage
description: Mettre à jour, sauvegarder, récupérer l'accès, désinstaller et résoudre les problèmes courants.
---

# Maintenance et dépannage

Toutes les commandes ci-dessous s'exécutent sur le serveur, depuis le dossier qui contient `docker-compose.yml`.

## Mise à jour

```bash
docker compose pull
docker compose up -d
```

Ne retéléchargez le fichier compose (voir [Installer](./installation.md#install)) que lorsque les notes de version indiquent qu'il a changé. Il écrase votre copie, donc refaites vos propres modifications ensuite (ports, montages, variables d'environnement…).

Si vous avez compilé depuis les sources : `git pull`, puis `docker compose up -d --build`.

:::warning[Alpha]
Sauvegardez le volume de données avant chaque mise à jour : le schéma de la base de données peut changer entre les versions `0.x`.
:::

## Sauvegarder les données {/* #back-up-the-data */}

La base de données se trouve dans le volume `roastgate-data` : votre compte, vos réglages, les sauvegardes de fichiers et le journal d'audit survivent aux mises à jour et à `docker compose down`. Seul `docker compose down --volumes` (ou `docker volume rm roastgate-data`) le supprime.

Pour le sauvegarder dans `roastgate-data.tgz` dans le dossier courant :

```bash
docker run --rm -v roastgate-data:/data -v "$PWD":/backup alpine tar czf /backup/roastgate-data.tgz -C /data .
```

Pour le restaurer (le conteneur doit être arrêté) :

```bash
docker compose stop
docker run --rm -v roastgate-data:/data -v "$PWD":/backup alpine sh -c "rm -rf /data/* && tar xzf /backup/roastgate-data.tgz -C /data"
docker compose up -d
```

Vos fichiers nginx ne sont pas dans ce volume : sauvegardez `/etc/nginx` et `/etc/letsencrypt` comme d'habitude.

## Mot de passe oublié ? {/* #forgot-the-password */}

```bash
docker exec -it roastgate roastgate reset-password
```

La commande demande un nouveau mot de passe et met fin à toutes les sessions ouvertes.

## Bloqué par l'authentification à deux facteurs {/* #locked-out-of-two-factor */}

Application d'authentification, codes de récupération et passkeys perdus :

```bash
docker exec roastgate roastgate disable-2fa
```

La commande désactive l'authentification à deux facteurs, supprime toutes les passkeys et met fin à toutes les sessions, de sorte que le mot de passe seul permet à nouveau de se connecter. Reconfigurez ensuite l'authentification à deux facteurs.

## Désinstallation

```bash
docker compose down            # conserve le volume de données
docker compose down --volumes  # supprime aussi le compte, les réglages et l'historique des sauvegardes
```

Supprimez ensuite le dossier qui contient `docker-compose.yml`, ainsi que l'image :

```bash
docker image rm ghcr.io/byteroast/roastgate:latest   # ou le tag que vous avez utilisé
```

Vos fichiers nginx restent là où ils sont : Roastgate ne les déplace jamais.

## Dépannage

### Où est le jeton d'installation ?

```bash
docker logs roastgate
```

Un nouveau jeton est généré à chaque démarrage tant que l'installation n'est pas terminée. Pour le choisir, définissez `ROASTGATE_SETUP_TOKEN` (16 caractères ou plus).

### « nginx is not reachable from Roastgate »

- Le conteneur a besoin de `privileged: true` et `pid: host` : vérifiez la ligne **host access** des diagnostics (**Settings → Check the host with these values**).
- nginx doit être installé **sur l'hôte**, pas dans un autre conteneur.

### « The directory … does not exist or is not visible to Roastgate »

Le chemin indiqué dans les réglages n'est pas monté dans le conteneur. Ajoutez le montage dans `docker-compose.yml` (même chemin des deux côtés), ou corrigez le chemin dans les réglages.

### Ma modification a été annulée

`nginx -t` l'a refusée : l'erreur affichée au-dessus de l'éditeur est celle de nginx. Si l'erreur concerne un autre fichier, `nginx -t` échouait déjà avant votre modification : corrigez d'abord ce fichier (**Dashboard → Test configuration** affiche l'erreur).

### Le certificat ne peut pas être émis

Lancez d'abord un **dry run**. La plupart des échecs viennent de :

- un domaine qui ne pointe pas vers ce serveur ;
- nginx qui ne répond pas sur le port 80 pour le domaine ;
- un bloc server qui ne sert pas le webroot ACME : cochez **Let the Let's Encrypt validation through** dans l'assistant ;
- une liste blanche ou un `return` qui bloque `/.well-known/acme-challenge/` dans une configuration écrite à la main.

### La page ne répond plus

L'interface maintient une connexion active avec le serveur (WebSockets). Derrière un proxy, vérifiez que les WebSockets sont transmis (**Support WebSockets** dans l'assistant), puis rechargez la page.

### Ma passkey n'est pas proposée

Une passkey ne fonctionne que sur l'adresse sur laquelle elle a été créée. `http://127.0.0.1:8181` et `https://roastgate.example.com` nécessitent chacune leur propre passkey.

## Obtenir de l'aide

- [Issues sur GitHub](https://github.com/ByteRoast/Roastgate/issues/new/choose) pour les bugs et les idées.
- [Politique de sécurité](https://github.com/ByteRoast/Roastgate/blob/main/SECURITY.md) pour les vulnérabilités.
