---
sidebar_position: 4
title: Reverse proxies et sites
description: Créer, modifier, activer et désactiver des reverse proxies et des sites statiques, avec l'assistant ou en texte brut.
---

# Reverse proxies et sites

Les deux pages fonctionnent de la même façon. Elles ne diffèrent que par ce qu'elles contiennent et la manière dont un fichier est activé :

| Page                | Contient                                      | Fichiers           | Désactiver…                                        |
|---------------------|-----------------------------------------------|--------------------|----------------------------------------------------|
| **Reverse proxies** | des domaines redirigés vers une application   | `conf.d/*.conf`    | renomme le fichier en `.conf.disabled`             |
| **Sites**           | des fichiers statiques servis par nginx       | `sites-available/` | supprime le lien symbolique dans `sites-enabled/`  |

## La liste

![La liste des reverse proxies, avec un fichier créé par l'assistant](@site/docs/roastgate/img/reverse-proxies-list.png)

Chaque ligne affiche le nom du fichier, un interrupteur **Enabled**, sa taille et sa dernière modification. Les fichiers créés par l'assistant portent une étiquette **wizard**.

- Interrupteur **Enabled** : active ou désactive le fichier en un clic. Pour les sites, Roastgate ne touche qu'aux liens symboliques qui pointent vers le site lui-même, relatifs ou absolus (le site par défaut de Debian en utilise un absolu).
- ✏️ **Edit** : ouvre le fichier dans l'assistant s'il a été créé par celui-ci, dans l'éditeur brut sinon.
- `</>` **Edit as raw text** (fichiers de l'assistant uniquement) : ouvre l'éditeur brut au lieu du formulaire.
- 🗑️ **Delete** : supprime le fichier après confirmation. Une sauvegarde est conservée.

Les boutons du haut :

- **Test nginx** : lance `nginx -t`.
- **Reload nginx** : teste, puis recharge nginx.
- **New from raw text** : crée un fichier dans l'éditeur brut.
- **New reverse proxy** / **New site** : ouvre l'assistant de création.

## L'assistant de création {/* #the-creation-wizard */}

Décrivez le proxy ou le site dans un formulaire et Roastgate écrit la configuration nginx. Le formulaire comporte cinq onglets.

![L'assistant : onglet Essentials d'un nouveau reverse proxy](@site/docs/roastgate/img/wizard-essentials.png)

### Essentials

| Champ                       | Reverse proxy | Site | Remarques                                                                                 |
|-----------------------------|:-------------:|:----:|-------------------------------------------------------------------------------------------|
| File name                   | ✓             | ✓    | Optionnel : le premier domaine est utilisé s'il est vide. Les proxies reçoivent l'extension `.conf`. |
| Domain names                | ✓             | ✓    | Un par ligne ou séparés par des espaces : `app.example.com www.example.com *.example.com` |
| Forward to                  | ✓             |      | L'application, par exemple `http://127.0.0.1:3000`. Utilisez `https://` si elle parle TLS. |
| Support WebSockets          | ✓             |      | Ajoute les en-têtes `Upgrade` et `Connection`.                                            |
| Timeout (seconds)           | ✓             |      | Vide, conserve les 60 s de nginx.                                                         |
| Root directory              |               | ✓    | Le dossier qui contient vos fichiers, **tel que nginx le voit sur l'hôte**.               |
| Single page application     |               | ✓    | Les chemins inconnus servent `index.html` (React, Vue, Angular…).                         |
| Cache static assets         |               | ✓    | Les navigateurs mettent les ressources statiques en cache pendant 30 jours.               |
| Maximum upload size         | ✓             | ✓    | Vide, conserve le `1m` de nginx. `0` supprime la limite.                                  |

:::caution[Chemin dans « Forward to »]
Si la destination comporte un chemin, il doit se terminer par une barre oblique : `http://backend/app/`. Sans elle, nginx colle le chemin à la requête.
:::

### HTTPS {/* #https */}

![L'assistant : onglet HTTPS d'un nouveau reverse proxy, avec la validation Let's Encrypt autorisée](@site/docs/roastgate/img/wizard-https.png)

- **Serve the site over HTTPS** : active le bloc server HTTPS.
- **Use a Let's Encrypt certificate** : choisissez l'un de vos [certificats](./certificates.md) pour remplir les deux chemins. Vous pouvez aussi saisir les chemins de n'importe quel autre certificat. L'assistant vous prévient lorsque le certificat choisi ne couvre pas tous les domaines.
- **Certificate (full chain)** et **Private key** : les chemins des fichiers du certificat.
- **Redirect HTTP to HTTPS**.
- **Enable HTTP/2** : écrit sous la forme `http2 on;` à partir de nginx 1.25.1, et `listen ... ssl http2;` avant, pour fonctionner avec votre version de nginx.
- **HSTS** : les navigateurs imposent HTTPS pendant un an. Ne l'activez qu'une fois HTTPS fonctionnel.
- **Let the Let's Encrypt validation through** : sert le webroot ACME sous `/.well-known/acme-challenge/` sur le port 80. Nécessaire pour émettre et renouveler les certificats, et continue de fonctionner derrière une liste blanche.

:::tip[Premier certificat pour un nouveau domaine]
Un certificat ne peut être émis qu'une fois que nginx répond sur le port 80 pour le domaine. Créez le proxy **sans HTTPS** mais avec **Let the Let's Encrypt validation through** coché, [obtenez le certificat](./certificates.md#get-a-certificate), puis rouvrez le proxy et activez HTTPS.
:::

### Access {/* #access */}

Restreignez le proxy ou le site aux adresses d'une ou plusieurs [listes blanches](./whitelists.md). Tous les autres reçoivent un `403`. Cochez les listes blanches à utiliser ; créez-en une d'abord si la liste est vide.

### Advanced

- **Security headers** : `X-Content-Type-Options: nosniff`, politiques de frame et de referrer.
- **Block TRACE and dotfiles** : refuse la méthode `TRACE` et les fichiers commençant par un point (sauf `/.well-known`).
- **HTTP port** et **HTTPS port** : 80 et 443 par défaut.
- **Also listen on IPv6** : désactivez-le si nginx refuse `listen [::]` sur votre hôte.
- **Extra directives in the server block** et **in the main location** : du nginx brut pour tout ce que le formulaire ne couvre pas. Les accolades doivent être équilibrées, afin que le texte ne puisse pas sortir de son bloc.

:::caution
Un `add_header` dans la location principale remplace les en-têtes de sécurité du bloc server pour cette location : c'est ainsi que nginx hérite des en-têtes.
:::

### Preview

![L'assistant : onglet Preview, montrant la configuration générée](@site/docs/roastgate/img/wizard-preview.png)

Montre exactement ce qui sera écrit, et dans quel fichier, pour la version de nginx détectée sur votre hôte. Si un champ est invalide, l'aperçu liste ce qu'il faut corriger.

Cliquez sur **Save** pour écrire le fichier. Avec **Reload nginx after saving** activé (par défaut), nginx est rechargé lorsque `nginx -t` passe.

### Sûr par construction

Chaque valeur est validée par un motif strict avant d'arriver dans le fichier (domaines, URL, chemins, tailles). Un champ invalide affiche son erreur et bloque l'enregistrement.

### Rouvrir un fichier de l'assistant

Les réglages du formulaire sont stockés dans un commentaire en tête du fichier généré, avec un hash du contenu. Rouvrir le fichier restaure le formulaire.

Si vous avez modifié le fichier à la main depuis, l'assistant vous prévient : enregistrer depuis le formulaire **remplace vos modifications manuelles**. Pour les conserver, utilisez plutôt **edit as raw text**.

## Importer une configuration écrite à la main

Un fichier que l'assistant n'a pas créé peut tout de même être ouvert dans l'assistant : cliquez sur **import into the wizard** dans l'éditeur brut (ou ouvrez `/reverse-proxies/wizard?name=app.conf`).

Ses réglages sont **lus depuis le fichier** : noms, ports, upstream, certificat, listes blanches, limite d'upload, en-têtes WebSocket, timeouts, redirection. Tout ce qui n'a pas de champ dans le formulaire (autres locations, `gzip`, `proxy_buffering`…) est conservé dans les zones **Extra directives** de l'onglet Advanced, donc rien n'est perdu. L'assistant liste aussi les valeurs par défaut qu'il ajoute et que votre fichier n'avait pas (par exemple les en-têtes `X-Forwarded-*`).

L'enregistrement **régénère tout le fichier** à partir du formulaire (une sauvegarde est conservée), donc vérifiez d'abord l'onglet **Preview**. Les commentaires entre les directives ne sont pas conservés.

![L'assistant après l'import d'un fichier écrit à la main : la notice liste ce que l'enregistrement va changer](@site/docs/roastgate/img/wizard-import.png)

Un fichier est **refusé, avec la raison**, lorsque l'assistant ne peut pas le reproduire fidèlement :

- un `upstream` ou un `map` au niveau racine ;
- un `listen` lié à une adresse, ou `default_server` ;
- un `server_name` en regex ;
- un `proxy_set_header Host` différent ;
- un serveur HTTP qui fait plus qu'une redirection ;
- plus de deux blocs server.

Ces fichiers restent modifiables en texte brut.

## L'éditeur brut

![L'éditeur brut avec coloration syntaxique nginx, sur un reverse proxy écrit à la main](@site/docs/roastgate/img/raw-editor.png)

Chaque fichier peut être modifié dans un [éditeur Monaco](https://github.com/microsoft/monaco-editor) (l'éditeur de VS Code) avec coloration syntaxique nginx. Le nom du fichier figure dans l'adresse, par exemple `/reverse-proxies/edit?name=app.conf`.

Les liens sous le titre mènent à :

- **history** : les [sauvegardes](./backups-and-audit-log.md) de ce fichier ;
- **open in the wizard** ou **import into the wizard** ;
- l'état activé ou désactivé du fichier.

En bas : **Reload nginx after saving**, **Enable** / **Disable**, **Delete** et **Save**. Un nouveau fichier demande un nom : `app.example.com.conf` pour un proxy (`.conf` est ajouté s'il manque), `example.com` pour un site.

Si `nginx -t` refuse votre modification, le fichier est restauré et l'erreur nginx est affichée au-dessus de l'éditeur.
