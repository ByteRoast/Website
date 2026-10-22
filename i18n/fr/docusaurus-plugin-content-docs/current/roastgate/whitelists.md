---
sidebar_position: 5
title: Listes blanches
description: Restreindre un reverse proxy ou un site à une liste d'adresses IP.
---

# Listes blanches

Une liste blanche est un fichier de lignes `allow` dans le répertoire des listes blanches (`/etc/nginx/whitelists` par défaut) :

```nginx title="/etc/nginx/whitelists/office.conf"
allow 203.0.113.10;     # front desk
allow 2001:db8::/32;
```

Seule, elle ne fait rien : elle s'applique partout où une configuration l'**inclut**, suivie de `deny all;`.

## Créer une liste blanche

Depuis **Whitelists**, cliquez sur **New whitelist**.

![L'éditeur de liste blanche avec trois adresses et leurs commentaires](@site/docs/roastgate/img/whitelist-edit.png)

- **Name** : par exemple `alice` ; l'extension `.conf` est ajoutée.
- **Allowed addresses** : une adresse et un commentaire optionnel par ligne. Cliquez sur **Add address** pour ajouter une ligne.
- **Add my address** : ajoute l'adresse depuis laquelle vous êtes connecté, telle que Roastgate la voit.
- **Paste several addresses** : une par ligne, ou séparées par des espaces et des virgules. Les lignes du type `allow 1.2.3.4;` fonctionnent aussi. Cliquez sur **Add them to the list**.

Chaque adresse est validée pendant la saisie : IPv4, IPv6 et plages CIDR. La validation est stricte : `1.2`, `0x7f.0.0.1` ou `10.0.0.5/24` (bits d'hôte définis, que nginx ignore silencieusement) sont signalés au lieu d'être écrits.

:::caution[Derrière un reverse proxy]
Si vous accédez à Roastgate via un proxy, **Add my address** peut afficher l'adresse du proxy. N'activez `ROASTGATE_TRUST_FORWARDED_HEADERS` que si Roastgate n'est joignable que par votre propre proxy (voir les [variables d'environnement](./settings-and-configuration.md#environment-variables)).
:::

## Utiliser une liste blanche

Le plus simple est l'onglet **Access** de l'[assistant](./reverse-proxies-and-sites.md#access) : cochez la liste blanche et enregistrez.

Dans une configuration écrite à la main, la page de la liste blanche vous donne les lignes à copier (**How to use it**). Ajoutez-les dans le `server` ou la `location` à restreindre :

```nginx
include /etc/nginx/whitelists/office.conf;
deny all;
```

:::warning[`return` passe en premier]
nginx évalue `return` avant `allow` et `deny` : une `location` qui ne fait que `return 200;` ignore la liste blanche.
:::

Une liste blanche vide n'autorise personne dès qu'elle est utilisée avec `deny all;`.

## Où est-elle utilisée ?

La page **Whitelists** affiche, pour chaque liste blanche, son nombre d'adresses et les fichiers qui l'utilisent.

![La liste des listes blanches, avec le nombre d'adresses et les fichiers qui utilisent chacune](@site/docs/roastgate/img/whitelist-used-by.png)

Sur la page d'une liste blanche, la section **Used by** liste chaque proxy et site qui inclut la liste, avec le numéro de ligne. Elle comprend les chemins relatifs et absolus, entre guillemets ou non, ainsi que les includes avec wildcard. Une utilisation dans un fichier désactivé est marquée comme inactive.

Une liste blanche encore incluse **ne peut pas être supprimée**. Pour les includes dans des fichiers que Roastgate ne lit pas (comme `nginx.conf`), `nginx -t` reste le dernier filet de sécurité.

## Édition brute

Le lien **edit as raw text** ouvre la liste blanche dans l'éditeur brut. Un fichier qui contient autre chose que des lignes `allow` (un `deny`, un commentaire entre les lignes…) n'est jamais réécrit par l'éditeur de liste : Roastgate l'ouvre en texte brut à la place, pour que rien de ce que vous avez écrit ne soit perdu.
