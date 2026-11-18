---
sidebar_position: 8
title: Trafic
description: Voir d'où viennent les requêtes vers votre serveur, lues dans les logs d'accès nginx et placées sur une carte du monde.
---

# Trafic

La page **Traffic** montre d'où viennent les requêtes vers votre serveur. Roastgate lit les logs d'accès nginx, cherche chaque adresse dans la base de villes gratuite de [DB-IP](https://db-ip.com), et les place sur une carte du monde.

Rien n'est stocké : la page relit les logs à chaque fois que vous l'ouvrez ou changez de période.

![La page Traffic : les chiffres clés, la carte du monde avec le Royaume-Uni et les États-Unis colorés, et les lieux](@site/docs/roastgate/img/traffic.png)

## Ce qu'il faut {/* #what-it-needs */}

- **Les logs nginx montés dans le conteneur.** Le fichier compose monte `/var/log/nginx` en lecture seule depuis Roastgate 0.4.0. Si vous avez installé une version antérieure, ajoutez le montage (voir [Installation](./installation.md#what-the-compose-file-does)) :

  ```yaml
  volumes:
    - /var/log/nginx:/var/log/nginx:ro
  ```

- **La base DB-IP City Lite**, `dbip-city-lite.mmdb` dans le volume de données. Sans elle, la page compte quand même les requêtes, mais aucune ne peut être placée sur la carte. Voir [La base GeoIP](#the-geoip-database).

## La page {/* #the-page */}

- **Période** : la dernière heure, 24 heures (par défaut), 7 jours ou 30 jours, ou **Since** une date de votre choix (à partir de minuit, dans le fuseau horaire du conteneur, `TZ`). Choisir une autre période pendant qu'une première se charge annule celle-ci.
- **Chiffres clés** : le nombre de requêtes, d'adresses distinctes, de pays, et les **requêtes non localisées** (voir plus bas).
- **La carte** :
  - chaque pays est coloré selon son nombre de requêtes, sur une échelle logarithmique pour qu'un pays très actif n'efface pas tous les autres ;
  - chaque ville est un point, plus grand quand elle envoie plus de requêtes ;
  - survoler un pays ou une ville affiche son drapeau, son nom et son nombre de requêtes (et d'adresses, pour une ville) ;
  - zoomez avec la molette ou les boutons **+** et **−**, faites glisser pour vous déplacer, et réinitialisez la vue avec le bouton central ;
  - le dernier bouton affiche la carte en plein écran (indisponible sur iPhone, où Safari n'autorise le plein écran que pour les vidéos).
- **Top places** : les dix villes qui ont envoyé le plus de requêtes, chacune avec une barre relative à la première.
- **All places** : chaque ville avec son pays, ses requêtes et ses adresses, de 10 à 100 lignes par page, ou toutes.

![La carte, avec le tooltip de Londres : 6 requêtes depuis 2 adresses](@site/docs/roastgate/img/traffic-tooltip.png)

### Requêtes non localisées {/* #unlocated-requests */}

Une requête est non localisée quand son adresse ne peut pas être placée sur la carte :

- une adresse privée ou locale (`127.0.0.1`, `192.168.x.x`, `10.x.x.x`, votre réseau Docker…), comme votre propre supervision ou un conteneur qui en appelle un autre ;
- une adresse que la base ne connaît pas ;
- toutes les adresses, quand la base est absente.

Elles sont comptées dans **Requests** mais pas sur la carte, dans les lieux ou dans **Addresses**.

## Quels logs sont lus {/* #which-logs-are-read */}

Roastgate lit les fichiers nommés `access.log*` dans le dossier des logs (`/var/log/nginx`, ou `ROASTGATE_NGINX_LOG_DIR`) :

- le fichier `access.log` courant ;
- les fichiers tournés (`access.log.1`…) ;
- les archives compressées (`access.log.2.gz`…).

Les fichiers modifiés pour la dernière fois avant le début de la période sont ignorés sans être ouverts : une courte période reste rapide même avec des mois d'archives.

Chaque ligne doit commencer par l'adresse du client et contenir la date entre crochets, comme dans le format `combined` par défaut de nginx :

```text
203.0.113.42 - - [18/Nov/2026:10:12:01 +0100] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0"
```

Les lignes dans un autre format sont ignorées.

:::info[Logs par site]
Seuls les fichiers dont le nom commence par `access.log` sont lus. Un site qui écrit ses logs ailleurs (`access_log /var/log/nginx/app.access.log;`) n'apparaît pas sur la carte.
:::

:::caution[Derrière un CDN ou un proxy]
L'adresse lue est le premier champ de la ligne, le `$remote_addr` de nginx. Si votre nginx est derrière un CDN ou un autre proxy, c'est l'adresse du proxy, pas celle du visiteur. Configurez le [module `real_ip`](https://nginx.org/en/docs/http/ngx_http_realip_module.html) de nginx pour que le log contienne la vraie adresse.
:::

## La base GeoIP {/* #the-geoip-database */}

Roastgate utilise [DB-IP City Lite](https://db-ip.com/db/download/ip-to-city-lite), une base gratuite publiée chaque mois sous licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Elle est créditée sous la carte. Elle n'est pas fournie dans l'image : récupérez-la automatiquement, ou copiez-la à la main.

### Mises à jour automatiques {/* #automatic-updates */}

Définissez `ROASTGATE_GEOIP_AUTO_UPDATE` dans `docker-compose.yml`, puis lancez `docker compose up -d` :

```yaml
environment:
  ROASTGATE_GEOIP_AUTO_UPDATE: "true"
```

Cinq minutes après le démarrage du conteneur, puis une fois par jour, Roastgate vérifie le mois de la base dont elle dispose. Quand elle est plus ancienne que le mois en cours, elle télécharge la nouvelle (une archive d'environ 60 Mo depuis `download.db-ip.com`) :

- le téléchargement est vérifié avant de remplacer la base actuelle, donc un fichier corrompu ne prend jamais sa place ;
- la nouvelle base est utilisée immédiatement, sans redémarrage ;
- tant que DB-IP n'a pas publié la base du mois, le mois précédent est téléchargé s'il n'y a aucune base. Sinon, Roastgate garde celle qu'elle a et réessaie le lendemain.

### À la main {/* #by-hand */}

Sans mises à jour automatiques, téléchargez le fichier **MMDB** sur [db-ip.com](https://db-ip.com/db/download/ip-to-city-lite), puis copiez-le dans le volume de données :

```bash
gunzip dbip-city-lite-2026-11.mmdb.gz
docker cp dbip-city-lite-2026-11.mmdb roastgate:/data/dbip-city-lite.mmdb
docker restart roastgate
```

Le fichier doit s'appeler `dbip-city-lite.mmdb`. Une base copiée à la main est lue au démarrage : redémarrez le conteneur après chaque copie.
